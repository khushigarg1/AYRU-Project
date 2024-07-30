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
exports.CustomerSideDataService = void 0;
const client_1 = require("@prisma/client");
const awsfunction_1 = require("../../config/awsfunction");
const errors_1 = require("../errors");
const prisma = new client_1.PrismaClient();
class CustomerSideDataService {
    addCustomerSideData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.customerSideData.create({
                data,
            });
        });
    }
    getCustomerSideData() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.customerSideData.findMany({
                orderBy: {
                    updatedAt: "desc",
                },
            });
        });
    }
    getCustomerSideDataById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.customerSideData.findUnique({
                where: { id },
            });
        });
    }
    updateCustomerSideData(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.customerSideData.update({
                where: { id },
                data,
            });
        });
    }
    deleteCustomerSideData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.customerSideData.delete({
                where: { id },
            });
        });
    }
    /*---------------------------medias--------------------*/
    uploadCustomerMedia(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let imageUploadPromises = [];
                let videoUploadPromises = [];
                const type = data.type;
                if (Array.isArray(data.images)) {
                    imageUploadPromises = data.images
                        .filter((file) => file.mimetype.startsWith("image"))
                        .map((image) => (0, awsfunction_1.uploadImageToS3)(image));
                    videoUploadPromises = data.images
                        .filter((file) => file.mimetype.startsWith("video"))
                        .map((video) => (0, awsfunction_1.uploadVideoToS3)(video));
                }
                else if (data.images && data.images.mimetype.startsWith("image")) {
                    imageUploadPromises.push((0, awsfunction_1.uploadImageToS3)(data.images));
                }
                else if (data.images && data.images.mimetype.startsWith("video")) {
                    videoUploadPromises.push((0, awsfunction_1.uploadVideoToS3)(data.images));
                }
                const [imageResults, videoResults] = yield Promise.all([
                    Promise.all(imageUploadPromises),
                    Promise.all(videoUploadPromises),
                ]);
                const allResults = [...imageResults, ...videoResults];
                const mediaCreatePromises = allResults.map((result) => {
                    const url = result === null || result === void 0 ? void 0 : result.key;
                    return prisma.customerSideImage.create({
                        data: {
                            imageUrl: url,
                            type,
                        },
                    });
                });
                const mediaEntries = yield Promise.all(mediaCreatePromises);
                return mediaEntries;
            }
            catch (error) {
                console.error("Error in uploadCustomerMedia:", error);
                throw new Error("Failed to process media upload: " + error);
            }
        });
    }
    getallCustomerMedia(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const media = yield prisma.customerSideImage.findMany({
                where: {
                    type: type,
                },
                orderBy: {
                    updatedAt: "desc",
                },
            });
            return media;
        });
    }
    deleteCustomerMedia(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const mediaToDelete = yield prisma.customerSideImage.findFirst({
                where: {
                    id,
                },
            });
            if (!mediaToDelete) {
                throw new errors_1.ApiBadRequestError("Media not found");
            }
            const deletedMedia = yield prisma.customerSideImage.delete({
                where: {
                    id: mediaToDelete.id,
                },
            });
            yield (0, awsfunction_1.deleteImageFromS3)(deletedMedia.imageUrl);
            return deletedMedia;
        });
    }
}
exports.CustomerSideDataService = CustomerSideDataService;
