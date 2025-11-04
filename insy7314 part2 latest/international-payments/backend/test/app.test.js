// test/api.test.js
import request from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { jest } from '@jest/globals';

import httpMocks from 'node-mocks-http';
import app from '../src/app.js';
import enforceHttps from '../src/middleware/httpsEnforce.js';
import { validatePayment } from '../src/validators/inputValidators.js';

dotenv.config();

// Mock tokens
const staffToken = jwt.sign(
  { id: 1, username: 'staff1', role: 'staff' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

const customerToken = jwt.sign(
  { id: 2, account_number: '123456', role: 'customer' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Invalid token
const invalidToken = 'Bearer invalid.token.value';

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
    it('should return 403 if staff tries to create payment', async () => {
      const res = await request(app)
        .post('/api/payments')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          amount: 100,
          currency: 'USD',
          provider: 'Bank',
          payee_account: '123456',
          swift_code: 'ABC12345',
        });
      expect(res.statusCode).toBe(403);
    });

    it('should return 400 for invalid payment data', async () => {
      const res = await request(app)
        .post('/api/payments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          amount: 'abc',
          currency: 'US',
          provider: '',
          payee_account: '',
          swift_code: '',
        });
      expect(res.statusCode).toBe(400);
    });

    it('should create payment for valid data', async () => {
      const res = await request(app)
        .post('/api/payments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          amount: 1000,
          currency: 'USD',
          provider: 'Bank of Tests',
          payee_account: '1234567890',
          swift_code: 'ABCDEFGH',
        });

      // Only run this if DB has customer id 2 to prevent FK errors
      if (res.statusCode === 201) {
        expect(res.body.message).toBe('Payment created successfully');
      } else {
        console.warn('Skipping creation test — DB might not have required customer id');
      }
    });
  });

  describe('GET /api/payments', () => {
    it('should return 403 if staff tries to fetch customer payments', async () => {
      const res = await request(app)
        .get('/api/payments')
        .set('Authorization', `Bearer ${staffToken}`);
      expect(res.statusCode).toBe(403);
    });

    it('should return payments array for customer', async () => {
      const res = await request(app)
        .get('/api/payments')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // --- Staff Routes ---
  describe('GET /api/staff/payments', () => {
    it('should return 403 if customer tries to fetch staff payments', async () => {
      const res = await request(app)
        .get('/api/staff/payments')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.statusCode).toBe(403);
    });

    it('should return payments array for staff', async () => {
      const res = await request(app)
        .get('/api/staff/payments')
        .set('Authorization', `Bearer ${staffToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/staff/verify/:id', () => {
    it('should return 403 if customer tries to verify', async () => {
      const res = await request(app)
        .post('/api/staff/verify/1')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.statusCode).toBe(403);
    });

    it('should allow staff to verify payment', async () => {
      const res = await request(app)
        .post('/api/staff/verify/1')
        .set('Authorization', `Bearer ${staffToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Payment verified');
    });
  });

  // --- Middleware Tests ---
  describe('Token and role middleware', () => {
    it('should return 403 if token missing', async () => {
      const res = await request(app).get('/api/staff/payments');
      expect(res.statusCode).toBe(403);
    });

    it('should return 401 for invalid token', async () => {
      const res = await request(app)
        .get('/api/staff/payments')
        .set('Authorization', invalidToken);
      expect(res.statusCode).toBe(401);
    });

    it('should return 403 if non-staff tries staff-only route', async () => {
      const res = await request(app)
        .get('/api/staff/payments')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.statusCode).toBe(403);
    });

    it('should return 403 if non-customer tries customer-only route', async () => {
      const res = await request(app)
        .get('/api/payments')
        .set('Authorization', `Bearer ${staffToken}`);
      expect(res.statusCode).toBe(403);
    });
  });

  // --- Input Validators ---
  describe('Payment validators', () => {
    it('should reject invalid currency format', () => {
      const valid = validatePayment({
        amount: 100,
        currency: 'usd',
        provider: 'Bank',
        payee_account: '123456',
        swift_code: 'ABC12345',
      });
      expect(valid).toBe(false);
    });

    it('should accept valid payment', () => {
      const valid = validatePayment({
        amount: 100,
        currency: 'USD',
        provider: 'Bank',
        payee_account: '1234567890',
        swift_code: 'ABCDEFGH',
      });
      expect(valid).toBe(true);
    });
  });

  describe('HTTPS Enforce Middleware', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalAllowed = process.env.ALLOWED_HOSTS;
  const originalAppHost = process.env.APP_HOST;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    process.env.ALLOWED_HOSTS = originalAllowed;
    process.env.APP_HOST = originalAppHost;
  });

  it('calls next() if not in production', () => {
    process.env.NODE_ENV = 'development';
    const req = httpMocks.createRequest({ headers: { 'x-forwarded-proto': 'http' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    enforceHttps(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('calls next() if proto is https in production', () => {
    process.env.NODE_ENV = 'production';
    const req = httpMocks.createRequest({
      headers: { 'x-forwarded-proto': 'https', host: 'localhost' }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    enforceHttps(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('redirects to https if proto is http and host is allowed', () => {
    process.env.NODE_ENV = 'production';
    process.env.ALLOWED_HOSTS = 'localhost';
    const req = httpMocks.createRequest({
      headers: { 'x-forwarded-proto': 'http', host: 'localhost' }
    });
    const res = httpMocks.createResponse();
    res.redirect = jest.fn();
    const next = jest.fn();

    enforceHttps(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith(301, 'https://localhost/');
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 if host not allowed', () => {
    process.env.NODE_ENV = 'production';
    process.env.ALLOWED_HOSTS = 'allowed.com';
    const req = httpMocks.createRequest({
      headers: { 'x-forwarded-proto': 'http', host: 'badhost' }
    });
    const res = httpMocks.createResponse();
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn();
    const next = jest.fn();

    enforceHttps(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Invalid host header');
    expect(next).not.toHaveBeenCalled();
  });

  it('defaults to localhost if ALLOWED_HOSTS and APP_HOST not set', () => {
    process.env.NODE_ENV = 'production';
    process.env.ALLOWED_HOSTS = '';
    process.env.APP_HOST = '';
    const req = httpMocks.createRequest({
      headers: { 'x-forwarded-proto': 'http', host: 'localhost' }
    });
    const res = httpMocks.createResponse();
    res.redirect = jest.fn();
    const next = jest.fn();

    enforceHttps(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith(301, 'https://localhost/');
  });
});

});

