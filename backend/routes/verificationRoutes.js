import express from 'express'
import { submitExperienceController, sendOtpController, verifyOtpController, uploadDocumentController, upload } from '../controllers/verificationController.js'

const router = express.Router();

router.post("/experience", submitExperienceController);
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController)
router.post(
  "/upload-document",
  upload.single("file"),
  uploadDocumentController,
);

export default router;