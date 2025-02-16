import { NextFunction, Request, Response } from "express";

import timeSlotService from '../services/timeSlotService';

export async function getAllTimeSlots(req: Request, res: Response, next: NextFunction) {
   try {
      const timeSlots = await timeSlotService.getAllTimeSlots();
      if(!timeSlots || timeSlots.length === 0) {
         res.status(404).json({ message: "No time slots found" })
         return;
      }
      res.status(200).json(timeSlots);
   } catch (error) {
      next(error);
   }
};

export async function getAllAvailableTimeSlots(req: Request, res: Response, next: NextFunction) {
   try {
      const { masterId, procedureId, date } = req.query;

      if (!masterId || !procedureId || !date) {
         res.status(400).json({ message: "masterId, procedureId, and date are required." });
         return
      }

      const dateString = typeof date === 'string' ? date : String(date);
      const parsedDate = new Date(dateString);
      
      if (isNaN(parsedDate.getTime())) {
         res.status(400).json({ message: "Invalid date format." });
         return
      }

      const timeSlots = await timeSlotService.getAllAvailableTimeSlots(
         masterId as string,
         procedureId as string,
         parsedDate
      );

      if (!timeSlots || timeSlots.length === 0) {
         res.status(404).json({ message: "No available time slots found." });
         return
      }

      res.status(200).json(timeSlots);
   } catch (error) {
      next(error);
   }
};

export async function createTimeSlots(req: Request, res: Response, next: NextFunction) {
   try {
      const { masterId, procedureId } = req.params; 
      const { date, startTime, endTime, slotDuration } = req.body;
      if (!masterId ||!procedureId ||!date ||!startTime ||!endTime ||!slotDuration) {
         res.status(400).json({ message: "masterId, procedureId, date, startTime, endTime, and slotDuration are required." });
         return
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
         res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
         return;
      }

      const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
         res.status(400).json({ message: "Invalid time format. Use HH:mm:ss." });
         return;
      }

      if (isNaN(slotDuration) || slotDuration <= 0) {
         res.status(400).json({ message: "slotDuration must be a positive number." });
         return;
      }

      const createrTimeSlot = await timeSlotService.createTimeSlots(
         masterId,
         procedureId, 
         date, 
         startTime, 
         endTime, 
         slotDuration
      );

      res.status(201).json({createrTimeSlot, message: 'Time slots successfully created' });
   } catch (error) {
      next(error);
   }
};