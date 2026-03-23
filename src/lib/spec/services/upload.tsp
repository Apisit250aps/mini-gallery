using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniGalleryService;

@route("/upload")
@tag("Upload")
interface UploadService {
  @post
  @route("/image")
  uploadImage(
    @header contentType: "multipart/form-data",
    @multipartBody body: UploadImageRequest,
  ): ApiResponse<UploadResult> | ErrorResponse400 | ErrorResponse500;
}
