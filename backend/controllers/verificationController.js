import {
  saveWorkerExperience,
  saveOtp,
  findLatestOtp,
  markOtpVerified,
  saveDocument,
} from "../models/verificationModel.js";
import nodemailer from "nodemailer";
import multer from "multer";
import fs from "fs";
import path from "path";

// Nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `doc_${Date.now()}_${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Multer middleware — limit to 5MB, images/PDFs only
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, and PDF files are allowed"));
    }
  },
});

// Function for the skills and experience section
export const submitExperienceController = async (req, res) => {
  try {
    const { professionalId, service, yearsExperience, experienceNotes } =
      req.body;

    if (!professionalId) {
      return res.status(400).json({
        success: false,
        message: "professionalId is required",
      });
    }

    const experienceId = await saveWorkerExperience({
      professionalId,
      service,
      yearsExperience,
      experienceNotes,
    });

    res.status(201).json({
      success: true,
      message: "Experience submitted successfully",
      experienceId,
    });
  } catch (error) {
    console.error("Submit experience error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit experience",
    });
  }
};

// Function for the email verification section
export const sendOtpController = async (req, res) => {
  try {
    const { userId, email } = req.body;

    if (!userId || !email) {
      return res.status(400).json({
        success: false,
        message: "userId and email are required",
      });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await saveOtp({ userId, email, otpCode, expiresAt });

    await transporter.sendMail({
      from: `"Yenza Verification" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Yenza Verification Code",
      html: `
        <p>Your verification code is:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${otpCode}</p>
        <p>This code expires in 10 minutes.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({
        success: false,
        message: "userId and code are required",
      });
    }

    const record = await findLatestOtp(userId);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "No active OTP found. Please request a new one.",
      });
    }

    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (record.otp_code !== code) {
      return res.status(400).json({
        success: false,
        message: "Incorrect code",
      });
    }

    await markOtpVerified(record.id);

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
};

export const uploadDocumentController = async (req, res) => {
  try {
    const { userId, documentType } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file was uploaded. Please select a file and try again.",
      });
    }

    if (!userId || !documentType) {
      return res.status(400).json({
        success: false,
        message: "Missing required information. Please try again.",
      });
    }

    const allowedTypes = ["id", "address", "police_clearance", "affidavit"];
    if (!allowedTypes.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid document type. Must be one of: ${allowedTypes.join(", ")}`,
      });
    }

    const documentId = await saveDocument({
      userId,
      documentType,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      documentId,
    });
  } catch (error) {
    console.error("Upload document error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while uploading document. Please try again.",
    });
  }
};
