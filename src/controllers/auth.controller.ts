import {
  RefreshingTokens,
  createUser,
  findOTPByEmail,
  findUserByEmail,
  findUserById,
  updateUserVerified,
} from "../databaseCalls/user.database";
import {
  validateResendOtp,
  validateSignin,
  validateSignup,
  validateVerifyUser,
} from "../schema/auth.schema";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import { Request, Response } from "express";
import { emailQueue } from "../utils/jobs/sendEmail.job";
import { compareHash } from "../utils/hashing";
import { generateToken, verifyToken } from "../utils/tokenHandling";
import { ApiResponse } from "../utils/ApiResponse";

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
    accessToken
  );
  if (!RefreshedToken) {
    throw new ApiError(500, "Internal server error refreshing tokens");
  }

  return res
    .status(200)

    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    })
    .json(new ApiResponse(200, "User logged in successfully", { accessToken }));
});
const logout = asyncHandler(async (req: Request, res: Response) => {
  const RefreshedToken = await RefreshingTokens(req.user?.email, "");
  if (!RefreshedToken) {
    throw new ApiError(500, "Internal server error refreshing tokens");
  }

  return res
    .status(200)
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "User logged out successfully", {}));
});

const sendToken = asyncHandler(async (req: Request, res: Response) => {
  const Token = req.cookies.refreshToken;
  if (!Token) {
    return res.status(401).json({ message: "Unauthorized no token exist" });
  }
  const decodedToken = await verifyToken(
    Token,
    process.env.REFRESH_TOKEN_SECRET || ""
  );
  if (!decodedToken || typeof decodedToken === "string") {
    return res.status(401).json({ message: "Unauthorized invalid token" });
  }
  const userLoggedIn = await findUserById(decodedToken?.id);
  if (!userLoggedIn || userLoggedIn.refreshToken !== Token) {
    return res
      .status(401)
      .clearCookie("refreshToken")
      .json({ message: "Unauthorized user not logged in" });
  }

  const accessToken = await generateToken(
    { id: userLoggedIn?.id },
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_EXPIRY
  );
  res.status(200).json(
    new ApiResponse(200, "creating access token was successful", {
      accessToken,
    })
  );
});

const verifyUser = asyncHandler(async (req: Request, res: Response) => {
  const { otp, email } = req.body;
  const validate = await validateVerifyUser({ otp, email });
  if (!validate.success) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "please enter a valid email and otp" +
            validate.error.errors[0].message
        )
      );
  }
  const otpSchema = await findOTPByEmail(email);
  if (!otpSchema) {
    return res.status(400).json(new ApiError(400, "Invalid email"));
  }
  if (otpSchema.createdAt.getTime() + 600000 > Date.now()) {
    return res.status(400).json(new ApiError(400, "OTP expired"));
  }
  const hashresult = await compareHash(otp, otpSchema.code);
  if (!hashresult) {
    return res.status(400).json(new ApiError(400, "Invalid OTP"));
  }
  const user = await updateUserVerified(email);
  if (!user) {
    return res.status(500).json(new ApiError(500, "error updating user"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "User verified successfully", {}));
});
const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, fullName } = req.body;
  const validate = await validateResendOtp({ email, fullName });
  if (!validate.success) {
    return res
      .status(400)
      .json(new ApiError(400, "please enter a valid email and fullName"));
  }
  await emailQueue.add("send email", { email, fullName });
  return res
    .status(200)
    .json(new ApiResponse(200, "OTP sent successfully", {}));
});
export { signup, signin, logout, sendToken, verifyUser, resendOtp };
