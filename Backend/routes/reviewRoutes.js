import express from 'express';
import {
  addReview,
  getReviewsForCourse,
  deleteReview
} from '../controllers/reviewController.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// POST /reviews/:courseId
router.post('/:courseId', verifyToken, addReview);

// GET /reviews/:courseId
router.get('/:courseId', getReviewsForCourse);

// DELETE /reviews/:courseId/:reviewId
router.delete('/:courseId/:reviewId', verifyToken, deleteReview);

export default router;
