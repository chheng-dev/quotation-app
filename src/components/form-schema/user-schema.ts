import { z } from 'zod';

export const userSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Invalid email address'),
    code: z.string().min(4, 'Code must be at least 4 characters long'),
    phoneNumber: z.string().optional(),
    dob: z.string().optional(),
    isActive: z.boolean(),
    isAdmin: z.boolean(),
    password: z.string().min(8, 'Password must be at least 8 characters long').optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    },
  );

export type UserFormSchema = z.infer<typeof userSchema>;

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
