import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

async function main() {
  const migrationPath = path.join(process.cwd(), 'prisma', 'migrations', '20260408_init', 'migration.sql');
  if (!fs.existsSync(migrationPath)) {
    console.error('Migration SQL not found at', migrationPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf8');

  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    multipleStatements: true,
  };

  console.log('Connecting to DB', connectionConfig.host + ':' + connectionConfig.port, 'db:', connectionConfig.database);

  const conn = await mysql.createConnection(connectionConfig);

  try {
    console.log('Running migration SQL...');
    const [result] = await conn.query(sql);
    console.log('Migration SQL executed. Result:', result);
    console.log('✅ Migration appliquée avec succès.');
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la migration:', err.message || err);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

main();
