import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import {
  getUserProcedure,
  getAllMasterProcedures,
  getSingleMasterProcedure,
  googleLogin,
  updateUserStatus,
  updateMasterProcedure,
  deleteMasterProcedure,
  deleteUserProcedure,
  addMasterProcedure,
  addUserProcedure,
  forgotPassword,
  resetPassword,
  changePassword,
  userLogin,
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} from "../../src/controllers/userController";
import userService from "../../src/services/userService";
import { BadRequestError } from "../../src/errors/ApiError";

jest.mock("../../src/services/userService", () => ({
  getUserProcedure: jest.fn(),
  getAllMasterProcedures: jest.fn(),
  getSingleMasterProcedure: jest.fn(),
  updateUserStatus: jest.fn(),
  updateMasterProcedure: jest.fn(),
  deleteMasterProcedure: jest.fn(),
  deleteUserProcedure: jest.fn(),
  addMasterProcedure: jest.fn(),
  addUserProcedure: jest.fn(),
  getUserByEmail: jest.fn(),
  sendVerificationMail: jest.fn(),
  getUserByResetToken: jest.fn(),
  updatePassword: jest.fn(),
  getSingleUser: jest.fn(),
  getAllUsers: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

const mockRequest = (params = {}, body = {}, query = {}, additional = {}) =>
  ({
    params,
    body,
    query,
    ...additional,
  } as Request);

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext = jest.fn() as NextFunction;

describe("User Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserProcedure", () => {
    it("should return user procedures", async () => {
      const id = "1";
      const procedures = [{ id: "p1", name: "Haircut" }];
      (userService.getUserProcedure as jest.Mock).mockResolvedValue(procedures);

      const req = mockRequest({ id });
      const res = mockResponse();

      await getUserProcedure(req, res, mockNext);

      expect(userService.getUserProcedure).toHaveBeenCalledWith(id);
      expect(res.json).toHaveBeenCalledWith(procedures);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      const id = "1";
      const error = new Error("Service error");
      (userService.getUserProcedure as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({ id });
      const res = mockResponse();

      await getUserProcedure(req, res, mockNext);

      expect(userService.getUserProcedure).toHaveBeenCalledWith(id);
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getAllMasterProcedures", () => {
    it("should return all master procedures", async () => {
      const masterId = "m1";
      const procedures = [{ id: "p1", name: "Haircut" }];
      (userService.getAllMasterProcedures as jest.Mock).mockResolvedValue(procedures);

      const req = mockRequest({ id: masterId });
      const res = mockResponse();

      await getAllMasterProcedures(req, res, mockNext);

      expect(userService.getAllMasterProcedures).toHaveBeenCalledWith(masterId);
      expect(res.json).toHaveBeenCalledWith(procedures);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      const masterId = "m1";
      const error = new Error("Service error");
      (userService.getAllMasterProcedures as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({ id: masterId });
      const res = mockResponse();

      await getAllMasterProcedures(req, res, mockNext);

      expect(userService.getAllMasterProcedures).toHaveBeenCalledWith(masterId);
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getSingleMasterProcedure", () => {
    it("should return a single master procedure", async () => {
      const masterId = "m1";
      const procedureId = "p1";
      const procedure = { id: procedureId, name: "Haircut" };
      (userService.getSingleMasterProcedure as jest.Mock).mockResolvedValue(procedure);

      const req = mockRequest({ id: masterId, procedureId });
      const res = mockResponse();

      await getSingleMasterProcedure(req, res, mockNext);

      expect(userService.getSingleMasterProcedure).toHaveBeenCalledWith(masterId, procedureId);
      expect(res.json).toHaveBeenCalledWith(procedure);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      const masterId = "m1";
      const procedureId = "p1";
      const error = new Error("Service error");
      (userService.getSingleMasterProcedure as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({ id: masterId, procedureId });
      const res = mockResponse();

      await getSingleMasterProcedure(req, res, mockNext);

      expect(userService.getSingleMasterProcedure).toHaveBeenCalledWith(masterId, procedureId);
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("googleLogin", () => {
    it("should return tokens for Google login", async () => {
      const user = { id: "1", email: "test@example.com", name: "Test", active: true, role: "user" };
      const token = "jwt-token";
      const refreshToken = "jwt-refresh-token";
      (jwt.sign as jest.Mock).mockReturnValueOnce(token).mockReturnValueOnce(refreshToken);

      const req = mockRequest({}, {}, {}, { user });
      const res = mockResponse();

      await googleLogin(req, res, mockNext);

      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Google login successful", token, refreshToken });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if token generation fails", async () => {
      const user = { id: "1", email: "test@example.com", name: "Test", active: true, role: "user" };
      const error = new Error("JWT error");
      (jwt.sign as jest.Mock).mockImplementation(() => { throw error; });

      const req = mockRequest({}, {}, {}, { user });
      const res = mockResponse();

      await googleLogin(req, res, mockNext);

      expect(jwt.sign).toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("updateUserStatus", () => {
    it("should update user status", async () => {
      const id = "1";
      const updatedUser = { id, active: true };
      (userService.updateUserStatus as jest.Mock).mockResolvedValue(updatedUser);

      const req = mockRequest({ id }, { active: true });
      const res = mockResponse();

      await updateUserStatus(req, res, mockNext);

      expect(userService.updateUserStatus).toHaveBeenCalledWith(id, true);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "User status updated", user: updatedUser });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError if active is not boolean", async () => {
      const id = "1";
      const req = mockRequest({ id }, { active: "not-a-boolean" });
      const res = mockResponse();

      await updateUserStatus(req, res, mockNext);

      expect(userService.updateUserStatus).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it("should call next with error if service fails", async () => {
      const id = "1";
      const error = new Error("Service error");
      (userService.updateUserStatus as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({ id }, { active: true });
      const res = mockResponse();

      await updateUserStatus(req, res, mockNext);

      expect(userService.updateUserStatus).toHaveBeenCalledWith(id, true);
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("updateMasterProcedure", () => {
    it("should update master procedure", async () => {
      const body = { masterId: "m1", procedureId: "p1", price: 50 };
      const updatedProcedure = { id: "p1", price: 50 };
      (userService.updateMasterProcedure as jest.Mock).mockResolvedValue(updatedProcedure);

      const req = mockRequest({}, body);
      const res = mockResponse();

      await updateMasterProcedure(req, res, mockNext);

      expect(userService.updateMasterProcedure).toHaveBeenCalledWith(body.masterId, body.procedureId, body.price);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedProcedure);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if required fields are missing or price is negative", async () => {
      const body = { masterId: "m1", price: -10 };
      const req = mockRequest({}, body);
      const res = mockResponse();

      await updateMasterProcedure(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Master ID and Procedure ID are required" });
      expect(userService.updateMasterProcedure).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      const body = { masterId: "m1", procedureId: "p1", price: 50 };
      const error = new Error("Service error");
      (userService.updateMasterProcedure as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({}, body);
      const res = mockResponse();

      await updateMasterProcedure(req, res, mockNext);

      expect(userService.updateMasterProcedure).toHaveBeenCalledWith(body.masterId, body.procedureId, body.price);
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteMasterProcedure", () => {
    it("should delete master procedure", async () => {
      const masterId = "m1";
      const procedureId = "p1";
      (userService.deleteMasterProcedure as jest.Mock).mockResolvedValue(undefined);

      const req = mockRequest({ id: masterId }, { procedureId });
      const res = mockResponse();

      await deleteMasterProcedure(req, res, mockNext);

      expect(userService.deleteMasterProcedure).toHaveBeenCalledWith(masterId, procedureId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Procedure removed" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if procedureId is missing", async () => {
      const masterId = "m1";
      const req = mockRequest({ id: masterId }, {});
      const res = mockResponse();

      await deleteMasterProcedure(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Procedure ID is required" });
      expect(userService.deleteMasterProcedure).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      const masterId = "m1";
      const procedureId = "p1";
      const error = new Error("Service error");
      (userService.deleteMasterProcedure as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({ id: masterId }, { procedureId });
      const res = mockResponse();

      await deleteMasterProcedure(req, res, mockNext);

      expect(userService.deleteMasterProcedure).toHaveBeenCalledWith(masterId, procedureId);
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteUserProcedure", () => {
    it("should delete user procedure", async () => {
      const userId = "u1";
      const query = { procedureId: "p1", masterId: "m1" };
      (userService.deleteUserProcedure as jest.Mock).mockResolvedValue(undefined);

      const req = mockRequest({ id: userId }, {}, query);
      const res = mockResponse();

      await deleteUserProcedure(req, res, mockNext);

      expect(userService.deleteUserProcedure).toHaveBeenCalledWith(userId, query.procedureId, query.masterId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Enrollment cancelled" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if any required param is missing", async () => {
      const userId = "u1";
      const query = { procedureId: "p1" };
      const req = mockRequest({ id: userId }, {}, query);
      const res = mockResponse();

      await deleteUserProcedure(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "User ID, Procedure ID and Master ID are required", userId, procedureId: query.procedureId, masterId: undefined });
      expect(userService.deleteUserProcedure).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      const userId = "u1";
      const query = { procedureId: "p1", masterId: "m1" };
      const error = new Error("Service error");
      (userService.deleteUserProcedure as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({ id: userId }, {}, query);
      const res = mockResponse();

      await deleteUserProcedure(req, res, mockNext);

      expect(userService.deleteUserProcedure).toHaveBeenCalledWith(userId, query.procedureId, query.masterId);
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("addMasterProcedure", () => {
    it("should add a master procedure", async () => {
      const masterId = "m1";
      const body = { procedureName: "Haircut", price: 50, duration: 30 };
      const masterProcedure = { id: "p1", name: "Haircut" };
      (userService.addMasterProcedure as jest.Mock).mockResolvedValue(masterProcedure);

      const req = mockRequest({ id: masterId }, body);
      const res = mockResponse();

      await addMasterProcedure(req, res, mockNext);

      expect(userService.addMasterProcedure).toHaveBeenCalledWith(masterId, body.procedureName, body.price, body.duration);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Procedure listed", masterProcedure });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if required fields are missing", async () => {
      const masterId = "m1";
      const body = { price: 50 };
      const req = mockRequest({ id: masterId }, body);
      const res = mockResponse();

      await addMasterProcedure(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Procedure name, and price are required" });
      expect(userService.addMasterProcedure).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      const masterId = "m1";
      const body = { procedureName: "Haircut", price: 50, duration: 30 };
      const error = new Error("Service error");
      (userService.addMasterProcedure as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({ id: masterId }, body);
      const res = mockResponse();

      await addMasterProcedure(req, res, mockNext);

      expect(userService.addMasterProcedure).toHaveBeenCalledWith(masterId, body.procedureName, body.price, body.duration);
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("addUserProcedure", () => {
    it("should add a user procedure", async () => {
      const body = { userId: "u1", procedureId: "p1", masterId: "m1" };
      (userService.addUserProcedure as jest.Mock).mockResolvedValue(undefined);

      const req = mockRequest({}, body);
      const res = mockResponse();

      await addUserProcedure(req, res, mockNext);

      expect(userService.addUserProcedure).toHaveBeenCalledWith(body.userId, body.procedureId, body.masterId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Procedure added successfully" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if required fields are missing", async () => {
      const body = { userId: "u1", procedureId: "p1" };
      const req = mockRequest({}, body);
      const res = mockResponse();

      await addUserProcedure(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "User ID, Procedure ID and Master ID are required" });
      expect(userService.addUserProcedure).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      const body = { userId: "u1", procedureId: "p1", masterId: "m1" };
      const error = new Error("Service error");
      (userService.addUserProcedure as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({}, body);
      const res = mockResponse();

      await addUserProcedure(req, res, mockNext);

      expect(userService.addUserProcedure).toHaveBeenCalledWith(body.userId, body.procedureId, body.masterId);
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("forgotPassword", () => {
    it("should send verification email and update user", async () => {
      const email = "test@example.com";
      const user = { id: "1", email, save: jest.fn().mockResolvedValue(true) };
      const token = "uuid-token";
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(user);
      (uuid as jest.Mock).mockReturnValue(token);
      (userService.sendVerificationMail as jest.Mock).mockResolvedValue(undefined);

      const req = mockRequest({}, { email });
      const res = mockResponse();

      await forgotPassword(req, res, mockNext);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(uuid).toHaveBeenCalled();
      expect(userService.sendVerificationMail).toHaveBeenCalledWith(email, expect.stringContaining(token));
      expect(user.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Verification email sent successfully." });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError if user not found", async () => {
      const email = "test@example.com";
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(null);

      const req = mockRequest({}, { email });
      const res = mockResponse();

      await forgotPassword(req, res, mockNext);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it("should throw BadRequestError if email format is invalid", async () => {
      const email = "invalid-email";
      const req = mockRequest({}, { email });
      const res = mockResponse();

      await forgotPassword(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });

  describe("resetPassword", () => {
    it("should reset password", async () => {
      const token = "reset-token";
      const newPassword = "newpassword123";
      const user = { id: "1" };
      const newUserData = { id: "1", password: "hashed" };
      (userService.getUserByResetToken as jest.Mock).mockResolvedValue(user);
      (userService.updatePassword as jest.Mock).mockResolvedValue(newUserData);

      const req = mockRequest({}, { newPassword }, { token });
      const res = mockResponse();

      await resetPassword(req, res, mockNext);

      expect(userService.getUserByResetToken).toHaveBeenCalledWith(token);
      expect(userService.updatePassword).toHaveBeenCalledWith(user, newPassword);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ newUserData, message: "Password reset successfully." });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError if newPassword is too short", async () => {
      const token = "reset-token";
      const newPassword = "short";
      const req = mockRequest({}, { newPassword }, { token });
      const res = mockResponse();

      await resetPassword(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it("should throw BadRequestError if token is missing", async () => {
      const newPassword = "newpassword123";
      const req = mockRequest({}, { newPassword }, {});
      const res = mockResponse();

      await resetPassword(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it("should throw BadRequestError if user not found", async () => {
      const token = "reset-token";
      const newPassword = "newpassword123";
      (userService.getUserByResetToken as jest.Mock).mockResolvedValue(null);

      const req = mockRequest({}, { newPassword }, { token });
      const res = mockResponse();

      await resetPassword(req, res, mockNext);

      expect(userService.getUserByResetToken).toHaveBeenCalledWith(token);
      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });

  describe("changePassword", () => {
    it("should change password", async () => {
      const id = "1";
      const user = { id, password: "hashed" };
      const updatedUser = { id, password: "new-hashed" };
      (userService.getSingleUser as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (userService.updatePassword as jest.Mock).mockResolvedValue(updatedUser);

      const req = mockRequest({ id }, { currentPassword: "oldpass", newPassword: "newpass" });
      const res = mockResponse();

      await changePassword(req, res, mockNext);

      expect(userService.getSingleUser).toHaveBeenCalledWith(id);
      expect(bcrypt.compare).toHaveBeenCalledWith("oldpass", "hashed");
      expect(userService.updatePassword).toHaveBeenCalledWith(user, "newpass");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(updatedUser);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError if passwords are missing", async () => {
      const id = "1";
      const req = mockRequest({ id }, { currentPassword: "oldpass" });
      const res = mockResponse();

      await changePassword(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it("should throw BadRequestError if user not found", async () => {
      const id = "1";
      (userService.getSingleUser as jest.Mock).mockResolvedValue(null);

      const req = mockRequest({ id }, { currentPassword: "oldpass", newPassword: "newpass" });
      const res = mockResponse();

      await changePassword(req, res, mockNext);

      expect(userService.getSingleUser).toHaveBeenCalledWith(id);
      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it("should throw BadRequestError if current password is incorrect", async () => {
      const id = "1";
      const user = { id, password: "hashed" };
      (userService.getSingleUser as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const req = mockRequest({ id }, { currentPassword: "wrongpass", newPassword: "newpass" });
      const res = mockResponse();

      await changePassword(req, res, mockNext);

      expect(bcrypt.compare).toHaveBeenCalledWith("wrongpass", "hashed");
      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });

  describe("userLogin", () => {
    it("should log in user and return tokens", async () => {
      const userData = { id: "1", email: "test@example.com", password: "hashed", name: "Test", role: "user", active: true };
      const token = "jwt-token";
      const refreshToken = "jwt-refresh-token";
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(userData);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValueOnce(token).mockReturnValueOnce(refreshToken);

      const req = mockRequest({}, { email: "test@example.com", password: "pass" });
      const res = mockResponse();

      await userLogin(req, res, mockNext);

      expect(userService.getUserByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("pass", "hashed");
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(res.cookie).toHaveBeenCalledWith("refreshToken", refreshToken, expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token, refreshToken, userData });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 if password is incorrect", async () => {
      const userData = { id: "1", email: "test@example.com", password: "hashed" };
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(userData);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const req = mockRequest({}, { email: "test@example.com", password: "wrongpass" });
      const res = mockResponse();

      await userLogin(req, res, mockNext);

      expect(bcrypt.compare).toHaveBeenCalledWith("wrongpass", "hashed");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError if user not found", async () => {
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(null);

      const req = mockRequest({}, { email: "test@example.com", password: "pass" });
      const res = mockResponse();

      await userLogin(req, res, mockNext);

      expect(userService.getUserByEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const users = [{ id: "1", email: "test@example.com" }];
      (userService.getAllUsers as jest.Mock).mockResolvedValue(users);

      const req = mockRequest();
      const res = mockResponse();

      await getAllUsers(req, res, mockNext);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 404 if no users found", async () => {
      (userService.getAllUsers as jest.Mock).mockResolvedValue([]);

      const req = mockRequest();
      const res = mockResponse();

      await getAllUsers(req, res, mockNext);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No users found" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      const error = new Error("Service error");
      (userService.getAllUsers as jest.Mock).mockRejectedValue(error);

      const req = mockRequest();
      const res = mockResponse();

      await getAllUsers(req, res, mockNext);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getSingleUser", () => {
    it("should return a single user", async () => {
      const id = "1";
      const user = { id, email: "test@example.com" };
      (userService.getSingleUser as jest.Mock).mockResolvedValue(user);

      const req = mockRequest({ id });
      const res = mockResponse();

      await getSingleUser(req, res, mockNext);

      expect(userService.getSingleUser).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      const id = "1";
      const error = new Error("Service error");
      (userService.getSingleUser as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({ id });
      const res = mockResponse();

      await getSingleUser(req, res, mockNext);

      expect(userService.getSingleUser).toHaveBeenCalledWith(id);
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("createUser", () => {
    it("should create a user with file", async () => {
      const body = { email: "test@example.com" };
      const file = { buffer: Buffer.from("image-data") };
      const user = { id: "1", email: "test@example.com" };
      (userService.createUser as jest.Mock).mockResolvedValue(user);

      const req = mockRequest({}, body, {}, { file });
      const res = mockResponse();

      await createUser(req, res, mockNext);

      expect(userService.createUser).toHaveBeenCalledWith(body, file.buffer);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(user);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should create a user without file", async () => {
      const body = { email: "test@example.com" };
      const user = { id: "1", email: "test@example.com" };
      (userService.createUser as jest.Mock).mockResolvedValue(user);

      const req = mockRequest({}, body);
      const res = mockResponse();

      await createUser(req, res, mockNext);

      expect(userService.createUser).toHaveBeenCalledWith(body, undefined);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(user);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      const body = { email: "test@example.com" };
      const error = new Error("Service error");
      (userService.createUser as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({}, body);
      const res = mockResponse();

      await createUser(req, res, mockNext);

      expect(userService.createUser).toHaveBeenCalledWith(body, undefined);
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("updateUser", () => {
    it("should update a user", async () => {
      const id = "1";
      const updates = { email: "new@example.com" };
      const updatedUser = { id, email: "new@example.com" };
      (userService.updateUser as jest.Mock).mockResolvedValue(updatedUser);

      const req = mockRequest({ id }, updates);
      const res = mockResponse();

      await updateUser(req, res, mockNext);

      expect(userService.updateUser).toHaveBeenCalledWith(id, updates);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      const id = "1";
      const updates = { email: "new@example.com" };
      const error = new Error("Service error");
      (userService.updateUser as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({ id }, updates);
      const res = mockResponse();

      await updateUser(req, res, mockNext);

      expect(userService.updateUser).toHaveBeenCalledWith(id, updates);
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const id = "1";
      (userService.deleteUser as jest.Mock).mockResolvedValue(undefined);

      const req = mockRequest({ id });
      const res = mockResponse();

      await deleteUser(req, res, mockNext);

      expect(userService.deleteUser).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalledWith("User deleted successfully");
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if service fails", async () => {
      const id = "1";
      const error = new Error("Service error");
      (userService.deleteUser as jest.Mock).mockRejectedValue(error);

      const req = mockRequest({ id });
      const res = mockResponse();

      await deleteUser(req, res, mockNext);

      expect(userService.deleteUser).toHaveBeenCalledWith(id);
      expect(res.send).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});