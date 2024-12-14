import { object, string } from "zod";

export const SignInSchema = object({
  email: string().email("Invalid email address"),
  password: string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be less than 32 characters long"),
});

export const RegisterSchema = object({
  name: string().min(1, "Name is required to be more than 1 character"),
  email: string().email("Invalid email address"),
  password: string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be less than 32 characters long"),
  ConfirmPassword: string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be less than 32 characters long"),
}).refine((data) => data.password === data.ConfirmPassword, {
  message: "Passwords do not match",
  path: ["ConfirmPassword"],
});
