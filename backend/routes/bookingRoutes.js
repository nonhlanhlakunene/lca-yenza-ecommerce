import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

import {
    createBookingController,
    getBookingController,
    getCustomerBookingsController,
    cancelBookingController
} from '../controllers/bookingController.js';


const router = express.Router();

router.post('/', authMiddleware, createBookingController);

router.get('/mine', authMiddleware, getCustomerBookingsController);

router.patch('/:id/cancel', authMiddleware, cancelBookingController);

router.get('/:id', authMiddleware, getBookingController);

export default router;
