import express from "express";

import {
    createReviewController,
    getReviewsController, getReviewsByProfessionalController
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", getReviewsController);

router.get("/professional/:reviewedUserId", getReviewsByProfessionalController);

router.post("/", createReviewController);

export default router;