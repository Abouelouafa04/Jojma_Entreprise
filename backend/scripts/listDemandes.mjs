import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') });

const prisma = new PrismaClient();

async function main() {
  try {
    const total = await prisma.demande.count();
    console.log(`Total demandes: ${total}`);
    const rows = await prisma.demande.findMany({ orderBy: { created_at: 'desc' }, take: 50 });
    console.log("Dernières demandes (jusqu'à 50):");
    rows.forEach((r) => {
      console.log(`- id=${r.id} type=${r.type_demande} nom=${r.nom} prenom=${r.prenom} email=${r.email} created_at=${r.created_at}`);
    });
  } catch (err) {
    console.error('Erreur lors de la lecture des demandes:', err);
    process.exitCode = 2;
  } finally {
    await prisma.$disconnect();
  }
}

main();
