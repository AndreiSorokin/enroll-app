import { z } from 'zod';

export const loginSchema = z.object({
   email: z.string().email('Invalid email address'),
   password: z.string().min(6, 'Password must contain letters and numbers and to be at least 6 characters long'),
});

export const registrationSchema = z.object({
   email: z.string().email('Invalid email address').min(1, 'Email is required'),
   password: z.string().min(6, 'Password must be at least 6 characters'),
   name: z.string().min(1, 'Name is required'),
   role: z.enum(['user', 'admin']).default('user'),
   image: z.any().nullable().optional(),
});

export const updateUserSchema = z.object({
   name: z.string().min(1, 'Invalid name'),
});

export const updatePasswordSchema = z.object({
   currentPassword: z.string().min(1, 'Current password is required'),
   newPassword: z
   .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
         /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
         "Password must contain at least one letter and one number"
      ),
});


export const resetPasswordSchema = z.object({
   newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
         /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
         "Password must contain at least one letter and one number"
      ),
});

export const emailSchema = z.object({
   email: z.string().email('Invalid email address'),
});

export const updateMasterProcedureSchema = z.object({
   price: z.preprocess(
      (val) => (typeof val === "string" ? Number(val) : val), 
      z.number().positive("Price must be a positive number").min(1, "Please set a correct number")
   ),
});

export const createMasterProcedureSchema = z.object({
   procedureName: z.string().min(1, "Procedure name is required"),
   price: z.number().positive("Price must be a positive number").min(1, "Please set a correct number"),
   duration: z.number().positive("duration must be a positive number")
});