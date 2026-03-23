import { components } from '@/lib/client/api/v1'
import { ColumnDef } from '@tanstack/react-table'

export const userColumns: ColumnDef<components['schemas']['User']>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'isActive',
    header: 'Active',
    cell: ({ row }) => {
      const isActive = row.original.isActive
      return isActive ? 'Yes' : 'No'
    },
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last Login',
    cell: ({ row }) => {
      const lastLogin = row.original.lastLogin
      return lastLogin ? new Date(lastLogin).toLocaleString() : '-'
    },
  },
]
