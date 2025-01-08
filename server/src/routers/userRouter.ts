import express from "express";

import { getAllUsers, createUser, getSingleUser, deleteUser, updateUser, userLogin } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authOwnershipMiddleware } from "../middlewares/authOwnershipMiddleware";

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getSingleUser)
router.post('/', createUser);
router.put('/:id', authMiddleware, authOwnershipMiddleware, updateUser);
router.delete('/:id', deleteUser);

router.post('/login', userLogin)

export default router;