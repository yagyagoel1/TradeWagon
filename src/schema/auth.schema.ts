import zod from "zod";
const validateSignup = (data: {
  email: string;
  password: string;
  fullName: string;
}) => {
  const schema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8),
    fullName: zod.string().min(3),
  });
  return schema.safeParse(data);
};

export { validateSignup };
