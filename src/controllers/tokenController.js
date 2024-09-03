

import User from "../models/usre.model.js";
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { generateAccessToken } from "../utils/generateToken.js";

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ status_code: 400, message: 'Refresh token not provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ status_code: 404, message: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user._id);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ status_code: 401, message: 'Expired refresh token' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ status_code: 401, message: 'Invalid refresh token' });
    } else {
      console.error("Unexpected error:", error);
      return res.status(500).json({ status_code: 500, message: 'Internal server error' });
    }
  }
});

export { refreshAccessToken };