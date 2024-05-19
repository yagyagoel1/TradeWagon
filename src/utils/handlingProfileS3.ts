import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const profileImageUploadS3 = async (
  file: Express.Multer.File | undefined,
  email: string
) => {
  const convertedImage = await sharp(file?.buffer).jpeg().toBuffer();
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME || "",
    Key: `profileImages/${email}/index.jpeg`,
    Body: convertedImage,
  };
  try {
    const result = await s3Client.send(new PutObjectCommand(uploadParams));
    return result;
  } catch (error) {
    console.error("Error uploading file", error);

    return error;
  }
};

export const getProfileImageS3 = async (email: string) => {
  try {
    const image = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME || "",
        Key: `profileImages/${email}`,
      })
    );
    return image;
  } catch (error) {
    console.error("Error getting file", error);
    return error;
  }
};
