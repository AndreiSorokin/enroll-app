import { BadRequestError, NotFoundError } from "../errors/ApiError";
import TimeSlot from "../models/timeSlot";


const getAllTimeSlots = async() => {
   try {
      return await TimeSlot.findAll();
   } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
            throw error;
      }
   }
};

const getAllAvailableTimeSlots = async(masterId: string, procedureId: string, date: Date) => {
   try {
      return await TimeSlot.findAll({
         where: {
            masterId,
            procedureId,
            date: date.toISOString().split('T')[0],
            isAvailable: true,
         },
      });
   } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
         throw error;
      }
   }
};

const createTimeSlots = async(masterId: string, procedureId: string, date: Date, startTime: Date, endTime: Date, slotDuration: number) => {
   try {
      const slots = [];
      let currentTime = new Date(`${date}T${startTime}`);
      const endTimeDate = new Date(`${date}T${endTime}`);

      while (currentTime < endTimeDate) {
        const nextTime = new Date(currentTime.getTime() + slotDuration * 60000);
         slots.push({
            masterId,
            procedureId,
            date: date.toISOString().split('T')[0],
            startTime: currentTime.toISOString(),
            endTime: nextTime.toISOString(),
            isAvailable: true,
         });
         currentTime = nextTime;
      }
   
      await TimeSlot.bulkCreate(slots);
   } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
         throw error;
      }
   }
};

export default {
   getAllTimeSlots,
   getAllAvailableTimeSlots,
   createTimeSlots
}