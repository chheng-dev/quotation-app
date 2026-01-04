'use client'
import { useRef } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { UserSchema } from '@/src/components/form-schema/user-schema'
import { useUpdateUser, useUser } from '@/src/hooks/use-user'
import { toast } from 'sonner'

import PageLayout from '../../shared/page-layout'
import UserForm, { UserFormRef } from '../user-form'

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const code = params.code as string
  const formRef = useRef<UserFormRef>(null)
  const { data: userData, isLoading: isLoadingUser } = useUser(code)
  const { mutate: updateUser } = useUpdateUser()

  const onSubmit = async (data: UserSchema, reset: () => void) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateUser(
      { code, user: data as any },
      {
        onSuccess: () => {
          toast.success('User updated successfully!')
          reset()
          router.push('/admin/users')
        },
      },
    )
  }

  const handleSubmitForm = () => {
    if (formRef.current) {
      formRef.current.submit()
    }
  }

  if (isLoadingUser) {
    return (
      <PageLayout
        title="Edit User"
        btnLabel="Update User"
        requiresAuth={{
          resource: 'users',
          action: 'update',
        }}
        onSubmit={handleSubmitForm}
      >
        <div className="flex items-center justify-center p-8">
          <p>Loading user data...</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title="Edit User"
      btnLabel="Update User"
      requiresAuth={{
        resource: 'users',
        action: 'update',
      }}
      onSubmit={handleSubmitForm}
    >
      <UserForm
        ref={formRef}
        onSubmit={onSubmit}
        defaultValues={userData as Partial<UserSchema>}
        mode="update"
      />
    </PageLayout>
  )
}
