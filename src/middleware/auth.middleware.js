// // src/middleware/authMiddleware.js

// import jwt from 'jsonwebtoken';
// import asyncHandler from 'express-async-handler';
// import User from '../models/usre.model.js';

// const protect = asyncHandler(async (req, res, next) => {
//     console.log("inside the auth middleware", req.headers.authorization)    
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
    
//     try {
//       token = req.headers.authorization.split(' ')[1]; 
//       const decoded = jwt.verify(token, process.env.JWT_SECRET); 
//       req.user = await User.findById(decoded.id).select('-password'); 
//       next(); 
//     } catch (error) {
//         return res.status(401).json({ status_code:401, message: 'Not authorized, token failed' });
//     //   res.status(401);

//     //   throw new Error('Not authorized, token failed');
//     }
//   }

//   if (!token) {
//     return res.status(401).json({ status_code:401, message: 'Not authorized, no token' });
//     res.status(401);
//     throw new Error('Not authorized, no token');
//   }
// });

// export { protect };
// src/middleware/authMiddleware.js
// src/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/usre.model.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (authHeader) {
    // If it starts with "Bearer ", extract the token
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      // Otherwise, assume the token is sent directly without "Bearer "
      token = authHeader;
    }

    console.log("Extracted Token:", token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ status_code: 401, message: 'Not authorized, token failed' });
    }
  } else {
    console.error("No token found or incorrect format");
    res.status(401).json({ status_code: 401, message: 'Not authorized, no token' });
  }
});

export { protect };
