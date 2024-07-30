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
const subCategory_controller_1 = require("../Controllers/subCategory.controller");
function SubCategoryRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post("/subcategory", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, subCategory_controller_1.addSubCategory)(server, request, reply));
        server.get("/subcategories", (request, reply) => (0, subCategory_controller_1.getSubCategories)(server, request, reply));
        server.get("/subcategory/:id", (request, reply) => (0, subCategory_controller_1.getSubCategoryById)(server, request, reply));
        server.put("/subcategory/:id", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, subCategory_controller_1.updateSubCategory)(server, request, reply));
        server.delete("/subcategory/:id", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, subCategory_controller_1.deleteSubCategory)(server, request, reply));
    });
}
exports.default = SubCategoryRoutes;
