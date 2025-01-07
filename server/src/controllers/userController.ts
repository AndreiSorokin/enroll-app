import userService from "../services/userService";

import { NextFunction, Request, response, Response } from "express";

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
   const users = await userService.getAllUsers();
   if(users.length === 0) {
      res.status(404).json({ message: "No users found" })
      return;
   }
   res.status(200).json(users);
};

export async function getSingleUser(req: Request, res: Response, next: NextFunction) {
   try {
      const { id } = req.params;
      const requesterRole = req.user?.role || 'user';
  
      const user = await userService.getSingleUser(id, requesterRole);
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error });
    }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
   const user = await userService.createUser(req.body);
   res.status(201).json(user);
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {

}