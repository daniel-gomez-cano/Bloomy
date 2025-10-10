import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.routes.js'

dotenv.config()

const app = express()

// Basic middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)

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

