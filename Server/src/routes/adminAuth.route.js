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
const adminAuth_controller_1 = require("../Controllers/adminAuth.controller");
function AdminAuthRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post("/signup", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, adminAuth_controller_1.adminSignup)(server, request, reply));
        server.put("/editdetail", { onRequest: [server.authenticateAdmin] }, (request, reply) => {
            (0, adminAuth_controller_1.editAdminDetails)(server, request, reply);
        });
        server.post("/login", (request, reply) => (0, adminAuth_controller_1.adminLogin)(server, request, reply));
        server.put("/change-password", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, adminAuth_controller_1.changeAdminPasswordHandler)(server, request, reply));
        server.get("/", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, adminAuth_controller_1.getAllAdmins)(server, request, reply));
        server.get("/:id", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, adminAuth_controller_1.getAdmin)(server, request, reply));
        server.get("/me", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, adminAuth_controller_1.getFirstAdmin)(server, request, reply));
    });
}
exports.default = AdminAuthRoutes;
