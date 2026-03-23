import { ActionDropdown } from '@/components/share/overlay/action-dropdown'
import { components } from '@/lib/client/api/v1'
import { Cell, ColumnDef } from '@tanstack/react-table'
import { CategoryDeleteAction, CategoryEditAction } from './category-actions'

const CategoryActionColumn = ({
  cell,
}: {
  cell: Cell<components['schemas']['Category'], unknown>
}) => {
  return (
    <ActionDropdown id={`CATEGORY_ACTION_${cell.row.original.id}`}>
      <CategoryEditAction category={cell.row.original} />
      <CategoryDeleteAction categoryId={cell.row.original.id} />
    </ActionDropdown>
  )
}

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
  {
    header: 'Actions',
    cell: CategoryActionColumn,
  },
]
