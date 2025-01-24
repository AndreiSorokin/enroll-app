import { BadRequestError, NotFoundError } from "../errors/ApiError";
import { TimeSlot } from "../models";
import Booking from "../models/booking";

const getAllBookings = async() => {
   try {
      const bookings = await Booking.findAll();

      if(!bookings || bookings.length === 0) {
         throw new NotFoundError("No bookings found");
      }

      return bookings;
   } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
            throw error;
      }
   }
};

const createBooking = async(userId: string, timeSlotId: string) => {
   try {
      const timeSlot = await TimeSlot.findByPk(timeSlotId);

      if(!timeSlot || !timeSlot.isAvailable) {
         throw new NotFoundError("Time slot is not available");
      }

      const booking = await Booking.create({
         userId,
         timeSlotId
      });

      await timeSlot.update({ isAvailable: false });
      return booking;
   } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
            throw error;
      }
   }
};

const deleteBooking = async(id: string, timeSlotId: string) => {
   try {
      const booking = await Booking.findByPk(id);
      const timeSlot = await TimeSlot.findByPk(timeSlotId);

      if(!booking) {
         throw new NotFoundError("Booking not found");
      }

      if(!timeSlot) {
         throw new BadRequestError("The provided time slot ID does not match the booking's time slot ID");
      }

      await timeSlot.update({ isAvailable: true });
      await booking.destroy();
   } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
         throw error;
      }
   }
};

export default {
   getAllBookings,
   createBooking,
   deleteBooking
}