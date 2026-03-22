import "@typespec/http";
import "@typespec/rest";
// models
import "./models/common.tsp";
import "./models/user.tsp";
import "./models/project.tsp";
import "./models/category.tsp";
// services
import "./services/user.tsp";
import "./services/project.tsp";
import "./services/category.tsp";
@service(#{ title: "Mini Gallery Service" })
namespace MiniGalleryService;
