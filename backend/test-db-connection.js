import { sequelize } from './src/config/database.js';

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie !');
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données :', error.message);
  } finally {
    await sequelize.close();
  }
}

testConnection();