'use client';
import { UserSchema } from '@/src/components/form-schema/user-schema';
import PageLayout from '../../shared/page-layout';
import UserForm, { UserFormRef } from '../user-form';
import { toast } from 'sonner';
import { useRef, useState } from 'react';

export default function NewUserPage() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<UserFormRef>(null);

  const onSubmit = async (data: UserSchema, reset: () => void) => {
    try {
      setLoading(true);
      console.log('Form submitted:', data);

      toast.success('User created successfully!');
      reset();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (formRef.current && !loading) {
      formRef.current.submit();
    }
  };

  return (
    <PageLayout
      title="Create New User"
      btnLabel="Create User"
      requiresAuth={{
        resource: 'users',
        action: 'create',
      }}
      onSubmit={handleSubmit}
    >
      <UserForm ref={formRef} onSubmit={onSubmit} />
    </PageLayout>
  );
}
