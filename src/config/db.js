import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB Connected');
    } catch (error) {
      console.error("error while connecting the db", error.message);
      process.exit(1);
    }
  };
  
  // module.exports = connectDB;

  export default connectDB;