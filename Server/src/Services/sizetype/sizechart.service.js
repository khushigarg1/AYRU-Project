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
exports.SizeChartService = void 0;
const client_1 = require("@prisma/client");
const errors_1 = require("../../errors");
const prisma = new client_1.PrismaClient();
class SizeChartService {
    createProduct(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, sizes } = data;
            if (!name || !sizes || sizes.length === 0) {
                throw new errors_1.ApiBadRequestError("Name and at least one size are required");
            }
            const sizechart = yield prisma.product.create({
                data: {
                    name,
                    sizes: {
                        createMany: {
                            data: sizes.map((size) => ({
                                name: size.name,
                                width: size.width,
                                height: size.height,
                            })),
                        },
                    },
                },
                include: { sizes: true },
            });
            return sizechart;
        });
    }
    getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.product.findMany({
                include: { sizes: true },
                orderBy: {
                    updatedAt: "desc",
                },
            });
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sizecharts = yield prisma.product.findUnique({
                where: { id },
                include: { sizes: true },
            });
            if (!sizecharts) {
                throw new errors_1.ApiBadRequestError(`SizeChart with id ${id} not found`);
            }
            return sizecharts;
        });
    }
    updateProduct(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, sizes } = data;
            yield prisma.sizeChart.deleteMany({
                where: { productId: id },
            });
            const updatedsizechart = yield prisma.product.update({
                where: { id },
                data: {
                    name,
                    sizes: {
                        createMany: {
                            data: sizes.map((size) => ({
                                name: size.name,
                                width: size.width,
                                height: size.height,
                            })),
                        },
                    },
                },
                include: { sizes: true },
            });
            return updatedsizechart;
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.sizeChart.deleteMany({
                where: { productId: id },
            });
            return yield prisma.product.delete({
                where: { id },
            });
        });
    }
}
exports.SizeChartService = SizeChartService;
