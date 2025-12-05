import { Router } from 'express'
import { generateReport, generateReportWithData, chatStream } from '../controllers/ai.controller.js'

const router = Router()

router.post('/report', generateReport)
router.post('/report-with-data', generateReportWithData)
router.post('/chat', chatStream)

export default router
