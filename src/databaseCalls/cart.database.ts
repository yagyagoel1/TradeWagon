import { prisma } from "../db";

export const getCartItems = async (userEmail: string) => {
  return await prisma.cart.findFirst({
    where: {
      ownerEmail: userEmail,
    },
    select: {
      id: true,
      items: {
        select: {
          id: true,
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              inStock: true,
              description: true,
              image: true,
              productType: true,
            },
          },
          quantity: true,
        },
      },
    },
  });
};

export const getCartItemById = async (
  ownerEmail: string,
  productId: string
) => {
  return await prisma.cart.findFirst({
    where: {
      ownerEmail: ownerEmail,
      items: {
        some: {
          productId: productId,
        },
      },
    },
    select: {
      id: true,
      items: {
        where: {
          productId: productId,
        },
        select: {
          id: true,
          quantity: true,
        },
      },
    },
  });
};

export const addProductToCart = async (
  ownerEmail: string,
  productId: string
) => {
  return await prisma.cart.update({
    where: {
      ownerEmail,
    },
    data: {
      items: {
        create: {
          productId,
        },
      },
    },
  });
};
export const increaseProductQuantity = async (cartProductId: string) => {
  return await prisma.cartProduct.update({
    where: {
      id: cartProductId,
    },
    data: {
      quantity: {
        increment: 1,
      },
    },
  });
};

export const deleteProductFromCart = async (cartProductId: string) => {
  return await prisma.cartProduct.delete({
    where: {
      id: cartProductId,
    },
  });
};
export const decreaseProductQuantity = async (cartProductId: string) => {
  return await prisma.cartProduct.update({
    where: {
      id: cartProductId,
    },
    data: {
      quantity: {
        decrement: 1,
      },
    },
  });
};
