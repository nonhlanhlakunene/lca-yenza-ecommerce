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

const getWorkerServices = async () => {
  const [rows] = await db.query(`
        SELECT
            s.name AS service_name,
            COUNT(p.professional_id) AS worker_count
        FROM services s
        LEFT JOIN professionals p
            ON p.service_id = s.id
        GROUP BY s.id, s.name
        HAVING COUNT(p.professional_id) > 0
        ORDER BY worker_count DESC
    `);

  return rows;
};

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

const getBookingsByService = async () => {
  const [rows] = await db.query(`
        SELECT
            s.name AS service_name,
            COUNT(b.service_id) AS booking_count
        FROM services s
        LEFT JOIN bookings b
            ON b.service_id = s.id
        GROUP BY s.id, s.name
        HAVING COUNT(b.service_id) > 0
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
      [professionalId],
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
      [professionalId],
    );

    await connection.query(
      `
            DELETE FROM users
            WHERE user_id = ?
            `,
      [userId],
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

// ============================================================
// PENDING VERIFICATIONS
// ============================================================

const getPendingVerifications = async () => {
  const [rows] = await db.query(`
        SELECT
            p.professional_id,
            p.user_id,
            p.city,
            p.verification_status,
            p.created_at,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            s.name AS service_name
        FROM professionals p
        INNER JOIN users u
            ON p.user_id = u.user_id
        LEFT JOIN services s
            ON s.id = p.service_id
        WHERE p.verification_status = 'pending'
        ORDER BY p.created_at DESC
    `);

  return rows;
};

// ============================================================
// VERIFICATION DETAILS (single worker)
// ============================================================

const getVerificationDetails = async (professionalId) => {
  const [profileRows] = await db.query(
    `
        SELECT
            p.professional_id,
            p.user_id,
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
            p.created_at AS professional_created_at,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            u.role,
            u.created_at AS user_created_at,
            s.name AS service_name
        FROM professionals p
        INNER JOIN users u
            ON p.user_id = u.user_id
        LEFT JOIN services s
            ON s.id = p.service_id
        WHERE p.professional_id = ?
    `,
    [professionalId],
  );

  if (profileRows.length === 0) {
    return null;
  }

  const profile = profileRows[0];

  const [documents] = await db.query(
    `
        SELECT
            id,
            document_type,
            file_name,
            file_path,
            file_size,
            mime_type,
            status,
            created_at
        FROM verification_documents
        WHERE user_id = ?
        ORDER BY created_at DESC
    `,
    [profile.user_id],
  );

  const [experience] = await db.query(
    `
        SELECT
            id,
            service,
            years_experience,
            experience_notes,
            created_at
        FROM worker_experience
        WHERE professional_id = ?
        ORDER BY created_at DESC
    `,
    [professionalId],
  );

  return {
    profile,
    documents,
    experience,
  };
};

const updateVerificationStatus = async (professionalId, newStatus) => {
  const [result] = await db.query(
    `
        UPDATE professionals
        SET verification_status = ?
        WHERE professional_id = ?
        `,
    [newStatus, professionalId],
  );

  return result.affectedRows;
};

const updateDocumentsStatus = async (userId, newStatus) => {
  const [result] = await db.query(
    `
        UPDATE verification_documents
        SET status = ?
        WHERE user_id = ?
        `,
    [newStatus, userId],
  );

  return result.affectedRows;
};

export default {
  getWorkers,
  getAdminStats,
  getWorkerActivity,
  getWorkerServices,
  getBookingStatus,
  getBookingsByService,
  deleteWorker,
  getPendingVerifications,
  getVerificationDetails,
  updateVerificationStatus,
  updateDocumentsStatus
};
