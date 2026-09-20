import express from "express";
import multer from "multer";
import {
    submitExperienceController,
    sendOtpController,
    verifyOtpController,
    uploadDocumentController,
    upload
} from "../controllers/verificationController.js";

const router = express.Router();

// Wrap multer so its errors become nice JSON
const uploadMiddleware = (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    success: false,
                    message: "File is too large. Maximum size is 5MB."
                });
            }
            return res.status(400).json({
                success: false,
                message: `Upload error: ${err.message}`
            });
        } else if (err) {
            // Custom error from fileFilter
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        next();
    });
};

router.post("/experience", submitExperienceController);
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/upload-document", uploadMiddleware, uploadDocumentController);

export default router;