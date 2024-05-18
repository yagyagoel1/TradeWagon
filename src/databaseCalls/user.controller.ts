import { prisma } from "../db";
import { hashData } from "../utils/hashing";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email,
      isEmailVerified: true,
    },
    select: {
      id: true,
    },
  });
};
export const createUser = async (data: {
  email: string;
  password: string;
  fullName: string;
}) => {
  const hashedPassword = await hashData(data.password);
  return await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
    },
    select: {
      id: true,
    },
  });
};
