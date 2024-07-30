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
exports.deleteFitted = exports.updateFitted = exports.getFittedById = exports.getFitteds = exports.createFitted = void 0;
const fitted_service_1 = __importDefault(require("../../Services/sizetype/fitted.service"));
const errors_1 = require("../../errors");
const fittedService = new fitted_service_1.default();
const createFitted = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, dimensions } = request.body;
    try {
        const fitted = yield fittedService.createFitted({ name, dimensions });
        reply.send({ data: fitted });
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
exports.createFitted = createFitted;
const getFitteds = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fitteds = yield fittedService.getFitteds();
        reply.send({ data: fitteds });
    }
    catch (error) {
        reply.status(500).send({ error: "Internal Server Error" });
    }
});
exports.getFitteds = getFitteds;
const getFittedById = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    try {
        const fitted = yield fittedService.getFittedById(Number(id));
        reply.send({ data: fitted });
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
exports.getFittedById = getFittedById;
const updateFitted = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const { name, dimensions } = request.body;
    try {
        const fitted = yield fittedService.updateFitted(Number(id), {
            name,
            dimensions,
        });
        reply.send({ data: fitted });
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
exports.updateFitted = updateFitted;
const deleteFitted = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    try {
        const fitted = yield fittedService.deleteFitted(Number(id));
        reply.send({ message: "Fitted deleted successfully", data: fitted });
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
exports.deleteFitted = deleteFitted;
