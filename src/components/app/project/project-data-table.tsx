'use client'

import { DataTable } from '@/components/share/table/data-table'
import { useProjectQueries } from '@/hooks/queries/project-query'
import React, { useMemo } from 'react'
import { projectColumns } from './project-data-columns'

export default function ProjectDataTable() {
  const { projects } = useProjectQueries()
  const columns = useMemo(() => projectColumns, [])

  return (
    <DataTable
      data={projects.data || []}
      columns={columns}
      isLoading={projects.isPending}
    />
  )
}
