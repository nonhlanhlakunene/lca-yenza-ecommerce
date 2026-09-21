import express from "express";

import {
    getWorkers,
    getStats,
    getWorkerActivity,
    getWorkerServices,
    getBookingStatus,
    getBookingsByService,
    removeWorker
} from "../controllers/adminControllers.js";

const router = express.Router();


router.get("/workers", getWorkers);

router.get("/stats", getStats);

router.get("/activity", getWorkerActivity);

router.get("/services", getWorkerServices);

router.get("/booking-status", getBookingStatus);

router.get("/bookings-by-service", getBookingsByService);

router.delete("/workers/:id", removeWorker);


export default router;