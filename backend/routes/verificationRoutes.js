import express from 'express'
import { submitExperienceController } from '../controllers/verificationController.js'

const router = express.Router();

router.post("/experience", submitExperienceController);

export default router;