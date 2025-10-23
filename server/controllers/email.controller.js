import { EmailVerification } from '../models/EmailVerification.js'
import { sendMail } from '../services/mailer.js'

function generateCode() {
  // 6-digit code, leading zeros allowed
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function requestEmailCode(req, res) {
  try {
    const { correo } = req.body
    if (!correo) return res.status(400).json({ message: 'Correo requerido' })
    const email = String(correo).toLowerCase().trim()

    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Upsert latest code per email
    await EmailVerification.findOneAndUpdate(
      { email },
      { email, code, expiresAt, verified: false },
      { upsert: true, new: true }
    )

    const subject = 'Tu código de verificación - Bloomy'
    const html = `
      <div style="font-family:Arial, sans-serif;font-size:16px;color:#111">
        <p>Hola,</p>
        <p>Tu código de verificación es:</p>
        <p style="font-size:24px;font-weight:700;letter-spacing:3px">${code}</p>
        <p>El código expira en 10 minutos.</p>
        <p>Si no solicitaste este código, puedes ignorar este mensaje.</p>
      </div>
    `
    await sendMail({ to: email, subject, html })

    return res.json({ ok: true })
  } catch (err) {
    console.error('requestEmailCode error', err)
    const detail = process.env.NODE_ENV === 'production' ? '' : ` (${err?.message || 'error'})`
    return res.status(500).json({ message: `No se pudo enviar el código${detail}` })
  }
}

export async function verifyEmailCode(req, res) {
  try {
    const { correo, codigo } = req.body
    if (!correo || !codigo) return res.status(400).json({ message: 'Datos incompletos' })
    const email = String(correo).toLowerCase().trim()
    const code = String(codigo).trim()

    const rec = await EmailVerification.findOne({ email })
    if (!rec) return res.status(400).json({ message: 'Solicita un código primero' })
    if (rec.expiresAt < new Date()) return res.status(400).json({ message: 'El código expiró' })
    if (rec.code !== code) return res.status(400).json({ message: 'Código inválido' })

    rec.verified = true
    await rec.save()
    return res.json({ ok: true })
  } catch (err) {
    console.error('verifyEmailCode error', err)
    const detail = process.env.NODE_ENV === 'production' ? '' : ` (${err?.message || 'error'})`
    return res.status(500).json({ message: `No se pudo verificar el código${detail}` })
  }
}
