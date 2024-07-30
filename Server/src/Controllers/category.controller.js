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
exports.getVisibleCategories = exports.deleteCategory = exports.updateCategory = exports.getCategoryByid = exports.getCategories = exports.addCategory = void 0;
const category_service_1 = require("../Services/category.service");
const categoryService = new category_service_1.CategoryService();
function addCategory(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const category = yield categoryService.addCategory(request.body);
            reply.send({ message: "Category created successfully", data: category });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.addCategory = addCategory;
function getCategories(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categories = yield categoryService.getCategories();
            reply.send({
                message: "Categories retrieved successfully",
                data: categories,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.getCategories = getCategories;
function getCategoryByid(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const category = yield categoryService.getCategoryById(Number(id));
            reply.send({ data: category });
        }
        catch (error) {
            reply.code(404).send({ message: error.message });
        }
    });
}
exports.getCategoryByid = getCategoryByid;
function updateCategory(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const category = yield categoryService.updateCategory(Number(id), request.body);
            reply.send({ message: "Category updated successfully", data: category });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.updateCategory = updateCategory;
function deleteCategory(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const { cascade } = request.query;
            const category = yield categoryService.deleteCategory(Number(id), cascade);
            reply.send({
                message: "Category with all subcategories deleted successfully",
                data: category,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.deleteCategory = deleteCategory;
function getVisibleCategories(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const visibleCategories = yield categoryService.getVisibleCategories();
            reply.send({
                message: "Visible categories retrieved successfully",
                data: visibleCategories,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.getVisibleCategories = getVisibleCategories;
