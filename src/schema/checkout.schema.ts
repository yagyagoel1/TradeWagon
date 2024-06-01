import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const checkoutSchema = (data: {
  id: string;
  isCart: boolean;
  paymentMethod: PaymentMethod;
  quantity: number;
}) => {
  const schema = z.object({
    id: z.string(),
    isCart: z.boolean(),
    paymentMethod: z.nativeEnum(PaymentMethod),
    quantity: z.number(),
  });
  return schema.safeParse(data);
};
