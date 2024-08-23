// src/utils/generateToken.js

import jwt from 'jsonwebtoken';

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '60m', 
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '14d', // Longer lifespan for refresh token
  });
};

export { generateAccessToken, generateRefreshToken };
