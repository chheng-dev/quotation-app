import { useRouter } from 'next/navigation'

import { GenericDataTable } from '@/src/components/generic-data-table'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { getRoles } from '@/src/hooks/use-role'
import { ColumnDef } from '@tanstack/react-table'
import { FilePenLine, Trash2 } from 'lucide-react'

const TableRole = () => {
  const router = useRouter()
  const columns: ColumnDef<any>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }: { row: any }) => {
        return <span className="capitalize">{row.original.name}</span>
      },
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Total Permissions',
      accessorKey: 'totalPermissions',
      cell: ({ row }: { row: any }) => {
        return (
          <Badge className="text-xs" variant="outline">
            {row.original.totalPermissions} permissions
          </Badge>
        )
      },
    },
  ]

  const { data, isLoading } = getRoles()
  if (!data) return null

  const handleEdit = (name: string) => {
    router.push(`/admin/roles/${name}`)
  }

  return (
    <div>
      <GenericDataTable
        columns={columns}
        data={data}
        searchPlaceholder="Search roles by name..."
        isLoading={isLoading}
        searchKey="name"
        actions={(row: any) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(row.name)}
            >
              <FilePenLine className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      />
    </div>
  )
}

export default TableRole
