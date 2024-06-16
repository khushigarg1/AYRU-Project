import { FastifyInstance } from "fastify";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategoryByid,
  getVisibleCategories,
  updateCategory,
} from "../Controllers/category.controller";

export default async function CategoryRoutes(server: FastifyInstance) {
  server.post(
    "/category",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => addCategory(server, request, reply)
  );
  server.get("/categories", (request, reply) =>
    getCategories(server, request, reply)
  );
  server.get("/categories/visible", (request, reply) =>
    getVisibleCategories(server, request, reply)
  );
  server.get("/category/:id", (request, reply) =>
    getCategoryByid(server, request, reply)
  );
  server.put(
    "/category/:id",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => updateCategory(server, request, reply)
  );
  server.delete(
    "/category/:id",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => deleteCategory(server, request, reply)
  );
}
