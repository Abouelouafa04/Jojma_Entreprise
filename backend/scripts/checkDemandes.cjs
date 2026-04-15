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
    const [countRows] = await conn.query('SELECT COUNT(*) AS cnt FROM demandes');
    console.log('Total demandes:', countRows[0].cnt);

    const [rows] = await conn.query('SELECT id, type_demande, nom, prenom, email, created_at FROM demandes ORDER BY created_at DESC LIMIT 20');
    console.log('Dernières demandes:');
    rows.forEach(r => {
      console.log(`- id=${r.id} type=${r.type_demande} nom=${r.nom} prenom=${r.prenom} email=${r.email} created_at=${r.created_at}`);
    });

    await conn.end();
  } catch (err) {
    console.error('Erreur SQL:', err);
    process.exitCode = 2;
  }
}

main();
