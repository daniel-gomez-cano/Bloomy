import 'dotenv/config'
import nodemailer from 'nodemailer'
import sgMail from '@sendgrid/mail'

// HTTP provider (Resend) key; if present we bypass raw SMTP to avoid host restrictions
const resendKey = process.env.RESEND_API_KEY
const sendgridKey = process.env.SENDGRID_API_KEY
if (sendgridKey) {
  try {
    sgMail.setApiKey(sendgridKey)
  } catch (e) {
    console.error('Failed to set SendGrid API key', e)
  }
}

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
  // 1. SendGrid (permite verificación de single sender sin dominio propio)
  if (sendgridKey) {
    try {
      const senderEmail = from.replace(/.*<|>/g, '') || from
      const msg = {
        to: Array.isArray(to) ? to : [to],
        from: senderEmail,
        subject,
        html: html || undefined,
        text: text || undefined,
      }
      const [resp] = await sgMail.send(msg)
      return { ok: true, provider: 'sendgrid', messageId: resp?.headers?.get?.('x-message-id') }
    } catch (err) {
      console.error('sendMail SendGrid error, trying next provider', err)
    }
  }

  // 2. Resend (requiere dominio verificado; gmail.com será rechazado)
  if (resendKey) {
    try {
      const body = {
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
      }
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      if (!resp.ok) {
        const errText = await resp.text()
        throw new Error(`Resend error ${resp.status}: ${errText}`)
      }
      const data = await resp.json()
      return data
    } catch (err) {
      console.error('sendMail Resend error, falling back to SMTP if possible', err)
      // If HTTP provider fails, attempt SMTP as fallback
    }
  }
  const t = getTransporter()
  try {
    const info = await t.sendMail({ from, to, subject, html, text })
    return info
  } catch (err) {
    console.error('sendMail SMTP error', err)
    throw err
  }
}
