import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import stripeRoutes from './routes/stripe.routes.js'
import { stripeWebhookHandler } from './controllers/stripe.controller.js'

const app = express()

// Basic middleware
app.use(cors({
	origin: (origin, cb) => {
		const allow = [process.env.CLIENT_ORIGIN || 'http://localhost:5173']
		// allow same-origin or no-origin (like curl/postman)
		if (!origin || allow.includes(origin)) return cb(null, true)
		return cb(new Error('Not allowed by CORS'))
	},
	credentials: true,
}))
// Webhook must be before express.json to keep raw body for signature verification
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler)

app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/stripe', stripeRoutes)

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3000
connectDB()
	.then(() => {
		app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
	})
	.catch((err) => {
		console.error('DB connection failed', err)
		process.exit(1)
	})

