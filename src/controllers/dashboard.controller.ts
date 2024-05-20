import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import {
  profileImageUploadS3,
  getProfileImageS3,
} from "../utils/handlingProfileS3";
import { ApiResponse } from "../utils/ApiResponse";
import {
  UserProfileImageExists,
  findUserByEmail,
  findUserById,
  toogleUserAvatar,
  updatePassword,
} from "../databaseCalls/user.database";
import { ApiError } from "../utils/ApiError";
import { compareHash } from "../utils/hashing";

export const putProfilePicture = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json(new ApiError(400, "No file uploaded"));
    }
    await profileImageUploadS3(req.file, req.user?.email);
    await toogleUserAvatar(req.user?.email, true);
    res.status(200).json(new ApiResponse(200, "Image uploaded successfully"));
  }
);
export const getProfileImage = asyncHandler(
  async (req: Request, res: Response) => {
    const imageExists = await UserProfileImageExists(req.user?.email);
    if (!imageExists) {
      return res.status(404).json(new ApiError(404, "No image found"));
    }
    const image = await getProfileImageS3(req.user?.email);
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Content-Disposition", `inline; filename="index.jpeg"`);

    // Pipe the image stream directly to the response
    image.pipe(res); //
  }
);

export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userProfile = await findUserById(req.user?.id);
    if (!userProfile) {
      return res.status(404).json(new ApiError(404, "No user found"));
    }

    res.status(200).json(
      new ApiResponse(200, "User found", {
        email: userProfile?.email,
        fullName: userProfile.fullName,
        Joined: userProfile.createdAt.toDateString(),
      })
    );
  }
);

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const user = await findUserByEmail(req.user?.id);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }
    const passwordMatch = await compareHash(oldPassword, user.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json(new ApiError(400, "Old password is incorrect"));
    }
    const changedPassword = await updatePassword(user.id, newPassword);
    res.status(200).json(new ApiResponse(200, "Password changed successfully"));
  }
);
