'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/src/hooks/use-auth';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const searchParams = useSearchParams();
  const isExpired = searchParams?.get('expired') === 'true';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { loginMutation } = useAuth();

  // Show toast notification if session expired
  useEffect(() => {
    if (isExpired) {
      toast.error('Your session has expired. Please login again.', {
        duration: 5000,
      });
    }
  }, [isExpired]);

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutateAsync(data, {
      onSuccess: () => {
        toast.success('Login successful!');
      },
      onError: (error: Error) => {
        toast.error(`Login failed: ${error.message}`);
      },
    });
  };

  return (
    <Card className="w-full md:w-[350px] shadow-none">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      {isExpired && (
        <div className="px-6 pb-4">
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your session has expired. Please login again to continue.
            </AlertDescription>
          </Alert>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password')}
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
