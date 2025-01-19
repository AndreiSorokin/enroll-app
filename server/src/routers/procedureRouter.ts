import express from 'express';

import { getAllProcedures, getSingleProcedure, deleteProcedure } from '../controllers/procedureController';
import { authMiddleware } from '../middlewares/authMiddleware';
import adminCheck from '../middlewares/adminCheck';

const router = express.Router();

router.get('/', getAllProcedures);
router.get('/:id', getSingleProcedure);
router.delete('/:id', authMiddleware, adminCheck, deleteProcedure);


export default router;