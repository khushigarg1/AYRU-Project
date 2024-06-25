import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CustomerSideDataService } from "../Services/customerSideData.service";

const customerSideDataServiceInstance = new CustomerSideDataService();

interface AddCustomerSideDataRequest {
  Body: {
    marqueeText: string;
    extraNote?: string;
    additionalText1?: string;
    additionalText2?: string;
    additionalText3?: string;
  };
}

export async function addCustomerSideData(
  server: FastifyInstance,
  request: FastifyRequest<AddCustomerSideDataRequest>,
  reply: FastifyReply
) {
  try {
    const {
      marqueeText,
      extraNote,
      additionalText1,
      additionalText2,
      additionalText3,
    } = request.body;

    const data = await customerSideDataServiceInstance.addCustomerSideData({
      marqueeText,
      extraNote,
      additionalText1,
      additionalText2,
      additionalText3,
    });

    reply.send({
      message: "Customer side data created successfully",
      data,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function getCustomerSideData(
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const data = await customerSideDataServiceInstance.getCustomerSideData();
    reply.send({
      message: "Customer side data retrieved successfully",
      data,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function getCustomerSideDataById(
  server: FastifyInstance,
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const data = await customerSideDataServiceInstance.getCustomerSideDataById(
      Number(id)
    );
    reply.send({ data });
  } catch (error) {
    reply.code(404).send({ message: (error as Error).message });
  }
}

export async function updateCustomerSideData(
  server: FastifyInstance,
  request: FastifyRequest<
    { Params: { id: string } } & AddCustomerSideDataRequest
  >,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const {
      marqueeText,
      extraNote,
      additionalText1,
      additionalText2,
      additionalText3,
    } = request.body;

    const updatedData =
      await customerSideDataServiceInstance.updateCustomerSideData(Number(id), {
        marqueeText,
        extraNote,
        additionalText1,
        additionalText2,
        additionalText3,
      });

    reply.send({
      message: "Customer side data updated successfully",
      data: updatedData,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export async function deleteCustomerSideData(
  server: FastifyInstance,
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const data = await customerSideDataServiceInstance.deleteCustomerSideData(
      Number(id)
    );
    reply.send({
      message: "Customer side data deleted successfully",
      data,
    });
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
}

export const uploadCustomerMedia = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const data = request.body;
    const result = await customerSideDataServiceInstance.uploadCustomerMedia(
      data
    );

    reply.send({ message: "ClientLove created successfully", data: result });
  } catch (error) {
    reply.status(500).send({ error: "Failed to upload media", details: error });
  }
};
export const getallCustomerMedia = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { type } = request.query as any;
    console.log(type);

    const result = await customerSideDataServiceInstance.getallCustomerMedia(
      type
    );
    reply.send({ message: "data fetched successfully", data: result });
  } catch (error) {
    reply.status(500).send({ error: "Failed to get media", details: error });
  }
};
export const deleteCustomerMedia = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as any;
    const result = await customerSideDataServiceInstance.deleteCustomerMedia(
      Number(id)
    );
    reply.send({ message: "deleted successfully", data: result });
  } catch (error) {
    reply.status(500).send({ error: "Failed to delete media", details: error });
  }
};
