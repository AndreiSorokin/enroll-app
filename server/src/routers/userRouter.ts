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

//TODO: ban users*, add/remove master procedure, apply middleware to master procedure, add pictures to users

router.get('/', getAllUsers);
router.get('/:id', getSingleUser)
router.post('/', createUser);
router.put('/:id', authMiddleware, authOwnershipMiddleware, updateUser);
router.delete('/:id', deleteUser);

router.post('/login', userLogin);
router.post('/reset-password', forgotPassword);

router.post('/:id/user-procedures', addUserProcedure);
router.delete('/:id/user-procedures', deleteUserProcedure);

router.post('/:id/master-procedures', addMasterProcedure);//
router.delete('/:id/master-procedures', deleteMasterProcedure);//

export default router;