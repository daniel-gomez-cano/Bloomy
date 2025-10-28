import { Router } from 'express'
import { generateReport } from '../controllers/ai.controller.js'

const router = Router()

router.post('/report', generateReport)

export default router
