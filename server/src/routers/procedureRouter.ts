import express from 'express';

import { getAllProcedures, getSingleProcedure, deleteProcedure } from '../controllers/procedureController';

const router = express.Router();

router.get('/', getAllProcedures);
router.get('/:id', getSingleProcedure);
router.delete('/:id', deleteProcedure);//for admins


export default router;