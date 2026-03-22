import "@typespec/http";
import "@typespec/rest";
// models
import "./models/common.tsp";
import "./models/user.tsp";
import "./models/project.tsp";

@service(#{ title: "Mini Gallery Service" })
namespace MiniGalleryService;
