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
exports.deleteClientLove = exports.updateClientLove = exports.getClientLoveById = exports.getAllClientLoves = exports.addClientLove = void 0;
const clientLove_service_1 = require("../Services/clientLove.service");
const clientLoveService = new clientLove_service_1.ClientLoveService();
function addClientLove(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clientLove = yield clientLoveService.addClientLove(request.body);
            reply.send({
                message: "ClientLove created successfully",
                data: clientLove,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.addClientLove = addClientLove;
function getAllClientLoves(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clientLoves = yield clientLoveService.getAllClientLoves();
            reply.send({ data: clientLoves });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.getAllClientLoves = getAllClientLoves;
function getClientLoveById(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = request.params;
        try {
            const clientLove = yield clientLoveService.getClientLoveById(Number(id));
            if (!clientLove) {
                reply.code(404).send({ message: "ClientLove not found" });
            }
            else {
                reply.send({ data: clientLove });
            }
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.getClientLoveById = getClientLoveById;
function updateClientLove(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = request.params;
        try {
            const clientLove = yield clientLoveService.updateClientLove(Number(id), request.body);
            reply.send({
                message: "ClientLove updated successfully",
                data: clientLove,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.updateClientLove = updateClientLove;
function deleteClientLove(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = request.params;
        try {
            yield clientLoveService.deleteClientLove(Number(id));
            reply.send({ message: "ClientLove deleted successfully" });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.deleteClientLove = deleteClientLove;
// export async function getImage(request: FastifyRequest, reply: FastifyReply) {
//   const { imageUrl } = request.params as any;
//   const imagePath = path.join(__dirname, "../uploads/images", imageUrl);
//   console.log("imagepath-----------", imagePath);
//   if (fs.existsSync(imagePath)) {
//     const imageData = fs.readFileSync(imagePath);
//     reply.header("Content-Type", "image/jpeg");
//     reply.send(imageData);
//   } else {
//     reply.code(404).send({ message: "Image not found" });
//   }
// }
