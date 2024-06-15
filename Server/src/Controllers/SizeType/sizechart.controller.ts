import { FastifyRequest, FastifyReply } from "fastify";
import { SizeChartService } from "../../Services/sizetype/sizechart.service";

const sizechartService = new SizeChartService();

export async function createProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const product = await sizechartService.createProduct(request.body);
    reply.send({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function getAllProducts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const products = await sizechartService.getAllProducts();
    reply.send({
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function getProductById(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string };
    const product = await sizechartService.getProductById(Number(id));
    reply.send({ data: product });
  } catch (error) {
    reply.code(404).send({ message: (error as Error).message });
  }
}

export async function updateProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string };
    const product = await sizechartService.updateProduct(
      Number(id),
      request.body
    );
    reply.send({
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function deleteProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string };
    await sizechartService.deleteProduct(Number(id));
    reply.send({
      message: "Product deleted successfully",
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}
