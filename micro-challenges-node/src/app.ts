import express from 'express';
import hmacRouter from './challenges/hmac';
import paginationRouter from './challenges/pagination';
import performanceRouter from './challenges/performance';

const app = express();

app.use(express.json());
app.use('/hmac', hmacRouter);
app.use('/pagination', paginationRouter);
app.use('/performance', performanceRouter);

app.get('/', (_req, res) => {
  res.json({ message: 'Micro-challenges Node.js API' });
});

export default app;