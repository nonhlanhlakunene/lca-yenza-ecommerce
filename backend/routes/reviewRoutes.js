import express from 'express';
import {createReviewController} from '../controllers/reviewController.js';

const router = express.Router();

router.post("/", createReviewController);

export default router;
import express from 'express'
import db from '../config/db.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [reviews] = await db.query(`
      SELECT
        id,
        full_name,
        job_title,
        rating,
        review_count
      FROM handymen
      WHERE review_count > 0
      ORDER BY rating DESC
      LIMIT 3
    `)

    res.json({
      success: true,
      reviews
    })
  } catch (error) {
    console.error('Error getting reviews:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to load reviews'
    })
  }
})

export default router
