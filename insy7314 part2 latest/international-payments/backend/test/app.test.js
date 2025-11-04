// test/api.test.js
import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Mock token generator for staff and customer
const staffToken = jwt.sign({ id: 1, username: 'staff1', role: 'staff' }, process.env.JWT_SECRET);
const customerToken = jwt.sign({ id: 2, account_number: '123456', role: 'customer' }, process.env.JWT_SECRET);

describe('API Tests', () => {

  // --- Root endpoint ---
  describe('GET /', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('International Payments API');
    });
  });

  // --- Customer Auth ---
  describe('POST /api/auth/login', () => {
    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ account_number: 'wrong', password: 'wrong' });
      expect(res.statusCode).toBe(401);
    });

    it('should return 401 for missing credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({});
      expect(res.statusCode).toBe(401);
    });
  });

  // --- Staff Auth ---
  describe('POST /api/staff/login', () => {
    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/staff/login')
        .send({ username: 'wrong', password: 'wrong' });
      expect(res.statusCode).toBe(401);
    });
  });

  // --- Customer Payments ---
  describe('POST /api/payments', () => {
    it('should return 403 if not customer', async () => {
      const res = await request(app)
        .post('/api/payments')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({ amount: 100, currency: 'USD', provider: 'Bank', payee_account: '987', swift_code: 'ABC123' });
      expect(res.statusCode).toBe(403);
    });

    it('should return 400 for invalid data', async () => {
      const res = await request(app)
        .post('/api/payments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ amount: 'abc', currency: 'US', payee_account: '' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/payments', () => {
    it('should return 403 if not customer', async () => {
      const res = await request(app)
        .get('/api/payments')
        .set('Authorization', `Bearer ${staffToken}`);
      expect(res.statusCode).toBe(403);
    });
  });

  // --- Staff Payment Management ---
  describe('GET /api/staff/payments', () => {
    it('should return 403 if not staff', async () => {
      const res = await request(app)
        .get('/api/staff/payments')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.statusCode).toBe(403);
    });
  });

  describe('POST /api/staff/verify/:id', () => {
    it('should return 403 if not staff', async () => {
      const res = await request(app)
        .post('/api/staff/verify/1')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.statusCode).toBe(403);
    });
  });

  // --- Token and Auth Middleware ---
  describe('Middleware checks', () => {
    it('should return 403 if missing token', async () => {
      const res = await request(app).get('/api/staff/payments');
      expect(res.statusCode).toBe(403);
    });

    it('should return 401 for invalid token', async () => {
      const res = await request(app)
        .get('/api/staff/payments')
        .set('Authorization', 'Bearer invalidtoken');
      expect(res.statusCode).toBe(401);
    });
  });

});
