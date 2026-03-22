using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniGalleryService;

model Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  galleries: string[];
  displayOrder: int32;
  location?: string;
  type?: string;
  program?: string;
  client?: string;
  siteArea?: string;
  builtArea?: string;
  design?: string;
  completion?: string;
  description?: string;

  // timestamps
  createdAt: utcDateTime;

  updatedAt: utcDateTime;
}

model ProjectCreateRequest
  is OmitProperties<Project, "id" | "createdAt" | "updatedAt">;
model ProjectUpdateRequest is OptionalProperties<ProjectCreateRequest>;
