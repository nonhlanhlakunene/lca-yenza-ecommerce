import express from "express";

import {
    createReviewController,
    getReviewsController
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", getReviewsController);

router.post("/", createReviewController);

export default router;