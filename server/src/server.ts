import express from 'express';

const { PORT } = require('./utils/config');
const { connectToDatabase } = require('./utils/db');

const app = express();
app.use(express.json());

const start = async () => {
   await connectToDatabase();
   app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
   });
};

start();