import express from 'express';
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  enrollCourse
} from '../controllers/studentController.js';
import { verifyUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', createStudent);      // admin: create student
router.get('/', getAllStudents);      // admin: list all
router.get('/:id', getStudentById);   // get by id
router.put('/:id', updateStudent);    // admin: update
router.delete('/:id', deleteStudent); // admin: delete
router.patch('/enroll-course/:courseId', verifyUser,  enrollCourse);

export default router;
