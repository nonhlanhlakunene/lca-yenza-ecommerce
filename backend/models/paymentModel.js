import db from '../config/db.js'

// Create pending payment
export const createPayment = async ({
    bookingId,
    userId,
    amount
}) => {

    const [result] = await db.execute(
        `INSERT INTO payments
        (
            booking_id,
            user_id,
            amount,
            currency,
            payment_method,
            payment_status
        )
        VALUES (?, ?, ?, 'ZAR', 'payfast', 'pending')`,
        [
            bookingId,
            userId,
            amount
        ]
    )
    return result.insertId
}


// Get the latest payment for a booking
export const getPaymentsByBookingId = async (bookingId) => {

    const [rows] = await db.execute(
        `SELECT
            payment_id,
            booking_id,
            user_id,
            amount,
            currency,
            payment_method,
            transaction_id,
            payment_status,
            paid_at,
            created_at,
            updated_at
        FROM payments
        WHERE booking_id = ?
        ORDER BY payment_id DESC
        LIMIT 1`,
        [bookingId]
    )
    return rows[0]
}


// Update payment after PayFast responds
export const updatePaymentStatus = async ({
    paymentId,
    transactionId,
    paymentStatus,
    paidAt
}) => {

    await db.execute(
        `UPDATE payments
        SET
            transaction_id = ?,
            payment_status = ?,
            paid_at = ?
        WHERE payment_id = ?`,
        [
            transactionId || null,
            paymentStatus,
            paidAt || null,
            paymentId
        ]
    )
}