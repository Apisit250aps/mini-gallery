using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniGalleryService;

@route("/projects")
@tag("Projects")
interface ProjectsService {
  @get getProjects(): ApiResponse<Project[]> | ErrorResponse500;

  @post createProject(
    @body body: ProjectCreateRequest,
  ): ApiResponse<Project> | ErrorResponse400 | ErrorResponse500;

  @patch @route("/sort") sortProjects(
    @body body: ProjectSortRequest,
  ): ApiResponse<Project[]> | ErrorResponse400 | ErrorResponse500;

  @put updateProject(@path id: string, @body body: ProjectUpdateRequest):
    | ApiResponse<Project>
    | ErrorResponse400
    | ErrorResponse404
    | ErrorResponse500;

  @delete deleteProject(
    @path id: string,
  ): ApiResponse<EmptyData> | ErrorResponse404 | ErrorResponse500;
}
