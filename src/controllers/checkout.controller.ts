import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { checkoutSchema } from "../schema/checkout.schema";
import { getCartItems } from "../databaseCalls/cart.database";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../db";
import { getProductById } from "../databaseCalls/product.database";
import { createOrderByEmail } from "../databaseCalls/order.database";
import { ApiResponse } from "../utils/ApiResponse";

const checkout = asyncHandler(async (req: Request, res: Response) => {
  const { id = "none", isCart, paymentMethod, quantity = "1" } = req.body;
  const intQuantity = parseInt(quantity);
  //check the input
  //check is cart
  //check if the cart exists and is not empty
  //else check if the product exists
  //check if the product is in stock
  // check the payment method
  //create the order
  //if payment is online create a order for payment
  //decrease the stock of the product
  //empty the cart if is cart is true
  //return the order details
  //return the payment details if payment is online

  const validate = checkoutSchema({
    id,
    isCart,
    paymentMethod,
    quantity: intQuantity,
  });
  if (!validate.success) {
    return res.status(400).json(validate.error.errors[0].message);
  }
  let totalCost = 0;
  if (isCart) {
    const cart = await getCartItems(req.user?.email.id);
    if (!cart || cart.items.length === 0) {
      return res.status(404).json(new ApiError(404, "Cart is empty"));
    }
    const updates = [];

    for (const item of cart.items) {
      if (item.product.inStock < item.quantity) {
        return res.status(400).json(
          new ApiError(400, "Product is out of stock", [], {
            id: item.product.id,
            name: item.product.name,
          })
        );
      }
      updates.push(
        prisma.product.update({
          where: { id: item.product.id },
          data: { inStock: item.product.inStock - item.quantity },
        })
      );
      totalCost += item.product.price * item.quantity;
    }

    // Execute all updates in a transaction
    await prisma.$transaction(updates);
    //create order
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
    await prisma.product.update({
      where: { id: product.id },
      data: { inStock: product.inStock - intQuantity },
    });
    totalCost = product.price * intQuantity;
    await createOrderByEmail({
      emailId: req.user?.email,
      items: [{ quantity: intQuantity, product }],
      TotalCost: totalCost,
      paymentMethod,
    });
    if (paymentMethod == "ONLINE") {
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
});

export { checkout };
