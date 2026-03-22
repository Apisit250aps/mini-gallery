using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniGalleryService;

model User {
  id: string;
  name: string;
  isAdmin: boolean;
  isActive: boolean;
  // timestamps
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
  lastLogin?: utcDateTime | null;
}

model UserCreateRequest
  is PickProperties<User, "name" | "isAdmin" | "isActive">;

model UserUpdateRequest is OptionalProperties<UserCreateRequest>;
