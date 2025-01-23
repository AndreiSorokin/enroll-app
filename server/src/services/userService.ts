import bcrypt from "bcrypt";
import validator from 'validator';
import { validate as isUuid } from 'uuid';
import nodemailer from "nodemailer";

import { User, Procedure, UserProcedure, MasterProcedure } from '../models';
import { ApiError, BadRequestError, InternalServerError, NotFoundError } from "../errors/ApiError";
import { uploadImageToCloudinary } from "./uploads"

interface ICreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin' | 'master';
  active?: boolean;
  image?: string;
};

const updateUserStatus = async(userId: string, active: boolean) => {
  try {
    const user = await User.findOne({
      where: { id: userId },
    });

    if(!user) {
      throw new NotFoundError('User not found');
    }

    await user.update({ active });
    return user;
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
  }
};

const updateMasterProcedure = async (masterId: string, procedureId: string, price: number) => {
  try {
    if (!validator.isUUID(masterId) || !validator.isUUID(procedureId)) {
      throw new BadRequestError('Invalid format of User ID or Procedure ID');
    };

    const master = await User.findByPk(masterId);
    if (!master) {
      throw new NotFoundError('Master not found');
    };

    const procedure = await Procedure.findByPk(procedureId);
    if (!procedure) {
      throw new NotFoundError('Procedure not found');
    };

    const masterProcedure = await MasterProcedure.findOne({
      where: { masterId, procedureId },
    });

    if (!masterProcedure) {
      throw new NotFoundError('Master Procedure not found');
    };

    return await masterProcedure.update({ price });
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
  }
};

const deleteMasterProcedure = async (masterId: string, procedureId: string) => {
  try {
    if (!validator.isUUID(masterId) || !validator.isUUID(procedureId)) {
      throw new BadRequestError('Invalid format of User ID or Procedure ID');
    }

    const master = await User.findByPk(masterId);
    if (!master) {
      throw new NotFoundError('Master not found');
    }

    const procedure = await Procedure.findByPk(procedureId);
    if (!procedure) {
      throw new NotFoundError('Procedure not found');
    }

    const userProcedure = await MasterProcedure.findOne({
      where: { masterId, procedureId },
    });

    if (!userProcedure) {
      throw new NotFoundError('Procedure not found');
    }

    await userProcedure.destroy();
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
  }
};

const deleteUserProcedure = async (userId: string, procedureId: string, masterId: string) => {
  try {
    if (!validator.isUUID(userId) || !validator.isUUID(procedureId) || !validator.isUUID(masterId)) {
      throw new BadRequestError('Invalid format of User ID or Procedure ID');
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const procedure = await Procedure.findByPk(procedureId);
    if (!procedure) {
      throw new NotFoundError('Procedure not found');
    }

    const master = await User.findByPk(masterId);
    if (!master || master.role !== 'master') {
      throw new NotFoundError('Master not found or the provided ID is not a master');
    }

    const masterProcedure = await MasterProcedure.findOne({
      where: { masterId, procedureId },
    });

    if (!masterProcedure) {
      throw new NotFoundError('The specified master cannot perform this procedure');
    }

    const userProcedure = await UserProcedure.findOne({
      where: { userId, procedureId },
    });

    if (!userProcedure) {
      throw new NotFoundError('Enrollment not found');
    }

    await userProcedure.destroy();
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
  }
};

const addMasterProcedure = async (masterId: string, procedureName: string, price: number, duration: number) => {
  try {
    if (!validator.isUUID(masterId) || !procedureName || price <= 0) {
      throw new BadRequestError('Invalid format of User ID or Procedure ID');
    }

    const master = await User.findByPk(masterId);
    if (!master) {
      throw new NotFoundError('Master not found');
    }

    if (master.role !== 'master') {
      throw new BadRequestError('Only masters can add master procedures');
    }

    const procedure = await Procedure.create({ name: procedureName, duration });

    return await MasterProcedure.create({
      masterId,
      procedureId: procedure.id,
      price
    });
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
  }
};

const addUserProcedure = async (userId: string, procedureId: string, masterId: string) => {
  try {
    if (!validator.isUUID(userId) || !validator.isUUID(procedureId) || !validator.isUUID(masterId)) {
      throw new BadRequestError('Invalid format of User ID or Procedure ID');
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const procedure = await Procedure.findByPk(procedureId);
    if (!procedure) {
      throw new NotFoundError('Procedure not found');
    }

    const master = await User.findByPk(masterId);
    if (!master || master.role !== 'master') {
      throw new NotFoundError('Master not found or the provided ID is not a master');
    }

    const masterProcedure = await MasterProcedure.findOne({
      where: { masterId, procedureId },
    });

    if (!masterProcedure) {
      throw new NotFoundError('The specified master cannot perform this procedure');
    }

    const existingEntry = await UserProcedure.findOne({
      where: { userId, procedureId, masterId },
    });

    if (existingEntry) {
      throw new BadRequestError('User already enrolled in this procedure');
    }

    return await UserProcedure.create({
      userId,
      procedureId,
      masterId
    });
  } catch (error) {
  console.log('error: ', error)
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
  }
};

const sendVerificationMail = async(email: string, verificationLink: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: process.env.MAILER_USER,
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking this link: ${verificationLink}`,
  };

  return await transporter.sendMail(mailOptions);
};

const getUserByEmail = async (email: string) => {
  try {
    if (!email) {
      throw new BadRequestError('Email is required');
    }
  
    const user = await User.findOne({ 
      where: 
      { email },
      attributes: ['id', 'name', 'email', 'password', 'role', 'active', 'resetToken', 'resetTokenExpiresAt']
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
  }
};

const getUserByResetToken = async(resetToken: string) => {
  try {
    if (!resetToken) {
      throw new BadRequestError(`Please provide resetToken`);
    }

    const user = await User.findOne({
      where: { resetToken }
    })

    if (!user) {
      throw new NotFoundError(`No user found with resetToken ${resetToken}`);
    }

    if (user.resetTokenExpiresAt && user.resetTokenExpiresAt <= new Date()) {
      throw new BadRequestError('Reset token has expired');
    }

    return user;
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
  }
};

const updatePassword = async(user: User, newPassword: string) => {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiresAt = null;

    await user.save();
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
  }
};

const getAllUsers = async () => {
  try {
    return await User.findAll({
        include: [
          {
            model: Procedure,
            as: 'EnrolledProcedures',
          },
          {
            model: Procedure,
            as: 'MasterProcedures',
          },
        ],
      });
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
  }
};

const getSingleUser = async (id: string) => {
  try {
    if (!validator.isUUID(id)) {
      throw new BadRequestError('Invalid user ID format');
    }

    const user = await User.findOne({
      where: { id },
      include: [
        {
          model: Procedure,
          as: 'EnrolledProcedures',
        },
        {
          model: Procedure,
          as: 'MasterProcedures',
        },
      ],
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
  }
};

const createUser = async(user: ICreateUserInput, fileBuffer?: Buffer) => {
  try {
      const { name, email, password, role ='user', active = true, image } = user;

    if (!['user', 'admin', 'master'].includes(role)) {
      throw new ApiError(400, `Invalid role: ${role}`);
    }

    const isEmailTaken = await User.findOne({ where: { email } });
    if (isEmailTaken) {
      return 'A user with this email already exists';
    }

    if (!validator.isEmail(email)) {
      throw new ApiError(400, 'Invalid email format');
    }

    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    let imageUrl = null;
    if (fileBuffer) {
      imageUrl = await uploadImageToCloudinary(fileBuffer, email);
    }

    const newUser = await User.create({
      email,
      name,
      password:
      hashedPassword,
      role,
      active,
      image: imageUrl,
      resetToken: null,
      resetTokenExpiresAt: null,
    });

    return newUser;
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    } 
  }
};

const updateUser = async (id: string, updates: User) => {
  try {
    if (!isUuid(id)) {
      throw new BadRequestError('Invalid user ID format');
    }
  
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
  
    return await user.update(updates);
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
  }
};

const deleteUser = async (id: string) => {

  try {
    if (!isUuid(id)) {
      throw new BadRequestError('Invalid user ID format');
    }
  
    const user = await User.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundError('User not found');
    }
  
    await User.destroy({
      where: { id },
    });
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
  }
};

export default {
  getAllUsers,
  getSingleUser,
  createUser,
  deleteUser,
  updateUser,
  getUserByEmail,
  sendVerificationMail,
  addUserProcedure,
  deleteUserProcedure,
  addMasterProcedure,
  deleteMasterProcedure,
  updateMasterProcedure,
  updateUserStatus,
  getUserByResetToken,
  updatePassword
}