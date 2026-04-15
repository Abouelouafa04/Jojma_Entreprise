import { Request, Response } from 'express';
import * as DemandesService from '../../services/demandes.service';
import { AppError } from '../../utils/AppError';
import { sequelize } from '../../config/database';
import { QueryTypes } from 'sequelize';

export const listDemandes = async (req: Request, res: Response) => {
  const { page = 1, perPage, limit, q, sortBy, sortDir } = req.query as any;
  const filters = {
    ...req.query
  };

  try {
    const result = await DemandesService.getDemandes({ page, perPage: perPage || limit, q, sortBy, sortDir, ...filters });
    return res.json(result);
  } catch (err: any) {
    // Fallback: if Prisma client fails to initialize, query the DB directly via Sequelize
    if (err && (String(err.name).includes('Prisma') || String(err.message).includes('PrismaClient'))) {
      const pageNum = Number(page || 1);
      const per = Number(perPage || limit || 25);
      const offset = (pageNum - 1) * per;
      const allowedSort = ['created_at', 'updated_at', 'priorite', 'statut', 'nom', 'email'];
      const orderColumn = allowedSort.includes(String(sortBy)) ? String(sortBy) : 'created_at';
      const dir = (String(sortDir || 'desc')).toLowerCase() === 'asc' ? 'ASC' : 'DESC';

      const totalRows: any = await sequelize.query('SELECT COUNT(*) AS total FROM demandes', { type: QueryTypes.SELECT });
      const total = Number(totalRows?.[0]?.total ?? 0);

      const rows: any[] = await sequelize.query(
        `SELECT * FROM demandes ORDER BY ${orderColumn} ${dir} LIMIT ${per} OFFSET ${offset}`,
        { type: QueryTypes.SELECT }
      );

      const formatted = rows.map((d: any) => ({
        ...d,
        id: d.id != null ? String(d.id) : d.id,
        assigne_a: d.assigne_a != null ? String(d.assigne_a) : null,
        created_at: d.created_at ? new Date(d.created_at).toISOString() : null,
        updated_at: d.updated_at ? new Date(d.updated_at).toISOString() : null,
        archived_at: d.archived_at ? new Date(d.archived_at).toISOString() : null,
      }));

      return res.json({ data: formatted, meta: { total, page: pageNum, perPage: per } });
    }
    throw err;
  }
};

export const getStats = async (req: Request, res: Response) => {
  const stats = await DemandesService.getStats();
  res.json(stats);
};

export const getDemandeById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const demande = await DemandesService.getDemandeById(id);
  if (!demande) throw new AppError('Demande introuvable', 404);
  res.json(demande);
};

export const updateDemande = async (req: any, res: Response) => {
  const { id } = req.params;
  const adminId = req.user?.id ? String(req.user.id) : undefined;
  const updated = await DemandesService.updateDemande(id, req.body, adminId);
  res.json(updated);
};

export const addNote = async (req: any, res: Response) => {
  const { id } = req.params;
  const { note } = req.body;
  if (!note) throw new AppError('Note requise', 400);
  const adminId = req.user?.id ? String(req.user.id) : null;
  const log = await DemandesService.addNote(id, adminId, note);
  res.status(201).json(log);
};

export const archiveDemande = async (req: any, res: Response) => {
  const { id } = req.params;
  const adminId = req.user?.id ? String(req.user.id) : undefined;
  const archived = await DemandesService.archiveDemande(id, adminId);
  res.json(archived);
};

export const deleteDemande = async (req: any, res: Response) => {
  const { id } = req.params;
  // For safety we archive instead of hard delete
  const adminId = req.user?.id ? String(req.user.id) : undefined;
  await DemandesService.archiveDemande(id, adminId);
  res.json({ message: 'Demande archivée/supprimée' });
};
