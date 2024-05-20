import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import {
  profileImageUploadS3,
  getProfileImageS3,
} from "../utils/handlingProfileS3";
import { ApiResponse } from "../utils/ApiResponse";
import {
  UserProfileImageExists,
  addNewAddress,
  changeUserProfileMe,
  findUserAddress,
  findUserByEmail,
  findUserById,
  getUserProfileMe,
  toogleUserAvatar,
  updatePassword,
} from "../databaseCalls/user.database";
import { ApiError } from "../utils/ApiError";
import { compareHash } from "../utils/hashing";
import {
  addUserAddressSchema,
  changeUsesrProfileSchema,
} from "../schema/dashboard.schema";

const putProfilePicture = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json(new ApiError(400, "No file uploaded"));
  }
  await profileImageUploadS3(req.file, req.user?.email);
  await toogleUserAvatar(req.user?.email, true);
  res.status(200).json(new ApiResponse(200, "Image uploaded successfully"));
});
const getProfileImage = asyncHandler(async (req: Request, res: Response) => {
  const imageExists = await UserProfileImageExists(req.user?.email);
  if (!imageExists) {
    return res.status(404).json(new ApiError(404, "No image found"));
  }
  const image = await getProfileImageS3(req.user?.email);
  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Content-Disposition", `inline; filename="index.jpeg"`);

  // Pipe the image stream directly to the response
  image.pipe(res); //
});

const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const userProfile = await getUserProfileMe(req.user?.id);
  if (!userProfile) {
    return res.status(404).json(new ApiError(404, "No user found"));
  }

  res.status(200).json(new ApiResponse(200, "User found", userProfile));
});

const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const user = await findUserByEmail(req.user?.id);
  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }
  const passwordMatch = await compareHash(oldPassword, user.password);
  if (!passwordMatch) {
    return res.status(400).json(new ApiError(400, "Old password is incorrect"));
  }
  const changedPassword = await updatePassword(user.id, newPassword);
  res.status(200).json(new ApiResponse(200, "Password changed successfully"));
});

const changeUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { fullName } = req.body;
  const validate = await changeUsesrProfileSchema(fullName);
  if (!validate.success) {
    return res
      .status(400)
      .json(new ApiError(400, validate.error.errors[0].message));
  }
  const user = await changeUserProfileMe(req.user?.id, fullName);
  res
    .status(200)
    .json(new ApiResponse(200, "User profile updated successfully"));
});

const addUserAddress = asyncHandler(async (req: Request, res: Response) => {
  const { street, city, state, country, postalCode } = req.body;
  const validate = await addUserAddressSchema({
    street,
    city,
    state,
    country,
    postalCode,
  });
  if (!validate.success) {
    return res
      .status(400)
      .json(new ApiError(400, validate.error.errors[0].message));
  }
  const checkAddress = await findUserAddress(req.user?.email);
  if (checkAddress) {
    await addNewAddress(req.user?.email, {
      street,
      city,
      state,
      country,
      postalCode,
    });
  } else {
    await addNewAddress(req.user?.email, {
      street,
      city,
      state,
      country,
      postalCode,
      primary: true,
    });
  }
  res.status(200).json(new ApiResponse(200, "Address added successfully"));
});
export {
  changePassword,
  changeUserProfile,
  getUserProfile,
  getProfileImage,
  putProfilePicture,
  addUserAddress,
};
