import express from 'express';

import userRouter from './routers/userRouter';
import { User, Procedure } from './models';
// console.log('User.associations: ', User.associations);
// console.log('Procedure.associations ', Procedure.associations);

import { sequelize } from './utils/db';
console.log(sequelize)

const app = express();


app.use(express.json());

app.use('/api/v1/users', userRouter);

export default app;