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
const flat_controller_1 = require("../../Controllers/SizeType/flat.controller");
function flatRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post("/", { onRequest: [server.authenticateAdmin] }, flat_controller_1.createFlat);
        server.get("/", flat_controller_1.getFlats);
        server.get("/:id", flat_controller_1.getFlatById);
        server.put("/:id", { onRequest: [server.authenticateAdmin] }, flat_controller_1.updateFlat);
        server.delete("/:id", { onRequest: [server.authenticateAdmin] }, flat_controller_1.deleteFlat);
    });
}
exports.default = flatRoutes;
