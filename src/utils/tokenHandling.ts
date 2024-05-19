import jwt from "jsonwebtoken";

export const generateToken = async (
  payload: any,
  secret: string = "secret",
  expiry: string = "1d"
) => {
  const token = await jwt.sign(payload, secret, { expiresIn: expiry });
  return token;
};

export const verifyToken = async (token: string, secret: string) => {
  try {
    const user = await jwt.verify(token, secret || "secret");
    return user;
  } catch (error) {
    return null;
  }
};
