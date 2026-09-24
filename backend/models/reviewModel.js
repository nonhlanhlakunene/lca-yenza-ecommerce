import db from "../config/db.js";

export const createReview = async ({
  reviewerId,
  reviewedUserId,
  bookingId,
  rating,
  comment,
}) => {
  const [result] = await db.query(
    `INSERT INTO reviews
        (reviewer_id, reviewed_user_id, booking_id, rating, comment)
        VALUES (?, ?, ?, ?, ?)`,
    [reviewerId, reviewedUserId, bookingId, rating, comment || null],
  );

  return result.insertId;
};

export const getReviews = async () => {
  const [rows] = await db.query(
    `SELECT
            id,
            reviewer_id,
            reviewed_user_id,
            booking_id,
            rating,
            comment,
            status,
            created_at
        FROM reviews
        WHERE status = 'published'
        ORDER BY id DESC`,
  );

  return rows;
};

export const getReviewsByProfessional = async (reviewedUserId) => {
  const [rows] = await db.query(
    `SELECT
            r.id,
            r.rating,
            r.comment,
            r.created_at,
            u.first_name AS reviewer_first_name,
            u.last_name AS reviewer_last_name
        FROM reviews r
        LEFT JOIN users u ON u.user_id = r.reviewer_id
        WHERE r.reviewed_user_id = ? AND r.status = 'published'
        ORDER BY r.created_at DESC`,
    [reviewedUserId],
  );

  return rows;
};