import db from "../config/db.js";


const getWorkers = async () => {
    const [rows] = await db.query(`
        SELECT
            p.professional_id,
            p.user_id,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            s.name AS service_name,
            p.hourly_rate,
            p.city,
            p.verification_status,
            p.availability_status,
            p.profile_image
        FROM professionals p
        INNER JOIN users u
            ON p.user_id = u.user_id
        INNER JOIN services s
            ON p.service_id = s.id
        ORDER BY p.professional_id ASC
    `);

    return rows;
};


const getAdminStats = async () => {
    const [rows] = await db.query(`
        SELECT
            (
                SELECT COUNT(*)
                FROM professionals
            ) AS total_workers,

            (
                SELECT COUNT(*)
                FROM users
                WHERE role = 'customer'
            ) AS total_customers,

            (
                SELECT COUNT(*)
                FROM bookings
            ) AS total_bookings,

            (
                SELECT COALESCE(SUM(amount), 0)
                FROM payments
                WHERE payment_status = 'successful'
            ) AS total_revenue
    `);

    return rows[0];
};


const getWorkerActivity = async () => {
    const [rows] = await db.query(`
        SELECT
            (
                SELECT COUNT(*)
                FROM bookings
                WHERE status IN ('confirmed', 'pending')
            ) AS active,

            (
                SELECT COUNT(*)
                FROM bookings
                WHERE status = 'completed'
            ) AS completed,

            (
                SELECT COUNT(*)
                FROM bookings
                WHERE status = 'pending'
            ) AS pending
    `);

    return rows[0];
};


/*
|--------------------------------------------------------------------------
| WORKER SERVICE CHART
|--------------------------------------------------------------------------
| Counts how many professionals belong to each service.
| This uses the existing professionals + services tables.
*/

const getWorkerServices = async () => {
    const [rows] = await db.query(`
        SELECT
            s.name AS service_name,
            COUNT(p.professional_id) AS worker_count
        FROM services s
        LEFT JOIN professionals p
            ON p.service_id = s.id
        GROUP BY s.id, s.name
        HAVING worker_count > 0
        ORDER BY worker_count DESC
    `);

    return rows;
};


/*
|--------------------------------------------------------------------------
| BOOKING STATUS CHART
|--------------------------------------------------------------------------
| Gives the chart a breakdown of every booking status
| that actually exists in the database.
*/

const getBookingStatus = async () => {
    const [rows] = await db.query(`
        SELECT
            status,
            COUNT(*) AS booking_count
        FROM bookings
        GROUP BY status
        ORDER BY booking_count DESC
    `);

    return rows;
};


const deleteWorker = async (professionalId) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [professional] = await connection.query(
            `
            SELECT user_id
            FROM professionals
            WHERE professional_id = ?
            `,
            [professionalId]
        );

        if (professional.length === 0) {
            await connection.rollback();
            return false;
        }

        const userId = professional[0].user_id;

        await connection.query(
            `
            DELETE FROM professionals
            WHERE professional_id = ?
            `,
            [professionalId]
        );

        await connection.query(
            `
            DELETE FROM users
            WHERE user_id = ?
            `,
            [userId]
        );

        await connection.commit();

        return true;

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
};


export default {
    getWorkers,
    getAdminStats,
    getWorkerActivity,
    getWorkerServices,
    getBookingStatus,
    deleteWorker
};