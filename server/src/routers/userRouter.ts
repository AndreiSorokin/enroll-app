import express from "express";
import multer from 'multer';

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
   updateMasterProcedure,
   updateUserStatus
} from "../controllers/userController";
import adminCheck from "../middlewares/adminCheck";
import userStatusCheck from "../middlewares/userStatusCheck";


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//TODO: ban users*, google login

router.get('/', getAllUsers);
router.get('/:id', getSingleUser)
router.post('/registration', upload.single('image'), createUser);
router.put('/:id', authMiddleware, authOwnershipMiddleware, userStatusCheck, updateUser);
router.delete('/:id', authMiddleware, adminCheck, deleteUser);

router.post('/login', userLogin);
router.post('/reset-password', forgotPassword);

router.post('/:id/user-procedures', authMiddleware, authOwnershipMiddleware, userStatusCheck, addUserProcedure);
router.delete('/:id/user-procedures', authMiddleware, authOwnershipMiddleware, userStatusCheck, deleteUserProcedure);

router.post('/:id/master-procedures', authMiddleware, authOwnershipMiddleware, userStatusCheck, addMasterProcedure);
router.delete('/:id/master-procedures', authMiddleware, authOwnershipMiddleware, userStatusCheck, deleteMasterProcedure);
router.put('/:id/master-procedures/:procedureId', updateMasterProcedure);

router.post('/:id/update-user-status', authMiddleware, adminCheck, updateUserStatus);

export default router;