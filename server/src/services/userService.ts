import bcrypt from "bcrypt";
import validator from 'validator';
import { validate as isUuid } from 'uuid';

import { User, Procedure } from '../models';
import { ApiError, BadRequestError, InternalServerError, NotFoundError } from "../errors/ApiError";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin' | 'master';
  active?: boolean;
};

//reset password, ban users*

const getUserByEmail = async (email: string) => {
  try {
    if (!email) {
      throw new BadRequestError('Email is required');
    }
  
    const user = await User.findOne({ 
      where: 
      { email },
      attributes: ['id', 'name', 'email', 'password', 'role', 'active']
    });
  
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  } catch (error) {
    throw new InternalServerError('Database query failed');
  }
}

const getAllUsers = async () => {
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
    console.error('Error fetching user:', error);
    throw error;
  }
};

const createUser = async(user: CreateUserInput): Promise<string | object> => {
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
    active
  });

  return newUser;
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
    throw new InternalServerError('Database query failed');
  }
}

const deleteUser = async (id: string) => {

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
};

export default {
  getAllUsers,
  getSingleUser,
  createUser,
  deleteUser,
  updateUser,
  getUserByEmail
}