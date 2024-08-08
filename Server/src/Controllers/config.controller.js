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
exports.updateConfig = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function updateConfig(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { masterpayment } = request.body;
        try {
            let config;
            const existingConfig = yield prisma.config.findUnique({
                where: { id: 1 },
            });
            if (existingConfig) {
                config = yield prisma.config.update({
                    where: { id: 1 },
                    data: { masterpayment },
                });
            }
            else {
                config = yield prisma.config.create({
                    data: {
                        id: 1,
                        masterpayment,
                    },
                });
            }
            return reply.status(200).send(config);
        }
        catch (error) {
            console.error("Error updating or creating config:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
exports.updateConfig = updateConfig;
