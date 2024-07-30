"use strict";
// controllers/sizeChartMediaController.ts
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
exports.handleDeleteChartMedia = exports.handleGetChartMedia = exports.handleUploadChartMedia = void 0;
const sizechartmedia_services_1 = require("../../Services/Inventory/sizechartmedia.services");
const handleUploadChartMedia = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        const data = request.body;
        const newMedia = yield (0, sizechartmedia_services_1.uploadChartMedia)(Number(id), data);
        reply.send(newMedia);
    }
    catch (error) {
        reply.status(500).send({ error: error });
    }
});
exports.handleUploadChartMedia = handleUploadChartMedia;
const handleGetChartMedia = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        const media = yield (0, sizechartmedia_services_1.getChartMedia)(Number(id));
        reply.send(media);
    }
    catch (error) {
        reply.status(500).send({ error: error });
    }
});
exports.handleGetChartMedia = handleGetChartMedia;
const handleDeleteChartMedia = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        const media = yield (0, sizechartmedia_services_1.deleteChartMedia)(Number(id));
        reply.send(media);
    }
    catch (error) {
        reply.status(500).send({ error: error });
    }
});
exports.handleDeleteChartMedia = handleDeleteChartMedia;
