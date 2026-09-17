import express from 'express';
import {createReviewController} from '../controllers/reviewController.js';

const router = express.Router();

router.post("/", createReviewController);

export default router;