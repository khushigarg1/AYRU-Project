import { PrismaClient } from "@prisma/client";
import { ApiBadRequestError } from "../../errors";

const prisma = new PrismaClient();

interface FittedData {
  name: string;
  dimensions?: string[];
}

class FittedService {
  async createFitted(data: FittedData) {
    if (!data.name || data.name.trim() === "") {
      throw new ApiBadRequestError("Name is required and cannot be empty");
    }

    const existingFitted = await prisma.fitted.findUnique({
      where: { name: data.name },
    });
    if (existingFitted) {
      throw new ApiBadRequestError(
        `Fitted with name ${data.name} already exists`
      );
    }

    return prisma.fitted.create({
      data: {
        name: data.name,
        // FittedDimensions: {
        //   create:
        //     data.dimensions?.map((dimension) => ({ dimensions: dimension })) ||
        //     [],
        // },
      },
      // include: { FittedDimensions: true },
    });
  }

  async getFitteds() {
    return prisma.fitted.findMany({
      // include: { FittedDimensions: true },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async getFittedById(id: number) {
    const fitted = await prisma.fitted.findUnique({
      where: { id },
      // include: { FittedDimensions: true },
    });
    if (!fitted) {
      throw new ApiBadRequestError(`Fitted with id ${id} not found`);
    }
    return fitted;
  }

  async updateFitted(id: number, data: FittedData) {
    if (!data.name || data.name.trim() === "") {
      throw new ApiBadRequestError("Name is required and cannot be empty");
    }

    const existingFitted = await prisma.fitted.findUnique({
      where: { name: data.name },
    });
    if (existingFitted && existingFitted.id !== id) {
      throw new ApiBadRequestError(
        `Fitted with name ${data.name} already exists`
      );
    }

    // await prisma.fittedDimensions.deleteMany({
    //   where: { fittedId: id },
    // });

    return prisma.fitted.update({
      where: { id },
      data: {
        name: data.name,
        // FittedDimensions: {
        //   create:
        //     data.dimensions?.map((dimension) => ({ dimensions: dimension })) ||
        //     [],
        // },
      },
      // include: { FittedDimensions: true },
    });
  }

  async deleteFitted(id: number) {
    // await prisma.fittedDimensions.deleteMany({
    //   where: { fittedId: id },
    // });

    return prisma.fitted.delete({
      where: { id },
    });
  }
}

export default FittedService;
