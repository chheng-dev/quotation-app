/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { GenericDataTable } from '@/src/components/generic-data-table'
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar'
import { Button } from '@/src/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/src/components/ui/tooltip'
import { useDeleteUser } from '@/src/hooks/use-user'
import { User } from '@/src/models/userModel'
import { useAlertDialog } from '@/src/providers/alert-dialog-provider'
import { ColumnDef } from '@tanstack/react-table'
import { FilePenLine, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface TableUserProps {
  items: User[]
  isLoading: boolean
}

const TableUser = ({ items, isLoading }: TableUserProps) => {
  const router = useRouter()
  const { mutateAsync: deleteUser } = useDeleteUser()
  const { openDialog } = useAlertDialog()
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const handleEdit = (code: string) => {
    router.push(`/admin/users/${code}`)
  }

  const handleDeleteClick = (user: User) => {
    openDialog({
      title: 'Delete User',
      description: `This action cannot be undone. This will permanently delete the user ${user?.name} and remove all associated data.`,
      actionLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'destructive',
      onAction: () => handleDeleteConfirm(user),
      onCancel: () => setUserToDelete(null),
    })
  }

  const handleDeleteConfirm = async (user: User) => {
    if (!user) return

    try {
      await deleteUser(user.code)
      toast.success('User deleted successfully!')
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete user')
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const user = row.original
        const initials = user.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="font-medium">{user.name}</div>
          </div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'code',
      header: 'Code',
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone',
      cell: ({ row }) => row.original.phoneNumber || '-',
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.original.isActive
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        )
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(user.code)}
                >
                  <FilePenLine className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit User</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(user)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete User</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <GenericDataTable
        columns={columns}
        data={items}
        searchKey="name"
        searchPlaceholder="Search users by name..."
        isLoading={isLoading}
      />
    </div>
  )
}

export default TableUser
