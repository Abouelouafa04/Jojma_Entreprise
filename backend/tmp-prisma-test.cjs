const { PrismaClient } = require('@prisma/client');
console.log('PrismaClient ok', typeof PrismaClient);
(async () => {
  try {
    const p = new PrismaClient();
    console.log('constructed ok');
    await p.$disconnect();
    console.log('disconnected');
  } catch (e) {
    console.error('err', e);
    process.exit(1);
  }
})();
