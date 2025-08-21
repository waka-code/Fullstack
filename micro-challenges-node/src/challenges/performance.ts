import { Router, Request, Response } from 'express';
import { Worker } from 'worker_threads';
import path from 'path';

const router = Router();

router.get('/heavy', (req: Request, res: Response) => {
  const n = Math.max(1, parseInt(req.query.n as string) || 35);

  const worker = new Worker(path.join(__dirname, 'worker-fib.js'), {
    workerData: { n }
  });

  worker.on('message', (result) => {
    res.json({ n, result });
  });

  worker.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
});


export default router;