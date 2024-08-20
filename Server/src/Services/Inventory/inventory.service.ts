import { PrismaClient } from "@prisma/client";
import {
  deleteImageFromS3,
  uploadImageToS3,
  uploadVideoToS3,
} from "../../../config/awsfunction";
import { ApiBadRequestError } from "../../errors";
import {
  InventoryAttributes,
  InventoryUpdateAttributes,
} from "../../schema/inventory.schema";
import { omitCostPrice } from "../../utils/omitCostPrice";

const prisma = new PrismaClient();

export class InventoryService {
  async uploadMedias(data: any) {
    try {
      let imageUploadPromises = [];
      let videoUploadPromises = [];

      // Handle multiple images
      if (Array.isArray(data.images)) {
        imageUploadPromises = data.images
          .filter((file: any) => file.mimetype.startsWith("image"))
          .map((image: any) => uploadImageToS3(image));

        videoUploadPromises = data.images
          .filter((file: any) => file.mimetype.startsWith("video"))
          .map((video: any) => uploadVideoToS3(video));
      }
      // Handle single image
      else if (data.images && data.images.mimetype.startsWith("image")) {
        imageUploadPromises.push(uploadImageToS3(data.images));
      }
      // Handle single video
      else if (data.images && data.images.mimetype.startsWith("video")) {
        videoUploadPromises.push(uploadVideoToS3(data.images));
      }

      // Upload images and videos concurrently
      const [imageResults, videoResults] = await Promise.all([
        Promise.all(imageUploadPromises),
        Promise.all(videoUploadPromises),
      ]);

      // Combine results of both image and video uploads
      const allResults = [...imageResults, ...videoResults];

      // Create media entries in the database
      const mediaCreatePromises = allResults.map((result, index) => {
        const url = result?.key;
        const isImage = Array.isArray(data.images)
          ? index < imageResults?.length
          : data.images?.mimetype?.startsWith("image");

        return prisma.media.create({
          data: {
            url: url,
            type: isImage ? "image" : "video",
            inventoryId: Number(data.inventoryId),
          },
        });
      });

      // Execute all media creation promises
      const mediaEntries = await Promise.all(mediaCreatePromises);
      return mediaEntries;
    } catch (error) {
      console.error("Error in uploadMedias:", error);
      throw new Error("Failed to process media upload: " + error);
    }
  }
  async getallMedia(id: number) {
    const media = await prisma.media.findMany({
      where: {
        inventoryId: id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return media;
  }
  async deleteMedia(id: number) {
    const mediaToDelete = await prisma.media.findFirst({
      where: {
        id,
      },
    });

    if (!mediaToDelete) {
      throw new ApiBadRequestError("Media not found");
    }

    const deletedMedia = await prisma.media.delete({
      where: {
        id: mediaToDelete.id,
      },
    });

    // Delete the media from S3
    await deleteImageFromS3(deletedMedia.url);

    return deletedMedia;
  }
  async deleteInventoryMedia(id: number) {
    try {
      const mediaToDelete = await prisma.media.findMany({
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

      await prisma.media.deleteMany({
        where: {
          inventoryId: id,
        },
      });

      for (const media of mediaToDelete) {
        await deleteImageFromS3(media.url);
      }

      return mediaToDelete;
    } catch (error) {
      console.error("Error deleting media:", error);
      throw new Error("Failed to delete media");
    }
  }

  async deleteSizeChartMedia(id: number) {
    try {
      const sizeChartMediaToDelete = await prisma.sizeChartMedia.findMany({
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

      await prisma.sizeChartMedia.deleteMany({
        where: {
          inventoryId: id,
        },
      });

      for (const media of sizeChartMediaToDelete) {
        await deleteImageFromS3(media.url);
      }

      return sizeChartMediaToDelete;
    } catch (error) {
      console.error("Error deleting size chart media:", error);
      throw new Error("Failed to delete size chart media");
    }
  }

  async createInventory(data: InventoryAttributes) {
    try {
      if (!data.productName || !data.skuId) {
        throw new ApiBadRequestError("Please fill all required fields!!");
      }

      const existingEntry = await prisma.inventory.findFirst({
        where: { skuId: data.skuId },
      });

      if (existingEntry) {
        throw new ApiBadRequestError(
          "SKUID should be different, it already exists."
        );
      }

      const newInventory = await prisma.inventory.create({
        data: {
          productName: data.productName,
          skuId: data.skuId,
          categoryId: data.categoryId,
          status: "PENDING",
          sellingPrice: data.sellingPrice,
          quantity: data.quantity,
          productstatus: data?.productstatus || "DRAFT",
          soldQuantity: data.soldQuantity || 0,
          availability: data.availability || true,
          extraOptionOutOfStock: data?.extraOptionOutOfStock || false,
          sale: data?.sale || false,
        },
      });

      if (data.subCategoryIds && data.subCategoryIds.length > 0) {
        const subCategoryData = data.subCategoryIds.map(
          (subcategoryid: number) => ({
            inventoryId: newInventory.id,
            subcategoryid,
          })
        );
        await prisma.inventorySubcategory.createMany({
          data: subCategoryData,
        });
      }

      return newInventory;
    } catch (error) {
      console.error("Error creating inventory:", error);
      throw error;
    }
  }

  async getInventories() {
    const inventorydata = await prisma.inventory.findMany({
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
    const inventory = await omitCostPrice(inventorydata);
    return inventory;
  }

  async getInventoryById(id: number) {
    if (!id) {
      throw new ApiBadRequestError("Inventory id not found");
    }
    const existingentry = await prisma.inventory.findFirst({
      where: { id },
    });
    if (!existingentry) {
      throw new ApiBadRequestError("Inventory not found");
    }

    const inventorydata = await prisma.inventory.findUnique({
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
    const inventory = await omitCostPrice(inventorydata);
    return inventory;
  }

  async getAdminInventories() {
    const inventory = await prisma.inventory.findMany({
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
  }

  async getAdminInventoryById(id: number) {
    if (!id) {
      throw new ApiBadRequestError("Inventory id not found");
    }
    const existingentry = await prisma.inventory.findFirst({
      where: { id },
    });
    if (!existingentry) {
      throw new ApiBadRequestError("Inventory not found");
    }

    const inventory = await prisma.inventory.findUnique({
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
  }

  async updateInventory(id: number, data: InventoryUpdateAttributes) {
    const {
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
      disclaimer,
      description,
      careInstructions,
      categoryId,
      subCategoryIds,
      flatIds,
      fittedIds,
      customFittedIds,
      others,
      others1,
      colorIds,
      relatedInventoriesIds,
    } = data;

    const deleteManyOptions = { where: { inventoryId: id } };

    await prisma.inventoryFitted.deleteMany(deleteManyOptions);
    await prisma.inventoryFlat.deleteMany(deleteManyOptions);
    await prisma.inventorySubcategory.deleteMany(deleteManyOptions);
    await prisma.customFittedInventory.deleteMany(deleteManyOptions);
    await prisma.colorVariation.deleteMany(deleteManyOptions);
    try {
      const updatedInventory = await prisma.inventory.update({
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
            create:
              subCategoryIds?.map((subcategoryid) => ({ subcategoryid })) || [],
          },
          InventoryFlat: {
            create:
              flatIds?.map((flat) => ({
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
              })) || [],
          },
          InventoryFitted: {
            create:
              fittedIds?.map((fitted) => ({
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
              })) || [],
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
            create:
              colorIds?.map((colorId) => ({
                Color: {
                  connect: { id: colorId },
                },
              })) || [],
          },
          relatedInventories: {
            set:
              relatedInventoriesIds?.map((relatedId) => ({ id: relatedId })) ||
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

      const inventoryFlats = await prisma.inventoryFlat.findMany({
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

      const inventoryFlatIds = inventoryFlats.map(
        (inventoryFlat) => inventoryFlat.id
      );
      let inventory = null;
      if (
        customFittedIds &&
        (customFittedIds[0]?.sellingPrice ||
          customFittedIds[0]?.costPrice ||
          customFittedIds[0]?.discountedPrice)
      ) {
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
        const customFittedInventoryData = inventoryFlats.map(
          (inventoryFlat) => {
            const newSellingPrice =
              (inventoryFlat?.sellingPrice ?? 0) <
              customFittedIds[0]?.sellingPrice
                ? customFittedIds[0]?.sellingPrice
                : (inventoryFlat?.sellingPrice ?? 0) +
                  (customFittedIds[0]?.sellingPrice ?? 0);

            const newCostPrice =
              (inventoryFlat?.costPrice ?? 0) < customFittedIds[0]?.costPrice
                ? customFittedIds[0]?.costPrice
                : (inventoryFlat?.costPrice ?? 0) +
                  (customFittedIds[0]?.costPrice ?? 0);

            const newDiscountedPrice =
              (inventoryFlat?.discountedPrice ?? 0) === 0
                ? 0
                : (inventoryFlat?.discountedPrice ?? 0) <
                  customFittedIds[0]?.sellingPrice
                ? customFittedIds[0]?.sellingPrice
                : (inventoryFlat?.discountedPrice ?? 0) +
                  (customFittedIds[0]?.sellingPrice ?? 0);

            return {
              sellingPrice: newSellingPrice,
              costPrice: newCostPrice,
              discountedPrice: newDiscountedPrice,
              inventoryId: updatedInventory?.id,
              inventoryFlatId: inventoryFlat?.id,
            };
          }
        );
        const customFittedInventory =
          await prisma.customFittedInventory.createMany({
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
        inventory = {
          ...updatedInventory,
          customFittedInventory: customFittedInventory,
        };
      }

      return { inventory: inventory ? inventory : updatedInventory };
    } catch (error) {
      throw error;
    }
  }

  async getInventoriesByCategory(
    categoryId: number,
    subCategoryId?: number,
    sale?: string
  ) {
    if (!categoryId) {
      throw new ApiBadRequestError("Category ID is required");
    }

    const whereClause: any = {
      categoryId: categoryId,
    };

    if (subCategoryId) {
      whereClause.InventorySubcategory = {
        some: {
          subcategoryid: subCategoryId,
        },
      };
    }

    if (sale === "true") {
      whereClause.sale = true;
    }
    (whereClause.productstatus = "PUBLISHED"),
      console.log("whereClause:", JSON.stringify(whereClause, null, 2));

    const inventorydata = await prisma.inventory.findMany({
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
    const inventories = await omitCostPrice(inventorydata);
    return inventories;
  }
}
