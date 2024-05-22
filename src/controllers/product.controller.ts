import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { addProductSchema, getProductsSchema } from "../schema/product.schema";
import { ApiError } from "../utils/ApiError";
import {
  addProducts,
  getAllProducts,
  getProductById,
} from "../databaseCalls/product.database";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadOnCloudinary } from "../utils/cloudinary";

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

const addProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, price, description, image, productType } = req.body;
  const validate = await addProductSchema({
    name,
    price,
    description,
    image,
    productType,
  });
  if (!validate.success) {
    return res
      .status(400)
      .json(new ApiError(400, validate.error.errors[0].message));
  }
  if (!req.file) {
    return res.status(400).json(new ApiError(400, "Image is required"));
  }
  const uploadUrl = await uploadOnCloudinary(
    req.file.path,
    name,
    `products/${req.user?.email}`
  );
  if (!uploadUrl) {
    return res.status(400).json(new ApiError(400, "Image upload failed"));
  }
  const product = await addProducts({
    name,
    price,
    description,
    image: uploadUrl.secure_url,
    productType,
  });
  res
    .status(201)
    .json(new ApiResponse(201, "Product added successfully", product));
});
export { getProducts, getProductId, addProduct };
