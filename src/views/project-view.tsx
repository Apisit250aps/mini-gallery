import { ProjectCreateAction } from '@/components/app/project/project-actions'
import ProjectDataTable from '@/components/app/project/project-data-table'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react'

export default function ProjectView() {
  return (
    <div>
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/projects/new">Create Project</Link>
        </Button>
      </div>
      <ProjectDataTable />
    </div>
  )
}
