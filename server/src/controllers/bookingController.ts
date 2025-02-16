import { NextFunction, Request, Response } from "express";

import bookingService from '../services/bookingService';

export async function getUserBookings (req: Request, res: Response, next: NextFunction) {
   try {
      const userId = req.params.userId;
      const bookings = await bookingService.getUserBookings(userId);
      res.status(200).json(bookings);
   } catch (error) {
      next(error);
   }
};

export async function getAllBookings(req: Request, res: Response, next: NextFunction) {
   try {
      const bookings = await bookingService.getAllBookings();
      res.json(bookings);
   } catch (error) {
      next(error)
   }
};

export async function createBooking(req: Request, res: Response, next: NextFunction) {
   try {
      const { userId, timeSlotId } = req.body;

      if (!userId ||!timeSlotId) {
         res.status(400).json({ message: "userId and timeSlotId are required." });
         return;
      }

      const booking = await bookingService.createBooking(userId, timeSlotId);
      res.json(booking);
   } catch (error) {
      next(error)
   }
};

export async function deleteBooking(req: Request, res: Response, next: NextFunction) {
   try {
      const { id } = req.params;
      const { timeSlotId } = req.query;
      await bookingService.deleteBooking(id, timeSlotId as string);

      res.status(204).json({ message: "Booking has been deleted successfully" });
   } catch (error) {
      next(error);
   }
};