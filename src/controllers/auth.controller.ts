import {
  RefreshingTokens,
  createUser,
  findUserByEmail,
} from "../databaseCalls/user.database";
import { validateSignin, validateSignup } from "../schema/auth.schema";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import { Request, Response } from "express";
import { emailQueue } from "../utils/jobs/sendEmail.job";
import { compareHash } from "../utils/hashing";
import { generateToken } from "../utils/tokenHandling";
const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;
  const validation = validateSignup({ email, password, fullName });
  if (!validation.success) {
    return res
      .status(400)
      .json(new ApiError(400, validation.error.errors[0].message));
  }
  const userFind = await findUserByEmail(email);
  if (userFind) {
    return res.status(400).json(new ApiError(400, "User already exists"));
  }
  const createdUser = await createUser({ email, password, fullName });
  if (createdUser) {
    await emailQueue.add("send email", { email, fullName });
    return res.status(201).json({
      message: "User created successfully please verify your email address",
    });
  }
});
const signin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const validation = validateSignin({ email, password });
  if (!validation.success) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "please enter a valid email and password" +
            validation.error.errors[0].message
        )
      );
  }
  const userExists = await findUserByEmail(email);
  if (!userExists) {
    return res
      .status(400)
      .json(new ApiError(400, "User does not exist or is not verified"));
  }
  const passwordMatch = await compareHash(password, userExists?.password);
  if (!passwordMatch) {
    return res.status(400).json(new ApiError(400, "Invalid password"));
  }
  const accessToken = await generateToken(
    { id: userExists?.id },
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_EXPIRY
  );
  const refreshToken = await generateToken(
    { id: userExists?.id },
    process.env.REFRESH_TOKEN_SECRET,
    process.env.REFRESH_TOKEN_EXPIRY
  );

  const RefreshedToken = await RefreshingTokens(
    userExists?.email || "",
    accessToken,
    refreshToken
  );
  if (!RefreshedToken) {
    throw new ApiError(500, "Internal server error refreshing tokens");
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    })
    .json({ message: "User logged in successfully" });
});
const logout = asyncHandler(async (req: Request, res: Response) => {
  const RefreshedToken = await RefreshingTokens(req.user?.email, "", "");
  if (!RefreshedToken) {
    throw new ApiError(500, "Internal server error refreshing tokens");
  }

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({ message: "User logged out successfully" });
});

export { signup, signin, logout };
