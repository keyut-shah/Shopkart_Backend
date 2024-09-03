import express from 'express';
import routes from './src/routes/index.js';
import connectDB from './src/config/db.js'; 
import dotenv from 'dotenv';
import multer from 'multer';


dotenv.config();

const app = express();
const upload = multer(); 

app.use(express.json());
// app.use(upload.none()); 


connectDB();


routes(app)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
