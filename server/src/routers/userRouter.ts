import express from "express";

import { getAllUsers, createUser, getSingleUser, deleteUser } from "../controllers/userController";

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getSingleUser)
router.post('/', createUser);
router.delete('/:id', deleteUser);

export default router;