import express from 'express'

import {
    createBookingController,
    getBookingController,
    getCustomerBookingsController
} from '../controllers/bookingController.js'

const router = express.Router()

router.post('/', createBookingController)

router.get('/customer/:customerId', getCustomerBookingsController)

router.get('/:id', getBookingController)

export default router
