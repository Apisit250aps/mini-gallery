'use client'

import { DataSortable } from '@/components/share/table/data-sortable'
import { useProjectQueries } from '@/hooks/queries/project-query'
import { components } from '@/lib/client/api/v1'
import React, { useCallback, useMemo } from 'react'
import { projectColumns } from './project-data-columns'

export default function ProjectDataTable() {
  const { projects, sortProjects } = useProjectQueries()
  const columns = useMemo(() => projectColumns, [])

  const onDataChange = useCallback(
    async (newData: components['schemas']['Project'][]) => {
      await sortProjects.mutateAsync({
        body: {
          projectIds: newData.map((project) => project.id),
        },
      })
    },
    [sortProjects],
  )

  return (
    <DataSortable
      data={projects.data || []}
      columns={columns}
      onDataChange={onDataChange}
    />
  )
}
