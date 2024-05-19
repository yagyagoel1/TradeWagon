import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import {
  profileImageUploadS3,
  getProfileImageS3,
} from "../utils/handlingProfileS3";
import { ApiResponse } from "../utils/ApiResponse";
import { toogleUserAvatar } from "../databaseCalls/user.database";

export const putProfilePicture = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json(new ApiResponse(400, "No file uploaded"));
    }
    await profileImageUploadS3(req.file, req.user?.email);
    await toogleUserAvatar(req.user?.email, true);
    res.status(200).json(new ApiResponse(200, "Image uploaded successfully"));
  }
);
