import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface FlatData {
  name: string;
  size: string;
  inventoryId?: number;
}

export const createFlatService = async (data: FlatData) => {
  return prisma.flat.create({
    data,
  });
};

export const getFlatsService = async () => {
  return prisma.flat.findMany();
};

export const getFlatByIdService = async (id: number) => {
  return prisma.flat.findUnique({
    where: { id },
  });
};

export const updateFlatService = async (id: number, data: FlatData) => {
  return prisma.flat.update({
    where: { id },
    data,
  });
};

export const deleteFlatService = async (id: number) => {
  return prisma.flat.delete({
    where: { id },
  });
};
