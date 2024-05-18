import bcrypt from "bcrypt";

export const hashData = async (data: any) => {
  try {
    const hashedData = await bcrypt.hash(data, 10);
    return hashedData;
  } catch (error: any) {
    throw new Error("Error while hashing data" + error.message);
  }
};

export const compareHash = async (data: any, hashedData: any) => {
  try {
    const isMatch = await bcrypt.compare(data, hashedData);
    return isMatch;
  } catch (error: any) {
    throw new Error("Error while comparing hash" + error.message);
  }
};
