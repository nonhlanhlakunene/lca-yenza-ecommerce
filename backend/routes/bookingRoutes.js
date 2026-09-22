import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'

import {
    createBookingController,
    getBookingController,
    getCustomerBookingsController
} from '../controllers/bookingController.js'


const router = express.Router()

router.post('/', authMiddleware, createBookingController)

router.get('/customer/:customerId', getCustomerBookingsController)

router.get('/:id', getBookingController)

export default routerp
