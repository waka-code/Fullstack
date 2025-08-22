import { Request, Response, NextFunction, Router } from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { RawBodyRequest } from '../type/type';

dotenv.config();
const SECRET = process.env.SECRET || 'Waddimi';

export function rawBodySaver(req: RawBodyRequest, _res: Response, buf: Buffer) {
  req.rawBody = buf.toString('utf8');
}

export const hmacRawBodySaver = rawBodySaver;

function verifyHmac(req: RawBodyRequest, res: Response, next: NextFunction) {
  const signature = req.header('x-signature');
  if (!signature) {
    return res.status(401).json({ error: 'Missing signature' });
  }

  if(!req.rawBody){
    return res.status(400).json({ error: 'Missing request body' });
  }
  
  const expected = crypto.createHmac('sha256', SECRET).update(req.rawBody).digest('hex');

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