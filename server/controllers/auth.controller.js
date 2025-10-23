import bcrypt from 'bcrypt'
import { User } from '../models/User.js'
import { EmailVerification } from '../models/EmailVerification.js'
import { signAccessToken, verifyToken } from '../services/jwt.js'

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
