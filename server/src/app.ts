import express from 'express';

import userRouter from './routers/userRouter';
import procedureRouter from './routers/procedureRouter';
import uploadRouter from './routers/uploadRouter';
import apiErrorhandler from './middlewares/errorHandler';
import { authMiddleware } from './middlewares/authMiddleware';
import { authOwnershipMiddleware } from './middlewares/authOwnershipMiddleware';
import adminCheck from './middlewares/adminCheck';

const app = express();


app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/procedures', procedureRouter);
app.use('/api/v1/uploads', uploadRouter);

app.use(authMiddleware);
app.use(authOwnershipMiddleware);
app.use(adminCheck);
app.use(apiErrorhandler);

export default app;