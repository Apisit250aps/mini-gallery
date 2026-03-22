using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniGalleryService;


@route("/users")
@tag("Users")
interface UsersService {
  @get getUsers(): ApiResponse<User[]> | ErrorResponse500;

  @post createUser(
    @body body: UserCreateRequest,
  ): ApiResponse<User> | ErrorResponse400 | ErrorResponse500;

  @put updateUser(@path id: string, @body body: UserUpdateRequest):
    | ApiResponse<User>
    | ErrorResponse400
    | ErrorResponse404
    | ErrorResponse500;

  @delete deleteUser(
    @path id: string,
  ): ApiResponse<EmptyData> | ErrorResponse404 | ErrorResponse500;
}
