import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { getProductsSchema } from "../schema/product.schema";
import { ApiError } from "../utils/ApiError";
import {
  getAllProducts,
  getProductById,
} from "../databaseCalls/product.database";
import { ApiResponse } from "../utils/ApiResponse";

const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page } = req.body;
  const pages = page.parseInt() || 1;
  const validate = await getProductsSchema(pages);
  if (!validate.success) {
    return res
      .status(400)
      .json(new ApiError(400, validate.error.errors[0].message));
  }
  const products = await getAllProducts(pages);
  res
    .status(200)
    .json(new ApiResponse(200, "Products fetched successfully", products));
});
const getProductId = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(id);
  res
    .status(200)
    .json(new ApiResponse(200, "Product fetched successfully", product));
});

export { getProducts, getProductId };
