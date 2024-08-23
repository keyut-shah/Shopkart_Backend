// src/routes/userRoutes.js

import express from 'express';
import { authUser, registerUser , getUserProfile } from '../controllers/user.controller.js';
import { refreshAccessToken } from '../controllers/tokenController.js';
import { protect } from '../middleware/auth.middleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer(); 

router.post('/signin', upload.none(), authUser);
router.post('/signup',  upload.none(),registerUser);
router.post('/refresh-token', refreshAccessToken); // New route for refreshing access token
router.get('/profile', protect, getUserProfile);


export default router;
