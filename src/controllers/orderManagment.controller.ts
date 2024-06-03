import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import {
  getAllOrdersForAdmin,
  updateOrderStatus,
} from "../databaseCalls/order.database";
import { ApiError } from "../utils/ApiError";
import { updateOrderStatusSchema } from "../schema/orderManagment.schema";
import { asyncHandler } from "../utils/AsyncHandler";

const ListAllOrdersForAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { page } = req.params;
    const orders = await getAllOrdersForAdmin(parseInt(page));
    res
      .status(200)
      .json(new ApiResponse(200, "orders fetched successfully", orders));
  }
);
const updateOrderStatusAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const validate = await updateOrderStatusSchema(status);
    if (!validate.success) {
      return res
        .status(400)
        .json(new ApiError(400, validate.error?.errors[0].message));
    }
    const order = await updateOrderStatus(orderId, status);
    if (!order) {
      return res.status(404).json(new ApiError(404, "Order not found"));
    }

    res.status(200).json(new ApiResponse(200, "Order status updated"));
  }
);
const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = await updateOrderStatus(orderId, "CANCELLED");
  if (!order) {
    return res.status(404).json(new ApiError(404, "Order not found"));
  }
  res.status(200).json(new ApiResponse(200, "Order cancelled successfully"));
});
export { ListAllOrdersForAdmin, updateOrderStatusAdmin, cancelOrder };
