import { FastifyInstance } from "fastify";
import {
  createInventory,
  getInventories,
  getInventoryById,
  getAdminInventories,
  getAdminInventoryById,
  updateInventory,
  deleteInventory,
  uploadMedia,
  getallMedia,
  deleteMedia,
  getInventoriesByCategory,
  searchInventory,
  filterInventory,
  filterSaleItem,
} from "../Controllers/Inventory/inventory.controller";
import {
  handleUploadChartMedia,
  handleDeleteChartMedia,
  handleGetChartMedia,
} from "../Controllers/Inventory/sizechartmedia.controller";

export default async function inventoryRoutes(server: FastifyInstance) {
  server.post("/", { onRequest: [server.authenticateAdmin] }, createInventory);
  server.get("/", getInventories);
  server.get("/:id", getInventoryById);
  server.get(
    "/all",
    { onRequest: [server.authenticateAdmin] },
    getAdminInventories
  );
  server.get(
    "/admin/:id",
    { onRequest: [server.authenticateAdmin] },
    getAdminInventoryById
  );
  server.get("/category", getInventoriesByCategory);
  server.put(
    "/:id",
    { onRequest: [server.authenticateAdmin] },
    updateInventory
  );
  server.delete(
    "/:id",
    { onRequest: [server.authenticateAdmin] },
    deleteInventory
  );
  server.post(
    "/upload/:id",
    { onRequest: [server.authenticateAdmin] },
    uploadMedia
  );
  server.get("/media/:id", getallMedia);
  server.delete(
    "/media/:id",
    { onRequest: [server.authenticateAdmin] },
    deleteMedia
  );
  /*-----------------size chart media-------------*/
  server.post(
    "/chart/upload/:id",
    { onRequest: [server.authenticateAdmin] },
    handleUploadChartMedia
  );
  server.get("/chart/:id", handleGetChartMedia);
  server.delete(
    "/chart/:id",
    { onRequest: [server.authenticateAdmin] },
    handleDeleteChartMedia
  );

  //------------------------------------FOR SEARCHIGN AND FILTERING------------------------------
  server.get("/search", searchInventory);
  server.get("/filter", filterInventory);
  server.get("/sale", filterSaleItem);
}
