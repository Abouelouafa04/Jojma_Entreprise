const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function main() {
  try {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'jojma_db';

    const conn = await mysql.createConnection({ host, port, user, password, database });

    const sql = `INSERT INTO demandes (type_demande, source_formulaire, nom, prenom, email, telephone, sujet, message, statut, priorite, est_lu, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    const params = ['contact', 'contact_form', 'Test', 'Utilisateur', 'test@example.com', '0600000000', 'Sujet test', 'Message test', 'nouveau', 'normale', 0];

    const [result] = await conn.execute(sql, params);
    console.log('Inserted test demande, insertId =', result.insertId);

    await conn.end();
  } catch (err) {
    console.error('Erreur SQL insertion:', err);
    process.exitCode = 2;
  }
}

main();
