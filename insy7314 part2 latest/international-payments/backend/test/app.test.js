// test/api.test.js
import request from 'supertest';
import app from '../src/app.js';

describe('Basic API routes', () => {
  // Test root endpoint
  describe('GET /', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('International Payments API');
    });
  });

  // Auth routes
  describe('POST /api/auth/login', () => {
    it('should return 401 for missing email/password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});
      expect(res.statusCode).toBe(401); // correct based on your app
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wrong@example.com', password: 'wrong123' });
      expect(res.statusCode).toBe(401);
    });
  });

  // Payments routes
  describe('POST /api/payments', () => {
    it('should return 403 for missing/invalid fields', async () => {
      const res = await request(app)
        .post('/api/payments')
        .send({ amount: 'abc', currency: 'US', recipientId: '' });
      expect(res.statusCode).toBe(403);
    });
  });


});
