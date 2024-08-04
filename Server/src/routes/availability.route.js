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
exports.availabilityRoutes = void 0;
const availability_controller_1 = require("../Controllers/availability.controller");
function availabilityRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post("/", { preHandler: [server.authenticateUser] }, availability_controller_1.createAvailabilityRequest);
        server.get("/:id", { preHandler: [server.authenticateUser] }, availability_controller_1.getAvailabilityCheck);
        server.get("/single/:id", { preHandler: [server.authenticateAdmin] }, availability_controller_1.getAvailability);
        server.get("/all", { preHandler: [server.authenticateAdmin] }, availability_controller_1.getAllAvailability);
        server.put("/:id", { preHandler: [server.authenticateAdmin] }, availability_controller_1.updateAvailabilityRequest);
        server.get("/check-expired", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            return (0, availability_controller_1.checkExpiredRequests)(request, reply);
        }));
    });
}
exports.availabilityRoutes = availabilityRoutes;
