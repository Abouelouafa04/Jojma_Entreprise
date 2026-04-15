  import { PrismaClient } from '@prisma/client';
  import { AppError } from '../utils/AppError';
  import { sequelize } from '../config/database';
  import { QueryTypes } from 'sequelize';

// Lazily construct PrismaClient to avoid initialization during module import
let _prisma: PrismaClient | null = null;
function getPrisma() {
  // Pass an empty options object to satisfy newer generated clients
  // which expect a (possibly empty) options argument on construction.
  if (!_prisma) _prisma = new PrismaClient({});
  return _prisma;
}

function mapTypeDemande(v?: string) {
  if (!v) return undefined;
  const s = String(v).toLowerCase();
  if (s === 'projet_3d' || s === 'projet-3d' || s === 'projet3d') return 'PROJET_3D';
  if (s === 'contact') return 'CONTACT';
  return 'AUTRE';
}

function mapStatut(v?: string) {
  if (!v) return undefined;
  const s = String(v).toLowerCase();
  switch (s) {
    case 'nouveau': return 'NOUVEAU';
    case 'lu': return 'LU';
    case 'en_cours': case 'encours': return 'EN_COURS';
    case 'en_attente': return 'EN_ATTENTE';
    case 'traite': return 'TRAITE';
    case 'archive': return 'ARCHIVE';
    case 'rejete': return 'REJETE';
    default: return undefined;
  }
}

function mapPriorite(v?: string) {
  if (!v) return undefined;
  const s = String(v).toLowerCase();
  switch (s) {
    case 'basse': return 'BASSE';
    case 'normale': return 'NORMALE';
    case 'haute': return 'HAUTE';
    case 'urgente': return 'URGENTE';
    default: return undefined;
  }
}

function formatDemande(d: any) {
  if (!d) return null;
  return {
    ...d,
    id: d.id?.toString(),
    assigne_a: d.assigne_a ? d.assigne_a.toString() : null,
    created_at: d.created_at ? d.created_at.toISOString() : null,
    updated_at: d.updated_at ? d.updated_at.toISOString() : null,
    archived_at: d.archived_at ? d.archived_at.toISOString() : null,
  };
}

function formatLog(l: any) {
  if (!l) return null;
  return {
    ...l,
    id: l.id?.toString(),
    demande_id: l.demande_id?.toString(),
    admin_id: l.admin_id ? l.admin_id.toString() : null,
    created_at: l.created_at ? l.created_at.toISOString() : null,
  };
}

export async function createDemande(payload: any) {
  const data: any = {
    type_demande: mapTypeDemande(payload.type_demande) || 'AUTRE',
    source_formulaire: payload.source_formulaire || null,
    nom: payload.nom || null,
    prenom: payload.prenom || null,
    email: payload.email || null,
    telephone: payload.telephone || null,
    adresse: payload.adresse || null,
    entreprise: payload.entreprise || null,
    domaine_activite: payload.domaine_activite || null,
    sujet: payload.sujet || null,
    message: payload.message || null,
    statut: 'NOUVEAU',
    priorite: mapPriorite(payload.priorite) || 'NORMALE',
    est_lu: false,
  };
  try {
    const created = await getPrisma().demande.create({ data });

    // add a creation log
    await getPrisma().demandeLog.create({
      data: {
        demande_id: created.id,
        admin_id: null,
        action_type: 'created',
        description: 'Demande créée via formulaire',
      }
    });

    return formatDemande(created);
  } catch (err: any) {
    // If Prisma is not available (e.g. constructor validation), fallback to raw SQL via Sequelize
    if (err && (String(err.name).includes('Prisma') || String(err.message).includes('PrismaClient'))) {
      // Insert demande via raw SQL
      const insertSql = `INSERT INTO demandes (type_demande, source_formulaire, nom, prenom, email, telephone, adresse, entreprise, domaine_activite, sujet, message, statut, priorite, est_lu, assigne_a, admin_notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
      const params = [
        data.type_demande,
        data.source_formulaire,
        data.nom,
        data.prenom,
        data.email,
        data.telephone,
        data.adresse,
        data.entreprise,
        data.domaine_activite,
        data.sujet,
        data.message,
        data.statut,
        data.priorite,
        data.est_lu ? 1 : 0,
        data.assigne_a || null,
        data.admin_notes || null,
      ];

      await sequelize.query(insertSql, { replacements: params });

      // Retrieve the inserted row (match by email & recent created_at)
      const rows: any[] = await sequelize.query(
        'SELECT * FROM demandes WHERE email = ? ORDER BY created_at DESC LIMIT 1',
        { replacements: [data.email], type: QueryTypes.SELECT }
      );
      const createdRow = rows?.[0] ?? null;

      if (createdRow) {
        // Normalize date fields to Date objects for formatDemande
        if (createdRow.created_at) createdRow.created_at = new Date(createdRow.created_at);
        if (createdRow.updated_at) createdRow.updated_at = new Date(createdRow.updated_at);
        if (createdRow.archived_at) createdRow.archived_at = new Date(createdRow.archived_at);

        // Insert log
        try {
          await sequelize.query(
            'INSERT INTO demande_logs (demande_id, admin_id, action_type, description, created_at) VALUES (?, ?, ?, ?, NOW())',
            { replacements: [createdRow.id, null, 'created', 'Demande créée via formulaire'] }
          );
        } catch (e) {
          // ignore logging errors
        }

        return formatDemande(createdRow);
      }

      throw new AppError('Impossible de créer la demande (fallback SQL a échoué)', 500);
    }

    throw err;
  }
}

export async function getDemandes(opts: any) {
  const page = Number(opts.page || 1);
  const perPage = Number(opts.perPage || opts.limit || 25);
  const q = opts.q ? String(opts.q) : undefined;
  const where: any = {};

  if (opts.type_demande) where.type_demande = mapTypeDemande(opts.type_demande);
  if (opts.statut) where.statut = mapStatut(opts.statut);
  if (opts.priorite) where.priorite = mapPriorite(opts.priorite);
  if (opts.source) where.source_formulaire = String(opts.source);
  if (opts.hasTelephone === 'true' || opts.hasTelephone === true) where.telephone = { not: null };
  if (opts.unreadOnly === 'true' || opts.unreadOnly === true) where.est_lu = false;
  if (opts.dateFrom || opts.dateTo) {
    where.created_at = {};
    if (opts.dateFrom) where.created_at.gte = new Date(String(opts.dateFrom));
    if (opts.dateTo) where.created_at.lte = new Date(String(opts.dateTo));
  }

  if (q) {
    where.OR = [
      { nom: { contains: q, mode: 'insensitive' } },
      { prenom: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { telephone: { contains: q, mode: 'insensitive' } },
      { entreprise: { contains: q, mode: 'insensitive' } },
      { sujet: { contains: q, mode: 'insensitive' } },
      { message: { contains: q, mode: 'insensitive' } },
    ];
  }

  const allowedSort: Record<string, any> = {
    created_at: 'created_at',
    updated_at: 'updated_at',
    priorite: 'priorite',
    statut: 'statut',
    nom: 'nom',
    email: 'email',
  };

  const sortBy = allowedSort[String(opts.sortBy)] || 'created_at';
  const sortDir = (String(opts.sortDir || 'desc')).toLowerCase() === 'asc' ? 'asc' : 'desc';

  const total = await getPrisma().demande.count({ where });

  const demandes = await getPrisma().demande.findMany({
    where,
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { [sortBy]: sortDir }
  });

  return {
    data: demandes.map(formatDemande),
    meta: { total, page, perPage }
  };
}

export async function getDemandeById(id: string) {
  try {
    const key = BigInt(id);
    const demande = await getPrisma().demande.findUnique({ where: { id: key } });
    if (!demande) return null;
    const logs = await getPrisma().demandeLog.findMany({ where: { demande_id: key }, orderBy: { created_at: 'desc' } });
    return { ...formatDemande(demande), logs: logs.map(formatLog) };
  } catch (error) {
    throw new AppError('Invalid id', 400);
  }
}

export async function updateDemande(id: string, payload: any, adminId?: string) {
  const data: any = {};
  if (payload.statut) data.statut = mapStatut(payload.statut);
  if (payload.priorite) data.priorite = mapPriorite(payload.priorite);
  if (payload.assigne_a) data.assigne_a = BigInt(String(payload.assigne_a));
  if (typeof payload.est_lu !== 'undefined') data.est_lu = Boolean(payload.est_lu);
  if (payload.admin_notes) data.admin_notes = payload.admin_notes;
  if (payload.archived_at) data.archived_at = new Date(payload.archived_at);

  const key = BigInt(id);
  const updated = await getPrisma().demande.update({ where: { id: key }, data });

  // log the changes
  await getPrisma().demandeLog.create({
    data: {
      demande_id: key,
      admin_id: adminId ? BigInt(adminId) : null,
      action_type: 'update',
      description: `Mise à jour: ${JSON.stringify(data)}`,
      meta: data
    }
  });

  return formatDemande(updated);
}

export async function addNote(demandeId: string, adminId: string | null, note: string) {
  const key = BigInt(demandeId);
  const log = await getPrisma().demandeLog.create({
    data: {
      demande_id: key,
      admin_id: adminId ? BigInt(adminId) : null,
      action_type: 'note',
      description: note,
    }
  });
  return formatLog(log);
}

export async function archiveDemande(demandeId: string, adminId?: string) {
  const key = BigInt(demandeId);
  const updated = await getPrisma().demande.update({ where: { id: key }, data: { archived_at: new Date(), statut: 'ARCHIVE' } });
  await getPrisma().demandeLog.create({ data: { demande_id: key, admin_id: adminId ? BigInt(adminId) : null, action_type: 'archive', description: 'Demande archivée' } });
  return formatDemande(updated);
}

export async function getStats() {
  try {
    const total = await getPrisma().demande.count();
    const nouvelles = await getPrisma().demande.count({ where: { statut: 'NOUVEAU' } });
    const enCours = await getPrisma().demande.count({ where: { statut: 'EN_COURS' } });
    const traite = await getPrisma().demande.count({ where: { statut: 'TRAITE' } });
    const archive = await getPrisma().demande.count({ where: { statut: 'ARCHIVE' } });
    const urgent = await getPrisma().demande.count({ where: { priorite: 'URGENTE' } });
    const unread = await getPrisma().demande.count({ where: { est_lu: false } });

    return { total, nouvelles, enCours, traite, archive, urgent, unread };
  } catch (err: any) {
    // Fallback: if Prisma client fails to initialize, query the DB directly via Sequelize
    if (err && (String(err.name).includes('Prisma') || String(err.message).includes('PrismaClient'))) {
      const totalRows: any = await sequelize.query('SELECT COUNT(*) AS total FROM demandes', { type: QueryTypes.SELECT });
      const total = Number(totalRows?.[0]?.total ?? 0);

      const count = async (whereClause: string) => {
        const rows: any = await sequelize.query(`SELECT COUNT(*) AS total FROM demandes ${whereClause}`, { type: QueryTypes.SELECT });
        return Number(rows?.[0]?.total ?? 0);
      };

      const nouvelles = await count("WHERE statut = 'NOUVEAU'");
      const enCours = await count("WHERE statut = 'EN_COURS'");
      const traite = await count("WHERE statut = 'TRAITE'");
      const archive = await count("WHERE statut = 'ARCHIVE'");
      const urgent = await count("WHERE priorite = 'URGENTE'");
      const unread = await count('WHERE est_lu = 0');

      return { total, nouvelles, enCours, traite, archive, urgent, unread };
    }
    throw err;
  }
}
