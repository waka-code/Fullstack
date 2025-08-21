import request from 'supertest';
import crypto from 'crypto';
import app from '../src/app';
import { describe, expect, it } from '@jest/globals';
import dotenv from 'dotenv';

dotenv.config();
const SECRET = process.env.SECRET!;

function signBody(body: object) {
  return crypto.createHmac('sha256', SECRET).update(JSON.stringify(body)).digest('hex');
}

describe('HMAC Protected Route', () => {
  const url = '/hmac/protected';

  it('permite acceso con firma válida', async () => {
    const body = { foo: 'bar' };
    const signature = signBody(body);

    const res = await request(app)
      .post(url)
      .set('x-signature', signature)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
  });

  it('rechaza acceso con firma inválida', async () => {
    const body = { foo: 'bar' };
    const signature = 'invalidsignature';

    const res = await request(app)
      .post(url)
      .set('x-signature', signature)
      .send(body);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Invalid signature' });
  });

  it('rechaza acceso si falta la firma', async () => {
    const body = { foo: 'bar' };

    const res = await request(app)
      .post(url)
      .send(body);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Missing signature' });
  });
});