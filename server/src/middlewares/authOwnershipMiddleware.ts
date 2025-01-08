import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors/ApiError";

export const authOwnershipMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // if (!req.user || !req.user.id) {
    //   throw new UnauthorizedError('User information not available');
    // }

    const { id } = req.params;

    // if (req.user.id !== id) {
    //   throw new ForbiddenError('You are not authorized to do this');
    // }

  next();
  } catch (error) {
    next(error);
  }
};