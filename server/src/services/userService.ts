import { User, Procedure } from '../models';

const getAllUsers = () => {
   return User.findAll({
      include: [
        {
          model: Procedure,
          as: 'procedures', // Match the alias used in the association
        },
        {
          model: Procedure,
          as: 'MasterProcedures', // Match the alias used in the association
        },
      ],
    });
}

export default {
   getAllUsers,
}