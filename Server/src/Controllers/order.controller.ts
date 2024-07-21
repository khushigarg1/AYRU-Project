import { FastifyReply, FastifyRequest } from "fastify";
import {
  createOrderService,
  getOrderService,
  getOrdersService,
  updateOrderService,
  deleteOrderService,
} from "../Services/order.service";

// Create Order
export async function createOrder(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const newOrder = await createOrderService(request.body);
    return reply.code(201).send(newOrder);
  } catch (error) {
    return reply.code(500).send(error);
  }
}

// Get Single Order
export async function getOrder(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const order = await getOrderService(parseInt(id, 10));
    if (order) {
      return reply.code(200).send(order);
    }
    return reply.code(404).send({ message: "Order not found" });
  } catch (error) {
    return reply.code(500).send(error);
  }
}

// Get All Orders
export async function getOrders(request: FastifyRequest, reply: FastifyReply) {
  try {
    const orders = await getOrdersService();
    return reply.code(200).send(orders);
  } catch (error) {
    return reply.code(500).send(error);
  }
}

// Update Order
export async function updateOrder(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string };
    const updatedOrder = await updateOrderService(
      parseInt(id, 10),
      request.body
    );
    if (updatedOrder) {
      return reply.code(200).send(updatedOrder);
    }
    return reply.code(404).send({ message: "Order not found" });
  } catch (error) {
    return reply.code(500).send(error);
  }
}

// Delete Order
export async function deleteOrder(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string };
    const deleted = await deleteOrderService(parseInt(id, 10));
    if (deleted) {
      return reply.code(200).send({ message: "Order deleted successfully" });
    }
    return reply.code(404).send({ message: "Order not found" });
  } catch (error) {
    return reply.code(500).send(error);
  }
}
