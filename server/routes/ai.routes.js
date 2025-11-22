import { Router } from 'express'
import { generateReport, chatStream } from '../controllers/ai.controller.js'

const router = Router()

router.post('/report', generateReport)
router.post('/chat', chatStream)

export default router
