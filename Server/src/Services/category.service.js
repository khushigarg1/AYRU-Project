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
exports.CategoryService = void 0;
const client_1 = require("@prisma/client");
const errors_1 = require("../errors");
const omitCostPrice_1 = require("../utils/omitCostPrice");
const prisma = new client_1.PrismaClient();
class CategoryService {
    addCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { categoryName, description, icon, visible } = data;
            if (!categoryName) {
                throw new errors_1.ApiBadRequestError("Please provide category name");
            }
            const category = yield prisma.category.create({
                data: { categoryName, description, icon, visible },
            });
            return category;
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield prisma.category.findMany({
                include: {
                    subcategories: true,
                    Inventory: {
                        include: {
                            InventoryFlat: { include: { Flat: true } },
                            customFittedInventory: {
                                include: { InventoryFlat: { include: { Flat: true } } },
                            },
                            InventoryFitted: {
                                include: {
                                    Fitted: true,
                                },
                            },
                            ColorVariations: { include: { Color: true } },
                            relatedInventories: true,
                            relatedByInventories: true,
                            Media: true,
                            SizeChartMedia: true,
                        },
                    },
                },
                orderBy: {
                    updatedAt: "desc",
                },
            });
            return categories;
            // const omitCategories = await omitCostPrice(categories);
            // return omitCategories;
        });
    }
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield prisma.category.findUnique({
                where: { id },
                include: { subcategories: true, Inventory: true },
            });
            if (!category) {
                throw new errors_1.ApiBadRequestError("Error: Category not found.");
            }
            return category;
            // const omitCategory = await omitCostPrice(category);
            // if (!omitCategory) {
            //   throw new ApiBadRequestError("Error: Category not found.");
            // }
            // return omitCategory;
        });
    }
    updateCategory(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existCategory = yield prisma.category.findFirst({
                where: { id },
            });
            if (!existCategory) {
                throw new errors_1.ApiBadRequestError("Category not present, please create category first");
            }
            const { categoryName, description, icon, visible } = data;
            const category = yield prisma.category.update({
                where: { id },
                data: { categoryName, description, icon, visible },
            });
            return category;
        });
    }
    deleteCategory(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, cascade = false) {
            const subcategories = yield prisma.subCategory.findMany({
                where: { categoryId: id },
                orderBy: {
                    updatedAt: "desc",
                },
            });
            if (subcategories.length > 0) {
                if (!cascade) {
                    throw new errors_1.ApiBadRequestError("Please delete subcategories related to this category first");
                }
                else {
                    yield prisma.subCategory.deleteMany({
                        where: { categoryId: id },
                    });
                }
            }
            const category = yield prisma.category.delete({
                where: { id },
            });
            return category;
        });
    }
    getVisibleCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const visibleCategories = yield prisma.category.findMany({
                where: { visible: true },
                include: {
                    subcategories: {
                        where: { visible: true },
                    },
                    Inventory: {
                        include: {
                            InventoryFlat: { include: { Flat: true } },
                            customFittedInventory: {
                                include: { InventoryFlat: { include: { Flat: true } } },
                            },
                            InventoryFitted: {
                                include: {
                                    Fitted: true,
                                },
                            },
                            // ProductInventory: {
                            //   include: {
                            //     product: {
                            //       include: { sizes: true },
                            //     },
                            //     selectedSizes: true,
                            //   },
                            // },
                            ColorVariations: { include: { Color: true } },
                            relatedInventories: true,
                            relatedByInventories: true,
                            Media: true,
                            SizeChartMedia: true,
                        },
                    },
                },
                orderBy: {
                    updatedAt: "desc",
                },
            });
            // return visibleCategories;
            const omitVisibleCategories = yield (0, omitCostPrice_1.omitCostPrice)(visibleCategories);
            return omitVisibleCategories;
        });
    }
}
exports.CategoryService = CategoryService;
