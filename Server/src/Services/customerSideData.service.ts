import { PrismaClient } from "@prisma/client";
import {
  deleteImageFromS3,
  uploadImageToS3,
  uploadVideoToS3,
} from "../../config/awsfunction";
import { ApiBadRequestError } from "../errors";

const prisma = new PrismaClient();

export class CustomerSideDataService {
  async addCustomerSideData(data: {
    marqueeText: string;
    extraNote?: string;
    additionalText1?: string;
    additionalText2?: string;
    additionalText3?: string;
  }) {
    return await prisma.customerSideData.create({
      data,
    });
  }

  async getCustomerSideData() {
    return await prisma.customerSideData.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async getCustomerSideDataById(id: number) {
    return await prisma.customerSideData.findUnique({
      where: { id },
    });
  }

  async updateCustomerSideData(
    id: number,
    data: {
      marqueeText?: string;
      extraNote?: string;
      additionalText1?: string;
      additionalText2?: string;
      additionalText3?: string;
    }
  ) {
    return await prisma.customerSideData.update({
      where: { id },
      data,
    });
  }

  async deleteCustomerSideData(id: number) {
    return await prisma.customerSideData.delete({
      where: { id },
    });
  }
  /*---------------------------medias--------------------*/
  async uploadCustomerMedia(data: any) {
    try {
      console.log(data);

      let imageUploadPromises = [];
      let videoUploadPromises = [];

      const type = data.type;

      if (Array.isArray(data.images)) {
        imageUploadPromises = data.images
          .filter((file: any) => file.mimetype.startsWith("image"))
          .map((image: any) => uploadImageToS3(image));

        videoUploadPromises = data.images
          .filter((file: any) => file.mimetype.startsWith("video"))
          .map((video: any) => uploadVideoToS3(video));
      } else if (data.images && data.images.mimetype.startsWith("image")) {
        imageUploadPromises.push(uploadImageToS3(data.images));
      } else if (data.images && data.images.mimetype.startsWith("video")) {
        videoUploadPromises.push(uploadVideoToS3(data.images));
      }
      const [imageResults, videoResults] = await Promise.all([
        Promise.all(imageUploadPromises),
        Promise.all(videoUploadPromises),
      ]);
      const allResults = [...imageResults, ...videoResults];

      const mediaCreatePromises = allResults.map((result) => {
        const url = result?.key;

        return prisma.customerSideImage.create({
          data: {
            imageUrl: url,
            type,
          },
        });
      });

      const mediaEntries = await Promise.all(mediaCreatePromises);
      return mediaEntries;
    } catch (error) {
      console.error("Error in uploadCustomerMedia:", error);
      throw new Error("Failed to process media upload: " + error);
    }
  }

  async getallCustomerMedia(type: string) {
    const media = await prisma.customerSideImage.findMany({
      where: {
        type: type,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return media;
  }

  async deleteCustomerMedia(id: number) {
    const mediaToDelete = await prisma.customerSideImage.findFirst({
      where: {
        id,
      },
    });

    if (!mediaToDelete) {
      throw new ApiBadRequestError("Media not found");
    }

    const deletedMedia = await prisma.customerSideImage.delete({
      where: {
        id: mediaToDelete.id,
      },
    });

    await deleteImageFromS3(deletedMedia.imageUrl);

    return deletedMedia;
  }
}
