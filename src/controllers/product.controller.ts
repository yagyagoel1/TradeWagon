import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import {
  addProductSchema,
  getProductsSchema,
  updateProductSchema,
} from "../schema/product.schema";
import { ApiError } from "../utils/ApiError";
import {
  addProducts,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
  updateProductImage,
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
  const { name, price, description, image, productType, inStock } = req.body;
  const validate = await addProductSchema({
    name,
    price,
    description,
    image,
    productType,
    inStock,
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
    inStock,
  });
  res
    .status(201)
    .json(new ApiResponse(201, "Product added successfully", product));
});
const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const validate = await updateProductSchema(data);
  if (!validate.success) {
    return res
      .status(400)
      .json(new ApiError(400, validate.error.errors[0].message));
  }
  const product = await updateProductById(id, data);
  res
    .status(200)
    .json(new ApiResponse(200, "Product updated successfully", {}));
});
const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await deleteProductById(id);
  res
    .status(200)
    .json(new ApiResponse(200, "Product deleted successfully", {}));
});
const changeImage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!req.file) {
    return res.status(400).json(new ApiError(400, "Image is required"));
  }
  const uploadUrl = await uploadOnCloudinary(
    req.file?.path,
    id,
    `products/${req.user?.email}`
  );
  if (!uploadUrl) {
    return res.status(400).json(new ApiError(400, "Image upload failed"));
  }
  const product = await updateProductImage(id, { image: uploadUrl.secure_url });
  return res.status(200).json(
    new ApiResponse(200, "Image updated successfully", {
      uploadUrl: uploadUrl.secure_url,
    })
  );
});
export { getProducts, getProductId, addProduct, updateProduct, deleteProduct };
