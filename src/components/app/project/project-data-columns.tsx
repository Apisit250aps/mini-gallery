import { components } from '@/lib/client/api/v1'
import { ColumnDef } from '@tanstack/react-table'

export const projectColumns: ColumnDef<components['schemas']['Project']>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'displayOrder',
    header: 'Order',
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = row.original.tags
      return tags?.length ? tags.join(', ') : '-'
    },
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
