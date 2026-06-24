import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploader = async (file) => {
  try {
    let uploadResponse = await cloudinary.uploader.upload(file);
    return uploadResponse;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export { cloudinary, uploader };
