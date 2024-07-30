"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = exports.deleteImageFromS3 = exports.saveFile = exports.uploadVideoToS3 = exports.uploadImageToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const util = __importStar(require("util"));
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const mime_types_1 = __importDefault(require("mime-types"));
const AWS_REGION = process.env.P_AWS_REGION;
const ACCESS_KEY_ID = process.env.P_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.P_AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.IMAGE_BUCKET;
const s3Client = new client_s3_1.S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
});
const prisma = new client_1.PrismaClient();
function uploadImageToS3(file) {
    return __awaiter(this, void 0, void 0, function* () {
        // }): Promise<{ key: string; imageUrl: string }> {
        const AWS_REGION = process.env.P_AWS_REGION;
        const ACCESS_KEY_ID = process.env.P_AWS_ACCESS_KEY_ID;
        const SECRET_ACCESS_KEY = process.env.P_AWS_SECRET_ACCESS_KEY;
        const BUCKET_NAME = process.env.IMAGE_BUCKET;
        const s3Client = new client_s3_1.S3Client({
            region: AWS_REGION,
            credentials: {
                accessKeyId: ACCESS_KEY_ID,
                secretAccessKey: SECRET_ACCESS_KEY,
            },
        });
        const contentType = mime_types_1.default.lookup(file.name) || "application/octet-stream";
        try {
            const params = {
                Bucket: BUCKET_NAME,
                Key: `${Date.now()}-${file.name}`,
                Body: file.data,
                // ACL: "public-read",
                ContentType: contentType,
            };
            const uploadResult = yield s3Client.send(new client_s3_1.PutObjectCommand(params));
            const command = new client_s3_1.GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: params.Key,
            });
            const url = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command);
            return { key: params === null || params === void 0 ? void 0 : params.Key, URL: url };
        }
        catch (error) {
            console.error("Error uploading image to S3:", error);
            throw new Error("Failed to upload image");
        }
    });
}
exports.uploadImageToS3 = uploadImageToS3;
function uploadVideoToS3(file) {
    return __awaiter(this, void 0, void 0, function* () {
        // }): Promise<{ key: string; videoUrl: string }> {
        const AWS_REGION = process.env.P_AWS_REGION;
        const ACCESS_KEY_ID = process.env.P_AWS_ACCESS_KEY_ID;
        const SECRET_ACCESS_KEY = process.env.P_AWS_SECRET_ACCESS_KEY;
        const BUCKET_NAME = process.env.IMAGE_BUCKET;
        const s3Client = new client_s3_1.S3Client({
            region: AWS_REGION,
            credentials: {
                accessKeyId: ACCESS_KEY_ID,
                secretAccessKey: SECRET_ACCESS_KEY,
            },
        });
        const contentType = mime_types_1.default.lookup(file.name) || "application/octet-stream";
        try {
            const params = {
                Bucket: BUCKET_NAME,
                Key: `${Date.now()}-${file.name}`,
                Body: file.data,
                ContentType: contentType,
            };
            const uploadResult = yield s3Client.send(new client_s3_1.PutObjectCommand(params));
            const command = new client_s3_1.GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: params.Key,
            });
            const url = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command);
            return { key: params === null || params === void 0 ? void 0 : params.Key, URL: url };
        }
        catch (error) {
            console.error("Error uploading video to S3:", error);
            throw new Error("Failed to upload video");
        }
    });
}
exports.uploadVideoToS3 = uploadVideoToS3;
function saveFile(file, directory) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileName = `${Date.now()}-${file.name}`;
        const directoryPath = path.join(__dirname, "..", directory);
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
        const filePath = path.join(directoryPath, fileName);
        yield util.promisify(fs.writeFile)(filePath, file.data);
        return fileName;
    });
}
exports.saveFile = saveFile;
function deleteImageFromS3(key) {
    return __awaiter(this, void 0, void 0, function* () {
        const AWS_REGION = process.env.P_AWS_REGION;
        const ACCESS_KEY_ID = process.env.P_AWS_ACCESS_KEY_ID;
        const SECRET_ACCESS_KEY = process.env.P_AWS_SECRET_ACCESS_KEY;
        const BUCKET_NAME = process.env.IMAGE_BUCKET;
        const s3Client = new client_s3_1.S3Client({
            region: AWS_REGION,
            credentials: {
                accessKeyId: ACCESS_KEY_ID,
                secretAccessKey: SECRET_ACCESS_KEY,
            },
        });
        try {
            const params = {
                Bucket: BUCKET_NAME,
                Key: key,
            };
            yield s3Client.send(new client_s3_1.DeleteObjectCommand(params));
        }
        catch (error) {
            console.error("Error deleting object from S3:", error);
            throw new Error("Failed to delete object from S3");
        }
    });
}
exports.deleteImageFromS3 = deleteImageFromS3;
function getImage(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const AWS_REGION = process.env.P_AWS_REGION;
        const ACCESS_KEY_ID = process.env.P_AWS_ACCESS_KEY_ID;
        const SECRET_ACCESS_KEY = process.env.P_AWS_SECRET_ACCESS_KEY;
        const BUCKET_NAME = process.env.IMAGE_BUCKET;
        const s3Client = new client_s3_1.S3Client({
            region: AWS_REGION,
            credentials: {
                accessKeyId: ACCESS_KEY_ID,
                secretAccessKey: SECRET_ACCESS_KEY,
            },
        });
        const { imageUrl: key } = request.params;
        try {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key,
            });
            const { Bucket, Key } = command.input;
            const url = `https://${Bucket}.s3.amazonaws.com/${Key}`;
            reply.send(url);
            // const command = new GetObjectCommand({
            //   Bucket: BUCKET_NAME,
            //   Key: key,
            // });
            // const url = await getSignedUrl(s3Client, command);
            // reply.send({ url: url });
        }
        catch (error) {
            console.error("Error fetching image from S3:", error);
            reply.code(404).send({ message: "Image not found" });
        }
    });
}
exports.getImage = getImage;
