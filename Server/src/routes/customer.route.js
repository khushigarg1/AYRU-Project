"use strict";
// routes/customerSideDataRoutes.ts
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
const CustomerSideData_controller_1 = require("../Controllers/CustomerSideData.controller");
function customerSideDataRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post("", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, CustomerSideData_controller_1.addCustomerSideData)(server, request, reply));
        server.get("", (request, reply) => (0, CustomerSideData_controller_1.getCustomerSideData)(server, request, reply));
        server.get("/:id", (request, reply) => (0, CustomerSideData_controller_1.getCustomerSideDataById)(server, request, reply));
        server.put("/:id", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, CustomerSideData_controller_1.updateCustomerSideData)(server, request, reply));
        server.delete("/:id", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, CustomerSideData_controller_1.deleteCustomerSideData)(server, request, reply));
        //--------------------upload media and all
        server.post("/upload", { onRequest: [server.authenticateAdmin] }, CustomerSideData_controller_1.uploadCustomerMedia);
        server.get("/media", CustomerSideData_controller_1.getallCustomerMedia);
        server.delete("/media/:id", { onRequest: [server.authenticateAdmin] }, CustomerSideData_controller_1.deleteCustomerMedia);
    });
}
exports.default = customerSideDataRoutes;
