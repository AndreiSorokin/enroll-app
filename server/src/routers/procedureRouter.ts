import express from 'express';

import { getAllProcedures, getSingleProcedure, createProcedure } from '../controllers/procedureController';

const router = express.Router();

router.get('/', getAllProcedures);
router.get('/:id', getSingleProcedure);
router.post('/', createProcedure);

export default router;