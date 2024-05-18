import { createUser, findUserByEmail } from "../databaseCalls/user.controller";
import { validateSignup } from "../schema/auth.schema";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import { Request, Response } from "express";
import { emailQueue } from "../utils/jobs/sendEmail.job";
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
    res.status(201).json({
      message: "User created successfully please verify your email address",
    });
  }
});

export { signup };
