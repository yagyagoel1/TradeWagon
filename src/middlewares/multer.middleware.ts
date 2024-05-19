import multer from "multer";

// Define storage configuration for multer
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};
// Create multer upload middleware with the defined storage configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10MB file size limit
});
