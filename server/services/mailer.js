import 'dotenv/config'
import nodemailer from 'nodemailer'

const host = process.env.SMTP_HOST
const port = Number(process.env.SMTP_PORT || 587)
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS
const from = process.env.SMTP_FROM || 'no-reply@bloomy.app'

let transporter
export function getTransporter() {
  if (!transporter) {
    const base = {
      host,
      port,
      secure: port === 465, // true for 465, false for 587/25/2525
      auth: user && pass ? { user, pass } : undefined,
    }
    // If using Gmail, it's safer to set service
    const config = host && host.includes('gmail') ? { ...base, service: 'gmail' } : base
    transporter = nodemailer.createTransport(config)
    // Optional debug
    if (process.env.NODE_ENV !== 'production') {
      console.log('Mailer configured:', { host: config.host, port: config.port, hasAuth: !!config.auth })
    }
  }
  return transporter
}

export async function sendMail({ to, subject, html, text }) {
  const t = getTransporter()
  const info = await t.sendMail({ from, to, subject, html, text })
  return info
}
