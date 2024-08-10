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
const Dashboard_controller_1 = require("../Controllers/Dashboard.controller");
function DashboardRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.get("", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, Dashboard_controller_1.getAllDashboardData)(request, reply));
    });
}
exports.default = DashboardRoutes;
