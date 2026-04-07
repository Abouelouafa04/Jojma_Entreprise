import { Sequelize } from 'sequelize';
import 'dotenv/config';

// Note: En environnement de preview, si PG n'est pas dispo, 
// on pourrait fallback sur sqlite pour la démo, mais on reste sur la config PG demandée.
const sequelize = new Sequelize(
  process.env.DB_NAME || 'jojma_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '1020@Mouad',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export { sequelize };
