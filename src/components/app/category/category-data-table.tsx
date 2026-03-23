'use client'

import { DataTable } from '@/components/share/table/data-table'
import { useProjectQueries } from '@/hooks/queries/project-query'
import React, { useMemo } from 'react'
import { categoryColumns } from './category-data-columns'

export default function CategoryDataTable() {
  const { categories } = useProjectQueries()
  const columns = useMemo(() => categoryColumns, [])

  return (
    <DataTable
      data={categories.data || []}
      columns={columns}
      isLoading={categories.isPending}
    />
  )
}
