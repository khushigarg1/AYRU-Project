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
const order_controller_1 = require("../Controllers/order.controller");
function orderRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post("/webhook", order_controller_1.razorPayWebhook);
        server.post("/", (request, reply) => {
            (0, order_controller_1.createOrder)(server, request, reply);
        });
        server.get("/", { preHandler: [server.authenticateUser] }, order_controller_1.getOrder);
        server.get("/:id", { preHandler: [server.authenticateUser] }, order_controller_1.getOrderbyId);
        server.get("/admin/:id", { preHandler: [server.authenticateAdmin] }, order_controller_1.getOrderbyAdminId);
        server.get("/all", { onRequest: [server.authenticateAdmin] }, order_controller_1.getOrders);
        server.put("/:id", order_controller_1.updateOrder);
        server.delete("/:id", { onRequest: [server.authenticateAdmin] }, order_controller_1.deleteOrder);
    });
}
exports.default = orderRoutes;
