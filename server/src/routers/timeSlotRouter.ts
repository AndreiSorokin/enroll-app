import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import userStatusCheck from "../middlewares/userStatusCheck";
import masterCheck from "../middlewares/masterCheck";
import {
   getAllTimeSlots,
   getAllAvailableTimeSlots,
   createTimeSlots
} from "../controllers/timeSlotController";

const router = express.Router();

router.get('/', getAllTimeSlots);
router.get('/available', getAllAvailableTimeSlots);
router.post('/:masterId/:procedureId', authMiddleware, userStatusCheck, masterCheck, createTimeSlots);

export default router;