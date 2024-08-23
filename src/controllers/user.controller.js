// src/controllers/userController.js

import asyncHandler from 'express-async-handler';
import User from '../models/usre.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
// @desc    Auth user & get token
// @route   POST /api/users/signin
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
console.log("My user value during sign in ",user);

// const isMatch = await bcrypt.compare(password, user.password);
// if (!isMatch) {
//   return res.status(400).json({ msg: 'Invalid credentials' });
// }

  if (user && (await user.isPasswordCorrect(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      phoneNo: user.phoneNo,
      addresses: user.addresses,
      profilePicture: user.profilePicture,
      accessToken: generateAccessToken(user._id),
      refreshToken: generateRefreshToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, gender, phoneNo, addresses, profilePicture } = req.body;
console.log(req.body)
  const userExists = await User.findOne({ email });

  if (userExists) {
    // res.status(400);
    // throw new Error('User already exists');
    return res.status(400).json({ status_code:400, message: 'User already exists' });

  }

  const user = await User.create({
    name,
    email,
    password,
    gender,
    phoneNo,
    addresses,
    profilePicture,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      phoneNo: user.phoneNo,
      addresses: user.addresses,
      profilePicture: user.profilePicture,
      accessToken: generateAccessToken(user._id),
      refreshToken: generateRefreshToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});


// @desc    Logout user
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  // Implement logic to invalidate the refresh token, if needed
  res.json({ message: 'Logged out successfully' });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user; // req.user is set in the protect middleware

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      phoneNo: user.phoneNo,
      addresses: user.addresses,
      profilePicture: user.profilePicture,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { authUser, registerUser ,logoutUser , getUserProfile};
