import express from 'express';
import {
  enrollCourse
} from '../controllers/studentController.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/enroll-course/:courseId', verifyToken,  enrollCourse);

export default router;
