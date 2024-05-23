import { prisma } from "../db";
import { asyncHandler } from "../utils/AsyncHandler";
import { hashData } from "../utils/hashing";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      fullName: true,
      isEmailVerified: true,
    },
  });
};
export const updateUnverifiedUser = async (data: {
  email: string;
  password: string;
  fullName: string;
}) => {
  const hashedPassword = await hashData(data.password);
  return await prisma.user.update({
    where: {
      email: data.email,
    },
    data: {
      password: hashedPassword,
      fullName: data.fullName,
    },
    select: {
      id: true,
      email: true,
      password: true,
      fullName: true,
      isEmailVerified: true,
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
      createdAt: true,
      refreshToken: true,
      role: true,
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

export const createOtp = async (email: string, code: string) => {
  return await prisma.otp.create({
    data: {
      userEmail: email,
      code,
    },
    select: {
      id: true,
    },
  });
};
export const updateOtp = async (email: string, code: string) => {
  return await prisma.otp.update({
    where: {
      userEmail: email,
    },
    data: {
      code,
      createdAt: new Date(),
    },
    select: {
      id: true,
    },
  });
};
export const toogleUserAvatar = async (email: string, avatar: boolean) => {
  return await prisma.user.update({
    where: {
      email,
    },
    data: {
      avatar: avatar,
    },
    select: {
      id: true,
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
export const UserProfileImageExists = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email,
      avatar: true,
    },
    select: {
      id: true,
    },
  });
};

export const updatePassword = async (id: string, password: string) => {
  const hashedPassword = await hashData(password);
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: hashedPassword,
    },
    select: {
      id: true,
    },
  });
};

export const getUserProfileMe = async (id: string) => {
  return await prisma.user.findFirst({
    where: {
      id,
    },
    select: {
      email: true,
      fullName: true,
      createdAt: true,
      address: {
        select: {
          id: true,
          street: true,
          city: true,
          state: true,
          country: true,
          postalCode: true,
        },
      },
    },
  });
};
export const changeUserProfileMe = async (id: string, fullName: string) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      fullName,
    },
    select: {
      id: true,
    },
  });
};

export const findUserAddress = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email,
    },
    select: {
      address: {
        select: {
          street: true,
          city: true,
          state: true,
          country: true,
          postalCode: true,
        },
      },
    },
  });
};
export const addNewAddress = async (
  email: string,
  data: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }
) => {
  return await prisma.address.create({
    data: {
      street: data.street,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
      ownerEmail: email,
    },
    select: {
      id: true,
    },
  });
};
export const deleteUserAddress = async (email: string) => {
  return await prisma.address.delete({
    where: {
      ownerEmail: email,
    },
    select: {
      id: true,
    },
  });
};
export const findAddressByEmail = async (email: string) => {
  return await prisma.address.findFirst({
    where: {
      ownerEmail: email,
    },
    select: {
      id: true,
      street: true,
      city: true,
      state: true,
      country: true,
      postalCode: true,
    },
  });
};
export const updateUserAddressByEmail = async (
  email: string,
  data: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  }
) => {
  return await prisma.address.update({
    where: {
      ownerEmail: email,
    },
    data: {
      street: data?.street,
      city: data?.city,
      state: data?.state,
      country: data?.country,
      postalCode: data?.postalCode,
    },
    select: {
      id: true,
    },
  });
};
