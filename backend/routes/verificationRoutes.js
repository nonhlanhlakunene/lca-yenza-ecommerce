import express from 'express'
import { submitExperienceController, sendOtpController, verifyOtpController } from '../controllers/verificationController.js'

const router = express.Router();

router.post("/experience", submitExperienceController);
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController)

export default router;