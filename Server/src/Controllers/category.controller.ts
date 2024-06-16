import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CategoryService } from "../Services/category.service";
const categoryService = new CategoryService();

export async function addCategory(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const category = await categoryService.addCategory(request.body);
    reply.send({ message: "Category created successfully", data: category });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function getCategories(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const categories = await categoryService.getCategories();
    reply.send({
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function getCategoryByid(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as any;
    const category = await categoryService.getCategoryById(Number(id));
    reply.send({ data: category });
  } catch (error) {
    reply.code(404).send({ message: (error as Error).message });
  }
}

export async function updateCategory(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as any;
    const category = await categoryService.updateCategory(
      Number(id),
      request.body
    );
    reply.send({ message: "Category updated successfully", data: category });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function deleteCategory(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as any;
    const { cascade } = request.query as any;
    const category = await categoryService.deleteCategory(Number(id), cascade);
    reply.send({
      message: "Category with all subcategories deleted successfully",
      data: category,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function getVisibleCategories(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const visibleCategories = await categoryService.getVisibleCategories();
    reply.send({
      message: "Visible categories retrieved successfully",
      data: visibleCategories,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}
