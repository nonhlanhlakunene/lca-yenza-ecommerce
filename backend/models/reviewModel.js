import db from '../config/db.js';

export const createReview = async ({
    reviewerId,
    reviewedUserId,
    bookingId,
    rating,
    comment
}) => {
    const [result] = await db.query(
        `INSERT INTO reviews (reviewer_id, reviewed_user_id, booking_id, rating, comment)
         VALUES (?, ?, ?, ?, ?)`,
        [reviewerId, reviewedUserId, bookingId, rating, comment || null]
    );
    return result.insertId;
};