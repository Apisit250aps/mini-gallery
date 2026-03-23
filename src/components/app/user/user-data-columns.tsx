import { ActionDropdown } from '@/components/share/overlay/action-dropdown'
import { components } from '@/lib/client/api/v1'
import { Cell, ColumnDef } from '@tanstack/react-table'
import { UserDeleteAction, UserEditAction } from './user-actions'

const UserActionColumn = ({
  cell,
}: {
  cell: Cell<components['schemas']['User'], unknown>
}) => {
  return (
    <ActionDropdown id={`USER_ACTION_${cell.row.original.id}`}>
      <UserEditAction user={cell.row.original} />
      <UserDeleteAction userId={cell.row.original.id} />
    </ActionDropdown>
  )
}

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
  {
    header: 'Actions',
    cell: UserActionColumn,
  },
]
