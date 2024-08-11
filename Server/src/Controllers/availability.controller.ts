// src/controllers/availabilityController.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { AvailabilityService } from "../Services/availability.service.js";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const availabilityService = new AvailabilityService();

export async function createAvailabilityRequest(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id: userId } = request?.user;

  const { inventoryid, mobilenumber } = request.body as {
    inventoryid: number;
    mobilenumber: string;
  };

  try {
    const availabilityRequest =
      await availabilityService.createAvailabilityRequest(
        Number(userId),
        inventoryid,
        mobilenumber
      );

    // Send WhatsApp message to admin and user here

    return reply.status(201).send(availabilityRequest);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}
export async function getAvailabilityCheck(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id: userId } = request.user;

  const { id } = request.params as {
    id: string;
  };

  try {
    const availabilityRequest = await prisma.availabilityRequest.findFirst({
      where: {
        userId: Number(userId),
        inventoryid: Number(id),
      },
    });

    if (!availabilityRequest) {
      return reply
        .status(404)
        .send({ error: "Availability request not found" });
    }

    return reply.status(200).send({ data: availabilityRequest });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function getAvailability(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };

  try {
    const availabilityRequest = await prisma.availabilityRequest.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
        inventory: {
          include: {
            customFittedInventory: {
              include: { InventoryFlat: { include: { Flat: true } } },
            },
            InventoryFlat: { include: { Flat: true } },
            InventorySubcategory: { include: { SubCategory: true } },
            InventoryFitted: {
              include: { Fitted: true },
            },
            Category: true,
            Wishlist: true,
            ColorVariations: { include: { Color: true } },
            relatedInventories: { include: { Media: true } },
            relatedByInventories: { include: { Media: true } },
            Media: true,
            SizeChartMedia: true,
          },
        },
      },
    });

    if (!availabilityRequest) {
      return reply
        .status(404)
        .send({ error: "Availability request not found" });
    }

    return reply.status(200).send({ data: availabilityRequest });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function getAllAvailability(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const availabilityRequests = await prisma.availabilityRequest.findMany({
      include: {
        user: true,
        inventory: {
          include: {
            customFittedInventory: {
              include: { InventoryFlat: { include: { Flat: true } } },
            },
            InventoryFlat: { include: { Flat: true } },
            InventorySubcategory: { include: { SubCategory: true } },
            InventoryFitted: {
              include: { Fitted: true },
            },
            Category: true,
            Wishlist: true,
            ColorVariations: { include: { Color: true } },
            relatedInventories: { include: { Media: true } },
            relatedByInventories: { include: { Media: true } },
            Media: true,
            SizeChartMedia: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!availabilityRequests || availabilityRequests.length === 0) {
      return reply
        .status(404)
        .send({ error: "No availability requests found" });
    }

    return reply.status(200).send({ data: availabilityRequests });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function updateAvailabilityRequest(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as {
    id: string;
  };
  const { status } = request.body as {
    status: "approved" | "rejected" | "pending";
  };

  try {
    const availabilityRequest =
      await availabilityService.updateAvailabilityRequest(Number(id), status);

    return reply.status(200).send(availabilityRequest);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

export async function checkExpiredRequests(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const now = new Date();
  const fortyTwoHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  console.log(fortyTwoHoursAgo);

  try {
    const expiredRequests = await prisma.availabilityRequest.findMany({
      where: {
        status: "pending",
        updatedAt: { lte: fortyTwoHoursAgo },
      },
    });

    for (const request of expiredRequests) {
      await prisma.availabilityRequest.update({
        where: { id: request.id },
        data: { status: "rejected" },
      });
    }

    return reply.status(200).send({
      message: "Expired requests checked and updated successfully",
      updatedRequests: expiredRequests.length,
    });
  } catch (error) {
    console.error("Error checking expired requests:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}
