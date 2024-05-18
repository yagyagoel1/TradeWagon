import { Request, Response } from "express";
const asyncHandler = (requestHandler: any) => {
  return async (req: Request, res: Response) => {
    try {
      await requestHandler(req, res);
    } catch (error: any) {
      console.error("error while listening ", error);
      return res.status(500).json({ message: "oops something went wrong" });
    }
  };
};

export { asyncHandler };
