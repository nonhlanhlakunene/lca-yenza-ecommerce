import  { createPayment, getPaymentsByBookingId, updatePaymentStatus } from '../models/paymentModel.js'
import db from '../config/db.js'
import { generatePayFastSignature, validatePayFastSignature, validatePayFastServerConfirmation } from '../services/payfastService.js'


// CREATE PAYFAST PAYMENT
export const createPayFastPayment = async (req, res) => {

    try {
        const { bookingId } = req.body

        // CHECK BOOKING ID
        if (!bookingId) {

            return res.status(400).json({
                success: false,
                message: 'Booking ID is required'
            })
        }


        // GET BOOKING INFORMATION
        const [rows] = await db.execute(
            `SELECT
                b.booking_id,
                b.customer_id,
                b.professional_id,
                b.service_id,
                b.status,
                
                u.first_name,
                u.last_name,
                u.email,
                
                p.hourly_rate,
                
                s.name AS service_name
                
            FROM bookings b
            
            JOIN users u
                ON b.customer_id = u.user_id

            JOIN professionals p
                ON b.professional_id = p.professional_id

            JOIN services s
                ON b.service_id = s.id
                
            WHERE b.booking_id = ?

            LIMIT 1`,
            [bookingId]
        )

        const booking = rows[0]


        // CHECK BOOKING EXISTS
        if (!booking) {

            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            })
        }


        // GET PAYMENT AMOUNT
        const amount = Number(booking.hourly_rate)

        if (!amount || amount <= 0) {

            return res.status(400).json({
                success: false,
                message: 'Invalid booking amount'
            })
        }


        // CHECK FOR EXISTING PAYMENT
        const existingPayment = await getPaymentsByBookingId(bookingId)

        if (
            existingPayment &&
            existingPayment.payment_status === 'successful'
        ) {

            return res.status(400).json({
                success: false,
                message: 'This booking has already been paid'
            })
        }


        // CREATE PAYMENT IN DATABASE
        let paymentId

        if (
            existingPayment &&
            existingPayment.payment_status === 'pending'
        ) {
            paymentId = existingPayment.payment_id
        } else {

            paymentId = await createPayment({

                bookingId,
                userId: booking.customer_id,
                amount

            })
        }


        // PAYFAST SETTINGS
        const merchantId =
            process.env.PAYFAST_MERCHANT_ID

        const merchantKey = 
            process.env.PAYFAST_MERCHANT_KEY

        const passphrase =
            process.env.PAYFAST_PASSPHRASE ||
            null

        const paymentUrl =
            process.env.PAYFAST_URL ||
            'https://sandbox.payfast.co.za/eng/process'

        const frontendUrl =
            process.env.FRONTEND_URL ||
            'http://localhost:5173'

        const notifyUrl = 
            process.env.PAYFAST_NOTIFY_URL


        // CHECK PAYFAST CREDENTIALS
        if (!merchantId || !merchantKey || !notifyUrl) {

            return res.status(500).json({
                success: false,
                message: 'PayFast credentials are not configured'
            })
        }


        // CREATE PAYFAST DATA
        const payfastData = {

            merchant_id:
                merchantId,

            merchant_key:
                merchantKey,

            return_url:
                `${frontendUrl}/bookings`,

            cancel_url:
                `${frontendUrl}/bookings`,

            notify_url:
                notifyUrl,

            name_first:
                booking.first_name,

            name_last:
                booking.last_name,

            email_address:
                booking.email,

            amount:
                amount.toFixed(2),

            item_name:
                `YENZA ${booking.service_name}`,

            item_description:
                `Booking #${booking.booking_id}`,

            custom_str1:
                String(booking.booking_id),

            custom_str2:
                String(paymentId)
        }


        // GENERATE PAYFAST SIGNATURE
        const signature =
            generatePayFastSignature(
                payfastData,
                passphrase
            )

        payfastData.signature = signature


        // SEND PAYMENT INFORMATION TO FRONTEND
        return res.status(200).json({
            success: true,

            payment_id: paymentId,

            booking_id: booking.booking_id,

            amount,

            payment_url: paymentUrl,

            payfast_data: payfastData

        })
    } catch (error) {

        console.error(
            'Create PayFast payment error:',
            error
        )

        return res.status(500).json({
            success: false,
            message: 'Failed to create PayFast payment'
        })
    }
}


// HANDLE PAYFAST NOTIFICATIONS
export const handlePayFastNotify = async (req, res) => {

    try {

        const data = req.body

        console.log('PayFast ITN received:', data)

        const bookingId = data.custom_str1
        const paymentId = data.custom_str2

        // Check required values
        if (!bookingId || !paymentId) {
            return res
                .status(400)
                .send('Payment not found')
        }

        // PayFast Settings
        const passphrase =
            process.env.PAYFAST_PASSPHRASE || null


        // Validate PayFast signature
        const validSignature =
            validatePayFastSignature(
                data,
                passphrase
            )

        if (!validSignature) {
            console.error(
                'Invalid PayFast ITN signature'
            )
            return res
                .status(400)
                .send('Invalid signature')
        }

        // Confirm ITN with PayFast's server
        const validServerConfirmation =
            await validatePayFastServerConfirmation(
                data
            )

        if (!validServerConfirmation) {
            console.error(
                'PayFast server confirmation failed'
            )
            return res
                .status(400)
                .send('ITN validation failed')
        }

        // Get payment from database
        const [paymentRows] = await db.execute(
            `SELECT
                payment_id,
                booking_id,
                amount,
                payment_status
            FROM payments
            WHERE payment_id = ?
            LIMIT 1`,
            [paymentId]
        )

        const payment = paymentRows[0]

        if (!payment) {

            return res
                .status(404)
                .send('Payment not found')
        }


        // Make sure the payment belongs to this booking
        if (String(payment.booking_id) !== String(bookingId)) {

            return res
                .status(400)
                .send('Booking mismatch')
        }

        // Compare the amount PayFast sent with the amount in database
        const receivedAmount =
            Number(data.amount_gross)
        const expectedAmount =
            Number(payment.amount)

        if (
            Math.abs(
                receivedAmount - expectedAmount
            ) > 0.01
        ) {
            console.error(
                'PayFast amount mismatch:',
                {
                    receivedAmount,
                    expectedAmount
                }
            )

            return res
                .status(400)
                .send('Amount mismatch')
        }

        // Check payment status
        if (data.payment_status === 'COMPLETE') {

            await updatePaymentStatus({
                paymentId: payment.payment_id,
                transactionId: data.pf_payment_id,
                paymentStatus: 'successful',
                paidAt: new Date()
            })


            // Confirm booking
            await db.execute(

                `UPDATE bookings
                SET status = 'confirmed'
                WHERE booking_id = ?`,
                [bookingId]
            )

            console.log(
                `Payment ${payment.payment_id} marked as successful`
            )
        }

        return res
            .status(200)
            .send('OK')

    } catch (error) {

        console.error(
            'PayFast ITN error:',
            error
        )

        return res
            .status(500)
            .send('ITN processing failed')
            
    }
}