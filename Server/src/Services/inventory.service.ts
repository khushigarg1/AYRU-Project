import { PrismaClient } from "@prisma/client";
import {
  deleteImageFromS3,
  getImageFromS3,
  uploadImageToS3,
  uploadVideoToS3,
} from "../../config/awsfunction";
import { ApiBadRequestError } from "../errors";

const prisma = new PrismaClient();

export class InventoryService {
  async uploadMedias(data: any) {
    try {
      const imageUploadPromises = data?.images
        ?.filter((file: any) => file.mimetype.startsWith("image"))
        .map((image: any) => uploadImageToS3(image));

      const videoUploadPromises = data?.video
        ?.filter((file: any) => file.mimetype.startsWith("video"))
        .map((video: any) => uploadVideoToS3(video));

      const [imageResults, videoResults] = await Promise.all([
        Promise.all(imageUploadPromises),
        videoUploadPromises ? Promise.all(videoUploadPromises) : [],
      ]);

      const allResults = [...imageResults, ...videoResults];

      const mediaCreatePromises = allResults.map((result, index) => {
        const url = result?.key;
        const isImage = data?.images?.some(
          (file: any, idx: number) =>
            idx === index && file.mimetype.startsWith("image")
        );

        return prisma.media.create({
          data: {
            url: url,
            type: isImage ? "image" : "video",
            inventoryId: Number(data.inventoryId),
          },
        });
      });

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
        throw new ApiBadRequestError("Media not found");
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

  async getInventories() {
    const inventory = await prisma.inventory.findMany({
      include: {
        InventoryFlat: { include: { Flat: true } },
        InventoryFitted: {
          include: {
            Fitted: {
              include: { FittedDimensions: true },
            },
          },
        },
        customFittedInventory: { include: { customFitted: true } },
        Media: true,
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
        InventoryFitted: {
          include: {
            Fitted: {
              include: { FittedDimensions: true },
            },
          },
        },
        customFittedInventory: { include: { customFitted: true } },
        Media: true,
      },
    });
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
