import { PrismaClient } from "@prisma/client";
import { ApiBadRequestError } from "../../errors";

const prisma = new PrismaClient();

interface FlatData {
  name: string;
  size: string;
}

class FlatService {
  async createFlat(data: FlatData) {
    if (
      !data.name ||
      // !data.size ||
      data.name.trim() === ""
      // data.size.trim() === ""
    ) {
      throw new ApiBadRequestError("Name are required and cannot be empty");
    }

    const existingFlat = await prisma.flat.findUnique({
      where: { name: data.name },
    });
    if (existingFlat) {
      throw new ApiBadRequestError(
        `Flat with name ${data.name} already exists`
      );
    }

    return prisma.flat.create({ data });
  }

  async getFlats() {
    return prisma.flat.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async getFlatById(id: number) {
    const flat = await prisma.flat.findUnique({
      where: { id },
    });
    if (!flat) {
      throw new ApiBadRequestError(`Flat with id ${id} not found`);
    }
    return flat;
  }

  async updateFlat(id: number, data: FlatData) {
    if (
      !data.name ||
      !data.size ||
      data.name.trim() === "" ||
      data.size.trim() === ""
    ) {
      throw new ApiBadRequestError(
        "Name and size are required and cannot be empty"
      );
    }

    const existingFlat = await prisma.flat.findUnique({
      where: { name: data.name },
    });
    if (existingFlat && existingFlat.id !== id) {
      throw new ApiBadRequestError(
        `Flat with name ${data.name} already exists`
      );
    }

    const flat = await prisma.flat.update({
      where: { id },
      data,
    });
    if (!flat) {
      throw new ApiBadRequestError(`Flat with id ${id} not found`);
    }
    return flat;
  }

  async deleteFlat(id: number) {
    const flat = await prisma.flat.delete({
      where: { id },
    });
    if (!flat) {
      throw new ApiBadRequestError(`Flat with id ${id} not found`);
    }
    return flat;
  }
}

export default FlatService;
