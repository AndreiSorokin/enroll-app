import userService from "../services/userService";

import { NextFunction, Request, response, Response } from "express";

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
   const users = await userService.getAllUsers();
   if(users.length === 0) {
      res.status(404).json({ message: "No users found" })
      return;
   }
   res.status(200).json(users);
}