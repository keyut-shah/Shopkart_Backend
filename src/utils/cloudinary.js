import dotenv from 'dotenv';


import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

dotenv.config();


console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUDNAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);


cloudinary.config({ 
  cloud_name:  process.env.CLOUDINARY_CLOUDNAME,
  api_key:  process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log("Cloudinary config:", cloudinary.config());

const uploadOnCloudinary = async (localFilePath) => {
    console.log("inside the upload cloudinary method ") 
    console.log("local path is ", localFilePath)

    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
       
       
        fs.unlinkSync(localFilePath)
        console.log("file is deleted ", localFilePath)
        console.log("file is uploaded on cloudinary ", response.url)
        return response;

    } catch (error) {
        console.log("error while uploading on cloudinary ", error)
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}


export {uploadOnCloudinary}



