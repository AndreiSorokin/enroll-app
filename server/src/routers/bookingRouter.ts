import express from "express";

import { getAllBookings, createBooking, deleteBooking, getUserBookings } from "../controllers/bookingController";
import { authMiddleware } from "../middlewares/authMiddleware";
import userStatusCheck from "../middlewares/userStatusCheck";

const router = express.Router();

router.get('/', getAllBookings);
router.get('/:userId', authMiddleware, userStatusCheck, getUserBookings);
router.post('/', authMiddleware, userStatusCheck, createBooking);
router.delete('/:id', deleteBooking);

export default router;