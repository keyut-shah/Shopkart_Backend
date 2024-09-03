

import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/usre.model.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }



    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ status_code: 401, message: "Token expired" });
      } else {
        res
          .status(401)
          .json({ status_code: 401, message: "Not authorized, token failed" });
      }

      // res.status(401).json({ status_code: 401, message: 'Not authorized, token failed' });
    }
  } else {
    console.error("No token found or incorrect format");
    res
      .status(401)
      .json({ status_code: 401, message: "Not authorized, no token" });
  }
});

export { protect };
