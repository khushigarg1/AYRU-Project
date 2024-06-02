import { PrismaClient } from "@prisma/client";
import { ApiBadRequestError } from "../errors";
import fs from "fs";
import path from "path";
import util from "util";

const prisma = new PrismaClient();

const saveFile = async (file: any, directory: string): Promise<string> => {
  const fileName = `${Date.now()}-${file.filename}`;
  const filePath = path.join(__dirname, "..", directory, fileName);
  await util.promisify(fs.writeFile)(filePath, await file.toBuffer());
  return fileName;
};

export class ClientLoveService {
  async addClientLove(data: any, files: any) {
    // const { text } = data;
    const text = "hey";
    let imageUrl = null;
    let video = null;
    console.log(files, files?.image);

    // if (files.image) {
    const imageFileName = await saveFile(files.image, "uploads/images");
    imageUrl = `/uploads/images/${imageFileName}`;
    // }

    if (files.video) {
      const videoFileName = await saveFile(files.video, "uploads/videos");
      video = `/uploads/videos/${videoFileName}`;
    }

    const clientLove = await prisma.clientLove.create({
      data: { text, imageUrl, video },
    });

    return clientLove;
  }

  async getClientLoves() {
    return await prisma.clientLove.findMany();
  }

  async getClientLoveById(id: number) {
    const clientLove = await prisma.clientLove.findUnique({
      where: { id },
    });
    if (!clientLove) {
      throw new ApiBadRequestError("Error: ClientLove not found.");
    }
    return clientLove;
  }

  async updateClientLove(id: number, data: any, files: any) {
    const existClientLove = await prisma.clientLove.findFirst({
      where: { id },
    });
    if (!existClientLove) {
      throw new ApiBadRequestError(
        "ClientLove not present, please create ClientLove first"
      );
    }

    let imageUrl = existClientLove.imageUrl;
    let video = existClientLove.video;

    if (files.image) {
      const imageFileName = await saveFile(files.image, "uploads/images");
      imageUrl = `/uploads/images/${imageFileName}`;
    }

    if (files.video) {
      const videoFileName = await saveFile(files.video, "uploads/videos");
      video = `/uploads/videos/${videoFileName}`;
    }

    const clientLove = await prisma.clientLove.update({
      where: { id },
      data: { ...data, imageUrl, video },
    });

    return clientLove;
  }

  async deleteClientLove(id: number) {
    return await prisma.clientLove.delete({
      where: { id },
    });
  }
}
