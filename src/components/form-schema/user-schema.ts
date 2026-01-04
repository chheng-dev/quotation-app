import { z } from 'zod';

// Base schema with shared fields
const baseUserSchema = {
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
  code: z.string().min(4, 'Code must be at least 4 characters long'),
  phoneNumber: z.string().optional(),
  dob: z.string().optional(),
  isActive: z.boolean(),
  isAdmin: z.boolean(),
};

// Schema for creating new users - password is required
export const userCreateSchema = z
  .object({
    ...baseUserSchema,
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    },
  );

// Schema for updating existing users - password is optional
export const userUpdateSchema = z
  .object({
    ...baseUserSchema,
    password: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length === 0 || val.length >= 8,
        {
          message: 'Password must be at least 8 characters long',
        },
      ),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // If password is provided (non-empty), it must match confirmPassword
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    },
  );

// Legacy export for backward compatibility (defaults to create schema)
export const userSchema = userCreateSchema;

export type UserFormSchema = z.infer<typeof userCreateSchema>;
export type UserUpdateFormSchema = z.infer<typeof userUpdateSchema>;

export type UserSchema = {
  id?: number;
  name: string;
  email: string;
  code: string;
  phoneNumber?: string;
  dob?: string;
  isActive: boolean;
  isAdmin: boolean;
  password?: string;
  isPasswordUpdate?: boolean;
};
