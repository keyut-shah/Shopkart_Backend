// src/controllers/tokenController.js

import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../utils/generateToken.js';

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(401);
    throw new Error('Refresh Token is required');
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(403);
      throw new Error('Invalid Refresh Token');
    }

    const accessToken = generateAccessToken(user.id);

    res.json({ accessToken });
  });
});

export { refreshAccessToken };
