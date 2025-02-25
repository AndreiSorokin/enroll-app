import { Request, Response, NextFunction } from "express";
import { uploadImage } from "../../src/controllers/uploads";
import { uploadImageToCloudinary } from "../../src/services/uploads";
import { InternalServerError } from "../../src/errors/ApiError";

jest.mock("../../src/services/uploads", () => ({
  uploadImageToCloudinary: jest.fn(),
}));

const mockRequest = (file?: any) =>
  ({
    file,
  } as Request);

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext = jest.fn() as NextFunction;

describe("Upload Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadImage", () => {
    it("should upload an image and return imageUrl", async () => {
      const file = {
        originalname: "test-image.jpg",
        buffer: Buffer.from("fake-image-data"),
      };
      const imageUrl = "https://cloudinary.com/test-image.jpg";
      (uploadImageToCloudinary as jest.Mock).mockResolvedValue(imageUrl);

      const req = mockRequest(file);
      const res = mockResponse();

      await uploadImage(req, res, mockNext);

      expect(uploadImageToCloudinary).toHaveBeenCalledWith(file.buffer, file.originalname);
      expect(res.json).toHaveBeenCalledWith({ imageUrl });
      expect(res.status).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if no file is uploaded", async () => {
      const req = mockRequest(undefined);
      const res = mockResponse();

      await uploadImage(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("No file uploaded");
      expect(uploadImageToCloudinary).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with InternalServerError if upload fails", async () => {
      const file = {
        originalname: "test-image.jpg",
        buffer: Buffer.from("fake-image-data"),
      };
      const error = new Error("Cloudinary upload failed");
      (uploadImageToCloudinary as jest.Mock).mockRejectedValue(error);

      const req = mockRequest(file);
      const res = mockResponse();

      await uploadImage(req, res, mockNext);

      expect(uploadImageToCloudinary).toHaveBeenCalledWith(file.buffer, file.originalname);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(InternalServerError));
    });
  });
});