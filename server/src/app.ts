import express from 'express';

import userRouter from './routers/userRouter';
import procedureRouter from './routers/procedureRouter';
import uploadRouter from './routers/uploadRouter';
import apiErrorhandler from './middlewares/errorHandler';

const app = express();


app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/procedures', procedureRouter);
app.use('/api/v1/uploads', uploadRouter);

app.use(apiErrorhandler)

export default app;