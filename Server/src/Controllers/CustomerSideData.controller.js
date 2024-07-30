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
exports.deleteCustomerMedia = exports.getallCustomerMedia = exports.uploadCustomerMedia = exports.deleteCustomerSideData = exports.updateCustomerSideData = exports.getCustomerSideDataById = exports.getCustomerSideData = exports.addCustomerSideData = void 0;
const customerSideData_service_1 = require("../Services/customerSideData.service");
const customerSideDataServiceInstance = new customerSideData_service_1.CustomerSideDataService();
function addCustomerSideData(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { marqueeText, extraNote, additionalText1, additionalText2, additionalText3, } = request.body;
            const data = yield customerSideDataServiceInstance.addCustomerSideData({
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
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.addCustomerSideData = addCustomerSideData;
function getCustomerSideData(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield customerSideDataServiceInstance.getCustomerSideData();
            reply.send({
                message: "Customer side data retrieved successfully",
                data,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.getCustomerSideData = getCustomerSideData;
function getCustomerSideDataById(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const data = yield customerSideDataServiceInstance.getCustomerSideDataById(Number(id));
            reply.send({ data });
        }
        catch (error) {
            reply.code(404).send({ message: error.message });
        }
    });
}
exports.getCustomerSideDataById = getCustomerSideDataById;
function updateCustomerSideData(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const { marqueeText, extraNote, additionalText1, additionalText2, additionalText3, } = request.body;
            const updatedData = yield customerSideDataServiceInstance.updateCustomerSideData(Number(id), {
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
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.updateCustomerSideData = updateCustomerSideData;
function deleteCustomerSideData(server, request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const data = yield customerSideDataServiceInstance.deleteCustomerSideData(Number(id));
            reply.send({
                message: "Customer side data deleted successfully",
                data,
            });
        }
        catch (error) {
            reply.code(400).send({ message: error.message });
        }
    });
}
exports.deleteCustomerSideData = deleteCustomerSideData;
const uploadCustomerMedia = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = request.body;
        const result = yield customerSideDataServiceInstance.uploadCustomerMedia(data);
        reply.send({ message: "ClientLove created successfully", data: result });
    }
    catch (error) {
        reply.status(500).send({ error: "Failed to upload media", details: error });
    }
});
exports.uploadCustomerMedia = uploadCustomerMedia;
const getallCustomerMedia = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = request.query;
        const result = yield customerSideDataServiceInstance.getallCustomerMedia(type);
        reply.send({ message: "data fetched successfully", data: result });
    }
    catch (error) {
        reply.status(500).send({ error: "Failed to get media", details: error });
    }
});
exports.getallCustomerMedia = getallCustomerMedia;
const deleteCustomerMedia = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        const result = yield customerSideDataServiceInstance.deleteCustomerMedia(Number(id));
        reply.send({ message: "deleted successfully", data: result });
    }
    catch (error) {
        reply.status(500).send({ error: "Failed to delete media", details: error });
    }
});
exports.deleteCustomerMedia = deleteCustomerMedia;
