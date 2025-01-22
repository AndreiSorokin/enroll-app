import validator from 'validator';

import { User, Procedure, MasterProcedure } from '../models';
import { ApiError, BadRequestError, InternalServerError, NotFoundError } from "../errors/ApiError";
import { sequelize } from "../utils/db"

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

const getAllProcedures = async () => {
   try {
     const procedures = await Procedure.findAll({
       include: [
         {
           model: MasterProcedure,
           as: 'masterProcedures',
           attributes: [],
         },
       ],
     });
 
     return procedures;
   } catch (error) {
     throw new Error('Failed to fetch procedures');
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