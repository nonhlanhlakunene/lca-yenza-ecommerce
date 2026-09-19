import express from 'express'
import { createPayFastPayment, handlePayFastNotify } from '../controllers/paymentController.js'

const router = express.Router()


// CREATE A PAYFAST PAYMENT
router.post(
    '/payfast',
    createPayFastPayment
)


// RECEIVES PAYFAST'S PAYMENT NOTIFICATION
router.post(
    '/payfast/notify',
    handlePayFastNotify
)

export default router