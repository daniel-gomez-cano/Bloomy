import express from 'express'
import { createCheckoutSession, stripeWebhookHandler, confirmCheckoutSession } from '../controllers/stripe.controller.js'

const router = express.Router()

// Protected endpoint: create a checkout session
router.post('/create-checkout-session', createCheckoutSession)

// Fallback confirmation (used after returning from Stripe)
router.post('/confirm', confirmCheckoutSession)

// Webhook endpoint: note this should be mounted with raw body parser in index.js
// Webhook now mounted globally in index.js before JSON parser

export default router
