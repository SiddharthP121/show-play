import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uplaodFile = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const uploadedResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      secure: true, // <--- this ensures HTTPS
    });

    console.log("The file has been uploaded", uploadedResult.url); //clg this uploaded result

    if (uploadedResult) {
      fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the upload operation got failed
      return uploadedResult;
    }
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export { uplaodFile };
