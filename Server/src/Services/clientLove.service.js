"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientLoveService = void 0;
const client_1 = require("@prisma/client");
const awsfunction_1 = require("../../config/awsfunction");
const prisma = new client_1.PrismaClient();
const isProduction = process.env.NODE_ENV === "production";
// const saveFile = async (file: any, directory: string): Promise<string> => {
//   const fileName = `${Date.now()}-${file.name}`;
//   console.log(fileName);
//   const directoryPath = path.join(__dirname, "..", directory);
//   if (!fs.existsSync(directoryPath)) {
//     fs.mkdirSync(directoryPath, { recursive: true });
//   }
//   const filePath = path.join(directoryPath, fileName);
//   await util.promisify(fs.writeFile)(filePath, file.data);
//   return fileName;
// };
class ClientLoveService {
    addClientLove(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = data.text;
            let imageUrl = null;
            let video = null;
            if (data.image) {
                const { key } = yield (0, awsfunction_1.uploadImageToS3)(data.image);
                imageUrl = key;
            }
            if (data && data.video !== "null") {
                const { key } = yield (0, awsfunction_1.uploadImageToS3)(data.image);
                imageUrl = key;
            }
            const clientLove = yield prisma.clientLove.create({
                data: { text, imageUrl, video },
            });
            return clientLove;
        });
    }
    getAllClientLoves() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.clientLove.findMany({
                orderBy: {
                    updatedAt: "desc",
                },
            });
        });
    }
    getClientLoveById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientLove = yield prisma.clientLove.findUnique({ where: { id } });
            return clientLove;
        });
    }
    updateClientLove(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let existingClientLove = yield prisma.clientLove.findUnique({
                where: { id },
                select: { imageUrl: true, video: true, text: true },
            });
            if (!existingClientLove) {
                throw new Error(`ClientLove with id ${id} not found.`);
            }
            if (data.image) {
                if (existingClientLove.imageUrl) {
                    yield (0, awsfunction_1.deleteImageFromS3)(existingClientLove.imageUrl);
                }
                const { key } = yield (0, awsfunction_1.uploadImageToS3)(data.image);
                existingClientLove.imageUrl = key !== null && key !== void 0 ? key : null;
            }
            if (data.video && data.video !== "null") {
                if (existingClientLove.video) {
                    yield (0, awsfunction_1.deleteImageFromS3)(existingClientLove.video);
                }
                const { key } = yield (0, awsfunction_1.uploadImageToS3)(data.video);
                existingClientLove.video = key !== null && key !== void 0 ? key : null;
            }
            if (data.text) {
                existingClientLove.text = data.text;
            }
            const updatedClientLove = yield prisma.clientLove.update({
                where: { id },
                data: {
                    text: existingClientLove.text,
                    imageUrl: existingClientLove.imageUrl || null,
                    video: existingClientLove.video || null,
                },
            });
            return updatedClientLove;
        });
    }
    deleteClientLove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientLove = yield prisma.clientLove.findUnique({
                where: { id },
                select: { imageUrl: true, video: true },
            });
            if (clientLove) {
                if (clientLove.imageUrl) {
                    yield (0, awsfunction_1.deleteImageFromS3)(clientLove.imageUrl);
                }
                if (clientLove.video) {
                    yield (0, awsfunction_1.deleteImageFromS3)(clientLove.video);
                }
            }
            return yield prisma.clientLove.delete({ where: { id } });
        });
    }
}
exports.ClientLoveService = ClientLoveService;
