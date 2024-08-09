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
      const { key } = await uploadImageToS3(data.image);
      imageUrl = key;
    }
    if (data && data.video !== "null") {
      const { key } = await uploadImageToS3(data.image);
      imageUrl = key;
    }

    const clientLove = await prisma.clientLove.create({
      data: { text, imageUrl, video },
    });
    return clientLove;
  }

  async getAllClientLoves() {
    return await prisma.clientLove.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async getClientLoveById(id: number) {
    const clientLove = await prisma.clientLove.findUnique({ where: { id } });
    return clientLove;
  }

  async updateClientLove(id: number, data: any) {
    let existingClientLove = await prisma.clientLove.findUnique({
      where: { id },
      select: { imageUrl: true, video: true, text: true },
    });

    if (!existingClientLove) {
      throw new Error(`ClientLove with id ${id} not found.`);
    }

    if (data.image) {
      if (existingClientLove.imageUrl) {
        await deleteImageFromS3(existingClientLove.imageUrl);
      }

      const { key } = await uploadImageToS3(data.image);
      existingClientLove.imageUrl = key ?? null;
    }

    if (data.video && data.video !== "null") {
      if (existingClientLove.video) {
        await deleteImageFromS3(existingClientLove.video);
      }

      const { key } = await uploadImageToS3(data.video);
      existingClientLove.video = key ?? null;
    }

    // if (data.text) {
    existingClientLove.text = data.text;
    // }
    const updatedClientLove = await prisma.clientLove.update({
      where: { id },
      data: {
        text: existingClientLove.text,
        imageUrl: existingClientLove.imageUrl || null,
        video: existingClientLove.video || null,
      },
    });

    return updatedClientLove;
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
