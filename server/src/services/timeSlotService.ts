import { BadRequestError, NotFoundError } from "../errors/ApiError";
import { Procedure, TimeSlot, User } from "../models";


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
      const timeSlots = await TimeSlot.findAll({
         where: {
            masterId,
            procedureId,
            date: date.toISOString().split('T')[0],
            isAvailable: true,
         },
      });
      return timeSlots;
   } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
         throw error;
      }
   }
};

const createTimeSlots = async (masterId: string, procedureId: string, date: string, startTime: string, endTime: string, slotDuration: number) => {
   try {
      const master = await User.findByPk(masterId);
      if (!master || master.role !== 'master') {
         throw new BadRequestError('Only masters can create time slots');
      }
      
      const procedure = await Procedure.findByPk(procedureId);
      if (!procedure) {
         throw new NotFoundError('Procedure not found');
      }
      
      const procedureDuration = procedure.duration;
      if (procedureDuration > slotDuration) {
         throw new BadRequestError(
            `Slot duration (${slotDuration} mins) cannot be smaller than procedure duration (${procedureDuration} mins)`
         );
      }
      
      const workingStart = new Date(`${date}T${startTime}`);
      const workingEnd = new Date(`${date}T${endTime}`);
      
      if (isNaN(workingStart.getTime()) || isNaN(workingEnd.getTime())) {
         throw new BadRequestError('Invalid working hours format');
      }
      if (workingStart >= workingEnd) {
         throw new BadRequestError('Working start time must be earlier than end time');
      }
      
      const slots = [];
      let currentTime = workingStart;
      
      while (currentTime < workingEnd) {
        const nextTime = new Date(currentTime.getTime() + slotDuration * 60 * 60000);
         if (nextTime > workingEnd) break;
         
         const formattedStartTime = currentTime.toISOString().split('T')[1].split('.')[0];
         const formattedEndTime = nextTime.toISOString().split('T')[1].split('.')[0];
         
         slots.push({
            masterId,
            procedureId,
            date: date,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            isAvailable: true,
            slotDuration
         });
         
         currentTime = nextTime;
      }
      
      if (slots.length === 0) {
         throw new BadRequestError('No time slots could be created with the given inputs');
      }
      
      await TimeSlot.bulkCreate(slots, { ignoreDuplicates: true });
      return slots;
      } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
         throw error;
      }
      throw new Error('An unexpected error occurred while creating time slots');
   }
};


export default {
   getAllTimeSlots,
   getAllAvailableTimeSlots,
   createTimeSlots
}