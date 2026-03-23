'use client'

import { DataTable } from '@/components/share/table/data-table'
import { useUserQueries } from '@/hooks/queries/user-query'
import React, { useMemo } from 'react'
import { userColumns } from './user-data-columns'

export default function UserDataTable() {
  const { users } = useUserQueries()
  const columns = useMemo(() => userColumns, [])
  return (
    <DataTable
      data={users.data || []}
      columns={columns}
      isLoading={users.isPending}
    />
  )
}
