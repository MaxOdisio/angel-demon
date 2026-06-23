import express, { Request, Response } from 'express';
import { handlerDebate } from './api/debate.js';
import { PORT } from './constants/env.js';

const app = express();
app.use(express.json());

app.post("/api/debate", handlerDebate);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
