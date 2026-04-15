import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';
import { sequelize } from '../src/config/database';
import User from '../src/modules/users/user.model';
import { PrismaClient } from '@prisma/client';

let prisma: any = null;

describe('Demandes integration tests', () => {
  let adminEmail: string;
  let adminPassword = 'P@ssw0rdTest!';
  let adminToken: string | null = null;
  let createdDemandeId: string | null = null;
  const uniqueSubject = `INT-DEMANDE-${Date.now()}`;

  beforeAll(async () => {
    // ensure DB connection
    // create an admin user
    adminEmail = `admin.test.${Date.now()}@example.com`;
    // instantiate Prisma client for cleanup later (guard against environments without EMAIL/DB config)
    try {
      prisma = new PrismaClient();
    } catch (err) {
      prisma = null;
    }

    await User.create({
      fullName: 'Integration Admin',
      prenom: 'Integration',
      nom: 'Admin',
      email: adminEmail,
      password: adminPassword,
      accountType: 'company',
      isActive: true,
      emailVerified: true,
      role: 'admin',
      termsAccepted: true
    });
  });

  afterAll(async () => {
    // cleanup created demande and user
    if (createdDemandeId) {
      try {
        await prisma.demande.delete({ where: { id: BigInt(createdDemandeId) } });
      } catch (err) {
        // ignore
      }
    }

    try {
      await User.destroy({ where: { email: adminEmail } });
    } catch (err) {
      // ignore
    }

    if (prisma) await prisma.$disconnect();
    await sequelize.close();
  });

  it('should submit a demande (public)', async () => {
    const payload = {
      type_demande: 'projet_3d',
      prenom: 'Jean',
      nom: 'Tester',
      email: `itest+${Date.now()}@example.com`,
      telephone: '0600000000',
      domaine_activite: 'integration',
      sujet: uniqueSubject,
      message: 'Test message from integration test'
    };

    const res = await request(app).post('/api/demandes/submit').send(payload).expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.sujet).toBe(uniqueSubject);
    createdDemandeId = res.body.id;
  });

  it('should login admin and list the created demande via admin API', async () => {
    // login
    const loginRes = await request(app).post('/api/auth/login').send({ email: adminEmail, password: adminPassword }).expect(200);
    expect(loginRes.body).toHaveProperty('token');
    adminToken = loginRes.body.token;

    // list demandes with search query
    const listRes = await request(app)
      .get('/api/admin/demandes')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ q: uniqueSubject })
      .expect(200);

    expect(listRes.body).toHaveProperty('data');
    const found = (listRes.body.data || []).find((d: any) => d.sujet === uniqueSubject);
    expect(found).toBeDefined();
  });

  it('should get demande detail and contain logs', async () => {
    if (!createdDemandeId || !adminToken) return;
    const res = await request(app)
      .get(`/api/admin/demandes/${createdDemandeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('logs');
    expect(Array.isArray(res.body.logs)).toBe(true);
    // creation log exists
    const hasCreate = (res.body.logs || []).some((l: any) => l.action_type === 'created');
    expect(hasCreate).toBe(true);
  });

  it('should update demande status and create an update log', async () => {
    if (!createdDemandeId || !adminToken) return;
    const updateRes = await request(app)
      .patch(`/api/admin/demandes/${createdDemandeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ statut: 'en_cours' })
      .expect(200);

    expect(updateRes.body).toHaveProperty('statut');
    // status normalized to uppercase in service
    expect(String(updateRes.body.statut).toLowerCase()).toContain('en_cours');

    // verify log exists
    const detailRes = await request(app)
      .get(`/api/admin/demandes/${createdDemandeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const hasUpdate = (detailRes.body.logs || []).some((l: any) => l.action_type === 'update');
    expect(hasUpdate).toBe(true);
  });
});
