import express from 'express';
import { handlerDebate } from './api/debate.js';
import { PORT } from './constants/env.js';

const app = express();
app.use(express.json());

// TODO add input validation (Zod?), error handling (extend Error class) and logging middlewares (rate limit, jwt + argon2)

app.post("/api/debate", handlerDebate);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
