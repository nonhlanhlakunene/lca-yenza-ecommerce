import express from "express";

import {
    getDashboard,
    getProfile,
    updateAvailability
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

router.patch(
    "/availability",
    authMiddleware,
    updateAvailability
);

export default router;
