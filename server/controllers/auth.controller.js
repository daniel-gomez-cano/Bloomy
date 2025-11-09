import bcrypt from 'bcrypt'
import { User } from '../models/User.js'
import { EmailVerification } from '../models/EmailVerification.js'
import { signAccessToken, verifyToken } from '../services/jwt.js'
import { OAuth2Client } from 'google-auth-library'

const COOKIE_NAME = 'bloomy_token'
const isProd = process.env.NODE_ENV === 'production'

export async function register(req, res) {
  try {
    const { nombre, correo, contrasena } = req.body
    if (!nombre || !correo || !contrasena) return res.status(400).json({ message: 'Datos incompletos' })

    const existing = await User.findOne({ correo })
    if (existing) return res.status(409).json({ message: 'El correo ya está registrado' })

    // Require verified email before registration
    const ver = await EmailVerification.findOne({ email: String(correo).toLowerCase().trim() })
    if (!ver || !ver.verified || ver.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Debes verificar tu correo antes de registrarte' })
    }

    const passwordHash = await bcrypt.hash(contrasena, 10)
    const user = await User.create({ nombre, correo, passwordHash })

    // Cleanup verification record after successful registration
    try { await EmailVerification.deleteOne({ email: String(correo).toLowerCase().trim() }) } catch {}

    const token = signAccessToken({ sub: user._id, correo: user.correo })
    res
      .cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(201)
      .json({ id: user._id, nombre: user.nombre, correo: user.correo, isPremium: user.isPremium })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error en el registro' })
  }
}

export async function login(req, res) {
  try {
    const { correo, contrasena } = req.body
    if (!correo || !contrasena) return res.status(400).json({ message: 'Datos incompletos' })

    const user = await User.findOne({ correo })
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' })

    const ok = await bcrypt.compare(contrasena, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' })

    const token = signAccessToken({ sub: user._id, correo: user.correo })
    res
      .cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ id: user._id, nombre: user.nombre, correo: user.correo, isPremium: user.isPremium })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error en el login' })
  }
}

export async function me(req, res) {
  try {
    const token = req.cookies?.[COOKIE_NAME]
    if (!token) return res.status(401).json({ message: 'No autenticado' })
    const payload = verifyToken(token)
    const user = await User.findById(payload.sub).select('-passwordHash')
    if (!user) return res.status(401).json({ message: 'No autenticado' })
    res.json(user)
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' })
  }
}

export async function logout(_req, res) {
  res
    .clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd })
    .json({ ok: true })
}

export async function changePassword(req, res) {
  try {
    const token = req.cookies?.[COOKIE_NAME]
    if (!token) return res.status(401).json({ message: 'No autenticado' })
    const payload = verifyToken(token)
    const user = await User.findById(payload.sub)
    if (!user) return res.status(401).json({ message: 'No autenticado' })

    const { contrasena } = req.body
    if (!contrasena || typeof contrasena !== 'string' || contrasena.length < 6) {
      return res.status(400).json({ message: 'La nueva contraseña es inválida (mínimo 6 caracteres)' })
    }

    const passwordHash = await bcrypt.hash(contrasena, 10)
    user.passwordHash = passwordHash
    await user.save()
    return res.json({ ok: true })
  } catch (err) {
    console.error('changePassword error', err)
    return res.status(500).json({ message: 'No se pudo cambiar la contraseña' })
  }
}

// Google Sign-In: intercambio de ID Token por sesión (cookie JWT)
export async function googleAuth(req, res) {
  try {
    const { credential } = req.body || {}
    if (!credential) return res.status(400).json({ message: 'Falta credential' })

    const clientId = process.env.GOOGLE_CLIENT_ID
    if (!clientId) return res.status(500).json({ message: 'Falta GOOGLE_CLIENT_ID en el servidor' })

    const client = new OAuth2Client(clientId)
    const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId })
    const payload = ticket.getPayload()
    if (!payload) return res.status(401).json({ message: 'Token de Google inválido' })

    const sub = payload.sub
    const email = String(payload.email || '').toLowerCase()
    const emailVerified = payload.email_verified
    const name = payload.name || email.split('@')[0]
    const picture = payload.picture || null

    if (!email || emailVerified === false) {
      return res.status(401).json({ message: 'Correo de Google no verificado' })
    }

    let user = await User.findOne({ $or: [ { googleId: sub }, { correo: email } ] })
    if (!user) {
      user = await User.create({
        nombre: name,
        correo: email,
        provider: 'google',
        googleId: sub,
        picture,
      })
    } else {
      // Conectar la cuenta local existente con Google si aún no está enlazada
      if (!user.googleId) user.googleId = sub
      if (!user.provider) user.provider = 'google'
      if (!user.picture && picture) user.picture = picture
      await user.save()
    }

    const token = signAccessToken({ sub: user._id, correo: user.correo })
    res
      .cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ id: user._id, nombre: user.nombre, correo: user.correo, isPremium: user.isPremium })
  } catch (err) {
    console.error('googleAuth error', err)
    return res.status(500).json({ message: 'No se pudo iniciar sesión con Google' })
  }
}
