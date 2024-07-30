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
const cart_controller_1 = require("../Controllers/cart.controller");
function CartRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post("/", { preHandler: [server.authenticateUser] }, cart_controller_1.addToCart);
        server.put("/:cartItemId", { preHandler: [server.authenticateUser] }, cart_controller_1.updateCart);
        server.delete("/:id", { preHandler: [server.authenticateUser] }, cart_controller_1.removeFromCart);
        server.get("/user", { preHandler: [server.authenticateUser] }, cart_controller_1.getCart);
        server.get("/", { preHandler: [server.authenticateAdmin] }, cart_controller_1.getAllCart);
    });
}
exports.default = CartRoutes;
