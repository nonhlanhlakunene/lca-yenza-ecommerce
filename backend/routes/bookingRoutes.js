import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'

import {
    createBookingController,
    getBookingController,
    getCustomerBookingsController
} from '../controllers/bookingController.js'


const router = express.Router()

router.post('/', authMiddleware, createBookingController)

router.get('/mine', authMiddleware, getCustomerBookingsController)

router.get('/:id', authMiddleware, getBookingController)

export default router
