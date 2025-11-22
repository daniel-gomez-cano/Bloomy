import 'dotenv/config'
import nodemailer from 'nodemailer'

const host = process.env.SMTP_HOST // e.g. smtp.gmail.com
const port = Number(process.env.SMTP_PORT || 587) // 465 (SSL) or 587 (STARTTLS)
const user = process.env.SMTP_USER // full email address
const pass = process.env.SMTP_PASS // app password or SMTP password
const from = process.env.SMTP_FROM || 'Bloomy <no-reply@bloomy.app>'
const service = process.env.SMTP_SERVICE // optional: 'gmail', 'hotmail', etc.

let transporter
export function getTransporter() {
  if (!transporter) {
    const inferredGmail = (!host || host.includes('gmail')) && user && user.endsWith('@gmail.com')
    const base = {
      host: host || (inferredGmail ? 'smtp.gmail.com' : undefined),
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
      pool: true,
      connectionTimeout: Number(process.env.SMTP_CONN_TIMEOUT || 10000),
      socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 15000),
    }
    // Prefer explicit service if provided or inferred Gmail
    const config = (service || inferredGmail) ? { ...base, service: service || 'gmail' } : base
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
  try {
    const info = await t.sendMail({ from, to, subject, html, text })
    return info
  } catch (err) {
    console.error('sendMail error', err)
    throw err
  }
}
