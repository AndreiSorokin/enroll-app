import { BadRequestError, NotFoundError } from "../errors/ApiError";
import { TimeSlot, UserProcedure } from "../models";
import Booking from "../models/booking";

const getUserBookings = async(userId: string) => {
   try {
      const bookings = await Booking.findAll({
         where: { userId },
         include: [{ model: TimeSlot, as: 'TimeSlot' }]
      });

      console.log("bookings: ", bookings)
      if(bookings.length === 0) {
         throw new NotFoundError("No bookings found for this user");
      }

      return bookings;
   } catch (error) {
      console.error("❌ Error in getUserBookings:", error);
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
         throw error;
      }
   }
};

const getAllBookings = async() => {
   try {
      const bookings = await Booking.findAll();

      if(bookings.length === 0) {
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
   deleteBooking,
   getUserBookings
}