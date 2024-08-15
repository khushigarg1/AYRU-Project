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
exports.InventoryService = void 0;
const client_1 = require("@prisma/client");
const awsfunction_1 = require("../../../config/awsfunction");
const errors_1 = require("../../errors");
const omitCostPrice_1 = require("../../utils/omitCostPrice");
const prisma = new client_1.PrismaClient();
class InventoryService {
    uploadMedias(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let imageUploadPromises = [];
                let videoUploadPromises = [];
                // Handle multiple images
                if (Array.isArray(data.images)) {
                    imageUploadPromises = data.images
                        .filter((file) => file.mimetype.startsWith("image"))
                        .map((image) => (0, awsfunction_1.uploadImageToS3)(image));
                    videoUploadPromises = data.images
                        .filter((file) => file.mimetype.startsWith("video"))
                        .map((video) => (0, awsfunction_1.uploadVideoToS3)(video));
                }
                // Handle single image
                else if (data.images && data.images.mimetype.startsWith("image")) {
                    imageUploadPromises.push((0, awsfunction_1.uploadImageToS3)(data.images));
                }
                // Handle single video
                else if (data.images && data.images.mimetype.startsWith("video")) {
                    videoUploadPromises.push((0, awsfunction_1.uploadVideoToS3)(data.images));
                }
                // Upload images and videos concurrently
                const [imageResults, videoResults] = yield Promise.all([
                    Promise.all(imageUploadPromises),
                    Promise.all(videoUploadPromises),
                ]);
                // Combine results of both image and video uploads
                const allResults = [...imageResults, ...videoResults];
                // Create media entries in the database
                const mediaCreatePromises = allResults.map((result, index) => {
                    var _a, _b;
                    const url = result === null || result === void 0 ? void 0 : result.key;
                    const isImage = Array.isArray(data.images)
                        ? index < (imageResults === null || imageResults === void 0 ? void 0 : imageResults.length)
                        : (_b = (_a = data.images) === null || _a === void 0 ? void 0 : _a.mimetype) === null || _b === void 0 ? void 0 : _b.startsWith("image");
                    return prisma.media.create({
                        data: {
                            url: url,
                            type: isImage ? "image" : "video",
                            inventoryId: Number(data.inventoryId),
                        },
                    });
                });
                // Execute all media creation promises
                const mediaEntries = yield Promise.all(mediaCreatePromises);
                return mediaEntries;
            }
            catch (error) {
                console.error("Error in uploadMedias:", error);
                throw new Error("Failed to process media upload: " + error);
            }
        });
    }
    getallMedia(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const media = yield prisma.media.findMany({
                where: {
                    inventoryId: id,
                },
                orderBy: {
                    updatedAt: "desc",
                },
            });
            return media;
        });
    }
    deleteMedia(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const mediaToDelete = yield prisma.media.findFirst({
                where: {
                    id,
                },
            });
            if (!mediaToDelete) {
                throw new errors_1.ApiBadRequestError("Media not found");
            }
            const deletedMedia = yield prisma.media.delete({
                where: {
                    id: mediaToDelete.id,
                },
            });
            // Delete the media from S3
            yield (0, awsfunction_1.deleteImageFromS3)(deletedMedia.url);
            return deletedMedia;
        });
    }
    deleteInventoryMedia(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mediaToDelete = yield prisma.media.findMany({
                    where: {
                        inventoryId: id,
                    },
                    orderBy: {
                        updatedAt: "desc",
                    },
                });
                if (mediaToDelete.length === 0) {
                    return [];
                }
                yield prisma.media.deleteMany({
                    where: {
                        inventoryId: id,
                    },
                });
                for (const media of mediaToDelete) {
                    yield (0, awsfunction_1.deleteImageFromS3)(media.url);
                }
                return mediaToDelete;
            }
            catch (error) {
                console.error("Error deleting media:", error);
                throw new Error("Failed to delete media");
            }
        });
    }
    deleteSizeChartMedia(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sizeChartMediaToDelete = yield prisma.sizeChartMedia.findMany({
                    where: {
                        inventoryId: id,
                    },
                    orderBy: {
                        updatedAt: "desc",
                    },
                });
                if (sizeChartMediaToDelete.length === 0) {
                    return [];
                }
                yield prisma.sizeChartMedia.deleteMany({
                    where: {
                        inventoryId: id,
                    },
                });
                for (const media of sizeChartMediaToDelete) {
                    yield (0, awsfunction_1.deleteImageFromS3)(media.url);
                }
                return sizeChartMediaToDelete;
            }
            catch (error) {
                console.error("Error deleting size chart media:", error);
                throw new Error("Failed to delete size chart media");
            }
        });
    }
    createInventory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data.productName || !data.skuId) {
                    throw new errors_1.ApiBadRequestError("Please fill all required fields!!");
                }
                const existingEntry = yield prisma.inventory.findFirst({
                    where: { skuId: data.skuId },
                });
                if (existingEntry) {
                    throw new errors_1.ApiBadRequestError("SKUID should be different, it already exists.");
                }
                const newInventory = yield prisma.inventory.create({
                    data: {
                        productName: data.productName,
                        skuId: data.skuId,
                        categoryId: data.categoryId,
                        status: "PENDING",
                        sellingPrice: data.sellingPrice,
                        quantity: data.quantity,
                        productstatus: (data === null || data === void 0 ? void 0 : data.productstatus) || "DRAFT",
                        soldQuantity: data.soldQuantity || 0,
                        availability: data.availability || true,
                        extraOptionOutOfStock: (data === null || data === void 0 ? void 0 : data.extraOptionOutOfStock) || false,
                        sale: (data === null || data === void 0 ? void 0 : data.sale) || false,
                    },
                });
                if (data.subCategoryIds && data.subCategoryIds.length > 0) {
                    const subCategoryData = data.subCategoryIds.map((subcategoryid) => ({
                        inventoryId: newInventory.id,
                        subcategoryid,
                    }));
                    yield prisma.inventorySubcategory.createMany({
                        data: subCategoryData,
                    });
                }
                return newInventory;
            }
            catch (error) {
                console.error("Error creating inventory:", error);
                throw error;
            }
        });
    }
    getInventories() {
        return __awaiter(this, void 0, void 0, function* () {
            const inventorydata = yield prisma.inventory.findMany({
                where: {
                    productstatus: "PUBLISHED",
                },
                include: {
                    customFittedInventory: {
                        include: { InventoryFlat: { include: { Flat: true } } },
                    },
                    InventoryFlat: { include: { Flat: true } },
                    InventorySubcategory: { include: { SubCategory: true } },
                    InventoryFitted: {
                        include: {
                            Fitted: true,
                        },
                    },
                    Category: true,
                    Wishlist: true,
                    // ProductInventory: {
                    //   include: {
                    //     product: {
                    //       include: { sizes: true },
                    //     },
                    //     selectedSizes: true,
                    //   },
                    // },
                    ColorVariations: { include: { Color: true } },
                    relatedInventories: {
                        include: {
                            Media: true,
                        },
                    },
                    relatedByInventories: {
                        include: {
                            Media: true,
                        },
                    },
                    Media: true,
                    SizeChartMedia: true,
                },
                orderBy: {
                    updatedAt: "desc",
                },
            });
            const inventory = yield (0, omitCostPrice_1.omitCostPrice)(inventorydata);
            return inventory;
        });
    }
    getInventoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new errors_1.ApiBadRequestError("Inventory id not found");
            }
            const existingentry = yield prisma.inventory.findFirst({
                where: { id },
            });
            if (!existingentry) {
                throw new errors_1.ApiBadRequestError("Inventory not found");
            }
            const inventorydata = yield prisma.inventory.findUnique({
                where: { id: Number(id) },
                include: {
                    InventoryFlat: { include: { Flat: true } },
                    customFittedInventory: {
                        include: { InventoryFlat: { include: { Flat: true } } },
                    },
                    InventorySubcategory: { include: { SubCategory: true } },
                    InventoryFitted: {
                        include: {
                            Fitted: true,
                        },
                    },
                    // ProductInventory: {
                    //   include: {
                    //     product: {
                    //       include: { sizes: true },
                    //     },
                    //     selectedSizes: true,
                    //   },
                    // },
                    Category: true,
                    Wishlist: true,
                    ColorVariations: { include: { Color: true } },
                    relatedInventories: {
                        include: {
                            Media: true,
                        },
                    },
                    relatedByInventories: {
                        include: {
                            Media: true,
                        },
                    },
                    Media: true,
                    SizeChartMedia: true,
                },
            });
            const inventory = yield (0, omitCostPrice_1.omitCostPrice)(inventorydata);
            return inventory;
        });
    }
    getAdminInventories() {
        return __awaiter(this, void 0, void 0, function* () {
            const inventory = yield prisma.inventory.findMany({
                include: {
                    customFittedInventory: {
                        include: { InventoryFlat: { include: { Flat: true } } },
                    },
                    InventoryFlat: { include: { Flat: true } },
                    InventorySubcategory: { include: { SubCategory: true } },
                    InventoryFitted: {
                        include: {
                            Fitted: true,
                        },
                    },
                    Category: true,
                    Wishlist: true,
                    // ProductInventory: {
                    //   include: {
                    //     product: {
                    //       include: { sizes: true },
                    //     },
                    //     selectedSizes: true,
                    //   },
                    // },
                    ColorVariations: { include: { Color: true } },
                    relatedInventories: {
                        include: {
                            Media: true,
                        },
                    },
                    relatedByInventories: {
                        include: {
                            Media: true,
                        },
                    },
                    Media: true,
                    SizeChartMedia: true,
                },
                orderBy: {
                    updatedAt: "desc",
                },
            });
            return inventory;
        });
    }
    getAdminInventoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new errors_1.ApiBadRequestError("Inventory id not found");
            }
            const existingentry = yield prisma.inventory.findFirst({
                where: { id },
            });
            if (!existingentry) {
                throw new errors_1.ApiBadRequestError("Inventory not found");
            }
            const inventory = yield prisma.inventory.findUnique({
                where: { id: Number(id) },
                include: {
                    InventoryFlat: { include: { Flat: true } },
                    customFittedInventory: {
                        include: { InventoryFlat: { include: { Flat: true } } },
                    },
                    InventorySubcategory: { include: { SubCategory: true } },
                    InventoryFitted: {
                        include: {
                            Fitted: true,
                        },
                    },
                    // ProductInventory: {
                    //   include: {
                    //     product: {
                    //       include: { sizes: true },
                    //     },
                    //     selectedSizes: true,
                    //   },
                    // },
                    Category: true,
                    Wishlist: true,
                    ColorVariations: { include: { Color: true } },
                    relatedInventories: {
                        include: {
                            Media: true,
                        },
                    },
                    relatedByInventories: {
                        include: {
                            Media: true,
                        },
                    },
                    Media: true,
                    SizeChartMedia: true,
                },
            });
            return inventory;
        });
    }
    updateInventory(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { productName, skuId, quantity, soldQuantity, minQuantity, maxQuantity, sellingPrice, costPrice, discountedPrice, availability, weight, itemWeight, productstatus, status, style, pattern, fabric, type, size, includedItems, itemDimensions, colorVariation, extraOptionOutOfStock, sale, specialFeatures, threadCount, origin, extraNote, disclaimer, description, careInstructions, categoryId, subCategoryIds, flatIds, fittedIds, customFittedIds, others, others1, colorIds, relatedInventoriesIds, } = data;
            const deleteManyOptions = { where: { inventoryId: id } };
            yield prisma.inventoryFitted.deleteMany(deleteManyOptions);
            yield prisma.inventoryFlat.deleteMany(deleteManyOptions);
            yield prisma.inventorySubcategory.deleteMany(deleteManyOptions);
            yield prisma.customFittedInventory.deleteMany(deleteManyOptions);
            yield prisma.colorVariation.deleteMany(deleteManyOptions);
            try {
                const updatedInventory = yield prisma.inventory.update({
                    where: { id },
                    data: {
                        productName,
                        skuId,
                        quantity,
                        soldQuantity,
                        minQuantity,
                        maxQuantity,
                        sellingPrice,
                        costPrice,
                        discountedPrice,
                        availability,
                        weight,
                        itemWeight,
                        productstatus,
                        status,
                        style,
                        pattern,
                        fabric,
                        type,
                        size,
                        includedItems,
                        itemDimensions,
                        colorVariation,
                        extraOptionOutOfStock,
                        sale,
                        specialFeatures,
                        threadCount,
                        origin,
                        extraNote,
                        description,
                        disclaimer,
                        careInstructions,
                        categoryId,
                        others,
                        others1,
                        InventorySubcategory: {
                            create: (subCategoryIds === null || subCategoryIds === void 0 ? void 0 : subCategoryIds.map((subcategoryid) => ({ subcategoryid }))) || [],
                        },
                        InventoryFlat: {
                            create: (flatIds === null || flatIds === void 0 ? void 0 : flatIds.map((flat) => ({
                                Flat: {
                                    connect: { id: flat.id },
                                },
                                quantity: flat.quantity,
                                soldQuantity: flat.soldQuantity,
                                minQuantity: flat.minQuantity,
                                maxQuantity: flat.maxQuantity,
                                sellingPrice: flat.sellingPrice,
                                costPrice: flat.costPrice,
                                discountedPrice: flat.discountedPrice,
                            }))) || [],
                        },
                        InventoryFitted: {
                            create: (fittedIds === null || fittedIds === void 0 ? void 0 : fittedIds.map((fitted) => ({
                                Fitted: {
                                    connect: { id: fitted.id },
                                },
                                quantity: fitted.quantity,
                                soldQuantity: fitted.soldQuantity,
                                minQuantity: fitted.minQuantity,
                                maxQuantity: fitted.maxQuantity,
                                sellingPrice: fitted.sellingPrice,
                                costPrice: fitted.costPrice,
                                discountedPrice: fitted.discountedPrice,
                            }))) || [],
                        },
                        // customFittedInventory: {
                        //   create:
                        //     customFittedIds?.map((customFitted) => ({
                        //       sellingPrice: customFitted.sellingPrice,
                        //       costPrice: customFitted.costPrice,
                        //       discountedPrice: customFitted.discountedPrice,
                        //       InventoryFlat: { connect: { id: customFitted?.id } },
                        //     })) || [],
                        // },
                        ColorVariations: {
                            create: (colorIds === null || colorIds === void 0 ? void 0 : colorIds.map((colorId) => ({
                                Color: {
                                    connect: { id: colorId },
                                },
                            }))) || [],
                        },
                        relatedInventories: {
                            set: (relatedInventoriesIds === null || relatedInventoriesIds === void 0 ? void 0 : relatedInventoriesIds.map((relatedId) => ({ id: relatedId }))) ||
                                [],
                        },
                    },
                    include: {
                        InventoryFlat: { include: { Flat: true } },
                        InventorySubcategory: { include: { SubCategory: true } },
                        customFittedInventory: {
                            include: { InventoryFlat: { include: { Flat: true } } },
                        },
                        InventoryFitted: {
                            include: {
                                Fitted: true,
                            },
                        },
                        Category: true,
                        Wishlist: true,
                        ColorVariations: { include: { Color: true } },
                        relatedInventories: { include: { Media: true } },
                        relatedByInventories: { include: { Media: true } },
                        Media: true,
                    },
                });
                const inventoryFlats = yield prisma.inventoryFlat.findMany({
                    where: {
                        inventoryId: id,
                    },
                    select: {
                        id: true,
                        sellingPrice: true,
                        costPrice: true,
                        discountedPrice: true,
                    },
                });
                const inventoryFlatIds = inventoryFlats.map((inventoryFlat) => inventoryFlat.id);
                let inventory = null;
                if (customFittedIds &&
                    (((_a = customFittedIds[0]) === null || _a === void 0 ? void 0 : _a.sellingPrice) ||
                        ((_b = customFittedIds[0]) === null || _b === void 0 ? void 0 : _b.costPrice) ||
                        ((_c = customFittedIds[0]) === null || _c === void 0 ? void 0 : _c.discountedPrice))) {
                    // const customFittedInventoryData = inventoryFlats.map(
                    //   (inventoryFlat) => ({
                    //     sellingPrice:
                    //       (inventoryFlat?.sellingPrice ?? 0) +
                    //       (customFittedIds[0]?.sellingPrice ?? 0),
                    //     costPrice:
                    //       (inventoryFlat?.costPrice ?? 0) +
                    //       (customFittedIds[0]?.costPrice ?? 0),
                    //     discountedPrice:
                    //       inventoryFlat?.discountedPrice &&
                    //       inventoryFlat.discountedPrice !== 0
                    //         ? inventoryFlat.discountedPrice +
                    //           (customFittedIds[0]?.sellingPrice ?? 0)
                    //         : inventoryFlat.discountedPrice ?? 0,
                    //     inventoryId: updatedInventory?.id,
                    //     inventoryFlatId: inventoryFlat?.id,
                    //   })
                    // );
                    const customFittedInventoryData = inventoryFlats.map((inventoryFlat) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
                        const newSellingPrice = ((_a = inventoryFlat === null || inventoryFlat === void 0 ? void 0 : inventoryFlat.sellingPrice) !== null && _a !== void 0 ? _a : 0) <
                            ((_b = customFittedIds[0]) === null || _b === void 0 ? void 0 : _b.sellingPrice)
                            ? (_c = customFittedIds[0]) === null || _c === void 0 ? void 0 : _c.sellingPrice
                            : ((_d = inventoryFlat === null || inventoryFlat === void 0 ? void 0 : inventoryFlat.sellingPrice) !== null && _d !== void 0 ? _d : 0) +
                                ((_f = (_e = customFittedIds[0]) === null || _e === void 0 ? void 0 : _e.sellingPrice) !== null && _f !== void 0 ? _f : 0);
                        const newCostPrice = ((_g = inventoryFlat === null || inventoryFlat === void 0 ? void 0 : inventoryFlat.costPrice) !== null && _g !== void 0 ? _g : 0) < ((_h = customFittedIds[0]) === null || _h === void 0 ? void 0 : _h.costPrice)
                            ? (_j = customFittedIds[0]) === null || _j === void 0 ? void 0 : _j.costPrice
                            : ((_k = inventoryFlat === null || inventoryFlat === void 0 ? void 0 : inventoryFlat.costPrice) !== null && _k !== void 0 ? _k : 0) +
                                ((_m = (_l = customFittedIds[0]) === null || _l === void 0 ? void 0 : _l.costPrice) !== null && _m !== void 0 ? _m : 0);
                        const newDiscountedPrice = ((_o = inventoryFlat === null || inventoryFlat === void 0 ? void 0 : inventoryFlat.discountedPrice) !== null && _o !== void 0 ? _o : 0) === 0
                            ? 0
                            : ((_p = inventoryFlat === null || inventoryFlat === void 0 ? void 0 : inventoryFlat.discountedPrice) !== null && _p !== void 0 ? _p : 0) <
                                ((_q = customFittedIds[0]) === null || _q === void 0 ? void 0 : _q.sellingPrice)
                                ? (_r = customFittedIds[0]) === null || _r === void 0 ? void 0 : _r.sellingPrice
                                : ((_s = inventoryFlat === null || inventoryFlat === void 0 ? void 0 : inventoryFlat.discountedPrice) !== null && _s !== void 0 ? _s : 0) +
                                    ((_u = (_t = customFittedIds[0]) === null || _t === void 0 ? void 0 : _t.sellingPrice) !== null && _u !== void 0 ? _u : 0);
                        return {
                            sellingPrice: newSellingPrice,
                            costPrice: newCostPrice,
                            discountedPrice: newDiscountedPrice,
                            inventoryId: updatedInventory === null || updatedInventory === void 0 ? void 0 : updatedInventory.id,
                            inventoryFlatId: inventoryFlat === null || inventoryFlat === void 0 ? void 0 : inventoryFlat.id,
                        };
                    });
                    const customFittedInventory = yield prisma.customFittedInventory.createMany({
                        data: customFittedInventoryData,
                    });
                    // const customFittedInventory =
                    //   await prisma.customFittedInventory.createMany({
                    //     data: inventoryFlatIds.map((inventoryFlatId) => ({
                    //       sellingPrice: customFittedIds[0]?.sellingPrice,
                    //       costPrice: customFittedIds[0]?.costPrice,
                    //       discountedPrice: customFittedIds[0]?.discountedPrice,
                    //       inventoryId: updatedInventory?.id,
                    //       inventoryFlatId: inventoryFlatId,
                    //     })),
                    //   });
                    inventory = Object.assign(Object.assign({}, updatedInventory), { customFittedInventory: customFittedInventory });
                }
                return { inventory: inventory ? inventory : updatedInventory };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getInventoriesByCategory(categoryId, subCategoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!categoryId) {
                throw new errors_1.ApiBadRequestError("Category ID is required");
            }
            const whereClause = {
                categoryId: categoryId,
            };
            if (subCategoryId) {
                whereClause.InventorySubcategory = {
                    some: {
                        subcategoryid: subCategoryId,
                    },
                };
            }
            console.log("whereClause:", JSON.stringify(whereClause, null, 2));
            const inventorydata = yield prisma.inventory.findMany({
                where: whereClause,
                include: {
                    InventoryFlat: { include: { Flat: true } },
                    customFittedInventory: {
                        include: { InventoryFlat: { include: { Flat: true } } },
                    },
                    InventoryFitted: {
                        include: {
                            Fitted: true,
                        },
                    },
                    Category: true,
                    InventorySubcategory: { include: { SubCategory: true } },
                    Wishlist: true,
                    ColorVariations: { include: { Color: true } },
                    relatedInventories: {
                        include: {
                            Media: true,
                        },
                    },
                    relatedByInventories: {
                        include: {
                            Media: true,
                        },
                    },
                    Media: true,
                    SizeChartMedia: true,
                },
                orderBy: {
                    updatedAt: "desc",
                },
            });
            // return inventories;
            const inventories = yield (0, omitCostPrice_1.omitCostPrice)(inventorydata);
            return inventories;
        });
    }
}
exports.InventoryService = InventoryService;
