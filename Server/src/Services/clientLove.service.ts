import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import util from "util";
import {
  deleteImageFromS3,
  saveFile,
  uploadImageToS3,
} from "../../config/awsfunction";

const prisma = new PrismaClient();
const isProduction = process.env.NODE_ENV === "production";

// const saveFile = async (file: any, directory: string): Promise<string> => {
//   const fileName = `${Date.now()}-${file.name}`;
//   console.log(fileName);

//   const directoryPath = path.join(__dirname, "..", directory);

//   if (!fs.existsSync(directoryPath)) {
//     fs.mkdirSync(directoryPath, { recursive: true });
//   }

//   const filePath = path.join(directoryPath, fileName);
//   await util.promisify(fs.writeFile)(filePath, file.data);
//   return fileName;
// };

export class ClientLoveService {
  async addClientLove(data: any) {
    const text = data.text;
    let imageUrl = null;
    let video = null;

    if (data.image) {
      // const imageFileName = await saveFile(data.image, "uploads/images");
      // imageUrl = `/uploads/images/${imageFileName}`;
      if (process.env.NODE_ENV === "production") {
        const { key, imageUrl: s3ImageUrl } = await uploadImageToS3(data.image);
        imageUrl = key;
      } else {
        const imageFileName = await saveFile(data.image, "uploads/images");
        imageUrl = `/uploads/images/${imageFileName}`;
      }
    }
    if (data && data.video !== "null") {
      if (process.env.NODE_ENV === "production") {
        const { key, imageUrl: s3ImageUrl } = await uploadImageToS3(data.image);
        imageUrl = key;
      } else {
        const videoFileName = await saveFile(data.video, "uploads/videos");
        video = `/uploads/videos/${videoFileName}`;
      }
    }

    const clientLove = await prisma.clientLove.create({
      data: { text, imageUrl, video },
    });
    return clientLove;
  }

  async getAllClientLoves() {
    return await prisma.clientLove.findMany();
  }

  async getClientLoveById(id: number) {
    const clientLove = await prisma.clientLove.findUnique({ where: { id } });
    return clientLove;
  }

  async updateClientLove(id: number, data: any) {
    const updateData: any = {};

    // console.log(data?.image);
    if (data.text) {
      updateData.text = data.text;
    }

    if (data.image) {
      if (process.env.NODE_ENV === "production") {
        const existingClientLove = await prisma.clientLove.findUnique({
          where: { id },
          select: { imageUrl: true },
        });
        console.log(existingClientLove?.imageUrl);

        if (existingClientLove && existingClientLove.imageUrl) {
          await deleteImageFromS3(existingClientLove.imageUrl);
        }

        const { key, imageUrl } = await uploadImageToS3(data.image);
        updateData.imageUrl = key;
      } else {
        const imageFileName = await saveFile(data.image, "uploads/images");
        updateData.imageUrl = `/uploads/images/${imageFileName}`;
      }
    }

    if (data && data.video !== "null") {
      if (process.env.NODE_ENV === "production") {
        const existingClientLove = await prisma.clientLove.findUnique({
          where: { id },
          select: { video: true },
        });

        if (existingClientLove && existingClientLove.video) {
          await deleteImageFromS3(existingClientLove.video);
        }

        const { key, imageUrl } = await uploadImageToS3(data.video);
        updateData.video = key;
      } else {
        const videoFileName = await saveFile(data.video, "uploads/videos");
        updateData.video = `/uploads/videos/${videoFileName}`;
      }
    }
    console.log(updateData);

    return await prisma.clientLove.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteClientLove(id: number) {
    const clientLove = await prisma.clientLove.findUnique({
      where: { id },
      select: { imageUrl: true, video: true },
    });

    if (clientLove) {
      if (clientLove.imageUrl) {
        await deleteImageFromS3(clientLove.imageUrl);
      }

      if (clientLove.video) {
        await deleteImageFromS3(clientLove.video);
      }
    }
    return await prisma.clientLove.delete({ where: { id } });
  }
}
