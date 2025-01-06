import { User, Procedure } from '../models';

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
}

export default {
  getAllUsers,
}