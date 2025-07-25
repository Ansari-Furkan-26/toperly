import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout); // POST for consistency with state-changing actions

export default router;
