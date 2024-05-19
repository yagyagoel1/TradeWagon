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
      email: true,
      password: true,
      fullName: true,
    },
  });
};
export const findUserById = async (id: string) => {
  return await prisma.user.findFirst({
    where: {
      id,
      isEmailVerified: true,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      refreshToken: true,
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
export const RefreshingTokens = async (email: string, refreshToken: string) => {
  return await prisma.user.update({
    where: {
      email,
    },
    data: {
      refreshToken,
    },
    select: {
      id: true,
    },
  });
};
export const findOTPByEmail = async (email: string) => {
  return await prisma.otp.findFirst({
    where: {
      userEmail: email,
    },
    select: {
      id: true,
      userEmail: true,
      code: true,
      createdAt: true,
    },
  });
};

export const updateUserVerified = async (email: string) => {
  return await prisma.user.update({
    where: {
      email,
    },
    data: {
      isEmailVerified: true,
    },
    select: {
      id: true,
    },
  });
};
