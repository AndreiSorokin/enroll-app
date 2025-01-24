import express from "express";

import { getAllBookings, createBooking } from "../controllers/bookingController";
import { authMiddleware } from "../middlewares/authMiddleware";
import userStatusCheck from "../middlewares/userStatusCheck";

const router = express.Router();

router.get('/', getAllBookings);
router.post('/', authMiddleware, userStatusCheck, createBooking);

export default router;