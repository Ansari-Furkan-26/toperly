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

const router = express.Router();

router.post('/', createCourse);
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.put('/:id', updateCourse);
router.post('/:id/videos', addVideoToCourse);
router.post('/:id/thumbnail', addThumbnailToCourse);
router.delete('/:id', deleteCourse);

export default router;
