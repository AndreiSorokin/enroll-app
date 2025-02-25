import { Request, Response, NextFunction } from "express";
import {
  deleteProcedure,
  getAllProcedures,
  getSingleProcedure,
  getMastersByProcedure,
} from "../../src/controllers/procedureController";
import procedureService from "../../src/services/procedureService";

jest.mock("../../src/services/procedureService", () => ({
  deleteProcedure: jest.fn(),
  getAllProcedures: jest.fn(),
  getSingleProcedure: jest.fn(),
  getMastersByProcedure: jest.fn(),
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

describe("Procedure Controllers", () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  describe("deleteProcedure", () => {
    it("should delete a procedure and return 204 with success message", async () => {
      const id = "1";
      (procedureService.deleteProcedure as jest.Mock).mockResolvedValue(undefined);

      const req = mockRequest({ id });
      const res = mockResponse();

      await deleteProcedure(req, res, mockNext);

      expect(procedureService.deleteProcedure).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ message: "Procedure has been deleted successfully" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if procedureService fails", async () => {
      const id = "1";
      const error = new Error("Procedure not found");
      (procedureService.deleteProcedure as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({ id });
      const res = mockResponse();

      await deleteProcedure(req, res, mockNext);

      expect(procedureService.deleteProcedure).toHaveBeenCalledWith(id);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getAllProcedures", () => {
    it("should return all procedures", async () => {
      const procedures = [
        { id: "1", name: "Haircut" },
        { id: "2", name: "Manicure" },
      ];
      (procedureService.getAllProcedures as jest.Mock).mockResolvedValue(procedures);

      const req = mockRequest();
      const res = mockResponse();

      await getAllProcedures(req, res, mockNext);

      expect(procedureService.getAllProcedures).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(procedures);
      expect(res.status).not.toHaveBeenCalledWith(404);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 404 if no procedures are found", async () => {
      (procedureService.getAllProcedures as jest.Mock).mockResolvedValue([]);

      const req = mockRequest();
      const res = mockResponse();

      await getAllProcedures(req, res, mockNext);

      expect(procedureService.getAllProcedures).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No procedures found" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if procedureService fails", async () => {
      const error = new Error("Database error");
      (procedureService.getAllProcedures as jest.Mock).mockRejectedValue(error);

      const req = mockRequest();
      const res = mockResponse();

      await getAllProcedures(req, res, mockNext);

      expect(procedureService.getAllProcedures).toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getSingleProcedure", () => {
    it("should return a single procedure", async () => {
      const id = "1";
      const procedure = { id, name: "Haircut" };
      (procedureService.getSingleProcedure as jest.Mock).mockResolvedValue(procedure);

      const req = mockRequest({ id });
      const res = mockResponse();

      await getSingleProcedure(req, res, mockNext);

      expect(procedureService.getSingleProcedure).toHaveBeenCalledWith(id);
      expect(res.json).toHaveBeenCalledWith(procedure);
      expect(res.status).not.toHaveBeenCalledWith(404);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 404 if procedure is not found", async () => {
      const id = "1";
      (procedureService.getSingleProcedure as jest.Mock).mockResolvedValue(null);

      const req = mockRequest({ id });
      const res = mockResponse();

      await getSingleProcedure(req, res, mockNext);

      expect(procedureService.getSingleProcedure).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Procedure not found" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if procedureService fails", async () => {
      const id = "1";
      const error = new Error("Service error");
      (procedureService.getSingleProcedure as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({ id });
      const res = mockResponse();

      await getSingleProcedure(req, res, mockNext);

      expect(procedureService.getSingleProcedure).toHaveBeenCalledWith(id);
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getMastersByProcedure", () => {
    it("should return masters for a procedure", async () => {
      const id = "1";
      const masters = [
        { id: "m1", name: "Master A" },
        { id: "m2", name: "Master B" },
      ];
      (procedureService.getMastersByProcedure as jest.Mock).mockResolvedValue(masters);

      const req = mockRequest({ id });
      const res = mockResponse();

      await getMastersByProcedure(req, res, mockNext);

      expect(procedureService.getMastersByProcedure).toHaveBeenCalledWith(id);
      expect(res.json).toHaveBeenCalledWith(masters);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if procedureService fails", async () => {
      const id = "1";
      const error = new Error("No masters found");
      (procedureService.getMastersByProcedure as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({ id });
      const res = mockResponse();

      await getMastersByProcedure(req, res, mockNext);

      expect(procedureService.getMastersByProcedure).toHaveBeenCalledWith(id);
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});