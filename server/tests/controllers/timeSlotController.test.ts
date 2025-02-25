import { Request, Response, NextFunction } from "express";
import {
  getAllTimeSlots,
  getAllAvailableTimeSlots,
  createTimeSlots,
} from "../../src/controllers/timeSlotController";
import timeSlotService from "../../src/services/timeSlotService";

jest.mock("../../src/services/timeSlotService", () => ({
  getAllTimeSlots: jest.fn(),
  getAllAvailableTimeSlots: jest.fn(),
  createTimeSlots: jest.fn(),
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

describe("TimeSlot Controllers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTimeSlots", () => {
    it("should return all time slots with status 200", async () => {
      const timeSlots = [
        { id: "1", date: "2025-03-01", startTime: "09:00:00" },
        { id: "2", date: "2025-03-01", startTime: "10:00:00" },
      ];
      (timeSlotService.getAllTimeSlots as jest.Mock).mockResolvedValue(timeSlots);

      const req = mockRequest();
      const res = mockResponse();

      await getAllTimeSlots(req, res, mockNext);

      expect(timeSlotService.getAllTimeSlots).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(timeSlots);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 404 if no time slots are found", async () => {
      (timeSlotService.getAllTimeSlots as jest.Mock).mockResolvedValue([]);

      const req = mockRequest();
      const res = mockResponse();

      await getAllTimeSlots(req, res, mockNext);

      expect(timeSlotService.getAllTimeSlots).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No time slots found" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      const error = new Error("Database error");
      (timeSlotService.getAllTimeSlots as jest.Mock).mockRejectedValue(error);

      const req = mockRequest();
      const res = mockResponse();

      await getAllTimeSlots(req, res, mockNext);

      expect(timeSlotService.getAllTimeSlots).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getAllAvailableTimeSlots", () => {
    it("should return available time slots with status 200", async () => {
      const query = { masterId: "m1", procedureId: "p1", date: "2025-03-01" };
      const timeSlots = [
        { id: "1", startTime: "09:00:00" },
        { id: "2", startTime: "10:00:00" },
      ];
      (timeSlotService.getAllAvailableTimeSlots as jest.Mock).mockResolvedValue(timeSlots);

      const req = mockRequest({}, {}, query);
      const res = mockResponse();

      await getAllAvailableTimeSlots(req, res, mockNext);

      expect(timeSlotService.getAllAvailableTimeSlots).toHaveBeenCalledWith(
        query.masterId,
        query.procedureId,
        expect.any(Date)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(timeSlots);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if any required query param is missing", async () => {
      const query = { masterId: "m1", procedureId: "p1" };
      const req = mockRequest({}, {}, query);
      const res = mockResponse();

      await getAllAvailableTimeSlots(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "masterId, procedureId, and date are required." });
      expect(timeSlotService.getAllAvailableTimeSlots).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if date format is invalid", async () => {
      const query = { masterId: "m1", procedureId: "p1", date: "invalid-date" };
      const req = mockRequest({}, {}, query);
      const res = mockResponse();

      await getAllAvailableTimeSlots(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid date format." });
      expect(timeSlotService.getAllAvailableTimeSlots).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 404 if no available time slots are found", async () => {
      const query = { masterId: "m1", procedureId: "p1", date: "2025-03-01" };
      (timeSlotService.getAllAvailableTimeSlots as jest.Mock).mockResolvedValue([]);

      const req = mockRequest({}, {}, query);
      const res = mockResponse();

      await getAllAvailableTimeSlots(req, res, mockNext);

      expect(timeSlotService.getAllAvailableTimeSlots).toHaveBeenCalledWith(
        query.masterId,
        query.procedureId,
        expect.any(Date)
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No available time slots found." });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      const query = { masterId: "m1", procedureId: "p1", date: "2025-03-01" };
      const error = new Error("Service error");
      (timeSlotService.getAllAvailableTimeSlots as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({}, {}, query);
      const res = mockResponse();

      await getAllAvailableTimeSlots(req, res, mockNext);

      expect(timeSlotService.getAllAvailableTimeSlots).toHaveBeenCalledWith(
        query.masterId,
        query.procedureId,
        expect.any(Date)
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("createTimeSlots", () => {
    it("should create time slots and return 201 with success message", async () => {
      const params = { masterId: "m1", procedureId: "p1" };
      const body = {
        date: "2025-03-01",
        startTime: "09:00:00",
        endTime: "12:00:00",
        slotDuration: 30,
      };
      const createdSlots = [{ id: "1", startTime: "09:00:00" }];
      (timeSlotService.createTimeSlots as jest.Mock).mockResolvedValue(createdSlots);

      const req = mockRequest(params, body);
      const res = mockResponse();

      await createTimeSlots(req, res, mockNext);

      expect(timeSlotService.createTimeSlots).toHaveBeenCalledWith(
        params.masterId,
        params.procedureId,
        body.date,
        body.startTime,
        body.endTime,
        body.slotDuration
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        createdTimeSlot: createdSlots,
        message: "Time slots successfully created",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if any required field is missing", async () => {
      const params = { masterId: "m1", procedureId: "p1" };
      const body = { date: "2025-03-01", startTime: "09:00:00" };
      const req = mockRequest(params, body);
      const res = mockResponse();

      await createTimeSlots(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "masterId, procedureId, date, startTime, endTime, and slotDuration are required.",
      });
      expect(timeSlotService.createTimeSlots).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if date format is invalid", async () => {
      const params = { masterId: "m1", procedureId: "p1" };
      const body = {
        date: "2025/03/01",
        startTime: "09:00:00",
        endTime: "12:00:00",
        slotDuration: 30,
      };
      const req = mockRequest(params, body);
      const res = mockResponse();

      await createTimeSlots(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid date format. Use YYYY-MM-DD." });
      expect(timeSlotService.createTimeSlots).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if time format is invalid", async () => {
      const params = { masterId: "m1", procedureId: "p1" };
      const body = {
        date: "2025-03-01",
        startTime: "9:00",
        endTime: "12:00:00",
        slotDuration: 30,
      };
      const req = mockRequest(params, body);
      const res = mockResponse();

      await createTimeSlots(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid time format. Use HH:mm:ss." });
      expect(timeSlotService.createTimeSlots).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if slotDuration is not a positive number", async () => {
      const params = { masterId: "m1", procedureId: "p1" };
      const body = {
        date: "2025-03-01",
        startTime: "09:00:00",
        endTime: "12:00:00",
        slotDuration: -5,
      };
      const req = mockRequest(params, body);
      const res = mockResponse();

      await createTimeSlots(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "slotDuration must be a positive number." });
      expect(timeSlotService.createTimeSlots).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      const params = { masterId: "m1", procedureId: "p1" };
      const body = {
        date: "2025-03-01",
        startTime: "09:00:00",
        endTime: "12:00:00",
        slotDuration: 30,
      };
      const error = new Error("Service error");
      (timeSlotService.createTimeSlots as jest.Mock).mockRejectedValue(error);

      const req = mockRequest(params, body);
      const res = mockResponse();

      await createTimeSlots(req, res, mockNext);

      expect(timeSlotService.createTimeSlots).toHaveBeenCalledWith(
        params.masterId,
        params.procedureId,
        body.date,
        body.startTime,
        body.endTime,
        body.slotDuration
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});