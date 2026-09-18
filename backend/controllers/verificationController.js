import { saveWorkerExperience } from "../models/verificationModel.js";

export const submitExperienceController = async (req, res) => {
    try {
        const { professionalId, experienceNotes } = req.body;

        if (!professionalId) {
            return res.status(400).json({
                success: false,
                message: "professionalId is required"
            });
        }

        const experienceId = await saveWorkerExperience({
            professionalId,
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