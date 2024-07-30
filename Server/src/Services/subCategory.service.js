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
exports.SubCategoryService = void 0;
const client_1 = require("@prisma/client");
const errors_1 = require("../errors");
const prisma = new client_1.PrismaClient();
class SubCategoryService {
    addSubCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { subcategoryName, categoryId, description, icon, visible } = data;
            const existingCategory = yield prisma.category.findUnique({
                where: { id: categoryId },
            });
            if (!existingCategory) {
                throw new errors_1.ApiBadRequestError("Please create category first");
            }
            if (!subcategoryName || !categoryId) {
                throw new errors_1.ApiBadRequestError("Please provide subcategory name and category ID");
            }
            const subCategory = yield prisma.subCategory.create({
                data: { subcategoryName, categoryId, description, icon, visible },
            });
            return subCategory;
        });
    }
    getSubCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const subCategories = yield prisma.subCategory.findMany({
                include: { category: true, InventorySubcategory: true },
                orderBy: {
                    updatedAt: "desc",
                },
            });
            return subCategories;
        });
    }
    getSubCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const subCategory = yield prisma.subCategory.findUnique({
                where: { id },
                include: { category: true, InventorySubcategory: true },
            });
            if (!subCategory) {
                throw new errors_1.ApiBadRequestError("Error: SubCategory not found.");
            }
            return subCategory;
        });
    }
    updateSubCategory(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existSubCategory = yield prisma.subCategory.findFirst({
                where: { id },
            });
            if (!existSubCategory) {
                throw new errors_1.ApiBadRequestError("SubCategory not present, please create subcategory first");
            }
            const { subcategoryName, categoryId, description, icon, visible } = data;
            const subCategory = yield prisma.subCategory.update({
                where: { id },
                data: { subcategoryName, categoryId, description, icon, visible },
            });
            return subCategory;
        });
    }
    deleteSubCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const subCategory = yield prisma.subCategory.delete({
                where: { id },
            });
            return subCategory;
        });
    }
}
exports.SubCategoryService = SubCategoryService;
