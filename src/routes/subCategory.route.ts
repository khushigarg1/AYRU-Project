import { FastifyInstance } from "fastify";
import {
  addSubCategory,
  deleteSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
} from "../Controllers/subCategory.controller";

export default async function SubCategoryRoutes(server: FastifyInstance) {
  server.post(
    "/subcategory",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => addSubCategory(server, request, reply)
  );
  server.get("/subcategories", (request, reply) =>
    getSubCategories(server, request, reply)
  );
  server.get("/subcategory/:id", (request, reply) =>
    getSubCategoryById(server, request, reply)
  );
  server.put(
    "/subcategory/:id",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => updateSubCategory(server, request, reply)
  );
  server.delete(
    "/subcategory/:id",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => deleteSubCategory(server, request, reply)
  );
}
