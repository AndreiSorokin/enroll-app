import { Request, Response, NextFunction } from "express";
import { ForbiddenError, NotFoundError } from "../errors/ApiError";

const adminCheck= (req: Request, res: Response, next: NextFunction): void => {

   const user = (req as any).user;

   if(!user) {
      throw new NotFoundError("Admin imformation not found");
   }

   if (user.role !== "admin") {
      throw new ForbiddenError("Only admins can perform this action");
   }

   next();
};

export default adminCheck;