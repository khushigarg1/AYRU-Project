import { FastifyRequest } from "fastify";
import jwt, {
  JsonWebTokenError,
  TokenExpiredError,
  VerifyErrors,
} from "jsonwebtoken";

// Define the `extractUser` method
async function extractUser(request: FastifyRequest) {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new Error("Authorization header missing");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const secretKey = process.env.JWT_TOKEN_SECRET;
    if (!secretKey) {
      throw new Error("JWT secret key not configured");
    }

    const decoded = jwt.verify(token, secretKey) as {
      id: number;
      email: string;
    };

    // Attach user details to the request
    request.user = decoded;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new Error("Token expired");
    } else if (error instanceof JsonWebTokenError) {
      throw new Error("Invalid token");
    } else {
      throw error;
    }
  }
}

export default extractUser;
