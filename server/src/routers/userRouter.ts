import express from "express";
import multer from 'multer';
import passport from "passport";

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
   resetPassword,
   changePassword,
   addUserProcedure,
   deleteUserProcedure,
   addMasterProcedure,
   deleteMasterProcedure,
   updateMasterProcedure,
   updateUserStatus,
   googleLogin,
   getSingleMasterProcedure,
   getUserProcedure,
   getAllMasterProcedures
} from "../controllers/userController";
import adminCheck from "../middlewares/adminCheck";
import userStatusCheck from "../middlewares/userStatusCheck";


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/auth/google', 
   passport.authenticate('google-id-token', { session: false }),
   googleLogin
);

router.get('/', getAllUsers);
router.get('/:id', getSingleUser);
router.post('/registration', upload.single('image'), createUser);
router.put('/:id', authMiddleware, authOwnershipMiddleware, userStatusCheck, updateUser);
router.delete('/:id', authMiddleware, adminCheck, deleteUser);

router.post('/login', userLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/:id/update-password', authMiddleware, authOwnershipMiddleware, changePassword);

router.get('/:id/user-procedures', authMiddleware, userStatusCheck, getUserProcedure);
router.post('/:id/user-procedures', authMiddleware, authOwnershipMiddleware, userStatusCheck, addUserProcedure);
router.delete('/:id/user-procedures', authMiddleware, authOwnershipMiddleware, userStatusCheck, deleteUserProcedure);

router.get('/:id/master-procedures', authMiddleware, getAllMasterProcedures);
router.get('/:id/master-procedures/:procedureId', authMiddleware, getSingleMasterProcedure);
router.post('/:id/master-procedures', authMiddleware, authOwnershipMiddleware, userStatusCheck, addMasterProcedure);
router.delete('/:id/master-procedures', authMiddleware, authOwnershipMiddleware, userStatusCheck, deleteMasterProcedure);
router.put('/:id/master-procedures/:procedureId', authMiddleware, authOwnershipMiddleware, updateMasterProcedure);

router.post('/:id/update-user-status', authMiddleware, adminCheck, updateUserStatus);

export default router;