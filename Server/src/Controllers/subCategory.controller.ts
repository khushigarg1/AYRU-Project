import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { SubCategoryService } from "../Services/subCategory.service";
const subCategoryService = new SubCategoryService();

export async function addSubCategory(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const subCategory = await subCategoryService.addSubCategory(request.body);
    reply.send({
      message: "SubCategory created successfully",
      data: subCategory,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function getSubCategories(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const subCategories = await subCategoryService.getSubCategories();
    reply.send({
      message: "SubCategories retrieved successfully",
      data: subCategories,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function getSubCategoryById(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as any;
    const subCategory = await subCategoryService.getSubCategoryById(Number(id));
    reply.send({ data: subCategory });
  } catch (error) {
    reply.code(404).send({ message: (error as Error).message });
  }
}

export async function updateSubCategory(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as any;
    const subCategory = await subCategoryService.updateSubCategory(
      Number(id),
      request.body
    );
    reply.send({
      message: "SubCategory updated successfully",
      data: subCategory,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function deleteSubCategory(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as any;
    const subCategory = await subCategoryService.deleteSubCategory(Number(id));
    reply.send({
      message: "SubCategory deleted successfully",
      data: subCategory,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}
