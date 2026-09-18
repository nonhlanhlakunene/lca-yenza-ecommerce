import { saveWorkerExperience, saveOtp, findLatestOtp, markOtpVerified } from "../models/verificationModel.js";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// function for the skills and experience section
export const submitExperienceController = async (req, res) => {
    try {
        const { professionalId, service, yearsExperience, experienceNotes } = req.body;

        if (!professionalId) {
            return res.status(400).json({
                success: false,
                message: "professionalId is required"
            });
        }

        const experienceId = await saveWorkerExperience({
            professionalId,
            service,
            yearsExperience,
            experienceNotes
        });

        res.status(201).json({
            success: true,
            message: "Experience submitted successfully",
            experienceId
        });
    } catch (error) {
        console.error("Submit experience error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to submit experience"
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
                message: "userId and email are required"
            });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await saveOtp({ userId, email, otpCode, expiresAt });

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Your Yenza Verification Code",
            html: `
                <p>Your verification code is:</p>
                <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${otpCode}</p>
                <p>This code expires in 10 minutes.</p>
            `
        });

        res.status(201).json({
            success: true,
            message: "OTP sent to email"
        });
    } catch (error) {
        console.error("Send OTP error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send OTP"
        });
    }
};

export const verifyOtpController = async (req, res) => {
    try {
        const { userId, code } = req.body;

        if (!userId || !code) {
            return res.status(400).json({
                success: false,
                message: "userId and code are required"
            });
        }

        const record = await findLatestOtp(userId);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "No active OTP found. Please request a new one."
            });
        }

        if (new Date(record.expires_at) < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }

        if (record.otp_code !== code) {
            return res.status(400).json({
                success: false,
                message: "Incorrect code"
            });
        }

        await markOtpVerified(record.id);

        res.json({
            success: true,
            message: "Email verified successfully"
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to verify OTP"
        });
    }
};