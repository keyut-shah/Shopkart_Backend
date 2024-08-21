import express from 'express';
import routes from './src/routes/index.js'; // Importing the combined routes
import connectDB from './src/config/db.js'; 
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to the database
connectDB();

// Use the API routes
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
