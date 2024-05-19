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
const validateSignin = (data: { email: string; password: string }) => {
  const schema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8),
  });
  return schema.safeParse(data);
};
const validateVerifyUser = (data: { email: string; otp: string }) => {
  const schema = zod.object({
    email: zod.string().email(),
    otp: zod.string().length(6),
  });
  return schema.safeParse(data);
};
export { validateSignup, validateSignin, validateVerifyUser };
