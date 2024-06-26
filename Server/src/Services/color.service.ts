import { PrismaClient } from "@prisma/client";
import { ApiBadRequestError } from "../errors";

const prisma = new PrismaClient();

interface ColorAttributes {
  name: string;
  colorCode: string;
}

export class ColorService {
  async addColor(data: ColorAttributes) {
    const { name, colorCode } = data;

    if (!name || !colorCode) {
      throw new ApiBadRequestError("Please provide name and color code");
    }

    // Assuming category association needs to be checked, modify this section accordingly

    const color = await prisma.color.create({
      data: { name, colorCode },
    });

    return color;
  }

  async getColors() {
    const colors = await prisma.color.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    return colors;
  }

  async getColorById(id: number) {
    const color = await prisma.color.findUnique({
      where: { id },
    });

    if (!color) {
      throw new ApiBadRequestError("Color not found.");
    }

    return color;
  }

  async updateColor(id: number, data: ColorAttributes) {
    const existColor = await prisma.color.findUnique({
      where: { id },
    });

    if (!existColor) {
      throw new ApiBadRequestError("Color not found.");
    }

    const { name, colorCode } = data;

    const updatedColor = await prisma.color.update({
      where: { id },
      data: { name, colorCode },
    });

    return updatedColor;
  }

  async deleteColor(id: number) {
    const color = await prisma.color.delete({
      where: { id },
    });

    return color;
  }
}
