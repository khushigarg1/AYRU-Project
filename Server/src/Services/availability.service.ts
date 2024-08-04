// src/services/availabilityService.ts
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "./mail";

const prisma = new PrismaClient();

export class AvailabilityService {
  async createAvailabilityRequest(
    userId: number,
    inventoryid: number,
    mobilenumber: string
  ) {
    await prisma.availabilityRequest.deleteMany({
      where: {
        userId,
        inventoryid,
      },
    });

    const availabilityRequest = await prisma.availabilityRequest.create({
      data: {
        userId,
        inventoryid,
        mobilenumber,
        status: "pending",
      },
    });
    const inventory = await prisma.inventory.findFirst({
      where: {
        id: inventoryid,
      },
      include: {
        Category: true,
      },
    });
    const userDetails = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    // Send email notification to admin
    const to = "ayrujaipur@gmail.com";
    const subject = "New Availability Request";
    const body = `
      <div class="container">
        <h1>New Availability Request</h1>
        <p>User with ID: ${userId} has requested to check the availability of inventory item with ID: ${inventoryid}.</p>
        <p>Product Name: ${inventory?.productName}</p>
        <p>Product category: ${inventory?.Category?.categoryName}</p>
        <p>${process.env.ADMIN_URL}/availability/${availabilityRequest?.id}</p>
        <p>User's mobile number: ${mobilenumber}</p>
        <p>User's email: ${userDetails?.email}</p>
      </div>
    `;

    await sendEmail(to, subject, body);
    return availabilityRequest;
  }

  async updateAvailabilityRequest(id: number, status: string) {
    return prisma.availabilityRequest.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  //   async checkExpiredRequests() {
  //     const now = new Date();
  //     const expiredRequests = await prisma.availabilityRequest.findMany({
  //       where: {
  //         status: "approved",
  //         expiresAt: { lte: now },
  //       },
  //     });

  //     for (const request of expiredRequests) {
  //       await prisma.availabilityRequest.update({
  //         where: { id: request.id },
  //         data: { status: "rejected" },
  //       });

  //       // Send WhatsApp message about expiry here
  //     }
  //   }
}
