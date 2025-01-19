import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/ApiError";

const userStatusCheck = (req: Request, res: Response, next: NextFunction) => {
   const user = (req as any).user;

   if (!user) {
      return next(new ForbiddenError("User not authenticated"));
   }

   if (!user.active) {
      throw new ForbiddenError("You don't have access to this systems Please contact support ");
   };

   next();
}

export default userStatusCheck;