import { z } from "zod";

export const getProductsSchema = (page: number) => {
  const schema = z.number().nonnegative().optional();
  return schema.safeParse(page);
};
