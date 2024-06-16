// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// interface CustomFittedData {
//   name: string;
// }

// export const createCustomFittedService = async (data: CustomFittedData) => {
//   return prisma.customFittedInventory.create({
//     data,
//   });
// };

// export const getCustomFittedsService = async () => {
//   return prisma.customFittedInventory.findMany();
// };

// export const getCustomFittedByIdService = async (id: number) => {
//   return prisma.customFittedInventory.findUnique({
//     where: { id },
//   });
// };

// export const updateCustomFittedService = async (
//   id: number,
//   data: CustomFittedData
// ) => {
//   return prisma.customFittedInventory.update({
//     where: { id },
//     data,
//   });
// };

// export const deleteCustomFittedService = async (id: number) => {
//   return prisma.customFittedInventory.delete({
//     where: { id },
//   });
// };
