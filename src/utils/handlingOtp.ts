import {
  createOtp,
  findOTPByEmail,
  updateOtp,
} from "../databaseCalls/user.database";
import { hashData } from "./hashing";

export const HandlingOtp = async (data: {
  email: string;
  fullName: string;
}) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const hashedOtp = await hashData(otp.toString());
  const userExists = await findOTPByEmail(data.email);
  if (userExists) {
    await updateOtp(data.email, hashedOtp);
  } else {
    await createOtp(data.email, hashedOtp);
  }
  return otp;
};
