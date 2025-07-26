import express from 'express';
import { addToWishlist, removeFromWishlist, getUserWishlist, getMywishlist } from '../controllers/wishlist.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', verifyToken, getUserWishlist);
router.post('/:courseId', verifyToken, addToWishlist);
router.delete('/:courseId', verifyToken, removeFromWishlist);
router.get('/my-wishlist', verifyToken, getMywishlist);

export default router;
