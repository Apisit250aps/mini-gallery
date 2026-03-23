import { components } from '@/lib/client/api/v1'
import { ColumnDef } from '@tanstack/react-table'

export const categoryColumns: ColumnDef<components['schemas']['Category']>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt
      return updatedAt ? new Date(updatedAt).toLocaleString() : '-'
    },
  },
]
