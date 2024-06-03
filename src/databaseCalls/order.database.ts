import { DeliveryStatus, PaymentMethod } from "@prisma/client";
import { prisma } from "../db";
import { QuoteFields } from "@aws-sdk/client-s3";

export const createOrderByEmail = async ({
  emailId,
  items,
  TotalCost,
  paymentMethod,
}: {
  emailId: string;
  items: any;
  TotalCost: number;
  paymentMethod: PaymentMethod;
}) => {
  const order = await prisma.order.create({
    data: {
      ownerEmail: emailId,
      items: {
        create: items.map((item: any) => ({
          product: { connect: { id: item.product.id } },
          quantity: item.quantity,
        })),
      },
      totalPrice: TotalCost,
      deliveryStatus: "PENDING",
      paymentMethod,
    },
  });
  return order;
};

export const getAllOrdersByEmail = async (email: string) => {
  const orders = await prisma.order.findMany({
    where: {
      ownerEmail: email,
    },
    select: {
      items: {
        include: {
          product: true,
        },
      },
      id: true,
      totalPrice: true,
      deliveryStatus: true,
      paymentMethod: true,
      createdAt: true,
    },
  });
  return orders;
};

export const getOrderById = async (id: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id,
    },
    select: {
      items: {
        include: {
          product: true,
        },
      },
      id: true,
      totalPrice: true,
      deliveryStatus: true,
      paymentMethod: true,
      createdAt: true,
    },
  });
  return order;
};

export const getAllOrdersForAdmin = async (page: number) => {
  const skip = (page - 1) * 10;
  const orders = await prisma.order.findMany({
    skip: skip,
    take: 10,
    select: {
      items: {
        include: {
          product: true,
        },
      },
      id: true,
      totalPrice: true,
      deliveryStatus: true,
      paymentMethod: true,
      createdAt: true,
      ownerEmail: true,
    },
  });
  return orders;
};

export const updateOrderStatus = async (
  orderId: string,
  status: DeliveryStatus
) => {
  const order = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      deliveryStatus: status,
    },
    select: {
      id: true,
      deliveryStatus: true,
      ownerEmail: true,
    },
  });
  return order;
};
