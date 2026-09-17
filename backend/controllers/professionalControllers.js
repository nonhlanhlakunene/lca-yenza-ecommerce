import professionalModel from "../models/professionalModels.js";


const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        const professional = await professionalModel.getProfessionalByUserId(userId);

        if (!professional) {
            return res.status(404).json({
                message: "Professional profile not found"
            });
        }

        const stats = await professionalModel.getDashboardStats(
            professional.professional_id
        );

        const totalEarnings = await professionalModel.getTotalEarnings(
            professional.professional_id
        );

        const recentJobs = await professionalModel.getRecentJobs(
            professional.professional_id
        );

        res.status(200).json({
            professional: {
                professional_id: professional.professional_id,
                user_id: professional.user_id,
                first_name: professional.first_name,
                last_name: professional.last_name,
                email: professional.email,
                service_name: professional.service_name,
                hourly_rate: professional.hourly_rate,
                experience_years: professional.experience_years,
                city: professional.city,
                verification_status: professional.verification_status,
                availability_status: professional.availability_status,
                profile_image: professional.profile_image
            },

            statistics: {
                total_jobs: stats.total_jobs,
                pending_jobs: stats.pending_jobs,
                confirmed_jobs: stats.confirmed_jobs,
                completed_jobs: stats.completed_jobs,
                cancelled_jobs: stats.cancelled_jobs,
                total_earnings: totalEarnings,
                completion_progress: stats.completion_progress
            },

            recent_jobs: recentJobs
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            message: "Could not load dashboard",
            error: error.message
        });
    }
};


const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const professional = await professionalModel.getProfessionalByUserId(userId);

        if (!professional) {
            return res.status(404).json({
                message: "Professional profile not found"
            });
        }

        res.status(200).json({
            professional
        });

    } catch (error) {
        console.error("Profile error:", error);

        res.status(500).json({
            message: "Could not load profile",
            error: error.message
        });
    }
};


const updateAvailability = async (req, res) => {
    try {
        const userId = req.user.id;
        const { availability_status } = req.body;

        if (
            availability_status !== "available" &&
            availability_status !== "unavailable"
        ) {
            return res.status(400).json({
                message: "Invalid availability status"
            });
        }

        const professional = await professionalModel.getProfessionalByUserId(userId);

        if (!professional) {
            return res.status(404).json({
                message: "Professional profile not found"
            });
        }

        await professionalModel.updateAvailability(
            professional.professional_id,
            availability_status
        );

        res.status(200).json({
            message: "Availability updated successfully",
            availability_status: availability_status
        });

    } catch (error) {
        console.error("Availability error:", error);

        res.status(500).json({
            message: "Could not update availability",
            error: error.message
        });
    }
};


export {
    getDashboard,
    getProfile,
    updateAvailability
};

