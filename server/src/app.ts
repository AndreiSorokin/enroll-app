import express from 'express';
import passport from "passport";
import cors from "cors";

import userRouter from './routers/userRouter';
import procedureRouter from './routers/procedureRouter';
import uploadRouter from './routers/uploadRouter';
import apiErrorhandler from './middlewares/errorHandler';
import { authMiddleware } from './middlewares/authMiddleware';
import { authOwnershipMiddleware } from './middlewares/authOwnershipMiddleware';
import adminCheck from './middlewares/adminCheck';
import userStatusCheck from './middlewares/userStatusCheck';
import { googleAuthStrategy } from './config/passport';

const app = express();
const corsOptions = {
   origin: 'http://localhost:5173',
   credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());
passport.use(googleAuthStrategy);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/procedures', procedureRouter);
app.use('/api/v1/uploads', uploadRouter);

app.use(authMiddleware);
app.use(authOwnershipMiddleware);
app.use(adminCheck);
app.use(apiErrorhandler);
app.use(userStatusCheck);

export default app;