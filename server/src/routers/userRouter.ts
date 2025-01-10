import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import { authOwnershipMiddleware } from "../middlewares/authOwnershipMiddleware";
import {
   getAllUsers,
   createUser,
   getSingleUser,
   deleteUser,
   updateUser,
   userLogin,
   forgotPassword,
   addUserProcedure,
   deleteUserProcedure,
   addMasterProcedure,
   deleteMasterProcedure,
} from "../controllers/userController";


const router = express.Router();

//TODO: ban users*, add pictures to users

router.get('/', getAllUsers);
router.get('/:id', getSingleUser)
router.post('/', createUser);
router.put('/:id', authMiddleware, authOwnershipMiddleware, updateUser);
router.delete('/:id', deleteUser);

router.post('/login', userLogin);
router.post('/reset-password', forgotPassword);

router.post('/:id/user-procedures', authMiddleware, authOwnershipMiddleware, addUserProcedure);
router.delete('/:id/user-procedures', authMiddleware, authOwnershipMiddleware, deleteUserProcedure);

router.post('/:id/master-procedures', authMiddleware, authOwnershipMiddleware, addMasterProcedure);
router.delete('/:id/master-procedures', authMiddleware, authOwnershipMiddleware, deleteMasterProcedure);

export default router;