const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function main() {
  try {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'jojma_db';

    const conn = await mysql.createConnection({ host, port, user, password, database });

    const adminPassword = 'P@ssw0rdTest!';
    const adminEmail = `admin.test.${Date.now()}@example.com`;
    const id = crypto.randomUUID();
    const hashed = await bcrypt.hash(adminPassword, 12);

    const insertSql = `INSERT INTO users (id, fullName, prenom, nom, email, password, accountType, isActive, emailVerified, role, termsAccepted, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    const params = [id, 'Integration Admin', 'Integration', 'Admin', adminEmail, hashed, 'company', 1, 1, 'admin', 1];

    await conn.execute(insertSql, params);
    console.log('Admin créé:', adminEmail, 'mot de passe:', adminPassword);

    await conn.end();

    // login to get token
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: adminPassword })
    });

    if (!loginRes.ok) {
      const t = await loginRes.text();
      console.error('Login failed:', loginRes.status, t);
      process.exitCode = 2;
      return;
    }

    const loginJson = await loginRes.json();
    const token = loginJson.token;
    console.log('Token reçu:', token ? token.slice(0, 20) + '...' : '(aucun)');

    // call admin demandes
    const listRes = await fetch('http://localhost:5000/api/admin/demandes', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const listJson = await listRes.json();
    console.log('Réponse /api/admin/demandes:', JSON.stringify(listJson, null, 2));

  } catch (err) {
    console.error('Erreur flow admin:', err);
    process.exitCode = 2;
  }
}

main();
