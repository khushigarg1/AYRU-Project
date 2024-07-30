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
exports.deleteColor = exports.updateColor = exports.getColorById = exports.getColors = exports.addColor = void 0;
const color_service_1 = require("../Services/color.service");
const colorServiceInstance = new color_service_1.ColorService();
function addColor(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, colorCode } = request.body;
            const color = yield colorServiceInstance.addColor({
                name,
                colorCode,
            });
            reply.send({
                message: "Color created successfully",
                data: color,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.addColor = addColor;
function getColors(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const colors = yield colorServiceInstance.getColors();
            reply.send({
                message: "Colors retrieved successfully",
                data: colors,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.getColors = getColors;
function getColorById(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const color = yield colorServiceInstance.getColorById(Number(id));
            reply.send({ data: color });
        }
        catch (error) {
            reply.code(404).send({ message: error.message });
        }
    });
}
exports.getColorById = getColorById;
function updateColor(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const { name, colorCode } = request.body;
            const updatedColor = yield colorServiceInstance.updateColor(Number(id), {
                name,
                colorCode,
            });
            reply.send({
                message: "Color updated successfully",
                data: updatedColor,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.updateColor = updateColor;
function deleteColor(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const color = yield colorServiceInstance.deleteColor(Number(id));
            reply.send({
                message: "Color deleted successfully",
                data: color,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.deleteColor = deleteColor;
