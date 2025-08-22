
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

router.get('/heavy-main', (req: Request, res: Response) => {
  const n = Math.max(1, parseInt(req.query.n as string) || 35);

  function fib(n: number): number {
    if (n <= 2) return 1;
    let a = 1, b = 1;
    for (let i = 3; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  }

  const result = fib(n);
  res.json({ n, result });
});


export default router;