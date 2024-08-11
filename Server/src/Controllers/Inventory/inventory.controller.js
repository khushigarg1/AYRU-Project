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
exports.filterSaleItem = exports.searchInventory = exports.filterInventory = exports.deleteMedia = exports.getallMedia = exports.uploadMedia = exports.deleteInventory = exports.updateInventory = exports.getAdminInventoryById = exports.getAdminInventories = exports.getInventoryById = exports.getInventories = exports.getInventoriesByCategory = exports.createInventory = void 0;
const client_1 = require("@prisma/client");
const inventory_service_1 = require("../../Services/Inventory/inventory.service");
const omitCostPrice_1 = require("../../utils/omitCostPrice");
const inventoryService = new inventory_service_1.InventoryService();
const prisma = new client_1.PrismaClient();
const createInventory = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { productName, skuId, categoryId, subCategoryIds, quantity, soldQuantity, sellingPrice, availability, productstatus, extraOptionOutOfStock, sale, } = request.body;
    try {
        const inventory = yield inventoryService.createInventory({
            productName,
            skuId,
            categoryId,
            subCategoryIds,
            quantity,
            soldQuantity,
            sellingPrice,
            availability,
            productstatus,
            extraOptionOutOfStock,
            sale,
        });
        reply.status(201).send({ data: inventory });
    }
    catch (error) {
        reply.status(500).send({ message: error.message, error: error });
    }
});
exports.createInventory = createInventory;
const getInventoriesByCategory = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId, subCategoryId } = request.query;
    if (!categoryId) {
        reply.status(400).send({ error: "Category ID is required" });
        return;
    }
    try {
        const inventories = yield inventoryService.getInventoriesByCategory(Number(categoryId), subCategoryId ? Number(subCategoryId) : undefined);
        reply.send({ data: inventories });
    }
    catch (error) {
        reply
            .status(500)
            .send({ error: "Failed to fetch inventories", details: error });
    }
});
exports.getInventoriesByCategory = getInventoriesByCategory;
const getInventories = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inventories = yield inventoryService.getInventories();
        reply.send({ data: inventories });
    }
    catch (error) {
        reply.send(error);
    }
});
exports.getInventories = getInventories;
const getInventoryById = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    console.log("heyyyy");
    try {
        const inventory = yield inventoryService.getInventoryById(Number(id));
        reply.send({ data: inventory });
    }
    catch (error) {
        reply.send(error);
    }
});
exports.getInventoryById = getInventoryById;
const getAdminInventories = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inventories = yield inventoryService.getAdminInventories();
        reply.send({ data: inventories });
    }
    catch (error) {
        reply.send(error);
    }
});
exports.getAdminInventories = getAdminInventories;
const getAdminInventoryById = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    console.log("heyyyy");
    try {
        const inventory = yield inventoryService.getAdminInventoryById(Number(id));
        reply.send({ data: inventory });
    }
    catch (error) {
        reply.send(error);
    }
});
exports.getAdminInventoryById = getAdminInventoryById;
const updateInventory = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const data = request.body;
    try {
        const inventory = yield inventoryService.updateInventory(Number(id), data);
        reply.send({ data: inventory });
    }
    catch (error) {
        reply.status(500).send({ message: error.message, error });
    }
});
exports.updateInventory = updateInventory;
const deleteInventory = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    try {
        yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.inventoryFlat.deleteMany({
                where: { inventoryId: Number(id) },
            });
            yield prisma.inventoryFitted.deleteMany({
                where: { inventoryId: Number(id) },
            });
            yield prisma.customFittedInventory.deleteMany({
                where: { inventoryId: Number(id) },
            });
            // await prisma.productInventory.deleteMany({
            //   where: { inventoryId: Number(id) },
            // });
            yield prisma.colorVariation.deleteMany({
                where: { inventoryId: Number(id) },
            });
            yield inventoryService.deleteInventoryMedia(Number(id));
            yield inventoryService.deleteSizeChartMedia(Number(id));
            yield prisma.inventory.delete({
                where: { id: Number(id) },
            });
        }));
        reply.send({
            message: "Inventory and related entries deleted successfully",
        });
    }
    catch (error) {
        reply
            .status(500)
            .send({ error: "Failed to delete inventory", details: error });
    }
});
exports.deleteInventory = deleteInventory;
//------------------------------------------------Media controllers for images and video----------------------
const uploadMedia = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = request.body;
        const result = yield inventoryService.uploadMedias(data);
        reply.send({ message: "ClientLove created successfully", data: result });
    }
    catch (error) {
        reply
            .status(500)
            .send({ message: "Failed to upload media", details: error });
    }
});
exports.uploadMedia = uploadMedia;
const getallMedia = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        const result = yield inventoryService.getallMedia(Number(id));
        reply.send({ message: "data fetched successfully", data: result });
    }
    catch (error) {
        reply.status(500).send({ message: "Failed to get media", details: error });
    }
});
exports.getallMedia = getallMedia;
const deleteMedia = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        const result = yield inventoryService.deleteMedia(Number(id));
        reply.send({ message: "deleted successfully", data: result });
    }
    catch (error) {
        reply
            .status(500)
            .send({ message: "Failed to delete media", details: error });
    }
});
exports.deleteMedia = deleteMedia;
/*-------------------------------For searchign and filtering inventories-----------------------*/
// Route for filtering inventory items
// export const filterInventory = async (
//   request: FastifyRequest,
//   reply: FastifyReply
// ) => {
//   const {
//     categoryId,
//     subCategoryId,
//     fabric,
//     style,
//     minPrice,
//     maxPrice,
//     sortBy,
//     sortOrder,
//   } = request.query as {
//     categoryId: string;
//     subCategoryId?: string;
//     fabric?: string;
//     style?: string;
//     minPrice?: string;
//     maxPrice?: string;
//     sortBy?: string;
//     sortOrder?: "asc" | "desc";
//   };
//   try {
//     const filterOptions: any = {};
//     if (categoryId) {
//       filterOptions.categoryId = Number(categoryId);
//     }
//     if (subCategoryId) {
//       filterOptions.subCategoryId = Number(subCategoryId);
//     }
//     if (fabric) {
//       filterOptions.fabric = { equals: fabric, mode: "insensitive" };
//     }
//     if (style) {
//       filterOptions.style = { equals: style, mode: "insensitive" };
//     }
//     if (minPrice && maxPrice) {
//       filterOptions.sellingPrice = {
//         gte: parseFloat(minPrice),
//         lte: parseFloat(maxPrice),
//       };
//     }
//     const orderBy: any = {};
//     if (sortBy) {
//       orderBy[sortBy] = sortOrder === "desc" ? "desc" : "asc";
//     }
//     const inventories = await prisma.inventory.findMany({
//       where: filterOptions,
//       orderBy,
//       include: {
//         category: true,
//         subCategory: true,
//         Media: true,
//         Wishlist: true,
//         relatedInventories: true,
//         relatedByInventories: true,
//         SizeChartMedia: true,
//         ColorVariations: { include: { Color: true } },
//         InventoryFlat: { include: { Flat: true } },
//         customFittedInventory: { include: { customFitted: true } },
//         InventoryFitted: {
//           include: {
//             Fitted: {
//               include: { FittedDimensions: true },
//             },
//             fittedDimensions: true,
//           },
//         },
//       },
//     });
//     reply.send({ data: inventories });
//   } catch (error) {
//     reply
//       .status(500)
//       .send({ error: "Failed to filter inventories", details: error });
//   }
// };
const filterInventory = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId, subCategoryId, fabric, style, minPrice, maxPrice, sortBy, sortOrder, flatSize, fittedSize, customFittedId, sale, availability, extraOptionOutOfStock, } = request.query;
    try {
        const baseFilterOptions = {};
        if (categoryId) {
            baseFilterOptions.categoryId = Number(categoryId);
        }
        if (subCategoryId) {
            const subCategoryIds = Array.isArray(subCategoryId)
                ? subCategoryId.map((id) => parseInt(id))
                : [parseInt(subCategoryId)];
            baseFilterOptions.InventorySubcategory = {
                some: {
                    subcategoryid: { in: subCategoryIds },
                },
            };
        }
        // if (subCategoryId) {
        //   baseFilterOptions.InventorySubcategory = {
        //     some: {
        //       subcategoryid: {
        //         has: Number(subCategoryId),
        //       },
        //     },
        //   };
        // }
        if (sale === "true") {
            baseFilterOptions.sale = true;
        }
        if (availability) {
            baseFilterOptions.availability = availability === "true";
        }
        if (extraOptionOutOfStock) {
            baseFilterOptions.extraOptionOutOfStock =
                extraOptionOutOfStock === "true";
        }
        const baseInventories = yield prisma.inventory.findMany({
            where: baseFilterOptions,
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
        });
        const filteredInventories = baseInventories.filter((inventory) => {
            let isValid = true;
            if (fabric &&
                inventory.fabric &&
                inventory.fabric.toLowerCase() !== fabric.toLowerCase()) {
                isValid = false;
            }
            if (style &&
                inventory.style &&
                inventory.style.toLowerCase() !== style.toLowerCase()) {
                isValid = false;
            }
            if (minPrice && maxPrice) {
                const priceToCompare = inventory.discountedPrice || inventory.sellingPrice;
                if (priceToCompare &&
                    (priceToCompare < parseFloat(minPrice) ||
                        priceToCompare > parseFloat(maxPrice))) {
                    isValid = false;
                }
            }
            return isValid;
        });
        const sortedInventories = filteredInventories.sort((a, b) => {
            if (sortBy) {
                const order = sortOrder === "desc" ? -1 : 1;
                const aValue = a[sortBy];
                const bValue = b[sortBy];
                if (aValue == null || bValue == null) {
                    return 0;
                }
                if (typeof aValue === "number" && typeof bValue === "number") {
                    return (aValue - bValue) * order;
                }
                if (typeof aValue === "string" && typeof bValue === "string") {
                    return aValue.localeCompare(bValue) * order;
                }
                if (aValue < bValue)
                    return -1 * order;
                if (aValue > bValue)
                    return 1 * order;
                return 0;
            }
            return 0;
        });
        // reply.send({ data: sortedInventories });
        const omitSortedInv = (0, omitCostPrice_1.omitCostPrice)(sortedInventories);
        reply.send({ data: omitSortedInv });
    }
    catch (error) {
        reply
            .status(500)
            .send({ error: "Failed to filter inventories", details: error });
    }
});
exports.filterInventory = filterInventory;
// Route for searching inventory items
const searchInventory = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("heyy1");
    const { searchQuery, categoryId, subCategoryId } = request.query;
    console.log(searchQuery);
    try {
        // Initialize the whereClause
        const whereClause = {
            OR: [
                { productName: { contains: searchQuery, mode: "insensitive" } },
                { colorVariation: { contains: searchQuery, mode: "insensitive" } },
                { fabric: { contains: searchQuery, mode: "insensitive" } },
                {
                    Category: {
                        categoryName: { contains: searchQuery, mode: "insensitive" },
                    },
                },
                {
                    InventorySubcategory: {
                        some: {
                            SubCategory: {
                                subcategoryName: { contains: searchQuery, mode: "insensitive" },
                            },
                        },
                    },
                },
            ],
        };
        // Add categoryId filter
        if (categoryId) {
            whereClause.AND = whereClause.AND || [];
            whereClause.AND.push({ categoryId: parseInt(categoryId) });
        }
        // Handle subCategoryId as an array
        if (subCategoryId) {
            const subCategoryIds = Array.isArray(subCategoryId)
                ? subCategoryId.map((id) => parseInt(id))
                : [parseInt(subCategoryId)];
            whereClause.InventorySubcategory = {
                some: {
                    subcategoryid: { in: subCategoryIds },
                },
            };
        }
        console.log("Where Clause:", JSON.stringify(whereClause, null, 2));
        // Query the database
        const inventories = yield prisma.inventory.findMany({
            where: whereClause,
            include: {
                Category: true,
                InventorySubcategory: { include: { SubCategory: true } },
                Media: true,
                Wishlist: true,
                ColorVariations: { include: { Color: true } },
                relatedInventories: true,
                relatedByInventories: true,
                SizeChartMedia: true,
                InventoryFlat: { include: { Flat: true } },
                InventoryFitted: { include: { Fitted: true } },
            },
        });
        // reply.send({ data: inventories });
        const omitInventory = (0, omitCostPrice_1.omitCostPrice)(inventories);
        reply.send({ data: omitInventory });
    }
    catch (error) {
        console.error("Error in searchInventory:", error);
        reply
            .status(500)
            .send({ error: "Failed to search inventories", details: error });
    }
});
exports.searchInventory = searchInventory;
const filterSaleItem = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inventories = yield prisma.inventory.findMany({
            where: {
                sale: true,
            },
            include: {
                Category: true,
                InventorySubcategory: { include: { SubCategory: true } },
                Media: true,
                Wishlist: true,
                ColorVariations: { include: { Color: true } },
                relatedInventories: true,
                relatedByInventories: true,
                SizeChartMedia: true,
                InventoryFlat: { include: { Flat: true } },
                InventoryFitted: { include: { Fitted: true } },
            },
        });
        // reply.send({ data: inventories });
        const omitInventories = (0, omitCostPrice_1.omitCostPrice)(inventories);
        reply.send({ data: omitInventories });
    }
    catch (error) {
        console.error("Error in filterSaleItems:", error);
        reply
            .status(500)
            .send({ error: "Failed to filter sale items", details: error });
    }
});
exports.filterSaleItem = filterSaleItem;
