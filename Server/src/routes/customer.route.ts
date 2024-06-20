// routes/customerSideDataRoutes.ts

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  addCustomerSideData,
  getCustomerSideData,
  getCustomerSideDataById,
  updateCustomerSideData,
  deleteCustomerSideData,
  uploadCustomerMedia,
  getallCustomerMedia,
  deleteCustomerMedia,
} from "../Controllers/CustomerSideData.controller";

export default async function customerSideDataRoutes(server: FastifyInstance) {
  server.post<{
    Body: {
      marqueeText: string;
      extraNote?: string;
      additionalText1?: string;
      additionalText2?: string;
      additionalText3?: string;
    };
  }>("", { onRequest: [server.authenticateAdmin] }, (request, reply) =>
    addCustomerSideData(server, request, reply)
  );

  server.get("", (request, reply) =>
    getCustomerSideData(server, request, reply)
  );

  server.get<{ Params: { id: string } }>("/:id", (request, reply) =>
    getCustomerSideDataById(server, request, reply)
  );

  server.put<{
    Params: { id: string };
    Body: {
      marqueeText: string;
      extraNote?: string;
      additionalText1?: string;
      additionalText2?: string;
      additionalText3?: string;
    };
  }>("/:id", { onRequest: [server.authenticateAdmin] }, (request, reply) =>
    updateCustomerSideData(server, request, reply)
  );

  server.delete<{ Params: { id: string } }>(
    "/:id",
    { onRequest: [server.authenticateAdmin] },
    (request, reply) => deleteCustomerSideData(server, request, reply)
  );

  //--------------------upload media and all

  server.post(
    "/upload",
    { onRequest: [server.authenticateAdmin] },
    uploadCustomerMedia
  );
  server.get("/media", getallCustomerMedia);
  server.delete(
    "/media/:id",
    { onRequest: [server.authenticateAdmin] },
    deleteCustomerMedia
  );
}
