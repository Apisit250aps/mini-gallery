using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniGalleryService;

model Category {
  id: string;
  name: string;
  slug: string;
  // timestamps
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model CategoryCreateRequest is PickProperties<Category, "name">;
model CategoryUpdateRequest is OptionalProperties<CategoryCreateRequest>;