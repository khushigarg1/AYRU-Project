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
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const sizechart_service_1 = require("../../Services/sizetype/sizechart.service");
const sizechartService = new sizechart_service_1.SizeChartService();
function createProduct(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const product = yield sizechartService.createProduct(request.body);
            reply.send({
                message: "Product created successfully",
                data: product,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.createProduct = createProduct;
function getAllProducts(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield sizechartService.getAllProducts();
            reply.send({
                message: "Products retrieved successfully",
                data: products,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.getAllProducts = getAllProducts;
function getProductById(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const product = yield sizechartService.getProductById(Number(id));
            reply.send({ data: product });
        }
        catch (error) {
            reply.code(404).send({ message: error.message });
        }
    });
}
exports.getProductById = getProductById;
function updateProduct(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const product = yield sizechartService.updateProduct(Number(id), request.body);
            reply.send({
                message: "Product updated successfully",
                data: product,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.updateProduct = updateProduct;
function deleteProduct(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            yield sizechartService.deleteProduct(Number(id));
            reply.send({
                message: "Product deleted successfully",
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.deleteProduct = deleteProduct;
