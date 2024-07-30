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
const color_controller_1 = require("../Controllers/color.controller");
function colorRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post("/", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, color_controller_1.addColor)(server, request, reply));
        server.get("/", (request, reply) => (0, color_controller_1.getColors)(server, request, reply));
        server.get("/:id", (request, reply) => (0, color_controller_1.getColorById)(server, request, reply));
        server.put("/:id", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, color_controller_1.updateColor)(server, request, reply));
        server.delete("/:id", { onRequest: [server.authenticateAdmin] }, (request, reply) => (0, color_controller_1.deleteColor)(server, request, reply));
    });
}
exports.default = colorRoutes;
