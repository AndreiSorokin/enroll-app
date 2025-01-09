import { NextFunction, Request, response, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

import userService from "../services/userService";
import { User } from "../misc/types";
import { BadRequestError } from "../errors/ApiError";

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
   try {
      const { email } = req.body;
      const userData = await userService.getUserByEmail(email);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const token:string = uuid();

      if(!userData) {
         throw new BadRequestError('User not found');
      }

      if (!emailRegex.test(email)) {
         throw new BadRequestError('Invalid email format');
      }

      const verificationLink = `http://localhost:3009/api/v1/users/reset-password?token=${token}`;
      await userService.sendVerificationMail(email, verificationLink);

      userData.resetToken = token;
      userData.resetTokenExpiresAt = new Date(Date.now() + 3600000);
      await userData.save();
      response
      .status(200)
      .json({ message: "Verification email sent successfully." });
   } catch (error) {
      next(error);
   }
};

export async function userLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
   console.log('JWT_SECRET1:', process.env.JWT_SECRET);
   try {
      const { email, password } = req.body;
      const userData = await userService.getUserByEmail(email) as Partial<User>;

      if (!userData || !userData.password) {
         throw new BadRequestError('Invalid credentials');
      }
      
      const hashedPassword = userData.password!;

      const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

      if (!isPasswordCorrect) {
         res.status(401).json({ message: "Invalid credentials" });
         return;
      }

      const token = jwt.sign({
         id: userData.id,
         name: userData.name,
         email: userData.email,
         role: userData.role,
         active: userData.active
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
   );

      const refreshToken = jwt.sign({
         email: userData.email,
         role: userData.role,
         active: userData.active
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
   );

      res.cookie('refreshToken', refreshToken, {
         httpOnly: true,
         secure: true,
         sameSite: 'strict',
         maxAge: 20 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({ token, refreshToken, userData });
   } catch (error) {
      next(error);
   }
};

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
   try {
      const users = await userService.getAllUsers();
      if(users.length === 0) {
         res.status(404).json({ message: "No users found" })
         return;
      }
   res.status(200).json(users);
   } catch (error) {
      next(error);
   }
};

export async function getSingleUser(req: Request, res: Response, next: NextFunction) {
   try {
      const user = await userService.getSingleUser(req.params.id);
      res.status(200).json(user);
   } catch (error) {
      next(error);
   }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
   try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
   } catch (error) {
      next(error);
   }
}

export async function updateUser (req: Request, res: Response, next: NextFunction) {
   try {
      const id = req.params.id;
      const updates = req.body;

      const updatedUser = await userService.updateUser(id, updates);
      res.status(200).json(updatedUser);
   } catch (error) {
      next(error);
   }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
   try {
      await userService.deleteUser(req.params.id);
      res.status(204).send('User deleted successfully');
   } catch (error) {
      next(error);
   }
}