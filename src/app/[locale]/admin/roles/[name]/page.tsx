'use client'
import { useRef } from 'react'

import { useParams, useRouter } from 'next/navigation'

import {
  RoleFormSchema,
  RoleUpdateFormSchema,
} from '@/src/components/form-schema/role-schema'
import { getRole, useUpdateRole } from '@/src/hooks/use-role'
import { toast } from 'sonner'

import PageLayout from '../../shared/page-layout'
import RoleForm, { RoleFormRef } from '../form'

export default function EditRolePage() {
  const router = useRouter()
  const params = useParams()
  const name = params.name as string
  const formRef = useRef<RoleFormRef>(null)
  const { data: role, isLoading } = getRole(name)
  const { mutate: updateRole } = useUpdateRole()

  const onSubmit = async (
    data: RoleFormSchema | RoleUpdateFormSchema,
    reset: () => void,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateRole(
      { name, data: data as any },
      {
        onSuccess: () => {
          toast.success('Role updated successfully!')
          reset()
          router.push('/admin/roles')
        },
        onError: (error: Error) => {
          toast.error(error?.message || 'Failed to update role')
        },
      },
    )
  }

  if (isLoading) {
    return (
      <PageLayout
        title="Edit Role"
        btnLabel="Update Role"
        requiresAuth={{
          resource: 'roles',
          action: 'update',
        }}
        onSubmit={() => formRef.current?.submit()}
      >
        <div className="flex items-center justify-center p-8">
          <p>Loading role data...</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title="Edit Role"
      btnLabel="Save"
      requiresAuth={{
        resource: 'roles',
        action: 'update',
      }}
      onSubmit={() => formRef.current?.submit()}
    >
      <RoleForm
        ref={formRef}
        mode="update"
        onSubmit={onSubmit}
        defaultValue={role as Partial<RoleUpdateFormSchema>}
      />
    </PageLayout>
  )
}
