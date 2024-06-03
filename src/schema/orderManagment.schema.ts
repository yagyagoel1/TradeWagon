import { DeliveryStatus } from "@prisma/client";
import { z } from "zod";

export const updateOrderStatusSchema = (status: string) => {
  const schema = z.object({
    status: z.nativeEnum(DeliveryStatus),
  });
  return schema.safeParse({ status });
};
