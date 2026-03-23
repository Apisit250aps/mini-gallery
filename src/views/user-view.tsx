import { UserCreateAction } from '@/components/app/user/user-actions'
import UserDataTable from '@/components/app/user/user-data-table'
import React from 'react'

export default function UserView() {
  return (
    <div>
      <div className="flex justify-end">
        <UserCreateAction />
      </div>
      <UserDataTable />
    </div>
  )
}
