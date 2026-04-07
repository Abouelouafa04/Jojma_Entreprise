import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';
import { sequelize } from '../src/config/database';

describe('Auth API Tests', () => {
  beforeAll(async () => {
    // Note: In a real test environment, you'd set up a test database
    // For now, we'll test the routes without DB dependency
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        accountType: 'creator',
        agreeToTerms: true
      };

      // Mock the database and email service for testing
      // In a real implementation, you'd use test doubles

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toContain('compte créé');
      expect(response.body.data.user).toHaveProperty('email', userData.email);
    });

    it('should reject registration with invalid data', async () => {
      const invalidData = {
        fullName: '',
        email: 'invalid-email',
        password: '123',
        confirmPassword: '456',
        accountType: 'invalid',
        agreeToTerms: false
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('email');
    });

    it('should reject invalid credentials', async () => {
      const invalidData = {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidData)
        .expect(401);

      expect(response.body.message).toContain('incorrect');
    });
  });

  describe('GET /api/auth/verify-email', () => {
    it('should verify email with valid token', async () => {
      // This would require setting up a test token in the database
      const response = await request(app)
        .get('/api/auth/verify-email?token=valid-test-token')
        .expect(302); // Redirect to welcome page

      expect(response.headers.location).toContain('/welcome');
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify-email?token=invalid-token')
        .expect(400);

      expect(response.body.message).toContain('invalide');
    });
  });
});