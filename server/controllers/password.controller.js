import { PasswordReset } from '../models/PasswordReset.js'
import { User } from '../models/User.js'
import { sendMail } from '../services/mailer.js'
import bcrypt from 'bcrypt'

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function requestPasswordReset(req, res) {
  try {
    const { correo } = req.body
    if (!correo) return res.status(400).json({ message: 'Correo requerido' })
    const email = String(correo).toLowerCase().trim()

    // Do not reveal whether user exists to prevent enumeration
    const user = await User.findOne({ correo: email })
    if (user) {
      const code = generateCode()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
      await PasswordReset.findOneAndUpdate(
        { email },
        { email, code, expiresAt, verified: false },
        { upsert: true, new: true }
      )
      const subject = 'Código para restablecer tu contraseña - Bloomy'
      const html = `
        <div style="font-family:Arial, sans-serif;font-size:16px;color:#111">
          <p>Hola,</p>
          <p>Tu código para restablecer la contraseña es:</p>
          <p style="font-size:24px;font-weight:700;letter-spacing:3px">${code}</p>
          <p>Este código expira en 10 minutos.</p>
        </div>
      `
      await sendMail({ to: email, subject, html })
    }
    return res.json({ ok: true })
  } catch (err) {
    console.error('requestPasswordReset error', err)
    const detail = process.env.NODE_ENV === 'production' ? '' : ` (${err?.message || 'error'})`
    return res.status(500).json({ message: `No se pudo enviar el código${detail}` })
  }
}

export async function verifyPasswordReset(req, res) {
  try {
    const { correo, codigo } = req.body
    if (!correo || !codigo) return res.status(400).json({ message: 'Datos incompletos' })
    const email = String(correo).toLowerCase().trim()
    const code = String(codigo).trim()

    const rec = await PasswordReset.findOne({ email })
    if (!rec) return res.status(400).json({ message: 'Solicita un código primero' })
    if (rec.expiresAt < new Date()) return res.status(400).json({ message: 'El código expiró' })
    if (rec.code !== code) return res.status(400).json({ message: 'Código inválido' })
    rec.verified = true
    await rec.save()
    return res.json({ ok: true })
  } catch (err) {
    console.error('verifyPasswordReset error', err)
    const detail = process.env.NODE_ENV === 'production' ? '' : ` (${err?.message || 'error'})`
    return res.status(500).json({ message: `No se pudo verificar el código${detail}` })
  }
}

export async function resetPassword(req, res) {
  try {
    const { correo, codigo, contrasena } = req.body
    if (!correo || !codigo || !contrasena) return res.status(400).json({ message: 'Datos incompletos' })
    if (typeof contrasena !== 'string' || contrasena.length < 6) return res.status(400).json({ message: 'La contraseña es inválida (mínimo 6 caracteres)' })
    const email = String(correo).toLowerCase().trim()
    const code = String(codigo).trim()

    const rec = await PasswordReset.findOne({ email })
    if (!rec) return res.status(400).json({ message: 'Solicita un código primero' })
    if (rec.expiresAt < new Date()) return res.status(400).json({ message: 'El código expiró' })
    if (!rec.verified || rec.code !== code) return res.status(400).json({ message: 'Código inválido o no verificado' })

    const user = await User.findOne({ correo: email })
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' })
    user.passwordHash = await bcrypt.hash(contrasena, 10)
    await user.save()

    // Cleanup
    try { await PasswordReset.deleteOne({ email }) } catch {}
    return res.json({ ok: true })
  } catch (err) {
    console.error('resetPassword error', err)
    const detail = process.env.NODE_ENV === 'production' ? '' : ` (${err?.message || 'error'})`
    return res.status(500).json({ message: `No se pudo restablecer la contraseña${detail}` })
  }
}
