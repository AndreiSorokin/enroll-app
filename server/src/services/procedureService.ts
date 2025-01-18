import validator from 'validator';

import { User, Procedure } from '../models';
import { ApiError, BadRequestError, InternalServerError, NotFoundError } from "../errors/ApiError";

interface IProcedure {
   price: number;
   name: string;
}

const deleteProcedure = async(id: string) => {
   try {
      if (!validator.isUUID(id)) {
         throw new BadRequestError('Invalid procedure ID format');
      }

      const procedure = await Procedure.findOne({ where: { id } });

      if (!procedure) {
         throw new NotFoundError("Procedure not found");
      }

      await Procedure.destroy({
         where: { id },
      });
   } catch (error) {
      throw new NotFoundError("Procedure not found");
   }
}

const getAllProcedures = async() => {
   try {
      const allProcedures = await Procedure.findAll();
      if (!allProcedures) {
         throw new NotFoundError('No procedures found');
      }

      return allProcedures;
   } catch (error) {
      throw new InternalServerError('Database query failed')
   }
};

const getSingleProcedure = async(id: string) => {
   try {
      if (!validator.isUUID(id)) {
         throw new BadRequestError('Invalid procedure ID format');
      }

      const procedure = await Procedure.findOne({
         where: { id },
         include: [
            {
               model: User,
               as: 'UsersEnrolled',
            },
            {
               model: User,
               as: 'Masters',
            },
         ],
      });

      if (!procedure) {
         throw new NotFoundError('Procedure not found');
      }

      return procedure;
   } catch (error) {
      throw new NotFoundError('Procedure  not found');
   }
}

export default {
   getAllProcedures,
   getSingleProcedure,
   deleteProcedure
}