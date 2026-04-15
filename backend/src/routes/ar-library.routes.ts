import { Router } from 'express';
import os from 'os';
import { protect } from '../middlewares/auth.middleware';
import Model3D from '../modules/models3d/model3d.model';
import ARExperience from '../modules/publicShare/experience.model';
import ARExperienceEvent from '../modules/publicShare/experienceEvent.model';
import { Op } from 'sequelize';

const router = Router();

function getLocalNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const list = interfaces[name] || [];
    for (const iface of list) {
      if ((iface as any).family === 'IPv4' && !(iface as any).internal) {
        return (iface as any).address;
      }
    }
  }
  return null;
}

function buildPublicFileUrl(req: any, filePath: string) {
  const requestHost = req.get('host') || `localhost:${process.env.PORT || 5000}`;
  const requestScheme = req.protocol || 'http';
  const normalizedPath = filePath.replace(/\\/g, '/');

  if (requestHost.includes('localhost') || requestHost.includes('127.0.0.1')) {
    const localIP = getLocalNetworkIp();
    if (localIP) {
      const port = requestHost.split(':')[1] || process.env.PORT || 5000;
      return `http://${localIP}:${port}/${normalizedPath}`;
    }
  }

  return `${requestScheme}://${requestHost}/${normalizedPath}`;
}

router.use(protect);
router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

router.get('/stats', async (req: any, res, next) => {
  try {
    const userId = req.user.id;

    const models = await Model3D.findAll({
      where: { userId },
      attributes: ['id'],
      raw: true,
    });

    const modelIds = models.map((m) => m.id);
    if (modelIds.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: {
          opens: 0,
          qrScans: 0,
          shares: 0,
          devices: {},
        },
      });
    }

    const experiences = await ARExperience.findAll({
      where: { modelId: { [Op.in]: modelIds } },
      attributes: ['id', 'viewsCount'],
      raw: true,
    });

    const expIds = experiences.map((e) => e.id);
    const opens = experiences.reduce((sum, e: any) => sum + (Number(e.viewsCount) || 0), 0);

    let events: any[] = [];
    if (expIds.length) {
      try {
        events = await ARExperienceEvent.findAll({
          where: { experienceId: { [Op.in]: expIds } },
          attributes: ['eventType', 'deviceType'],
          raw: true,
        });
      } catch (err: any) {
        const msg = String(err?.message || '');
        // Backward-compatible: table may not exist yet in DB.
        if (!msg.toLowerCase().includes("doesn't exist")) throw err;
      }
    }

    let qrScans = 0;
    let shares = 0;
    const devices: Record<string, number> = {};

    for (const ev of events as any[]) {
      if (ev.eventType === 'qr_scan') qrScans += 1;
      if (ev.eventType === 'share') shares += 1;
      const d = ev.deviceType || 'unknown';
      devices[d] = (devices[d] || 0) + 1;
    }

    res.status(200).json({
      status: 'success',
      data: { opens, qrScans, shares, devices },
    });
  } catch (e) {
    next(e);
  }
});

router.get('/library', async (req: any, res, next) => {
  try {
    const userId = req.user.id;
    let models: any[] = [];
    try {
      // Default: try fetching all columns (new fields may exist).
      models = await Model3D.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        raw: true,
      });
    } catch (err: any) {
      // Backward-compatible fallback for older DB schemas (e.g., missing convertedFormat columns).
      const msg = String(err?.message || '');
      if (msg.includes('Unknown column')) {
        models = await Model3D.findAll({
          where: { userId },
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'userId', 'name', 'status', 'sizeBytes', 'format', 'createdAt', 'updatedAt'],
          raw: true,
        });
      } else {
        throw err;
      }
    }

    const modelIds = models.map((m) => m.id);
    const experiences = modelIds.length
      ? await ARExperience.findAll({ where: { modelId: { [Op.in]: modelIds } }, raw: true })
      : [];

    const expByModel = new Map<string, any>();
    for (const exp of experiences as any[]) expByModel.set(exp.modelId, exp);

    const expIds = experiences.map((e: any) => e.id);
    let events: any[] = [];
    if (expIds.length) {
      try {
        events = await ARExperienceEvent.findAll({
          where: { experienceId: { [Op.in]: expIds } },
          attributes: ['experienceId', 'eventType', 'deviceType'],
          raw: true,
        });
      } catch (err: any) {
        const msg = String(err?.message || '');
        if (!msg.toLowerCase().includes("doesn't exist")) throw err;
      }
    }

    const metricsByExp = new Map<string, { qrScans: number; shares: number; devices: Record<string, number> }>();
    for (const ev of events as any[]) {
      const entry = metricsByExp.get(ev.experienceId) || { qrScans: 0, shares: 0, devices: {} };
      if (ev.eventType === 'qr_scan') entry.qrScans += 1;
      if (ev.eventType === 'share') entry.shares += 1;
      const d = ev.deviceType || 'unknown';
      entry.devices[d] = (entry.devices[d] || 0) + 1;
      metricsByExp.set(ev.experienceId, entry);
    }

    const clientBase = process.env.CLIENT_URL?.replace(/\/$/, '') || `${req.protocol}://${req.get('host')}`;

    const items = (models as any[]).map((m) => {
      const exp = expByModel.get(m.id) || null;
      const publicUrl = exp ? `${clientBase}/view/${exp.slug}` : null;
      const metrics = exp ? metricsByExp.get(exp.id) : null;
      const fileUrl = m.convertedFileName ? buildPublicFileUrl(req, `outputs/${m.convertedFileName}`) : null;

      return {
        id: m.id,
        title: m.name,
        status: m.status,
        format: (m.convertedFormat || m.format || '').toUpperCase(),
        sizeBytes: Number(m.sizeBytes || 0),
        generatedAt: m.conversionDate || m.createdAt,
        updatedAt: m.updatedAt,
        fileUrl,
        experience: exp
          ? {
              slug: exp.slug,
              publicUrl,
              qrCodeData: exp.qrCodeData,
              opens: Number(exp.viewsCount) || 0,
              qrScans: metrics?.qrScans || 0,
              shares: metrics?.shares || 0,
              devices: metrics?.devices || {},
            }
          : null,
      };
    });

    res.status(200).json({ status: 'success', results: items.length, data: { items } });
  } catch (e) {
    next(e);
  }
});

export default router;

