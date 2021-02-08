import express from 'express';

import 'reflect-metadata';
import { router } from './routes/routes';
import './database';
const PORT = 3003;

const app = express();

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log('server start 🔥', PORT);
});
