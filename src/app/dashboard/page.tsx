'use client'
import { ProjectsTable } from '@/views/projects';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground mt-1">
          จัดการ projects ทั้งหมดในระบบ
        </p>
      </div>
      <ProjectsTable />
    </div>
  );
}
