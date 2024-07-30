"use strict";
// services/sizeChartMediaService.ts
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
exports.deleteChartMedia = exports.getChartMedia = exports.uploadChartMedia = void 0;
const client_1 = require("@prisma/client");
const awsfunction_1 = require("../../../config/awsfunction");
const prisma = new client_1.PrismaClient();
const uploadChartMedia = (inventoryId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const image = data.image;
    if (!image.mimetype.startsWith("image")) {
        throw new Error("File is not an image");
    }
    const result = yield (0, awsfunction_1.uploadImageToS3)(image);
    if (!result.key) {
        throw new Error("Failed to upload image to S3");
    }
    yield prisma.sizeChartMedia.deleteMany({
        where: {
            inventoryId: inventoryId,
        },
    });
    const newMedia = yield prisma.sizeChartMedia.create({
        data: {
            url: result.key,
            inventoryId: inventoryId,
        },
    });
    return newMedia;
});
exports.uploadChartMedia = uploadChartMedia;
const getChartMedia = (inventoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const media = yield prisma.sizeChartMedia.findFirst({
        where: {
            inventoryId: inventoryId,
        },
    });
    if (!media) {
        throw new Error("No media found for the given inventoryId");
    }
    return media;
});
exports.getChartMedia = getChartMedia;
const deleteChartMedia = (inventoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const mediaToDelete = yield prisma.sizeChartMedia.findFirst({
        where: {
            inventoryId: inventoryId,
        },
    });
    if (!mediaToDelete) {
        throw new Error("Media not found");
    }
    yield prisma.sizeChartMedia.delete({
        where: {
            id: mediaToDelete.id,
        },
    });
    // Delete the image from S3
    yield (0, awsfunction_1.deleteImageFromS3)(mediaToDelete.url);
    return mediaToDelete;
});
exports.deleteChartMedia = deleteChartMedia;
