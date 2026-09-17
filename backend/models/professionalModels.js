import db from "../config/db.js";

const getProfessionalByUserId = async (userId) => {
    const [rows] = await db.query(
        `SELECT
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
            s.name AS service_name
        FROM professionals p
        JOIN users u ON p.user_id = u.user_id
        JOIN services s ON p.service_id = s.id
        WHERE p.user_id = ?`,
        [userId]
    );

    return rows[0];
};


const getDashboardStats = async (professionalId) => {
    const [rows] = await db.query(
        `SELECT
            COUNT(*) AS total_jobs,

            SUM(
                CASE
                    WHEN status = 'pending' THEN 1
                    ELSE 0
                END
            ) AS pending_jobs,

            SUM(
                CASE
                    WHEN status = 'confirmed' THEN 1
                    ELSE 0
                END
            ) AS confirmed_jobs,

            SUM(
                CASE
                    WHEN status = 'completed' THEN 1
                    ELSE 0
                END
            ) AS completed_jobs,

            SUM(
                CASE
                    WHEN status = 'cancelled' THEN 1
                    ELSE 0
                END
            ) AS cancelled_jobs

        FROM bookings
        WHERE professional_id = ?`,
        [professionalId]
    );

    const stats = rows[0];

    const totalJobs = Number(stats.total_jobs) || 0;
    const completedJobs = Number(stats.completed_jobs) || 0;

    let completionProgress = 0;

    if (totalJobs > 0) {
        completionProgress = Math.round(
            (completedJobs / totalJobs) * 100
        );
    }

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
        `SELECT
            COALESCE(SUM(p.amount), 0) AS total_earnings
        FROM payments p
        JOIN bookings b ON p.booking_id = b.booking_id
        WHERE b.professional_id = ?
        AND b.status = 'completed'`,
        [professionalId]
    );

    return Number(rows[0].total_earnings) || 0;
};


const getRecentJobs = async (professionalId) => {
    const [rows] = await db.query(
        `SELECT
            b.booking_id,
            b.booking_date,
            b.booking_time,
            b.service_address,
            b.city,
            b.province,
            b.status,
            b.notes,
            s.name AS service_name,
            u.first_name,
            u.last_name,
            u.email
        FROM bookings b
        JOIN users u ON b.customer_id = u.user_id
        JOIN services s ON b.service_id = s.id
        WHERE b.professional_id = ?
        ORDER BY b.booking_date DESC, b.booking_time DESC
        LIMIT 5`,
        [professionalId]
    );

    return rows;
};


const updateAvailability = async (professionalId, availabilityStatus) => {
    const [result] = await db.query(
        `UPDATE professionals
        SET availability_status = ?
        WHERE professional_id = ?`,
        [availabilityStatus, professionalId]
    );

    return result;
};


export default {
    getProfessionalByUserId,
    getDashboardStats,
    getTotalEarnings,
    getRecentJobs,
    updateAvailability
};
