import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary = async (
  filePath: string,
  fileName: string,
  folderName: string
) => {
  try {
    if (!filePath) {
      return null;
    }
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
      folder: folderName || "default",
      public_id: fileName,
    });
    //file has been uploaded

    return response;
  } catch (error) {
    return null;
  }
};

export { uploadOnCloudinary };
