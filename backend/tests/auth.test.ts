import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';
import { sequelize } from '../src/config/database';
import User from '../src/modules/users/user.model';
import EmailVerificationToken from '../src/modules/users/emailVerificationToken.model';

const uniqueEmail = `test+${Date.now()}@example.com`;

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
        email: uniqueEmail,
        password: 'password123',
        confirmPassword: 'password123',
        accountType: 'creator',
        agreeToTerms: true
      };

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
        email: uniqueEmail,
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
      // Create a user and a verification token to simulate email verification
      const user = await User.create({
        fullName: 'Verify User',
        email: `verify+${Date.now()}@example.com`,
        password: 'password123',
        accountType: 'creator',
        isActive: false,
        emailVerified: false,
        termsAccepted: true
      });

      await EmailVerificationToken.create({
        userId: user.id,
        token: 'valid-test-token',
        expiresAt: new Date(Date.now() + 1000000)
      });

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