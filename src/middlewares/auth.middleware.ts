import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/tokenHandling";
import jwt from "jsonwebtoken";
import { RefreshingTokens, findUserById } from "../databaseCalls/user.database";
import { Roles } from "../constants";
declare global {
  namespace Express {
    export interface Request {
      user?: jwt.JwtPayload;
    }
  }
}

export const verifyUser = (roles: Roles[]) => {
  return [
    async (req: Request, res: Response, next: NextFunction) => {
      //add session management middleware
      //add ip based checks

      try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
          return res
            .status(401)
            .json({ message: "Unauthorized no token exist" });
        }
        //verify token
        const decodedToken = await verifyToken(
          token,
          process.env.ACCESS_TOKEN_SECRET || ""
        );
        if (!decodedToken || typeof decodedToken === "string") {
          return res
            .status(401)
            .json({ message: "Unauthorized invalid token" });
        }
        const userLoggedIn = await findUserById(decodedToken?.id);
        if (!userLoggedIn) {
          return res.status(401).clearCookie("refreshToken").json({
            message: "Unauthorized user not logged in please login again",
          });
        }
        if (roles.includes(userLoggedIn.role as Roles)) {
          req.user = userLoggedIn;
          next();
        } else {
          return res.status(403).json({ message: "Forbidden" });
        }
      } catch (error: any) {
        console.error("error while verifying user ", error);
        return res.status(500).json({ message: "oops something went wrong" });
      }
    },
  ];
};
