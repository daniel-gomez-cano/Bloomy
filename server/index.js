import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import stripeRoutes from './routes/stripe.routes.js'
import aiRoutes from './routes/ai.routes.js'
import { stripeWebhookHandler } from './controllers/stripe.controller.js'

const app = express()

// Basic middleware
app.use(cors({
	origin: (origin, cb) => {
		// Allow multiple comma-separated origins via CLIENT_ORIGINS (fallback CLIENT_ORIGIN)
		const raw = process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || 'http://localhost:5173'
		const allow = raw.split(',').map(o => o.trim()).filter(Boolean)
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
app.use('/api/ai', aiRoutes)

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }))

// ===== Optional static client serving (single Render service) =====
// Enable by setting SERVE_CLIENT=true and ensuring the client build is present at ../client/bloomy-project/dist
if (process.env.SERVE_CLIENT === 'true') {
	const __filename = fileURLToPath(import.meta.url)
	const __dirname = path.dirname(__filename)
	const clientDist = path.join(__dirname, '../client/bloomy-project/dist')
	app.use(express.static(clientDist))
	// Fallback para rutas SPA (excluye /api y /health). Usamos RegExp compatible con Express 5.
	// Coincide con cualquier ruta que NO comience por /api/ ni sea /health.
	app.get(/^\/(?!api\/|health$).*/, (req, res) => {
		res.sendFile(path.join(clientDist, 'index.html'))
	})
}

const PORT = process.env.PORT || 3000
connectDB()
	.then(() => {
		app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
	})
	.catch((err) => {
		console.error('DB connection failed', err)
		process.exit(1)
	})

