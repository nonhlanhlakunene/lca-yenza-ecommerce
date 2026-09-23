import db from "../config/db.js";


const getProfessionalByUserId = async (userId) => {
    const [rows] = await db.query(
        `
        SELECT
            p.professional_id,
            p.user_id,
            p.service_id,
            p.bio,
            p.experience_years,
            p.hourly_rate,
            p.address,
            p.city,
            p.province,
            p.postal_code,
            p.profile_image,
            p.verification_status,
            p.availability_status,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            s.name AS service_name
        FROM professionals p
        JOIN users u
            ON p.user_id = u.user_id
        LEFT JOIN services s
            ON p.service_id = s.id
        WHERE p.user_id = ?
        `,
        [userId]
    );

    return rows[0];
};


const getDashboardStats = async (professionalId) => {
    const [rows] = await db.query(
        `
        SELECT
            COUNT(*) AS total_jobs,

            SUM(
                CASE
                    WHEN status = 'pending'
                    THEN 1
                    ELSE 0
                END
            ) AS pending_jobs,

            SUM(
                CASE
                    WHEN status = 'confirmed'
                    THEN 1
                    ELSE 0
                END
            ) AS confirmed_jobs,

            SUM(
                CASE
                    WHEN status = 'completed'
                    THEN 1
                    ELSE 0
                END
            ) AS completed_jobs,

            SUM(
                CASE
                    WHEN status = 'cancelled'
                    THEN 1
                    ELSE 0
                END
            ) AS cancelled_jobs

        FROM bookings
        WHERE professional_id = ?
        `,
        [professionalId]
    );

    const stats = rows[0];

    const totalJobs = Number(stats.total_jobs) || 0;
    const completedJobs = Number(stats.completed_jobs) || 0;

    const completionProgress =
        totalJobs > 0
            ? Math.round((completedJobs / totalJobs) * 100)
            : 0;

    return {
        total_jobs: totalJobs,
        pending_jobs: Number(stats.pending_jobs) || 0,
        confirmed_jobs: Number(stats.confirmed_jobs) || 0,
        completed_jobs: completedJobs,
        cancelled_jobs: Number(stats.cancelled_jobs) || 0,
        completion_progress: completionProgress
    };
};


const getTotalEarnings = async (professionalId) => {
    const [rows] = await db.query(
        `
        SELECT
            COALESCE(SUM(p.amount), 0) AS total_earnings
        FROM payments p
        JOIN bookings b
            ON p.booking_id = b.booking_id
        WHERE b.professional_id = ?
        AND b.status = 'completed'
        AND p.payment_status = 'successful'
        `,
        [professionalId]
    );

    return Number(rows[0].total_earnings) || 0;
};


const getPendingJobs = async (professionalId) => {
    const [rows] = await db.query(
        `
        SELECT
            b.booking_id,
            b.booking_date,
            b.booking_time,
            b.service_address,
            b.city,
            b.province,
            b.postal_code,
            b.notes,
            b.status,

            u.user_id AS customer_id,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,

            s.id AS service_id,
            s.name AS service_name

        FROM bookings b

        JOIN users u
            ON b.customer_id = u.user_id

        JOIN services s
            ON b.service_id = s.id

        WHERE b.professional_id = ?
        AND b.status = 'pending'

        ORDER BY b.booking_date ASC, b.booking_time ASC
        `,
        [professionalId]
    );

    return rows;
};


const getConfirmedBookings = async (professionalId) => {
    const [rows] = await db.query(
        `
        SELECT
            b.booking_id,
            b.booking_date,
            b.booking_time,
            b.service_address,
            b.city,
            b.province,
            b.postal_code,
            b.notes,
            b.status,

            u.user_id AS customer_id,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,

            s.id AS service_id,
            s.name AS service_name

        FROM bookings b

        JOIN users u
            ON b.customer_id = u.user_id

        JOIN services s
            ON b.service_id = s.id

        WHERE b.professional_id = ?
        AND b.status = 'confirmed'

        ORDER BY b.booking_date ASC, b.booking_time ASC
        `,
        [professionalId]
    );

    return rows;
};


const getBookingById = async (bookingId, professionalId) => {
    const [rows] = await db.query(
        `
        SELECT
            b.booking_id,
            b.booking_date,
            b.booking_time,
            b.service_address,
            b.city,
            b.province,
            b.postal_code,
            b.notes,
            b.status,

            u.user_id AS customer_id,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,

            s.id AS service_id,
            s.name AS service_name

        FROM bookings b

        JOIN users u
            ON b.customer_id = u.user_id

        JOIN services s
            ON b.service_id = s.id

        WHERE b.booking_id = ?
        AND b.professional_id = ?
        `,
        [bookingId, professionalId]
    );

    return rows[0];
};


const acceptBooking = async (bookingId, professionalId) => {
    const [result] = await db.query(
        `
        UPDATE bookings
        SET
            status = 'confirmed',
            updated_at = CURRENT_TIMESTAMP
        WHERE booking_id = ?
        AND professional_id = ?
        AND status = 'pending'
        `,
        [bookingId, professionalId]
    );

    return result;
};


const declineBooking = async (bookingId, professionalId) => {
    const [result] = await db.query(
        `
        UPDATE bookings
        SET
            status = 'cancelled',
            updated_at = CURRENT_TIMESTAMP
        WHERE booking_id = ?
        AND professional_id = ?
        AND status = 'pending'
        `,
        [bookingId, professionalId]
    );

    return result;
};


const updateAvailability = async (
    professionalId,
    availabilityStatus
) => {
    const [result] = await db.query(
        `
        UPDATE professionals
        SET
            availability_status = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE professional_id = ?
        `,
        [availabilityStatus, professionalId]
    );

    return result;
};


const updateProfessionalProfile = async (userId, profile) => {
    await db.query(
        `UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE user_id = ?`,
        [profile.first_name, profile.last_name, profile.email, profile.phone || null, userId]
    );
    await db.query(
        `UPDATE professionals SET service_id = ?, bio = ?, experience_years = ?, hourly_rate = ?, address = ?, city = ?,
         province = ?, postal_code = ?, profile_image = ?, availability_status = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
        [profile.service_id, profile.bio || null, profile.experience_years || 0, profile.hourly_rate,
            profile.address || null, profile.city || null, profile.province || null, profile.postal_code || null,
            profile.profile_image || null, profile.availability_status, userId]
    );
    return getProfessionalByUserId(userId);
};

export default {
    getProfessionalByUserId,
    getDashboardStats,
    getTotalEarnings,
    getPendingJobs,
    getConfirmedBookings,
    getBookingById,
    acceptBooking,
    declineBooking,
    updateAvailability,
    updateProfessionalProfile
};
