import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface FittedData {
  name: string;
  inventoryId?: number;
}

export const createFittedService = async (data: FittedData) => {
  return prisma.fitted.create({
    data,
  });
};

export const getFittedsService = async () => {
  return prisma.fitted.findMany();
};

export const getFittedByIdService = async (id: number) => {
  return prisma.fitted.findUnique({
    where: { id },
  });
};

export const updateFittedService = async (id: number, data: FittedData) => {
  return prisma.fitted.update({
    where: { id },
    data,
  });
};

export const deleteFittedService = async (id: number) => {
  return prisma.fitted.delete({
    where: { id },
  });
};
