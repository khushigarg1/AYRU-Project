"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnError = exports.ApiInternalServerError = exports.ApiForbiddenError = exports.ApiUnauthorizedError = exports.ApiBadRequestError = exports.Api404Error = void 0;
const client_1 = require("@prisma/client");
class BaseError extends Error {
    constructor(type, message, statusCode, isOperational) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.type = type;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
class Api404Error extends BaseError {
    constructor(message, type = "NOT FOUND", statusCode = 404, isOperational = true) {
        super(type, message, statusCode, isOperational);
    }
}
exports.Api404Error = Api404Error;
class ApiBadRequestError extends BaseError {
    constructor(message, type = "Bad Request", statusCode = 400, isOperational = false) {
        super(type, message, statusCode, isOperational);
    }
}
exports.ApiBadRequestError = ApiBadRequestError;
class ApiUnauthorizedError extends BaseError {
    constructor(message, type = "Unauthorized Request", statusCode = 401, isOperational = false) {
        super(type, message, statusCode, isOperational);
    }
}
exports.ApiUnauthorizedError = ApiUnauthorizedError;
class ApiForbiddenError extends BaseError {
    constructor(message, type = "Forbidden", statusCode = 403, isOperational = false) {
        super(type, message, statusCode, isOperational);
    }
}
exports.ApiForbiddenError = ApiForbiddenError;
class ApiInternalServerError extends BaseError {
    constructor(message, type = "Internal Server Error", statusCode = 500, isOperational = false) {
        super(type, message, statusCode, isOperational);
    }
}
exports.ApiInternalServerError = ApiInternalServerError;
// export const logError = (err: Error, req: FastifyRequest, res: FastifyReply, next: Function) => {
//   logger.error(err);
//   next(err);
// };
const returnError = (err, req, res) => {
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        res.status(400).send({
            type: "Database Error",
            message: err.message,
            status: 400,
        });
    }
    else if (err instanceof BaseError) {
        res.status(err.statusCode).send({
            type: err.type,
            message: err.message,
            status: err.statusCode,
        });
    }
    else {
        res.status(500).send({
            type: "Internal Server Error",
            message: "An unexpected error occurred",
            status: 500,
        });
    }
};
exports.returnError = returnError;
