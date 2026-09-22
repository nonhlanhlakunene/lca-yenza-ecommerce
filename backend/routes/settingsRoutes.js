import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { getMySettings, updateMySettings } from '../controllers/settingsController.js'

const router = express.Router()
router.get('/me', authMiddleware, getMySettings)
router.put('/me', authMiddleware, updateMySettings)
export default router
