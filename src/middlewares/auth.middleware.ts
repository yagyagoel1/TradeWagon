import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/tokenHandling";
import jwt from "jsonwebtoken";
import { findUserById } from "../databaseCalls/user.database";
declare global {
  namespace Express {
    export interface Request {
      user?: jwt.JwtPayload;
    }
  }
}

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized no token exist" });
    }
    //verify token
    const decodedToken = await verifyToken(token);
    if (!decodedToken || typeof decodedToken === "string") {
      return res.status(401).json({ message: "Unauthorized invalid token" });
    }
    const userLoggedIn = await findUserById(decodedToken?.id);
    if (!userLoggedIn || userLoggedIn.accessToken !== token) {
      return res
        .status(401)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json({ message: "Unauthorized user not logged in" });
    }

    req.user = userLoggedIn;
    next();
  } catch (error: any) {
    console.error("error while verifying user ", error);
    return res.status(500).json({ message: "oops something went wrong" });
  }
};
