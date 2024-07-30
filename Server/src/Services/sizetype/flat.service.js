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
const client_1 = require("@prisma/client");
const errors_1 = require("../../errors");
const prisma = new client_1.PrismaClient();
class FlatService {
    createFlat(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.name ||
                !data.size ||
                data.name.trim() === "" ||
                data.size.trim() === "") {
                throw new errors_1.ApiBadRequestError("Name and size are required and cannot be empty");
            }
            const existingFlat = yield prisma.flat.findUnique({
                where: { name: data.name },
            });
            if (existingFlat) {
                throw new errors_1.ApiBadRequestError(`Flat with name ${data.name} already exists`);
            }
            return prisma.flat.create({ data });
        });
    }
    getFlats() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.flat.findMany({
                orderBy: {
                    updatedAt: "desc",
                },
            });
        });
    }
    getFlatById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const flat = yield prisma.flat.findUnique({
                where: { id },
            });
            if (!flat) {
                throw new errors_1.ApiBadRequestError(`Flat with id ${id} not found`);
            }
            return flat;
        });
    }
    updateFlat(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.name ||
                !data.size ||
                data.name.trim() === "" ||
                data.size.trim() === "") {
                throw new errors_1.ApiBadRequestError("Name and size are required and cannot be empty");
            }
            const existingFlat = yield prisma.flat.findUnique({
                where: { name: data.name },
            });
            if (existingFlat && existingFlat.id !== id) {
                throw new errors_1.ApiBadRequestError(`Flat with name ${data.name} already exists`);
            }
            const flat = yield prisma.flat.update({
                where: { id },
                data,
            });
            if (!flat) {
                throw new errors_1.ApiBadRequestError(`Flat with id ${id} not found`);
            }
            return flat;
        });
    }
    deleteFlat(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const flat = yield prisma.flat.delete({
                where: { id },
            });
            if (!flat) {
                throw new errors_1.ApiBadRequestError(`Flat with id ${id} not found`);
            }
            return flat;
        });
    }
}
exports.default = FlatService;
