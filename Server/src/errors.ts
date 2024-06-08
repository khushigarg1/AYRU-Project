import { FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "@prisma/client";
import { logger } from "./logger";

class BaseError extends Error {
  public type: string;
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    type: string,
    message: string,
    statusCode: number,
    isOperational: boolean
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class Api404Error extends BaseError {
  constructor(
    message: string,
    type = "NOT FOUND",
    statusCode = 404,
    isOperational = true
  ) {
    super(type, message, statusCode, isOperational);
  }
}

export class ApiBadRequestError extends BaseError {
  constructor(
    message: string,
    type = "Bad Request",
    statusCode = 400,
    isOperational = false
  ) {
    super(type, message, statusCode, isOperational);
  }
}

export class ApiUnauthorizedError extends BaseError {
  constructor(
    message: string,
    type = "Unauthorized Request",
    statusCode = 401,
    isOperational = false
  ) {
    super(type, message, statusCode, isOperational);
  }
}

export class ApiForbiddenError extends BaseError {
  constructor(
    message: string,
    type = "Forbidden",
    statusCode = 403,
    isOperational = false
  ) {
    super(type, message, statusCode, isOperational);
  }
}

export class ApiInternalServerError extends BaseError {
  constructor(
    message: string,
    type = "Internal Server Error",
    statusCode = 500,
    isOperational = false
  ) {
    super(type, message, statusCode, isOperational);
  }
}

// export const logError = (err: Error, req: FastifyRequest, res: FastifyReply, next: Function) => {
//   logger.error(err);
//   next(err);
// };

export const returnError = (
  err: any,
  req: FastifyRequest,
  res: FastifyReply
) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).send({
      type: "Database Error",
      message: err.message,
      status: 400,
    });
  } else if (err instanceof BaseError) {
    res.status(err.statusCode).send({
      type: err.type,
      message: err.message,
      status: err.statusCode,
    });
  } else {
    res.status(500).send({
      type: "Internal Server Error",
      message: "An unexpected error occurred",
      status: 500,
    });
  }
};
