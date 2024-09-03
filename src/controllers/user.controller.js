// src/controllers/userController.js

import asyncHandler from "express-async-handler";
import User from "../models/usre.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
// @desc    Auth user & get token
// @route   POST /api/users/signin
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log("My user value during sign in ", user);

  // const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) {
  //   return res.status(400).json({ msg: 'Invalid credentials' });
  // }

  if (user && (await user.isPasswordCorrect(password))) {
    const userData = user.toJSON();
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      status_code: 201,
      message: "Usre Login Successfully",
      data: {
        user: userData,
        accessToken,
        refreshToken,
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, gender, phoneNo, addresses, profilePicture } =
    req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ status_code: 400, message: "User already exists" });
  }

  const user = new User({
    name,
    email,
    password,
  });

  const verificationCode = user.generateVerificationCode();
  // await user.save();
  console.log("My verification code", verificationCode);
  console.log(`SMTP User: ${process.env.smptuser}`);
  console.log(`SMTP Pass: ${process.env.smtppass}`);

  await user.save();

  await sendEmail(
    user.email,
    "Email Verification",
    `Your verification code is: ${verificationCode}`
  );

  res.status(201).json({
    success: true,
    message:
      "User registered successfully. Please check your email for verification code.",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  // Implement logic to invalidate the refresh token, if needed
  res.json({ message: "Logged out successfully" });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("req user id is ", req.user._id);

    const {
      name,
      gender,
      phoneNo,
      addressId,
      addressName,
      houseNo,
      streetAddress,
      phone_no,
      pincode,
      city,
      state,
      typeOfAddress,
      isSelected,
    } = req.body;
    console.log("req body is ", req.body);

    let user = await User.findById(userId);
    console.log("user is ", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      console.log("req file:", req.file);
    
      const profilepath = req.file.path;  // Correctly accessing the file path
      console.log("Local file path:", profilepath);
    
      try {
        const cloudinaryResponse = await uploadOnCloudinary(profilepath);
        console.log("my cloudinary response:", cloudinaryResponse);
    
        if (cloudinaryResponse) {
          user.profilePicture = cloudinaryResponse.url;
          console.log("Profile picture uploaded to Cloudinary:", cloudinaryResponse.url);
        } else {
          console.log("Failed to upload profile picture to Cloudinary");
        }
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return res.status(500).json({ message: "Failed to upload profile picture" });
      }
    }
    


    if (name) user.name = name.trim();
    console.log("user name is ",user.name)
    if (gender) user.gender = gender;
    if (phoneNo) user.phoneNo = phoneNo.trim();



    await user.save();
    const userData = user.toJSON();
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      message: "Address updated successfully",
      data: {
        user: userData,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// controllers/userController.js


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (user) {
    res.status(200).json({
      success: true,
      status_code: 200,
      data: user.toJSON(),
    });
  } else {
    res.status(404).json({ status_code: 404, message: "User not found" });
  }
});

const verifyUser = asyncHandler(async (req, res) => {
  const { userId, verificationCode } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(404)
      .json({ status_code: 404, message: "User not found" });
  }

  if (user.isVerified) {
    return res
      .status(400)
      .json({ status_code: 400, message: "User already verified" });
  }

  if (
    !user.verificationCode ||
    !bcrypt.compareSync(verificationCode, user.verificationCode)
  ) {
    return res
      .status(400)
      .json({ status_code: 400, message: "Invalid verification code" });
  }
  if (user.verificationCodeExpires < Date.now()) {
    return res
      .status(400)
      .json({ status_code: 400, message: "Expired verification code" });
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;

  await user.save();
  const userData = user.toJSON();
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.status(200).json({
    success: true,
    status_code: 201,
    message: "Email verified successfully",
    data: {
      user: userData,
      accessToken,
      refreshToken,
    },
  });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  verifyUser,
  updateUserProfile,
};
