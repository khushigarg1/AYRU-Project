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
exports.deleteSubCategory = exports.updateSubCategory = exports.getSubCategoryById = exports.getSubCategories = exports.addSubCategory = void 0;
const subCategory_service_1 = require("../Services/subCategory.service");
const subCategoryService = new subCategory_service_1.SubCategoryService();
function addSubCategory(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const subCategory = yield subCategoryService.addSubCategory(request.body);
            reply.send({
                message: "SubCategory created successfully",
                data: subCategory,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.addSubCategory = addSubCategory;
function getSubCategories(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const subCategories = yield subCategoryService.getSubCategories();
            reply.send({
                message: "SubCategories retrieved successfully",
                data: subCategories,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.getSubCategories = getSubCategories;
function getSubCategoryById(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const subCategory = yield subCategoryService.getSubCategoryById(Number(id));
            reply.send({ data: subCategory });
        }
        catch (error) {
            reply.code(404).send({ message: error.message });
        }
    });
}
exports.getSubCategoryById = getSubCategoryById;
function updateSubCategory(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const subCategory = yield subCategoryService.updateSubCategory(Number(id), request.body);
            reply.send({
                message: "SubCategory updated successfully",
                data: subCategory,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.updateSubCategory = updateSubCategory;
function deleteSubCategory(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const subCategory = yield subCategoryService.deleteSubCategory(Number(id));
            reply.send({
                message: "SubCategory deleted successfully",
                data: subCategory,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.deleteSubCategory = deleteSubCategory;
