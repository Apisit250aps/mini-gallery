import { ProjectCreateAction } from '@/components/app/project/project-actions'
import ProjectDataTable from '@/components/app/project/project-data-table'
import React from 'react'

export default function ProjectView() {
  return (
    <div>
      <div className="flex justify-end">
        <ProjectCreateAction />
      </div>
      <ProjectDataTable />
    </div>
  )
}
