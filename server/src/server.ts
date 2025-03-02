import express from 'express';
import path from 'path';

import app from './app';
import { PORT } from './utils/config';
import { connectToDatabase } from './utils/db';

const clientBuildPath = path.resolve(__dirname, '../../client/dist');

console.log("Serving static files from:", clientBuildPath);

app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
   res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.use((req, res, next) => {
   console.log(`Incoming request: ${req.method} ${req.url}`);
   next();
});

const start = async () => {
   await connectToDatabase();
   app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
   });
};

start();