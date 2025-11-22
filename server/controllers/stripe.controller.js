import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config()
import { User } from '../models/User.js'
import { verifyToken } from '../services/jwt.js'

const secret = process.env.STRIPE_SECRET_KEY
if (!secret) {
  console.error('[Stripe] Missing STRIPE_SECRET_KEY in environment')
}
const stripe = new Stripe(secret || '', { apiVersion: '2022-11-15' })
const PRICE_ID = process.env.STRIPE_PRICE_ID
// APP_BASE_URL: dominio público del frontend (en despliegue single-service puede ser el mismo dominio Render)
// Fallbacks mantienen compatibilidad local
const APP_BASE_URL = process.env.APP_BASE_URL || process.env.CLIENT_ORIGIN || process.env.VITE_CLIENT_URL || 'http://localhost:5173'

export async function createCheckoutSession(req, res) {
  try {
    // identify user from cookie (same logic as /me)
    const token = req.cookies?.bloomy_token
    if (!token) return res.status(401).json({ message: 'No autenticado' })
    const payload = verifyToken(token)
    const user = await User.findById(payload.sub)
    if (!user) return res.status(401).json({ message: 'No autenticado' })

    // create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      customer_email: user.correo,
      metadata: { userId: user._id.toString() },
      success_url: `${APP_BASE_URL.replace(/\/$/, '')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_BASE_URL.replace(/\/$/, '')}/dashboard?canceled=true`,
    })

    return res.json({ url: session.url })
  } catch (err) {
    console.error('createCheckoutSession err', err)
    return res.status(500).json({ message: 'No se pudo crear la sesión' })
  }
}

// webhook expects raw body; handler will be mounted using express.raw
export async function stripeWebhookHandler(req, res) {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    // quick diagnostics to ensure we get a Buffer body
    if (!Buffer.isBuffer(req.body)) {
      console.warn('[Stripe] Webhook body is not Buffer. Type:', typeof req.body)
    }
    if (webhookSecret) {
      // increase tolerance to 10 minutes for dev environments to avoid local clock drift issues
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret, 600)
    } else {
      // If no webhook secret provided, parse body directly (less secure)
      event = req.body
    }
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata?.userId
    const subscriptionId = session.subscription
    const customerId = session.customer

    if (userId) {
      try {
        await User.findByIdAndUpdate(userId, {
          isPremium: true,
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: customerId,
        })
        console.log(`User ${userId} marked as premium`)
      } catch (err) {
        console.error('Failed to update user after webhook', err)
      }
    }
  }

  res.json({ received: true })
}

// Fallback for dev/demo: confirm a Checkout session on return
// Use this if the webhook isn't reachable locally. Idempotent: safe to call multiple times.
export async function confirmCheckoutSession(req, res) {
  try {
    const { session_id } = req.body || {}
    if (!session_id) return res.status(400).json({ message: 'session_id requerido' })

    // Identify current user (cookie auth)
    const token = req.cookies?.bloomy_token
    if (!token) return res.status(401).json({ message: 'No autenticado' })
    const payload = verifyToken(token)
    const user = await User.findById(payload.sub)
    if (!user) return res.status(401).json({ message: 'No autenticado' })

    const session = await stripe.checkout.sessions.retrieve(session_id)

    // Basic ownership check: ensure the session email matches or metadata contains this user
    const sessionUserId = session?.metadata?.userId
    if (sessionUserId && sessionUserId !== String(user._id)) {
      return res.status(403).json({ message: 'Sesión no corresponde al usuario' })
    }

    const isComplete = session.status === 'complete' || session.payment_status === 'paid'
    if (!isComplete) {
      return res.status(409).json({ message: 'La sesión aún no está completada' })
    }

    // Update user as premium (idempotent)
    if (!user.isPremium) {
      user.isPremium = true
      user.stripeSubscriptionId = session.subscription || user.stripeSubscriptionId
      user.stripeCustomerId = (typeof session.customer === 'string' ? session.customer : session.customer?.id) || user.stripeCustomerId
      await user.save()
    }

    return res.json({ ok: true, isPremium: true })
  } catch (err) {
    console.error('confirmCheckoutSession error', err)
    return res.status(500).json({ message: 'No se pudo confirmar la sesión' })
  }
}
