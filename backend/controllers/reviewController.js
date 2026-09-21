import { createReview } from "../models/reviewModel.js";

export const createReviewController = async (req, res) => {
    try {
        const { reviewerId, reviewedUserId, bookingId, rating, comment } = req.body;

        if (!reviewerId || !reviewedUserId || !bookingId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required review information"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        const reviewId = await createReview({
            reviewerId,
            reviewedUserId,
            bookingId,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            reviewId
        });
    } catch (error) {
        console.error("Create review error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to submit review"
        });
    }
};