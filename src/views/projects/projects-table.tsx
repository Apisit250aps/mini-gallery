'use client';

import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { ProjectEntity } from '@/domains/schemas/project';
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '@/hooks/use-projects';
import { useOverlay } from '@/hooks/overlay-provider';
import { DataTable } from '@/components/shared/table';
import { Button } from '@/components/ui/button';
import { getProjectColumns } from './columns';
import { ProjectForm } from './project-form';

export function ProjectsTable() {
  const { data: projects = [], isLoading } = useProjects();
  const { mutateAsync: createProject, isPending: isCreating } = useCreateProject();
  const { mutateAsync: updateProject, isPending: isUpdating } = useUpdateProject();
  const { mutateAsync: deleteProject } = useDeleteProject();
  const overlay = useOverlay();

  // ── Open create dialog ──────────────────────────────────────────────────────
  const handleCreate = () => {
    overlay.dialog.open({
      title: 'สร้าง Project ใหม่',
      description: 'กรอกข้อมูล project ที่ต้องการสร้าง',
      size: 'lg',
      children: (
        <ProjectForm
          onSubmit={async (data) => {
            await createProject(data);
            overlay.dialog.close();
          }}
          isLoading={isCreating}
          submitLabel="สร้าง Project"
        />
      ),
    });
  };

  // ── Open edit dialog ────────────────────────────────────────────────────────
  const handleEdit = (project: ProjectEntity) => {
    overlay.dialog.open({
      title: 'แก้ไข Project',
      description: `แก้ไขข้อมูลของ "${project.name}"`,
      size: 'lg',
      children: (
        <ProjectForm
          defaultValues={project}
          onSubmit={async (data) => {
            await updateProject({ id: project.id, data });
            overlay.dialog.close();
          }}
          isLoading={isUpdating}
          submitLabel="บันทึกการแก้ไข"
        />
      ),
    });
  };

  // ── Open delete confirmation ────────────────────────────────────────────────
  const handleDelete = (project: ProjectEntity) => {
    overlay.alert.open({
      title: `ลบ "${project.name}"?`,
      description: 'การดำเนินการนี้ไม่สามารถย้อนกลับได้ คุณแน่ใจหรือไม่?',
      confirmText: 'ลบ',
      cancelText: 'ยกเลิก',
      onConfirm: () => deleteProject(project.id),
    });
  };

  const columns = useMemo(
    () => getProjectColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={projects}
      isLoading={isLoading}
      filterColumn="name"
      filterPlaceholder="ค้นหา project..."
      toolbarActions={
        <Button size="sm" onClick={handleCreate} id="create-project-btn">
          <Plus data-icon="inline-start" />
          สร้าง Project
        </Button>
      }
    />
  );
}
