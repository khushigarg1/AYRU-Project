import { PrismaClient } from "@prisma/client";
import { ApiBadRequestError } from "../../errors";

const prisma = new PrismaClient();

export class SizeChartService {
  async createProduct(data: any) {
    const { name, sizes } = data;

    if (!name || !sizes || sizes.length === 0) {
      throw new ApiBadRequestError("Name and at least one size are required");
    }

    const sizechart = await prisma.product.create({
      data: {
        name,
        sizes: {
          createMany: {
            data: sizes.map((size: any) => ({
              name: size.name,
              width: size.width,
              height: size.height,
            })),
          },
        },
      },
      include: { sizes: true },
    });

    return sizechart;
  }

  async getAllProducts() {
    return await prisma.product.findMany({
      include: { sizes: true },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async getProductById(id: number) {
    const sizecharts = await prisma.product.findUnique({
      where: { id },
      include: { sizes: true },
    });
    if (!sizecharts) {
      throw new ApiBadRequestError(`SizeChart with id ${id} not found`);
    }
    return sizecharts;
  }

  async updateProduct(id: number, data: any) {
    const { name, sizes } = data;

    await prisma.sizeChart.deleteMany({
      where: { productId: id },
    });
    const updatedsizechart = await prisma.product.update({
      where: { id },
      data: {
        name,
        sizes: {
          createMany: {
            data: sizes.map((size: any) => ({
              name: size.name,
              width: size.width,
              height: size.height,
            })),
          },
        },
      },
      include: { sizes: true },
    });

    return updatedsizechart;
  }

  async deleteProduct(id: number) {
    await prisma.sizeChart.deleteMany({
      where: { productId: id },
    });

    return await prisma.product.delete({
      where: { id },
    });
  }
}
