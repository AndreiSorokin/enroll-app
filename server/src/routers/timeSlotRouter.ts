import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import { authOwnershipMiddleware } from "../middlewares/authOwnershipMiddleware";
import userStatusCheck from "../middlewares/userStatusCheck";
import masterCheck from "../middlewares/masterCheck";
import {
   getAllTimeSlots,
   getAllAvailableTimeSlots,
   createTimeSlots
} from "../controllers/timeSlotController";

const router = express.Router();

router.get('/', getAllTimeSlots);
router.get('/timeslots', getAllAvailableTimeSlots);
router.post('/', authMiddleware, authOwnershipMiddleware, userStatusCheck, masterCheck, createTimeSlots);

export default router;