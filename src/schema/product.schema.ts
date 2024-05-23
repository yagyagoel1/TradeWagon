import { z } from "zod";

export enum ProductType {
  ELECTRONICS = "ELECTRONICS",
  CLOTHING = "CLOTHING",
  FOOD = "FOOD",
  OTHERS = "OTHERS",
}
export const getProductsSchema = (page: number) => {
  const schema = z.number().nonnegative().optional();
  return schema.safeParse(page);
};

export const addProductSchema = (product: {
  name: string;
  price: number;
  description: string;
  image: string;
  productType: string;
}) => {
  const schema = z.object({
    name: z.string().min(3).max(255),
    price: z.number().nonnegative(),
    description: z.string().min(3).max(255),
    image: z.string().url(),
    productType: z.enum([
      ProductType.ELECTRONICS,
      ProductType.CLOTHING,
      ProductType.FOOD,
      ProductType.OTHERS,
    ]),
  });
  return schema.safeParse(product);
};

export const updateProductSchema = (product: {
  name?: string;
  price?: number;
  description?: string;
  productType?: string;
}) => {
  const schema = z.object({
    name: z.string().min(3).max(255).optional(),
    price: z.number().nonnegative().optional(),
    description: z.string().min(3).max(255).optional(),
  });
  return schema.safeParse(product);
};
