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
const category_controller_1 = require("../Controllers/category.controller");
function CategoryRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post("/category", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, category_controller_1.addCategory)(server, request, reply));
        server.get("/categories", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, category_controller_1.getCategories)(server, request, reply));
        server.get("/categories/visible", (request, reply) => (0, category_controller_1.getVisibleCategories)(server, request, reply));
        server.get("/category/:id", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, category_controller_1.getCategoryByid)(server, request, reply));
        server.put("/category/:id", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, category_controller_1.updateCategory)(server, request, reply));
        server.delete("/category/:id", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, category_controller_1.deleteCategory)(server, request, reply));
    });
}
exports.default = CategoryRoutes;
