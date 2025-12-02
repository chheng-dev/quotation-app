'use client';

import {
  userSchema,
  type UserFormSchema,
  type UserSchema,
} from '@/src/components/form-schema/user-schema';
import { Card, CardContent } from '@/src/components/ui/card';
import { DatePicker } from '@/src/components/ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import StatusCombobox from '@/src/components/ui/shared/stauts-combobox';
import { FormRef, useFormRef } from '@/src/hooks/use-form-ref';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  onSubmit: (values: UserSchema, reset: () => void) => Promise<void>;
  defaultValues?: Partial<UserSchema>;
};

export type UserFormRef = FormRef<UserFormSchema>;

const UserForm = React.forwardRef<UserFormRef, Props>(({ onSubmit, defaultValues }, ref) => {
  const form = useForm<UserFormSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      code: defaultValues?.code || '',
      phoneNumber: defaultValues?.phoneNumber || '',
      dob: defaultValues?.dob || '',
      isActive: defaultValues?.isActive ?? true,
      isAdmin: defaultValues?.isAdmin ?? false,
      password: '',
      confirmPassword: '',
    },
  });

  const transformValues = (values: UserFormSchema): UserSchema => {
    return {
      ...(defaultValues?.id && { id: defaultValues.id }),
      name: values.name,
      email: values.email,
      code: values.code,
      phoneNumber: values.phoneNumber || undefined,
      dob: values.dob || undefined,
      isActive: values.isActive,
      isAdmin: values.isAdmin,
      ...(values.password && { password: values.password }),
    };
  };

  useFormRef(ref, {
    form,
    onSubmit: async (values, reset) => {
      const transformedValues = transformValues(values);
      await onSubmit(transformedValues, reset);
    },
  });

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              const transformedValues = transformValues(values);
              onSubmit(transformedValues, () => form.reset());
            })}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter user name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      User Code <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="USER001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+855 12 345 678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <DatePicker placeholder="Select date of birth" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Active User</FormLabel>
                    <FormControl>
                      <StatusCombobox defaultValue={field.value ? 'active' : 'inactive'} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Password Fields - Only show for create or when explicitly updating password */}
            {(!defaultValues || defaultValues.isPasswordUpdate) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Password {!defaultValues && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Confirm Password {!defaultValues && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active User</FormLabel>
                        <FormDescription>
                          User can log in to the system
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isAdmin"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Administrator</FormLabel>
                        <FormDescription>
                          User has administrator privileges
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div> */}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
});

UserForm.displayName = 'UserForm';

export default UserForm;
