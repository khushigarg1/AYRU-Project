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
exports.deleteMedia = exports.getallMedia = exports.uploadMedia = void 0;
const client_1 = require("@prisma/client");
const inventory_service_1 = require("../../Services/Inventory/inventory.service");
const inventoryService = new inventory_service_1.InventoryService();
const prisma = new client_1.PrismaClient();
//------------------------------------------------MEdia controllers for images and video----------------------
const uploadMedia = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = request.body;
        const result = yield inventoryService.uploadMedias(data);
        reply.send({ message: "ClientLove created successfully", data: result });
    }
    catch (error) {
        reply.status(500).send({ error: "Failed to upload media", details: error });
    }
});
exports.uploadMedia = uploadMedia;
const getallMedia = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        const result = yield inventoryService.getallMedia(Number(id));
        reply.send({ message: "data fetched successfully", data: result });
    }
    catch (error) {
        reply.status(500).send({ error: "Failed to get media", details: error });
    }
});
exports.getallMedia = getallMedia;
const deleteMedia = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        const result = yield inventoryService.deleteMedia(Number(id));
        reply.send({ message: "deleted successfully", data: result });
    }
    catch (error) {
        reply.status(500).send({ error: "Failed to delete media", details: error });
    }
});
exports.deleteMedia = deleteMedia;
