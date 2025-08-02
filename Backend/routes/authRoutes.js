import express from 'express';
import { register, login, logout, changePassword, getUserDetails } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout); // POST for consistency with state-changing actions
router.post('/change-password', verifyToken, changePassword);
router.get('/me', verifyToken, getUserDetails);

export default router;
