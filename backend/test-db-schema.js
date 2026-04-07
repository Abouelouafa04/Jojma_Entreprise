import { sequelize } from './src/config/database.js';

async function schemaCheck() {
  try {
    const [results] = await sequelize.query(`
      SELECT TABLE_NAME, COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
      AND COLUMN_NAME LIKE '%prenom%';
    `);
    console.log(results);
  } catch (e) {
    console.error(e);
  } finally {
    await sequelize.close();
  }
}

schemaCheck();