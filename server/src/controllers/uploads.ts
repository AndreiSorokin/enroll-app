import { Request, Response, NextFunction } from 'express';
import { uploadImageToCloudinary } from '../services/uploads';
import { InternalServerError } from '../errors/ApiError';

export const uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   if (!req.file) {
      res.status(400).send('No file uploaded');
      return;
   }
   try {
      const fileName = req.file.originalname;
      const fileBuffer = req.file.buffer;
      const imageUrl = await uploadImageToCloudinary(fileBuffer, fileName);
      res.json({ imageUrl });
   } catch (error) {
      next(new InternalServerError());
   }
};