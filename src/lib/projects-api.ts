import type { ProjectEntity, CreateProjectInput, UpdateProjectInput } from '@/domains/schemas/project';

// ─── Response shape from the Hono API ─────────────────────────────────────────
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const json = (await res.json()) as ApiResponse<T>;

  if (!res.ok) {
    throw new Error((json as { message?: string }).message ?? `API error: ${res.status}`);
  }

  return json.data;
}

// ─── Project API client ────────────────────────────────────────────────────────

export const projectsApi = {
  /** GET /api/projects */
  list(): Promise<ProjectEntity[]> {
    return apiFetch<ProjectEntity[]>('/api/projects');
  },

  /** GET /api/projects/:id */
  getById(id: string): Promise<ProjectEntity> {
    return apiFetch<ProjectEntity>(`/api/projects/${id}`);
  },

  /** POST /api/projects */
  create(data: Omit<CreateProjectInput, 'creator'>): Promise<ProjectEntity> {
    return apiFetch<ProjectEntity>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** PUT /api/projects/:id */
  update(id: string, data: UpdateProjectInput): Promise<ProjectEntity> {
    return apiFetch<ProjectEntity>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /** DELETE /api/projects/:id */
  delete(id: string): Promise<void> {
    return apiFetch<void>(`/api/projects/${id}`, { method: 'DELETE' });
  },
};
