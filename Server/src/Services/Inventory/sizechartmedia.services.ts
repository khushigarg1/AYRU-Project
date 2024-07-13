// services/sizeChartMediaService.ts

import { PrismaClient } from "@prisma/client";
import {
  uploadImageToS3,
  deleteImageFromS3,
} from "../../../config/awsfunction";
const prisma = new PrismaClient();

export const uploadChartMedia = async (inventoryId: number, data: any) => {
  const image = data.image;
  console.log(image, inventoryId);

  if (!image.mimetype.startsWith("image")) {
    throw new Error("File is not an image");
  }

  const result = await uploadImageToS3(image);

  if (!result.key) {
    throw new Error("Failed to upload image to S3");
  }

  await prisma.sizeChartMedia.deleteMany({
    where: {
      inventoryId: inventoryId,
    },
  });

  const newMedia = await prisma.sizeChartMedia.create({
    data: {
      url: result.key,
      inventoryId: inventoryId,
    },
  });

  return newMedia;
};

export const getChartMedia = async (inventoryId: number) => {
  const media = await prisma.sizeChartMedia.findFirst({
    where: {
      inventoryId: inventoryId,
    },
  });

  if (!media) {
    throw new Error("No media found for the given inventoryId");
  }

  return media;
};

export const deleteChartMedia = async (inventoryId: number) => {
  const mediaToDelete = await prisma.sizeChartMedia.findFirst({
    where: {
      inventoryId: inventoryId,
    },
  });

  if (!mediaToDelete) {
    throw new Error("Media not found");
  }

  await prisma.sizeChartMedia.delete({
    where: {
      id: mediaToDelete.id,
    },
  });

  // Delete the image from S3
  await deleteImageFromS3(mediaToDelete.url);

  return mediaToDelete;
};
