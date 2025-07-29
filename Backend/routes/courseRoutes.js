import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  addVideoToCourse,
  addThumbnailToCourse,
  deleteCourse
} from '../controllers/courseController.js';
import { verifyToken, isInstructor } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verifyToken, isInstructor, createCourse);
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.put('/:id', verifyToken, isInstructor, updateCourse);
router.post('/:id/videos', verifyToken, isInstructor, addVideoToCourse);
router.post('/:id/thumbnail',verifyToken, isInstructor, addThumbnailToCourse);
router.delete('/:id', verifyToken, isInstructor, deleteCourse);

export default router;
