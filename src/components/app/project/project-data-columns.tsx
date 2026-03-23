import { ActionDropdown } from '@/components/share/overlay/action-dropdown'
import { DragHandle } from '@/components/share/table/data-sortable'
import { components } from '@/lib/client/api/v1'
import { Cell, ColumnDef } from '@tanstack/react-table'
import { ProjectDeleteAction, ProjectEditAction } from './project-actions'

const ProjectActionColumn = ({
  cell,
}: {
  cell: Cell<components['schemas']['Project'], unknown>
}) => {
  return (
    <ActionDropdown id={`PROJECT_ACTION_${cell.row.original.id}`}>
      <ProjectEditAction project={cell.row.original} />
      <ProjectDeleteAction projectId={cell.row.original.id} />
    </ActionDropdown>
  )
}

export const projectColumns: ColumnDef<components['schemas']['Project']>[] = [
  {
    id: 'drag',
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'category.name',
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
  {
    header: 'Actions',
    cell: ProjectActionColumn,
  },
]
