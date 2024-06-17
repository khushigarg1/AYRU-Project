import { PrismaClient } from "@prisma/client";
import {
  deleteImageFromS3,
  getImageFromS3,
  uploadImageToS3,
  uploadVideoToS3,
} from "../../../config/awsfunction";
import { ApiBadRequestError } from "../../errors";
import {
  InventoryAttributes,
  InventoryUpdateAttributes,
} from "../../schema/inventory.schema";

const prisma = new PrismaClient();

export class InventoryService {
  async uploadMedias(data: any) {
    try {
      console.log(data);

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
          ? index < imageResults.length // Check index against length of image uploads
          : data.images.mimetype.startsWith("image");

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
    });
    console.log(media);

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
    if (
      !data.productName ||
      !data.skuId
      // ||
      // data.categoryId === undefined ||
      // data.subCategoryId === undefined
    ) {
      console.log();
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

    return await prisma.inventory.create({
      data: {
        productName: data.productName,
        skuId: data.skuId,
        categoryId: data?.categoryId,
        subCategoryId: data?.subCategoryId,
        status: "PENDING",
      },
    });
  }

  async getInventories() {
    const inventory = await prisma.inventory.findMany({
      include: {
        InventoryFlat: { include: { Flat: true } },
        customFittedInventory: { include: { customFitted: true } },
        InventoryFitted: {
          include: {
            Fitted: {
              include: { FittedDimensions: true },
            },
            fittedDimensions: true,
          },
        },
        ProductInventory: {
          include: {
            product: {
              include: { sizes: true },
            },
            selectedSizes: true,
          },
        },
        ColorVariations: { include: { Color: true } },
        relatedInventories: true,
        relatedByInventories: true,
        Media: true,
        SizeChartMedia: true,
      },
    });
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

    const inventory = await prisma.inventory.findUnique({
      where: { id: Number(id) },
      include: {
        InventoryFlat: { include: { Flat: true } },
        customFittedInventory: { include: { customFitted: true } },
        InventoryFitted: {
          include: {
            Fitted: {
              include: { FittedDimensions: true },
            },
            fittedDimensions: true,
          },
        },
        ProductInventory: {
          include: {
            product: {
              include: { sizes: true },
            },
            selectedSizes: true,
          },
        },
        ColorVariations: { include: { Color: true } },
        relatedInventories: true,
        relatedByInventories: true,
        Media: true,
        SizeChartMedia: true,
      },
    });
    return inventory;
  }
  async updateInventory(id: number, data: InventoryUpdateAttributes) {
    console.log(id, data);

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
      discountCount,
      availability,
      weight,
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
      specialFeatures,
      threadCount,
      itemWeight,
      origin,
      extraNote,
      disclaimer,
      careInstructions,
      categoryId,
      subCategoryId,
      flatIds,
      fittedIds,
      customFittedIds,
      others,
      // sizecharts,
      colorIds,
      relatedInventoriesIds,
    } = data;

    const deleteManyOptions = { where: { inventoryId: id } };

    await prisma.inventoryFitted.deleteMany(deleteManyOptions);
    await prisma.inventoryFlat.deleteMany(deleteManyOptions);
    await prisma.customFittedInventory.deleteMany(deleteManyOptions);
    // await prisma.productInventory.deleteMany(deleteManyOptions);
    await prisma.colorVariation.deleteMany(deleteManyOptions);
    console.log("heyyy");

    const inventory = await prisma.inventory.update({
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
        discountCount,
        availability,
        weight,
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
        specialFeatures,
        threadCount,
        itemWeight,
        origin,
        extraNote,
        disclaimer,
        careInstructions,
        categoryId,
        subCategoryId,
        others,
        InventoryFlat: {
          create: flatIds?.map((flatId) => ({ flatId })) || [],
        },
        InventoryFitted: {
          create:
            fittedIds?.map((fitted) => ({
              fittedId: fitted?.fittedId,
              fittedDimensions: {
                connect: fitted.fittedDimensions.map((dimensionId) => ({
                  id: dimensionId,
                })),
              },
            })) || [],
        },
        customFittedInventory: {
          create:
            customFittedIds?.map((customFittedId) => ({ customFittedId })) ||
            [],
        },
        // ProductInventory: {
        //   create:
        //     sizecharts?.map((sizechart) => ({
        //       productId: sizechart.productId,
        //       selectedSizes: {
        //         connect: sizechart.selectedSizes.map((sizeId) => ({
        //           id: sizeId,
        //         })),
        //       },
        //     })) || [],
        // },
        ColorVariations: {
          create: colorIds?.map((colorId) => ({ colorId })) || [],
        },
        relatedInventories: {
          set:
            relatedInventoriesIds?.map((relatedId) => ({ id: relatedId })) ||
            [],
        },
      },
      include: {
        InventoryFlat: { include: { Flat: true } },
        customFittedInventory: { include: { customFitted: true } },
        InventoryFitted: {
          include: {
            Fitted: {
              include: { FittedDimensions: true },
            },
            fittedDimensions: true,
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
        ColorVariations: { include: { Color: true } },
        relatedInventories: true,
        relatedByInventories: true,
        Media: true,
      },
    });
    console.log(inventory);

    return inventory;
  }
}

// export const createInventory = async (dataa: InventoryAttributes) => {
//   // try {
//   console.log(dataa);

//   const inventory = await prisma.inventory.create({
//     data: {
//       ...dataa,
//       // category: { connect: { id: data.categoryId } },
//       // subCategory: { connect: { id: data.subCategoryId } },
//       InventoryFlat: {
//         create: dataa.flatIds?.map((flatId) => ({ flatId })),
//       },
//       InventoryFitted: {
//         create: dataa.fittedIds?.map((fittedId) => ({ fittedId })),
//       },
//       customFittedInventory: {
//         create: dataa.customFittedIds?.map((customFittedId) => ({
//           customFittedId,
//         })),
//       },
//     },
//     include: {
//       InventoryFlat: { include: { Flat: true } },
//       InventoryFitted: {
//         include: {
//           Fitted: {
//             include: { FittedDimensions: true },
//           },
//         },
//       },
//       customFittedInventory: { include: { customFitted: true } },
//       Media: true,
//     },
//   });
//   return inventory;
//   // } catch (error) {
//   //   console.error("Error creating inventory:", error);
//   //   throw new ApiBadRequestError("Failed to create inventory");
//   // }
// };

// export const getInventories = async () => {
//   try {
//     const inventories = await prisma.inventory.findMany({
//       include: {
//         InventoryFlat: { include: { Flat: true } },
//         InventoryFitted: {
//           include: {
//             Fitted: {
//               include: { FittedDimensions: true },
//             },
//           },
//         },
//         customFittedInventory: { include: { customFitted: true } },
//         Media: true,
//       },
//     });
//     return inventories;
//   } catch (error) {
//     throw new ApiBadRequestError("Failed to fetch inventories");
//   }
// };

// export const getInventoryById = async (id: number) => {
//   try {
//     const inventory = await prisma.inventory.findUnique({
//       where: { id },
//       include: {
//         InventoryFlat: { include: { Flat: true } },
//         InventoryFitted: {
//           include: {
//             Fitted: {
//               include: { FittedDimensions: true },
//             },
//           },
//         },
//         customFittedInventory: { include: { customFitted: true } },
//         Media: true,
//       },
//     });
//     if (!inventory) {
//       throw new Api404Error("Inventory not found");
//     }
//     return inventory;
//   } catch (error) {
//     throw new ApiBadRequestError("Failed to fetch inventory");
//   }
// };

// export const updateInventory = async (
//   id: number,
//   data: InventoryAttributes
// ) => {
//   try {
//     await prisma.inventoryFlat.deleteMany({
//       where: { inventoryId: id },
//     });
//     await prisma.inventoryFitted.deleteMany({
//       where: { inventoryId: id },
//     });

//     const inventory = await prisma.inventory.update({
//       where: { id },
//       data: {
//         ...data,
//         InventoryFlat: {
//           create: data.flatIds?.map((flatId) => ({ flatId })),
//         },
//         InventoryFitted: {
//           create: data.fittedIds?.map((fittedId) => ({ fittedId })),
//         },
//         customFittedInventory: {
//           create: data.customFittedIds?.map((customFittedId) => ({
//             customFittedId,
//           })),
//         },
//       },
//       include: {
//         InventoryFlat: { include: { Flat: true } },
//         InventoryFitted: {
//           include: {
//             Fitted: {
//               include: { FittedDimensions: true },
//             },
//           },
//         },
//         customFittedInventory: { include: { customFitted: true } },
//         Media: true,
//       },
//     });
//     return inventory;
//   } catch (error) {
//     throw new ApiBadRequestError("Failed to update inventory");
//   }
// };

// export const deleteInventory = async (id: number) => {
//   try {
//     await prisma.$transaction(async (prisma) => {
//       await prisma.inventoryFlat.deleteMany({
//         where: { inventoryId: id },
//       });
//       await prisma.inventoryFitted.deleteMany({
//         where: { inventoryId: id },
//       });
//       await prisma.customFittedInventory.deleteMany({
//         where: { inventoryId: id },
//       });

//       await prisma.inventory.delete({
//         where: { id },
//       });
//     });
//   } catch (error) {
//     throw new ApiBadRequestError("Failed to delete inventory");
//   }
// };
