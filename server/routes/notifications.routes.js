import { Router } from 'express'
import { getVapidPublicKey, subscribe, unsubscribe, notifyUser } from '../controllers/notifications.controller.js'
import { authMiddleware } from '../services/jwt.js'

const router = Router()

router.get('/vapid-public-key', authMiddleware, getVapidPublicKey)
router.post('/subscribe', authMiddleware, subscribe)
router.post('/unsubscribe', authMiddleware, unsubscribe)
router.post('/notify', authMiddleware, notifyUser)

export default router