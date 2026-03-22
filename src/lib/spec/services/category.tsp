using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniGalleryService;


@route("/categories")
@tag("Categories")
interface CategoriesService {
  @get getCategories(): ApiResponse<Category[]> | ErrorResponse500;

  @post createCategory(
    @body body: CategoryCreateRequest,
  ): ApiResponse<Category> | ErrorResponse400 | ErrorResponse500;

  @put updateCategory(@path id: string, @body body: CategoryUpdateRequest):
    | ApiResponse<Category>
    | ErrorResponse400
    | ErrorResponse404
    | ErrorResponse500;

  @delete deleteCategory(
    @path id: string,
  ): ApiResponse<EmptyData> | ErrorResponse404 | ErrorResponse500;
}
