import request from 'supertest';
import app from '../src/app';
import { describe, expect, it } from '@jest/globals';

describe('Performance Route', () => {
  const url = '/performance/heavy';

  it('devuelve el fibonacci por defecto (n=35)', async () => {
    const res = await request(app).get(url);

    expect(res.status).toBe(200);
    expect(res.body.n).toBe(35);
    expect(res.body.result).toBe(9227465); 
  });

  it('devuelve el fibonacci para n=10', async () => {
    const res = await request(app).get(url).query({ n: 10 });

    expect(res.status).toBe(200);
    expect(res.body.n).toBe(10);
    expect(res.body.result).toBe(55); 
  });

  it('devuelve el fibonacci para n=1', async () => {
    const res = await request(app).get(url).query({ n: 1 });

    expect(res.status).toBe(200);
    expect(res.body.n).toBe(1);
    expect(res.body.result).toBe(1); 
  });
});