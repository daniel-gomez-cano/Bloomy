import express from 'express'
import { createCheckoutSession, stripeWebhookHandler } from '../controllers/stripe.controller.js'

const router = express.Router()

// Protected endpoint: create a checkout session
router.post('/create-checkout-session', createCheckoutSession)

// Webhook endpoint: note this should be mounted with raw body parser in index.js
// Webhook now mounted globally in index.js before JSON parser

export default router
