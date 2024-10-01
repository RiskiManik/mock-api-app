import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});
export const SignupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  password: z.string().min(3),
});
