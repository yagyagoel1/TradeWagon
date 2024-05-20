import { z } from "zod";

export const changeUsesrProfileSchema = async (fullName: string) => {
  const name = z.string().min(3);
  return name.safeParse(fullName);
};

export const addUserAddressSchema = async (data: {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}) => {
  const schema = z.object({
    street: z.string().min(3),
    city: z.string().min(3),
    state: z.string().min(3),
    country: z.string().min(3),
    postalCode: z.string().length(6),
  });
  return schema.safeParse(data);
};
