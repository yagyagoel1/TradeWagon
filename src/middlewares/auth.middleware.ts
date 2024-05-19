import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/tokenHandling";
import jwt from "jsonwebtoken";
import { RefreshingTokens, findUserById } from "../databaseCalls/user.database";
declare global {
  namespace Express {
    export interface Request {
      user?: jwt.JwtPayload;
    }
  }
}

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //add session management middleware
  //add ip based checks

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized no token exist" });
    }
    //verify token
    const decodedToken = await verifyToken(
      token,
      process.env.ACCESS_TOKEN_SECRET || ""
    );
    if (!decodedToken || typeof decodedToken === "string") {
      return res.status(401).json({ message: "Unauthorized invalid token" });
    }
    const userLoggedIn = await findUserById(decodedToken?.id);
    if (!userLoggedIn) {
      const refreshedToken = await RefreshingTokens(decodedToken?.email, "");
      return res.status(401).clearCookie("refreshToken").json({
        message: "Unauthorized user not logged in please login again",
      });
    }

    req.user = userLoggedIn;
    next();
  } catch (error: any) {
    console.error("error while verifying user ", error);
    return res.status(500).json({ message: "oops something went wrong" });
  }
};
