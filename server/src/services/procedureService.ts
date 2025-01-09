import validator from 'validator';

import { User, Procedure } from '../models';
import { ApiError, BadRequestError, InternalServerError, NotFoundError } from "../errors/ApiError";

interface IProcedure {
   price: number;
   name: string;
}

const createProcedure = async(procedure: IProcedure) => {
   const { price, name } = procedure;

   if (!price || price <= 0) {
      throw new BadRequestError('Invalid procedure price');
   }

   if (!name) {
      throw new BadRequestError('Name is required');
   }

   const newProcedure = await Procedure.create({ price, name });
   return newProcedure;
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
         throw new BadRequestError('Invalid user ID format');
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
      console.log('procedure service: ', error)
      throw new NotFoundError('Procedure  not found');
   }
}

export default {
   getAllProcedures,
   getSingleProcedure,
   createProcedure
}