'use client'

import { useRef } from 'react'

import { useRouter } from 'next/navigation'

import PageLayout from '../../shared/page-layout'
import RoleForm, { RoleFormRef } from '../form'

export default function NewRolePage() {
  const formRef = useRef<RoleFormRef>(null)
  const router = useRouter()

  const onSubmit = async () => {}

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.submit()
    }
  }

  return (
    <PageLayout
      title="New Role"
      requiresAuth={{
        resource: 'roles',
        action: 'create',
      }}
      btnLabel="Save Change"
      onSubmit={handleSubmit}
    >
      <RoleForm onSubmit={onSubmit} />
    </PageLayout>
  )
}
