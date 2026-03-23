using TypeSpec.Http;
using TypeSpec.Rest;

namespace MiniGalleryService;

model UploadAsset {
  path: string;
  contentType: string;
  url: string;
}

model UploadResult {
  folder: string;
  original: UploadAsset;
  webp: UploadAsset;
}

model UploadImageRequest {
  folder: HttpPart<string>;
  file: HttpPart<File>;
}
