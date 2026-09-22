import express from "express";

import {
    getAllProfessionals,
    getDashboard,
    getProfile,
    updateAvailability,
    acceptBooking,
    declineBooking
} from "../controllers/professionalControllers.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();


router.get(
    "/",
    getAllProfessionals
);


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