import bcrypt from "bcrypt";
import validator from 'validator';

import { User, Procedure } from '../models';
import { ApiError } from "../errors/ApiError";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin' | 'master';
  active?: boolean;
}

const getAllUsers = () => {
  return User.findAll({
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
}

export default {
  getAllUsers,
  createUser
}