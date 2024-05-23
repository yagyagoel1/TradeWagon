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
