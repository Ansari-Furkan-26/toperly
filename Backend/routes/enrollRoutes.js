import express from 'express';
import {
  enrollStudent, getMyEnrolledCourses
} from '../controllers/enrollController.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/:courseId', verifyToken,  enrollStudent);
router.get('/my-courses', verifyToken, getMyEnrolledCourses);

export default router;
