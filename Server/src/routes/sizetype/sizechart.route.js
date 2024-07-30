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
const sizechart_controller_1 = require("../../Controllers/SizeType/sizechart.controller");
function productRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post("/", { onRequest: [server.authenticateAdmin] }, sizechart_controller_1.createProduct);
        server.get("/", sizechart_controller_1.getAllProducts);
        server.get("/:id", sizechart_controller_1.getProductById);
        server.put("/:id", { onRequest: [server.authenticateAdmin] }, sizechart_controller_1.updateProduct);
        server.delete("/:id", { onRequest: [server.authenticateAdmin] }, sizechart_controller_1.deleteProduct);
    });
}
exports.default = productRoutes;
