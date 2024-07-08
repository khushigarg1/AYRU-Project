// controllers/cartController.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { CartService } from "../Services/cart.service";
import { ApiBadRequestError, Api404Error } from "../errors";

const cartService = new CartService();

export async function addToCart(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request?.user;
  const {
    inventoryId,
    quantity,
    sizeType,
    sizeName,
    length,
    width,
    height,
    remark,
  } = request.body as any;

  try {
    const cartItem = await cartService.addToCart(
      Number(id),
      inventoryId,
      quantity,
      sizeType,
      sizeName,
      length,
      width,
      height,
      remark
    );
    reply.code(201).send({ success: true, data: cartItem });
  } catch (error) {
    if (error instanceof ApiBadRequestError || error instanceof Api404Error) {
      reply.code(400).send({ success: false, error: error.message });
    } else {
      reply.code(500).send({ success: false, error: "Internal Server Error" });
    }
  }
}

export async function removeFromCart(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.user;
  const { cartItemId } = request.params as any;

  try {
    await cartService.removeFromCart(Number(id), parseInt(cartItemId));
    reply
      .code(200)
      .send({ success: true, message: "Cart item deleted successfully" });
  } catch (error) {
    if (error instanceof ApiBadRequestError || error instanceof Api404Error) {
      reply.code(400).send({ success: false, error: error.message });
    } else {
      reply.code(500).send({ success: false, error: "Internal Server Error" });
    }
  }
}

export async function updateCart(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.user;
  const { cartItemId } = request.params as any;
  const { quantity, sizeType, sizeName, length, width, height, remark } =
    request.body as any;

  try {
    const updatedCartItem = await cartService.updateCart(
      Number(id),
      parseInt(cartItemId),
      quantity,
      sizeType,
      sizeName,
      length,
      width,
      height,
      remark
    );
    reply.code(200).send({ success: true, data: updatedCartItem });
  } catch (error) {
    if (error instanceof ApiBadRequestError || error instanceof Api404Error) {
      reply.code(400).send({ success: false, error: error.message });
    } else {
      reply.code(500).send({ success: false, error: "Internal Server Error" });
    }
  }
}

export async function getCart(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.user;

  try {
    const userCart = await cartService.getUserCart(Number(id));
    reply.code(200).send({ success: true, data: userCart });
  } catch (error) {
    if (error instanceof ApiBadRequestError || error instanceof Api404Error) {
      reply.code(400).send({ success: false, error: error.message });
    } else {
      reply.code(500).send({ success: false, error: "Internal Server Error" });
    }
  }
}

export async function getAllCart(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userCart = await cartService.getAllCart();
    reply.code(200).send({ success: true, data: userCart });
  } catch (error) {
    if (error instanceof ApiBadRequestError || error instanceof Api404Error) {
      reply.code(400).send({ success: false, error: error.message });
    } else {
      reply.code(500).send({ success: false, error: "Internal Server Error" });
    }
  }
}
