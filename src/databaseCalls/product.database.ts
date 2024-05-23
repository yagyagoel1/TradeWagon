import { ProductType } from "@prisma/client";
import { prisma } from "../db";

export const getAllProducts = async (page: number) => {
  const skip = (page - 1) * 10;
  const products = await prisma.product.findMany({
    skip: skip,
    take: 10,
    select: {
      id: true,
      name: true,
      price: true,
      description: true,
      image: true,
      productType: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return products;
};
export const getProductById = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      price: true,
      description: true,
      image: true,
      productType: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return product;
};

export const addProducts = async (data: {
  name: string;
  price: number;
  description: string;
  image: string;
  productType: ProductType;
}) => {
  return await prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      description: data.description,
      image: data.image,
      productType: ProductType[data.productType],
    },
  });
};

export const updateProductById = async (
  id: string,
  data: { name?: string; price?: number; description?: string }
) => {
  return await prisma.product.update({
    where: {
      id,
    },
    data: {
      name: data?.name,
      price: data?.price,
      description: data?.description,
    },
  });
};
export const deleteProductById = async (id: string) => {
  return await prisma.product.delete({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });
};
export const updateProductImage = async (
  id: string,
  data: { image: string }
) => {
  return await prisma.product.update({
    where: {
      id,
    },
    data: {
      image: data.image,
    },
  });
};
