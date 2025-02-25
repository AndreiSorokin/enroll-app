import { Request, Response, NextFunction } from "express";
import {
   getUserBookings,
   getAllBookings,
   createBooking,
   deleteBooking,
} from "../../src/controllers/bookingController";
import bookingService from "../../src/services/bookingService";

jest.mock("../../src/services/bookingService", () => ({
   getUserBookings: jest.fn(),
   getAllBookings: jest.fn(),
   createBooking: jest.fn(),
   deleteBooking: jest.fn(),
}));

const mockRequest = (params = {}, body = {}, query = {}) =>
   ({
      params,
      body,
      query,
   } as Request);

const mockResponse = () => {
   const res: Partial<Response> = {};
   res.status = jest.fn().mockReturnValue(res);
   res.json = jest.fn().mockReturnValue(res);
   return res as Response;
};

const mockNext = jest.fn() as NextFunction;

describe("Booking Controllers", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe("getUserBookings", () => {
      it("should return bookings for a user with status 200", async () => {
         const userId = "123";
         const bookings = [{ id: "1", userId, timeSlotId: "456" }];
         (bookingService.getUserBookings as jest.Mock).mockResolvedValue(bookings);

         const req = mockRequest({ userId });
         const res = mockResponse();

         await getUserBookings(req, res, mockNext);

         expect(bookingService.getUserBookings).toHaveBeenCalledWith(userId);
         expect(res.status).toHaveBeenCalledWith(200);
      });

      it("should call next with error if bookingService fails", async () => {
         const userId = "123";
         const error = new Error("Database error");
         (bookingService.getUserBookings as jest.Mock).mockRejectedValue(error);

         const req = mockRequest({ userId });
         const res = mockResponse();

         await getUserBookings(req, res, mockNext);

         expect(bookingService.getUserBookings).toHaveBeenCalledWith(userId);
         expect(res.status).not.toHaveBeenCalled();
      });
   });

   describe("getAllBookings", () => {
         it("should return all bookings", async () => {
         const bookings = [
            { id: "1", userId: "123", timeSlotId: "456" },
            { id: "2", userId: "789", timeSlotId: "012" },
         ];
         (bookingService.getAllBookings as jest.Mock).mockResolvedValue(bookings);

         const req = mockRequest();
         const res = mockResponse();

         await getAllBookings(req, res, mockNext);

         expect(bookingService.getAllBookings).toHaveBeenCalled();
         expect(res.json).toHaveBeenCalledWith(bookings);
      });

      it("should call next with error if bookingService fails", async () => {
         const error = new Error("Service unavailable");
         (bookingService.getAllBookings as jest.Mock).mockRejectedValue(error);

         const req = mockRequest();
         const res = mockResponse();

         await getAllBookings(req, res, mockNext);

         expect(bookingService.getAllBookings).toHaveBeenCalled();
         expect(res.json).not.toHaveBeenCalled();
      });
   });

   describe("createBooking", () => {
      it("should create a booking and return it", async () => {
         const userId = "123";
         const timeSlotId = "456";
         const booking = { id: "1", userId, timeSlotId };
         (bookingService.createBooking as jest.Mock).mockResolvedValue(booking);

         const req = mockRequest({}, { userId, timeSlotId });
         const res = mockResponse();

         await createBooking(req, res, mockNext);

         expect(bookingService.createBooking).toHaveBeenCalledWith(userId, timeSlotId);
         expect(res.json).toHaveBeenCalledWith(booking);
      });

      it("should return 400 if userId or timeSlotId is missing", async () => {
         const req = mockRequest({}, { userId: "123" });
         const res = mockResponse();

         await createBooking(req, res, mockNext);

         expect(res.status).toHaveBeenCalledWith(400);
         expect(res.json).toHaveBeenCalledWith({ message: "userId and timeSlotId are required." });
      });

    it("should call next with error if bookingService fails", async () => {
      const userId = "123";
      const timeSlotId = "456";
      const error = new Error("Booking conflict");
      (bookingService.createBooking as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({}, { userId, timeSlotId });
      const res = mockResponse();

      await createBooking(req, res, mockNext);

      expect(bookingService.createBooking).toHaveBeenCalledWith(userId, timeSlotId);
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
   });

   describe("deleteBooking", () => {
      it("should delete a booking and return 204", async () => {
         const id = "1";
         const timeSlotId = "456";
         (bookingService.deleteBooking as jest.Mock).mockResolvedValue(undefined);

         const req = mockRequest({ id }, {}, { timeSlotId });
         const res = mockResponse();

         await deleteBooking(req, res, mockNext);

         expect(bookingService.deleteBooking).toHaveBeenCalledWith(id, timeSlotId);
         expect(res.status).toHaveBeenCalledWith(204);
         expect(res.json).toHaveBeenCalledWith({ message: "Booking has been deleted successfully" });
      });

      it("should call next with error if bookingService fails", async () => {
         const id = "1";
         const timeSlotId = "456";
         const error = new Error("Booking not found");
         (bookingService.deleteBooking as jest.Mock).mockRejectedValue(error);

         const req = mockRequest({ id }, {}, { timeSlotId });
         const res = mockResponse();

         await deleteBooking(req, res, mockNext);

         expect(bookingService.deleteBooking).toHaveBeenCalledWith(id, timeSlotId);
         expect(res.status).not.toHaveBeenCalled();
         expect(res.json).not.toHaveBeenCalled();
      });
   });
});