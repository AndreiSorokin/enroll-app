import bcrypt from "bcrypt";
import validator from 'validator';
import { validate as isUuid } from 'uuid';
import nodemailer from "nodemailer";

import { User, Procedure, UserProcedure } from '../models';
import { ApiError, BadRequestError, InternalServerError, NotFoundError } from "../errors/ApiError";

interface ICreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin' | 'master';
  active?: boolean;
};

const deleteMasterProcedure = async () => {
  try {
    
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
  }
};

const addMasterProcedure = async () => {
  try {
    
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
  }
};

const deleteUserProcedure = async (userId: string, procedureId: string) => {
  try {
    if (!validator.isUUID(userId) || !validator.isUUID(procedureId)) {
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

const addUserProcedure = async (userId: string, procedureId: string) => {
  try {
    if (!validator.isUUID(userId) || !validator.isUUID(procedureId)) {
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

    const existingEntry = await UserProcedure.findOne({
      where: { userId, procedureId },
    });

    if (existingEntry) {
      throw new BadRequestError('User already enrolled in this procedure');
    }

    return await UserProcedure.create({
      userId,
      procedureId,
    });
  } catch (error) {
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

const createUser = async(user: ICreateUserInput) => {
  try {
      const { name, email, password, role ='user', active = true } = user;

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

    const newUser = await User.create({
      email,
      name,
      password:
      hashedPassword,
      role,
      active,
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
}