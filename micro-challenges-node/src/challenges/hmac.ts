import { Request, Response, NextFunction, Router } from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
const SECRET = process.env.SECRET! || 'Waddimi';

function verifyHmac(req: Request, res: Response, next: NextFunction) {
  const signature = req.header('x-signature');
  if (!signature) {
    return res.status(401).json({ error: 'Missing signature' });
  }

  const body = JSON.stringify(req.body);
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('hex');

  if (signature !== expected) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  next();
}

const router = Router();

router.post('/protected', verifyHmac, (req, res) => {
  res.json({ success: true });
});

export default router;