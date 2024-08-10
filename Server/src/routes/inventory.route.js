"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inventory_controller_1 = require("../Controllers/Inventory/inventory.controller");
const sizechartmedia_controller_1 = require("../Controllers/Inventory/sizechartmedia.controller");
function inventoryRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post("/", { onRequest: [server.authenticateAdmin] }, inventory_controller_1.createInventory);
        server.get("/", inventory_controller_1.getInventories);
        server.get("/:id", inventory_controller_1.getInventoryById);
        server.get("/all", { onRequest: [server.authenticateAdmin] }, inventory_controller_1.getAdminInventories);
        server.get("/admin/:id", { onRequest: [server.authenticateAdmin] }, inventory_controller_1.getAdminInventoryById);
        server.get("/category", inventory_controller_1.getInventoriesByCategory);
        server.put("/:id", { onRequest: [server.authenticateAdmin] }, inventory_controller_1.updateInventory);
        server.delete("/:id", { onRequest: [server.authenticateAdmin] }, inventory_controller_1.deleteInventory);
        server.post("/upload/:id", { onRequest: [server.authenticateAdmin] }, inventory_controller_1.uploadMedia);
        server.get("/media/:id", inventory_controller_1.getallMedia);
        server.delete("/media/:id", { onRequest: [server.authenticateAdmin] }, inventory_controller_1.deleteMedia);
        /*-----------------size chart media-------------*/
        server.post("/chart/upload/:id", { onRequest: [server.authenticateAdmin] }, sizechartmedia_controller_1.handleUploadChartMedia);
        server.get("/chart/:id", sizechartmedia_controller_1.handleGetChartMedia);
        server.delete("/chart/:id", { onRequest: [server.authenticateAdmin] }, sizechartmedia_controller_1.handleDeleteChartMedia);
        //------------------------------------FOR SEARCHIGN AND FILTERING------------------------------
        server.get("/search", inventory_controller_1.searchInventory);
        server.get("/filter", inventory_controller_1.filterInventory);
        server.get("/sale", inventory_controller_1.filterSaleItem);
    });
}
exports.default = inventoryRoutes;
