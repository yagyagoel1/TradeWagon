import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { getAllOrdersForAdmin } from "../databaseCalls/order.database";
import { ApiError } from "../utils/ApiError";

const ListAllOrdersForAdmin = async (req: Request, res: Response) => {
  const { page } = req.params;
  const orders = await getAllOrdersForAdmin(parseInt(page));
  res
    .status(200)
    .json(new ApiResponse(200, "orders fetched successfully", orders));
};

export { ListAllOrdersForAdmin };
