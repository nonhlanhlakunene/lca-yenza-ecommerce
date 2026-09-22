import professionalModel from "../models/professionalModels.js";

const getDashboard = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const professional =
            await professionalModel.getProfessionalByUserId(userId);

        if (!professional) {
            return res.status(404).json({
                message: "Professional profile not found"
            });
        }

        const statistics =
            await professionalModel.getDashboardStats(
                professional.professional_id
            );

        const totalEarnings =
            await professionalModel.getTotalEarnings(
                professional.professional_id
            );

        const pendingJobs =
            await professionalModel.getPendingJobs(
                professional.professional_id
            );

        const confirmedBookings =
            await professionalModel.getConfirmedBookings(
                professional.professional_id
            );

        return res.status(200).json({
            professional,

            statistics: {
                total_jobs: statistics.total_jobs,
                pending_jobs: statistics.pending_jobs,
                confirmed_jobs: statistics.confirmed_jobs,
                completed_jobs: statistics.completed_jobs,
                cancelled_jobs: statistics.cancelled_jobs,
                total_earnings: totalEarnings,
                completion_progress: statistics.completion_progress
            },

            pending_jobs: pendingJobs,
            confirmed_bookings: confirmedBookings
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        return res.status(500).json({
            message: "Failed to load dashboard",
            error: error.message
        });
    }
};


const getProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const professional =
            await professionalModel.getProfessionalByUserId(userId);

        if (!professional) {
            return res.status(404).json({
                message: "Professional profile not found"
            });
        }

        return res.status(200).json(professional);

    } catch (error) {
        console.error("Get profile error:", error);

        return res.status(500).json({
            message: "Failed to get profile",
            error: error.message
        });
    }
};


const updateAvailability = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { availability_status } = req.body;

        if (!availability_status) {
            return res.status(400).json({
                message: "Availability status is required"
            });
        }

        const professional =
            await professionalModel.getProfessionalByUserId(userId);

        if (!professional) {
            return res.status(404).json({
                message: "Professional profile not found"
            });
        }

        await professionalModel.updateAvailability(
            professional.professional_id,
            availability_status
        );

        return res.status(200).json({
            message: "Availability updated successfully"
        });

    } catch (error) {
        console.error("Availability error:", error);

        return res.status(500).json({
            message: "Failed to update availability",
            error: error.message
        });
    }
};


const acceptBooking = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const bookingId = req.params.id;

        const professional =
            await professionalModel.getProfessionalByUserId(userId);

        if (!professional) {
            return res.status(404).json({
                message: "Professional profile not found"
            });
        }

        const booking =
            await professionalModel.getBookingById(
                bookingId,
                professional.professional_id
            );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (booking.status !== "pending") {
            return res.status(400).json({
                message: "This booking is no longer pending"
            });
        }

        await professionalModel.acceptBooking(
            bookingId,
            professional.professional_id
        );

        const updatedBooking =
            await professionalModel.getBookingById(
                bookingId,
                professional.professional_id
            );

        return res.status(200).json({
            message: "Booking accepted successfully",
            booking: updatedBooking
        });

    } catch (error) {
        console.error("Accept booking error:", error);

        return res.status(500).json({
            message: "Failed to accept booking",
            error: error.message
        });
    }
};


const declineBooking = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const bookingId = req.params.id;

        const professional =
            await professionalModel.getProfessionalByUserId(userId);

        if (!professional) {
            return res.status(404).json({
                message: "Professional profile not found"
            });
        }

        const booking =
            await professionalModel.getBookingById(
                bookingId,
                professional.professional_id
            );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (booking.status !== "pending") {
            return res.status(400).json({
                message: "This booking is no longer pending"
            });
        }

        await professionalModel.declineBooking(
            bookingId,
            professional.professional_id
        );

        return res.status(200).json({
            message: "Booking declined successfully"
        });

    } catch (error) {
        console.error("Decline booking error:", error);

        return res.status(500).json({
            message: "Failed to decline booking",
            error: error.message
        });
    }
};


const updateProfile = async (req, res) => {
    const { first_name, last_name, email, phone, service_id, bio, experience_years, hourly_rate,
        address, city, province, postal_code, profile_image, availability_status } = req.body;
    if (!first_name?.trim() || !last_name?.trim() || !email?.trim() || !service_id || hourly_rate === undefined) {
        return res.status(400).json({ message: 'Name, email, service, and hourly rate are required' });
    }
    const rate = Number(hourly_rate);
    const experience = Number(experience_years || 0);
    if (!Number.isFinite(rate) || rate < 0 || !Number.isFinite(experience) || experience < 0) {
        return res.status(400).json({ message: 'Rate and experience must be valid non-negative numbers' });
    }
    try {
        const professional = await professionalModel.updateProfessionalProfile(req.user.user_id, {
            first_name: first_name.trim(), last_name: last_name.trim(), email: email.trim(), phone: phone?.trim(),
            service_id: Number(service_id), bio: bio?.trim(), experience_years: experience, hourly_rate: rate,
            address: address?.trim(), city: city?.trim(), province: province?.trim(), postal_code: postal_code?.trim(),
            profile_image: profile_image?.trim(), availability_status: availability_status || 'available'
        });
        res.json({ message: 'Worker profile updated successfully', professional });
    } catch (error) {
        console.error('Update professional profile error:', error);
        if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'That email address is already in use' });
        res.status(500).json({ message: 'Failed to update worker profile' });
    }
};

export {
    getDashboard,
    getProfile,
    updateProfile,
    updateAvailability,
    acceptBooking,
    declineBooking
};
