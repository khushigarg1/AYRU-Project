import { FastifyInstance } from "fastify";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../../Controllers/SizeType/sizechart.controller";

export default async function productRoutes(server: FastifyInstance) {
  server.post("/", { onRequest: [server.authenticateAdmin] }, createProduct);
  server.get("/", getAllProducts);
  server.get("/:id", getProductById);
  server.put("/:id", { onRequest: [server.authenticateAdmin] }, updateProduct);
  server.delete(
    "/:id",
    { onRequest: [server.authenticateAdmin] },
    deleteProduct
  );
}
