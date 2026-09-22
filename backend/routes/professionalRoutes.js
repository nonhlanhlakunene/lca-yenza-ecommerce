import express from "express";

import {
    getDashboard,
    getProfile,
    updateProfile,
    updateAvailability,
    acceptBooking,
    declineBooking
} from "../controllers/professionalControllers.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

router.get(
    "/dashboard",
    authMiddleware,
    getDashboard
);


router.get(
    "/me",
    authMiddleware,
    getProfile
);

router.put(
    "/me",
    authMiddleware,
    updateProfile
);


router.patch(
    "/availability",
    authMiddleware,
    updateAvailability
);


router.patch(
    "/bookings/:id/accept",
    authMiddleware,
    acceptBooking
);


router.patch(
    "/bookings/:id/decline",
    authMiddleware,
    declineBooking
);


export default router;
