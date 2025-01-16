import express from 'express';

import { getAllProcedures, getSingleProcedure, modifyProcedure, deleteProcedure } from '../controllers/procedureController';

const router = express.Router();

router.get('/', getAllProcedures);
router.get('/:id', getSingleProcedure);
router.put('/:id', modifyProcedure);
router.delete('/:id', deleteProcedure);


export default router;