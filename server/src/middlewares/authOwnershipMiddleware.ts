import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors/ApiError";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const authOwnershipMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const request = req as AuthenticatedRequest;

    if (!request.user || !request.user.id) {
      throw new UnauthorizedError("User information not available");
    }

    const { id: requestedUserId } = req.params;

    if (request.user.id !== requestedUserId) {
      console.log("request.user.id: ", request.user.id)
      console.log('requestedUserId: ', requestedUserId)
      throw new ForbiddenError("You are not authorized to perform this action");
    }

    next();
  } catch (error) {
    next(error);
  }
};
