import { FastifyRequest, FastifyReply } from "fastify";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommandInput,
  GetObjectCommandInput,
  DeleteObjectCommandInput,
} from "@aws-sdk/client-s3";
import AWS from "aws-sdk";
import { PrismaClient } from "@prisma/client";
import { PassThrough, Readable } from "stream";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import { ManagedUpload } from "aws-sdk/clients/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const AWS_REGION = process.env.P_AWS_REGION as string;
const ACCESS_KEY_ID = process.env.P_AWS_ACCESS_KEY_ID as string;
const SECRET_ACCESS_KEY = process.env.P_AWS_SECRET_ACCESS_KEY as string;
const BUCKET_NAME = process.env.IMAGE_BUCKET as string;

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});
const prisma = new PrismaClient();

export async function uploadImageToS3(file: { name: string; data: Readable }) {
  // }): Promise<{ key: string; imageUrl: string }> {
  const AWS_REGION = process.env.P_AWS_REGION as string;
  const ACCESS_KEY_ID = process.env.P_AWS_ACCESS_KEY_ID as string;
  const SECRET_ACCESS_KEY = process.env.P_AWS_SECRET_ACCESS_KEY as string;
  const BUCKET_NAME = process.env.IMAGE_BUCKET as string;

  const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  });

  try {
    const params: PutObjectCommandInput = {
      Bucket: BUCKET_NAME,
      Key: `${Date.now()}-${file.name}`,
      Body: file.data,
    };

    const uploadResult = await s3Client.send(new PutObjectCommand(params));

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: params.Key,
    });

    const url = await getSignedUrl(s3Client, command);

    return { key: params?.Key, URL: url };
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw new Error("Failed to upload image");
  }
}

export async function uploadVideoToS3(file: { name: string; data: Readable }) {
  // }): Promise<{ key: string; videoUrl: string }> {

  const AWS_REGION = process.env.P_AWS_REGION as string;
  const ACCESS_KEY_ID = process.env.P_AWS_ACCESS_KEY_ID as string;
  const SECRET_ACCESS_KEY = process.env.P_AWS_SECRET_ACCESS_KEY as string;
  const BUCKET_NAME = process.env.IMAGE_BUCKET as string;

  const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  });
  try {
    const params: PutObjectCommandInput = {
      Bucket: BUCKET_NAME,
      Key: `${Date.now()}-${file.name}`,
      Body: file.data,
    };

    const uploadResult = await s3Client.send(new PutObjectCommand(params));

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: params.Key,
    });

    const url = await getSignedUrl(s3Client, command);
    return { key: params?.Key, URL: url };
  } catch (error) {
    console.error("Error uploading video to S3:", error);
    throw new Error("Failed to upload video");
  }
}

export async function saveFile(file: any, directory: string): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  const directoryPath = path.join(__dirname, "..", directory);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const filePath = path.join(directoryPath, fileName);
  await util.promisify(fs.writeFile)(filePath, file.data);
  return fileName;
}

export async function deleteImageFromS3(key: string): Promise<void> {
  const AWS_REGION = process.env.P_AWS_REGION as string;
  const ACCESS_KEY_ID = process.env.P_AWS_ACCESS_KEY_ID as string;
  const SECRET_ACCESS_KEY = process.env.P_AWS_SECRET_ACCESS_KEY as string;
  const BUCKET_NAME = process.env.IMAGE_BUCKET as string;

  const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  });
  try {
    const params: DeleteObjectCommandInput = {
      Bucket: BUCKET_NAME,
      Key: key,
    };
    await s3Client.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error("Error deleting object from S3:", error);
    throw new Error("Failed to delete object from S3");
  }
}

export async function getImage(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const AWS_REGION = process.env.P_AWS_REGION as string;
  const ACCESS_KEY_ID = process.env.P_AWS_ACCESS_KEY_ID as string;
  const SECRET_ACCESS_KEY = process.env.P_AWS_SECRET_ACCESS_KEY as string;
  const BUCKET_NAME = process.env.IMAGE_BUCKET as string;

  const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  });
  const { imageUrl: key } = request.params as any;

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command);

    reply.send(url);

    // const getObjectParams: GetObjectCommandInput = {
    //   Bucket: BUCKET_NAME,
    //   Key: key,
    // };

    // const command = new GetObjectCommand(getObjectParams);
    // const response = await s3Client.send(command);

    // if (response.Body) {
    //   const contentType = determineContentType(key);
    //   reply.header("Content-Type", contentType);
    //   (response.Body as Readable).pipe(reply.raw);
    // } else {
    //   throw new Error("Empty response body");
    // }
  } catch (error) {
    console.error("Error fetching image from S3:", error);
    reply.code(404).send({ message: "Image not found" });
  }
}

function determineContentType(key: string): string {
  const extension = key.split(".").pop()?.toLowerCase();
  switch (extension) {
    // Images
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "bmp":
      return "image/bmp";
    case "tiff":
      return "image/tiff";
    case "webp":
      return "image/webp";
    case "heif":
    case "heic":
      return "image/heif";

    // Videos
    case "mp4":
      return "video/mp4";
    case "mov":
      return "video/quicktime";
    case "avi":
      return "video/x-msvideo";
    case "mkv":
      return "video/x-matroska";
    case "wmv":
      return "video/x-ms-wmv";
    case "flv":
      return "video/x-flv";
    case "3gp":
      return "video/3gpp";
    case "webm":
      return "video/webm";
    default:
      return "application/octet-stream";
  }
}
