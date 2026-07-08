'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { projectsApi } from '@/lib/projects-api';
import type { CreateProjectInput, UpdateProjectInput } from '@/domains/schemas/project';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Fetch all projects */
export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: () => projectsApi.list(),
  });
}

/** Fetch a single project by id */
export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<CreateProjectInput, 'creator'>) => projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success('สร้าง Project สำเร็จ');
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectInput }) =>
      projectsApi.update(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
      toast.success('อัพเดต Project สำเร็จ');
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success('ลบ Project สำเร็จ');
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    },
  });
}
