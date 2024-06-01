import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { checkoutSchema, getOrderSchema } from "../schema/checkout.schema";
import { getCartItems } from "../databaseCalls/cart.database";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../db";
import { getProductById } from "../databaseCalls/product.database";
import {
  createOrderByEmail,
  getAllOrdersByEmail,
  getOrderById,
} from "../databaseCalls/order.database";
import { ApiResponse } from "../utils/ApiResponse";

const checkout = asyncHandler(async (req: Request, res: Response) => {
  let updates = [];
  let totalCost = 0;

  try {
    const { id = "none", isCart, paymentMethod, quantity = "1" } = req.body;
    const intQuantity = parseInt(quantity);

    const validate = checkoutSchema({
      id,
      isCart,
      paymentMethod,
      quantity: intQuantity,
    });
    if (!validate.success) {
      return res.status(400).json(validate.error.errors[0].message);
    }

    if (isCart) {
      const cart = await getCartItems(req.user?.email.id);
      if (!cart || cart.items.length === 0) {
        return res.status(404).json(new ApiError(404, "Cart is empty"));
      }

      for (const item of cart.items) {
        if (item.product.inStock < item.quantity) {
          return res.status(400).json(
            new ApiError(400, "Product is out of stock", [], {
              id: item.product.id,
              name: item.product.name,
            })
          );
        }
        updates.push({
          productId: item.product.id,
          previousStock: item.product.inStock,
          newStock: item.product.inStock - item.quantity,
        });

        totalCost += item.product.price * item.quantity;
      }

      // Execute all updates in a transaction
      await prisma.$transaction(
        updates.map((update) =>
          prisma.product.update({
            where: { id: update.productId },
            data: { inStock: update.newStock },
          })
        )
      );

      if (!(totalCost > 500)) totalCost += 50;

      await createOrderByEmail({
        emailId: req.user?.email,
        items: cart.items,
        TotalCost: totalCost,
        paymentMethod,
      });

      if (paymentMethod === "ONLINE") {
        //create payment order
        //create the transaction
      }
    } else {
      const product = await getProductById(id);
      if (!product) {
        return res.status(404).json(new ApiError(404, "Product not found"));
      }
      if (product.inStock < intQuantity) {
        return res.status(400).json(
          new ApiError(400, "Product is out of stock", [], {
            id: product.id,
            name: product.name,
          })
        );
      }
      updates.push({
        productId: product.id,
        previousStock: product.inStock,
        newStock: product.inStock - intQuantity,
      });

      await prisma.product.update({
        where: { id: product.id },
        data: { inStock: product.inStock - intQuantity },
      });

      totalCost = product.price * intQuantity;
      if (!(totalCost > 500)) totalCost += 50;
      await createOrderByEmail({
        emailId: req.user?.email,
        items: [{ quantity: intQuantity, product }],
        TotalCost: totalCost,
        paymentMethod,
      });

      if (paymentMethod === "ONLINE") {
        //create payment order
        //create the transaction
      }
    }

    res.status(200).json(
      new ApiResponse(200, "Order created successfully", {
        paymentMethod,
        totalCost,
        paymentdetails: {},
      })
    );
  } catch (error) {
    // Rollback the stock updates
    if (updates.length > 0) {
      await prisma.$transaction(
        updates.map((update) =>
          prisma.product.update({
            where: { id: update.productId },
            data: { inStock: update.previousStock },
          })
        )
      );
    }
    throw error;
  }
});
const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await getAllOrdersByEmail(req.user?.email);
  res
    .status(200)
    .json(new ApiResponse(200, "Orders retrieved successfully", orders));
});
const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validate = await getOrderSchema({ id });
  if (!validate.success) {
    return res
      .status(400)
      .json(new ApiError(400, validate.error.errors[0].message));
  }
  const order = await getOrderById(id);
  if (!order) {
    return res.status(404).json(new ApiError(404, "Order not found"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Order retrieved successfully", order));
});

export {
  checkout, //create transaction for the quantity
  getAllOrders,
  getOrder,
};
