import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import {
  addProductToCart,
  decreaseProductQuantity,
  deleteProductFromCart,
  getCartItemById,
  getCartItems,
  increaseProductQuantity,
} from "../databaseCalls/cart.database";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cartItems = await getCartItems(req.user?.email);
  res
    .status(200)
    .json(new ApiResponse(200, "Cart items fetched successfully", cartItems));
});
const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const doesproductExist = await getCartItemById(req.user?.email, productId);
  if (!doesproductExist || doesproductExist.items.length < 0) {
    await addProductToCart(req.user?.email, productId);
  } else {
    await increaseProductQuantity(doesproductExist.items[0].id);
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Product added to cart successfully"));
});
const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const doesproductExist = await getCartItemById(req.user?.email, productId);
  if (!doesproductExist || doesproductExist.items.length < 0) {
    return res
      .status(404)
      .json(new ApiError(404, "Product does not exist in cart"));
  }
  if (doesproductExist.items[0].quantity === 1) {
    await deleteProductFromCart(doesproductExist.items[0].id);
  } else {
    await decreaseProductQuantity(doesproductExist.items[0].id);
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Product removed from cart successfully"));
});

export { getCart, addToCart, removeFromCart };
