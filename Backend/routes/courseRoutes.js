import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  addVideoToCourse,
  addThumbnailToCourse,
  deleteCourse,
  updateMaterial,
  deleteMaterial,
  getInstructorsCourses,
  addMaterialToCourse
} from '../controllers/courseController.js';
import { verifyToken, isInstructor } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// router.post('/', verifyToken, isInstructor, createCourse);
router.post('/', createCourse);
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.get('/instructor/myCourses', verifyToken, isInstructor, getInstructorsCourses);
router.put('/:id', verifyToken, isInstructor, updateCourse);
router.post('/:id/videos', verifyToken, isInstructor, addVideoToCourse);
router.post('/:id/thumbnail', verifyToken, isInstructor, addThumbnailToCourse);
router.delete('/:id', verifyToken, isInstructor, deleteCourse);
router.post('/:id/materials', verifyToken, isInstructor, addMaterialToCourse);
router.put('/:id/materials/:materialId', verifyToken, isInstructor, updateMaterial);
router.delete('/:id/materials/:materialId', verifyToken, isInstructor, deleteMaterial);

export default router;