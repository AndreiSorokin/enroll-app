import express from 'express';

import { getAllProcedures, getSingleProcedure, createProcedure, modifyProcedure, deleteProcedure } from '../controllers/procedureController';

const router = express.Router();

// add pictures to procedures

router.get('/', getAllProcedures);
router.get('/:id', getSingleProcedure);
router.post('/', createProcedure);
router.put('/:id', modifyProcedure);
router.delete('/:id', deleteProcedure);

export default router;