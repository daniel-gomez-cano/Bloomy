import { Router } from 'express'
import { login, logout, me, register } from '../controllers/auth.controller.js'
import { requestEmailCode, verifyEmailCode } from '../controllers/email.controller.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', me)
router.post('/logout', logout)

// Email verification
router.post('/email/request-code', requestEmailCode)
router.post('/email/verify-code', verifyEmailCode)

export default router
