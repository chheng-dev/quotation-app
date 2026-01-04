/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useRef } from 'react'

import { UserSchema } from '@/src/components/form-schema/user-schema'
import { useCreateUser } from '@/src/hooks/use-user'
import { toast } from 'sonner'

import PageLayout from '../../shared/page-layout'
import UserForm, { UserFormRef } from '../user-form'

export default function NewUserPage() {
  const formRef = useRef<UserFormRef>(null)
  const { mutateAsync: createUser } = useCreateUser()

  const onSubmit = async (data: UserSchema, reset: () => void) => {
    createUser(data as any, {
      onSuccess: () => {
        toast.success('User created successfully!')
        reset()
      },
      onError: (error) => {
        toast.error(error?.message || 'Created failed')
      },
    })
  }

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.submit()
    }
  }

  return (
    <PageLayout
      title="Create New User"
      btnLabel="Save changes"
      requiresAuth={{
        resource: 'users',
        action: 'create',
      }}
      onSubmit={handleSubmit}
    >
      <UserForm ref={formRef} onSubmit={onSubmit} mode="create" />
    </PageLayout>
  )
}
