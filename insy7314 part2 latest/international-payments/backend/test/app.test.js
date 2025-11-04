import request from 'supertest';
import app from '../src/app.js';

describe('GET /', () => {
  it('responds with 200 OK', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});
