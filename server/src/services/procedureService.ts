import validator from 'validator';

import { User, Procedure, MasterProcedure } from '../models';
import { BadRequestError, NotFoundError } from "../errors/ApiError";

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

const getMastersByProcedure = async(id: string) => {
   try {
      const masters = await User.findAll({
         where: { role: 'master' },
         include: [
            {
               model: MasterProcedure,
               as: 'masterProcedures',
               where: { procedureId: id },
               attributes: ['id', 'masterId', 'procedureId', 'price'],
            },
         ],
         attributes: [
            'id',
            'name',
            'email',
            'image',
            'createdAt',
            'updatedAt',
         ],
      });

      console.log("Procedure ID:", id);
      console.log("Query Result:", masters);    

      if (masters.length === 0) {
         throw new NotFoundError("No masters found for this procedure");
      }

      return masters;
   } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
         throw error;
      }
   }
};

export default {
   getAllProcedures,
   getSingleProcedure,
   deleteProcedure,
   getMastersByProcedure
}