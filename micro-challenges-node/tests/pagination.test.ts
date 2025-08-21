import request from 'supertest';
import app from '../src/app';

describe('Pagination Route', () => {
  const url = '/pagination/items';

  it('devuelve la primera página por defecto', async () => {
    const res = await request(app).get(url);

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(10);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(10);
    expect(res.body.total).toBe(100);
    expect(res.body.items[0]).toEqual({ id: 1, value: 'Item 1' });
  });

  it('devuelve la página y límite especificados', async () => {
    const res = await request(app).get(url).query({ page: 2, limit: 5 });

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(5);
    expect(res.body.page).toBe(2);
    expect(res.body.limit).toBe(5);
    expect(res.body.items[0]).toEqual({ id: 6, value: 'Item 6' });
  });

  it('devuelve un array vacío si la página está fuera de rango', async () => {
    const res = await request(app).get(url).query({ page: 999, limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(0);
    expect(res.body.page).toBe(999);
    expect(res.body.limit).toBe(10);
  });
});