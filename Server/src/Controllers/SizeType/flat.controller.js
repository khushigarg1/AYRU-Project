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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFlat = exports.updateFlat = exports.getFlatById = exports.getFlats = exports.createFlat = void 0;
const flat_service_1 = __importDefault(require("../../Services/sizetype/flat.service"));
const errors_1 = require("../../errors");
const flatService = new flat_service_1.default();
const createFlat = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, size } = request.body;
    try {
        const flat = yield flatService.createFlat({ name, size });
        reply.send({ data: flat });
    }
    catch (error) {
        if (error instanceof errors_1.ApiBadRequestError) {
            reply.status(400).send({ error: error.message });
        }
        else {
            reply.status(500).send({ error: "Internal Server Error" });
        }
    }
});
exports.createFlat = createFlat;
const getFlats = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const flats = yield flatService.getFlats();
        reply.send({ data: flats });
    }
    catch (error) {
        reply.status(500).send({ error: "Internal Server Error" });
    }
});
exports.getFlats = getFlats;
const getFlatById = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    try {
        const flat = yield flatService.getFlatById(Number(id));
        reply.send({ data: flat });
    }
    catch (error) {
        if (error instanceof errors_1.ApiBadRequestError) {
            reply.status(404).send({ error: error.message });
        }
        else {
            reply.status(500).send({ error: "Internal Server Error" });
        }
    }
});
exports.getFlatById = getFlatById;
const updateFlat = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const { name, size } = request.body;
    try {
        const flat = yield flatService.updateFlat(Number(id), { name, size });
        reply.send({ data: flat });
    }
    catch (error) {
        if (error instanceof errors_1.ApiBadRequestError) {
            reply.status(400).send({ error: error.message });
        }
        else {
            reply.status(500).send({ error: "Internal Server Error" });
        }
    }
});
exports.updateFlat = updateFlat;
const deleteFlat = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    try {
        const flat = yield flatService.deleteFlat(Number(id));
        reply.send({ message: "Flat deleted successfully", data: flat });
    }
    catch (error) {
        if (error instanceof errors_1.ApiBadRequestError) {
            reply.status(404).send({ error: error.message });
        }
        else {
            reply.status(500).send({ error: "Internal Server Error" });
        }
    }
});
exports.deleteFlat = deleteFlat;
