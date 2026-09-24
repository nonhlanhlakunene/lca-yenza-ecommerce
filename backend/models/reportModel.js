import db from "../config/db.js";

export const createReport = async ({
  reporterId,
  reportedUserId,
  bookingId,
  reason,
  description,
}) => {
  const [result] = await db.query(
    `INSERT INTO reports (reporter_id, reported_user_id, booking_id, reason, description) 
        VALUES (?, ?, ?, ?, ?)`,
    [reporterId, reportedUserId, bookingId, reason, description],
  );
  return result.insertId;
};

export const getAllReports = async () => {
  const [reports] = await db.query(
    `
    SELECT
      r.id,
      r.reason,
      r.description,
      r.status,
      r.created_at,

      reporter.user_id AS reporter_id,
      reporter.first_name AS reporter_first_name,
      reporter.last_name AS reporter_last_name,
      reporter.email AS reporter_email,

      reported.user_id AS reported_user_id,
      reported.first_name AS reported_first_name,
      reported.last_name AS reported_last_name,
      reported.email AS reported_email,

      b.booking_id,
      b.booking_date,
      b.booking_time,
      b.service_address,
      b.city,
      b.notes AS booking_notes,

      s.name AS service_name

    FROM reports r
    LEFT JOIN users reporter ON reporter.user_id = r.reporter_id
    LEFT JOIN users reported ON reported.user_id = r.reported_user_id
    LEFT JOIN bookings b ON b.booking_id = r.booking_id
    LEFT JOIN services s ON s.id = b.service_id
    ORDER BY r.created_at DESC
    `,
  );

  return reports;
};

export const getReportById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM reports WHERE id = ?`, [id]);

  return rows[0];
};

export const updateReportStatus = async (id, status) => {
  const [result] = await db.query(
    `UPDATE reports SET status = ? WHERE id = ?`,
    [status, id],
  );

  return result.affectedRows;
};
