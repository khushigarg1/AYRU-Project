// controllers/sizeChartMediaController.ts

import { FastifyRequest, FastifyReply } from "fastify";
import {
  uploadChartMedia,
  getChartMedia,
  deleteChartMedia,
} from "../../Services/Inventory/sizechartmedia.services";

export const handleUploadChartMedia = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };
    const data = request.body;
    const newMedia = await uploadChartMedia(Number(id), data);
    reply.send(newMedia);
  } catch (error) {
    reply.status(500).send({ error: error });
  }
};

export const handleGetChartMedia = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };
    const media = await getChartMedia(Number(id));
    reply.send(media);
  } catch (error) {
    reply.status(500).send({ error: error });
  }
};

export const handleDeleteChartMedia = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };
    const media = await deleteChartMedia(Number(id));
    reply.send(media);
  } catch (error) {
    reply.status(500).send({ error: error });
  }
};
