import { FastifyRequest, FastifyReply } from "fastify";
import AWS from "aws-sdk";
import { Readable } from "stream";
import { ManagedUpload } from "aws-sdk/clients/s3";
import { GetObjectOutput } from "aws-sdk/clients/s3";
import fs from "fs";
import path from "path";
import util from "util";
import { PrismaClient } from "@prisma/client";

AWS.config.update({
  accessKeyId: process.env.P_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.P_AWS_SECRET_ACCESS_KEY,
  region: process.env.P_AWS_REGION,
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.IMAGE_BUCKET;

const prisma = new PrismaClient();

export async function uploadImageToS3(file: {
  name: string;
  data: Readable;
}): Promise<{ key: string; imageUrl: string }> {
  try {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: BUCKET_NAME!,
      Key: Date.now() + "-" + file.name,
      Body: file.data,
    };

    const uploadResult: ManagedUpload.SendData = await s3
      .upload(params)
      .promise();
    console.log(uploadResult);

    return { key: uploadResult?.Key ?? "", imageUrl: uploadResult.Location };
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw new Error("Failed to upload image");
  }
}

export async function uploadVideoToS3(file: {
  filename: string;
  data: Readable;
}): Promise<{ key: string; videoUrl: string }> {
  try {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: BUCKET_NAME!,
      Key: Date.now() + "-" + file.filename,
      Body: file.data,
    };

    const uploadResult: ManagedUpload.SendData = await s3
      .upload(params)
      .promise();
    console.log("Video Upload Result:", uploadResult);

    return { key: uploadResult?.Key ?? "", videoUrl: uploadResult.Location };
  } catch (error) {
    console.error("Error uploading video to S3:", error);
    throw new Error("Failed to upload video");
  }
}
export async function getImageFromS3(key: string): Promise<Buffer> {
  try {
    const getObjectParams: AWS.S3.GetObjectRequest = {
      Bucket: BUCKET_NAME!,
      Key: key,
    };
    const s3Response: GetObjectOutput = await s3
      .getObject(getObjectParams)
      .promise();
    // console.log(s3Response);

    return s3Response?.Body as Buffer;
  } catch (error) {
    console.error("Error fetching image from S3:", error);
    throw new Error("Image not found");
  }
}

export async function saveFile(file: any, directory: string): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  // console.log(fileName);

  const directoryPath = path.join(__dirname, "..", directory);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const filePath = path.join(directoryPath, fileName);
  await util.promisify(fs.writeFile)(filePath, file.data);
  return fileName;
}

export async function deleteImageFromS3(key: string) {
  try {
    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: BUCKET_NAME!,
      Key: key,
    };
    await s3.deleteObject(params).promise();
    // console.log(`Deleted object ${key} from S3`);
  } catch (error) {
    console.error("Error deleting object from S3:", error);
    throw new Error("Failed to delete object from S3");
  }
}
// export async function getImage(request: FastifyRequest, reply: FastifyReply) {
//   const { imageUrl: key } = request.params as any;

//   try {
//     // Fetch the image from S3
//     const getObjectParams = {
//       Bucket: BUCKET_NAME!,
//       Key: key,
//     };
//     const s3Response = await s3.getObject(getObjectParams).promise();
//     // console.log(s3Response);

//     // const contentType = s3Response.ContentType || "application/octet-stream";
//     // reply.header("Content-Type", contentType);

//     reply.send(s3Response.Body);
//   } catch (error) {
//     console.error("Error fetching image from S3:", error);
//     reply.code(404).send({ message: "Image not found" });
//   }
// }
export async function getImage(request: FastifyRequest, reply: FastifyReply) {
  const { imageUrl: key } = request.params as any;

  try {
    const getObjectParams = {
      Bucket: BUCKET_NAME!,
      Key: key,
    };
    const s3Response = await s3.getObject(getObjectParams).promise();
    const contentType = determineContentType(key);
    reply.header("Content-Type", contentType);

    reply.send(s3Response.Body);
  } catch (error) {
    console.error("Error fetching image from S3:", error);
    reply.code(404).send({ message: "Image not found" });
  }
}
function determineContentType(key: string): string {
  const extension = key.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "mp4":
      return "video/mp4";
    case "heif":
      return "image/heif";
    default:
      return "application/octet-stream";
  }
}
