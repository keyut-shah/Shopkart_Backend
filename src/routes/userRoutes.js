// src/routes/userRoutes.js

import express from "express";
import {
  authUser,
  registerUser,
  getUserProfile,
  verifyUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { refreshAccessToken } from "../controllers/tokenController.js";
import { protect } from "../middleware/auth.middleware.js";
import multer from "multer";
import { upload } from "../middleware/multer.middleware.js";



const router = express.Router();

router.post("/signin", upload.none(), authUser);
router.post("/signup", upload.none(), registerUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/get_user", protect, getUserProfile);
router.post("/verifyUser", upload.none(), verifyUser);
// router.put(
//   "/update_user",
//   protect,

//   updateUserProfile
// );
//  upload.single('profilePicture'),
router.put('/update_user', protect, upload.single('profilePicture'), updateUserProfile);

export default router;
