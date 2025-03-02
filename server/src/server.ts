import express from 'express';
import path from 'path';

import app from './app';
import { PORT } from './utils/config';
import { connectToDatabase } from './utils/db';

const clientBuildPath = path.join(__dirname, '../../../client/dist');

console.log("Serving static files from:", clientBuildPath);

app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
   console.log('Catch-all triggered, serving index.html');
   res.sendFile(path.join(clientBuildPath, 'index.html'));
});
app.get('*', (req, res) => {
   res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const start = async () => {
   await connectToDatabase();
   app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
   });
};

start();