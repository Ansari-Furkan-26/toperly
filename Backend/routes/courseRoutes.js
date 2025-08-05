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
  addMaterialToCourse,
  addChapterToVideo,
  updateChapter,
  deleteChapter
} from '../controllers/courseController.js';
import { verifyToken, isInstructor } from '../middlewares/auth.middleware.js';

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
router.post('/:id/videos/:videoId/chapters',  addChapterToVideo);
router.put('/:id/videos/:videoId/chapters/:chapterId', verifyToken, isInstructor, updateChapter);
router.delete('/:id/videos/:videoId/chapters/:chapterId', verifyToken, isInstructor, deleteChapter);

export default router;