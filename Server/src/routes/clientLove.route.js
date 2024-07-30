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
const clientLove_controller_1 = require("../Controllers/clientLove.controller");
function ClientLoveRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post("/clientLove", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, clientLove_controller_1.addClientLove)(server, request, reply));
        server.get("/clientLoves", (request, reply) => (0, clientLove_controller_1.getAllClientLoves)(request, reply));
        server.get("/clientLove/:id", (request, reply) => (0, clientLove_controller_1.getClientLoveById)(request, reply));
        server.put("/clientLove/:id", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, clientLove_controller_1.updateClientLove)(request, reply));
        server.delete("/clientLove/:id", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, clientLove_controller_1.deleteClientLove)(request, reply));
        // server.get("/images/:imageUrl", (request, reply) => getImage(request, reply));
    });
}
exports.default = ClientLoveRoutes;
