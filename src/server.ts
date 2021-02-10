import express, { urlencoded } from 'express';

import 'reflect-metadata';
import './database';

import { router } from './routes/routes';
import cors from 'cors';

const PORT = 3001;

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use(urlencoded({ extended: false }));
app.listen(PORT, () => {
  console.log('server start 🔥', PORT);
});
