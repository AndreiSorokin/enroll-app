import express from 'express';

import userRouter from './routers/userRouter';
import apiErrorhandler from './middlewares/errorHandler';

const app = express();


app.use(express.json());

app.use('/api/v1/users', userRouter);

app.use(apiErrorhandler)

export default app;