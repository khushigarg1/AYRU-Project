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
exports.ColorService = void 0;
const client_1 = require("@prisma/client");
const errors_1 = require("../errors");
const prisma = new client_1.PrismaClient();
class ColorService {
    addColor(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, colorCode } = data;
            if (!name || !colorCode) {
                throw new errors_1.ApiBadRequestError("Please provide name and color code");
            }
            // Assuming category association needs to be checked, modify this section accordingly
            const color = yield prisma.color.create({
                data: { name, colorCode },
            });
            return color;
        });
    }
    getColors() {
        return __awaiter(this, void 0, void 0, function* () {
            const colors = yield prisma.color.findMany({
                orderBy: {
                    updatedAt: "desc",
                },
            });
            return colors;
        });
    }
    getColorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const color = yield prisma.color.findUnique({
                where: { id },
            });
            if (!color) {
                throw new errors_1.ApiBadRequestError("Color not found.");
            }
            return color;
        });
    }
    updateColor(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existColor = yield prisma.color.findUnique({
                where: { id },
            });
            if (!existColor) {
                throw new errors_1.ApiBadRequestError("Color not found.");
            }
            const { name, colorCode } = data;
            const updatedColor = yield prisma.color.update({
                where: { id },
                data: { name, colorCode },
            });
            return updatedColor;
        });
    }
    deleteColor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const color = yield prisma.color.delete({
                where: { id },
            });
            return color;
        });
    }
}
exports.ColorService = ColorService;
