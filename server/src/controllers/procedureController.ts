import { NextFunction, Request, Response } from "express";

import procedureService from '../services/procedureService';


export async function deleteProcedure(req: Request, res: Response, next: NextFunction) {
   try {
      const id = req.params.id;
      await procedureService.deleteProcedure(id);

      res.status(204).json({ message: "Procedure has been deleted successfully" });
   } catch (error) {
      next(error);
   }
};

export async function getAllProcedures(req: Request, res: Response, next: NextFunction) {
   try {
      const allProcedures = await procedureService.getAllProcedures();

      if(allProcedures.length === 0) {
         res.status(404).json({ message: "No procedures found" })
         return;
      }

      res.json(allProcedures);
   } catch (error) {
      next(error);
   }
};

export async function getSingleProcedure(req: Request, res: Response, next: NextFunction) {
   try {
      const procedure = await procedureService.getSingleProcedure(req.params.id);

      if(!procedure) {
         res.status(404).json({ message: "Procedure not found" });
         return;
      }

      res.json(procedure);
   } catch (error) {
      next(error);
   }
};
export async function getMastersByProcedure(req: Request, res: Response, next: NextFunction) {
   try {
      const { id } = req.params;

      const masters = await procedureService.getMastersByProcedure(id);
      res.json(masters);
   } catch (error) {
      next(error);
   }
};