import { Router, Request, Response } from 'express';

const router = Router();

const ITEMS = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  value: `Item ${i + 1}`,
}));

router.get('/items', (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, parseInt(req.query.limit as string) || 10);

  const start = (page - 1) * limit;
  const end = start + limit;

  const items = ITEMS.slice(start, end);

  res.json({
    items,
    total: ITEMS.length,
    page,
    limit,
  });
});

export default router;