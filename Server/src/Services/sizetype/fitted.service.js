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
class FittedService {
    createFitted(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.name || data.name.trim() === "") {
                throw new errors_1.ApiBadRequestError("Name is required and cannot be empty");
            }
            const existingFitted = yield prisma.fitted.findUnique({
                where: { name: data.name },
            });
            if (existingFitted) {
                throw new errors_1.ApiBadRequestError(`Fitted with name ${data.name} already exists`);
            }
            return prisma.fitted.create({
                data: {
                    name: data.name,
                    // FittedDimensions: {
                    //   create:
                    //     data.dimensions?.map((dimension) => ({ dimensions: dimension })) ||
                    //     [],
                    // },
                },
                // include: { FittedDimensions: true },
            });
        });
    }
    getFitteds() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.fitted.findMany({
                // include: { FittedDimensions: true },
                orderBy: {
                    updatedAt: "desc",
                },
            });
        });
    }
    getFittedById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const fitted = yield prisma.fitted.findUnique({
                where: { id },
                // include: { FittedDimensions: true },
            });
            if (!fitted) {
                throw new errors_1.ApiBadRequestError(`Fitted with id ${id} not found`);
            }
            return fitted;
        });
    }
    updateFitted(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.name || data.name.trim() === "") {
                throw new errors_1.ApiBadRequestError("Name is required and cannot be empty");
            }
            const existingFitted = yield prisma.fitted.findUnique({
                where: { name: data.name },
            });
            if (existingFitted && existingFitted.id !== id) {
                throw new errors_1.ApiBadRequestError(`Fitted with name ${data.name} already exists`);
            }
            // await prisma.fittedDimensions.deleteMany({
            //   where: { fittedId: id },
            // });
            return prisma.fitted.update({
                where: { id },
                data: {
                    name: data.name,
                    // FittedDimensions: {
                    //   create:
                    //     data.dimensions?.map((dimension) => ({ dimensions: dimension })) ||
                    //     [],
                    // },
                },
                // include: { FittedDimensions: true },
            });
        });
    }
    deleteFitted(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // await prisma.fittedDimensions.deleteMany({
            //   where: { fittedId: id },
            // });
            return prisma.fitted.delete({
                where: { id },
            });
        });
    }
}
exports.default = FittedService;
