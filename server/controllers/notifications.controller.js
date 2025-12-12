import { User } from '../models/User.js'
import { sendPush, VAPID_PUBLIC_KEY, configureWebPush } from '../services/push.js'

configureWebPush()

export async function getVapidPublicKey(req, res) {
  res.json({ publicKey: VAPID_PUBLIC_KEY || null })
}

export async function subscribe(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: 'No autenticado' })
    const subscription = req.body?.subscription
    if (!subscription) return res.status(400).json({ message: 'Suscripción inválida' })
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    // Avoid duplicates
    const exists = user.pushSubscriptions.some(s => s.endpoint === subscription.endpoint)
    if (!exists) user.pushSubscriptions.push(subscription)
    await user.save()
    // Confirmation push
    try { await sendPush(subscription, { title: '🔔 Notificaciones activadas', body: 'Recibirás alertas de Bloomy', url: '/dashboard' }) } catch {}
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ message: 'Error al suscribirse' })
  }
}

export async function unsubscribe(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: 'No autenticado' })
    const endpoint = req.body?.endpoint
    if (!endpoint) return res.status(400).json({ message: 'Endpoint requerido' })
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    user.pushSubscriptions = user.pushSubscriptions.filter(s => s.endpoint !== endpoint)
    await user.save()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ message: 'Error al desuscribirse' })
  }
}

export async function notifyUser(req, res) {
  try {
    const userId = req.user?.id
    const { title, body, url } = req.body
    if (!userId) return res.status(401).json({ message: 'No autenticado' })
    const user = await User.findById(userId)
    if (!user || !user.pushSubscriptions?.length) return res.json({ ok: true, sent: 0 })
    let sent = 0
    await Promise.all(user.pushSubscriptions.map(async (sub) => {
      try { await sendPush(sub, { title, body, url }); sent++ } catch {}
    }))
    res.json({ ok: true, sent })
  } catch (e) {
    res.status(500).json({ message: 'Error al enviar notificación' })
  }
}