import os from 'os';
import { Request, Response, NextFunction } from 'express';
import ARExperience from './experience.model';
import ARExperienceEvent from './experienceEvent.model';
import Model3D from '../models3d/model3d.model';
import { AppError } from '../../utils/AppError';
import * as qrService from '../../services/qr.service';
import { v4 as uuidv4 } from 'uuid';

const getLocalNetworkIp = (): string | null => {
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceName of Object.keys(networkInterfaces)) {
    const addresses = networkInterfaces[interfaceName];
    if (!addresses) continue;

    for (const addressInfo of addresses) {
      if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
        return addressInfo.address;
      }
    }
  }

  return null;
};

const getClientUrl = (req: Request): string => {
  const envUrl = process.env.CLIENT_URL?.replace(/\/$/, '');
  const forwardedProto = req.get('x-forwarded-proto') || req.protocol || 'http';
  const host = req.get('x-forwarded-host') || req.get('host') || `localhost:${process.env.PORT || 5000}`;

  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }

  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    const localIp = getLocalNetworkIp();
    if (localIp) {
      const port = host.split(':')[1] || String(process.env.PORT || 5000);
      return `${forwardedProto}://${localIp}:${port}`;
    }
  }

  return `${forwardedProto}://${host}`;
};

export const createExperience = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { modelId } = req.body;

    // IMPORTANT: select only legacy columns to stay compatible with older DB schemas.
    // If the table doesn't have new columns (convertedFormat, ...), a full select would crash.
    const model = await Model3D.findOne({
      where: { id: modelId, userId: req.user.id },
      attributes: ['id', 'userId', 'name', 'status', 'sizeBytes', 'format', 'createdAt', 'updatedAt'],
    });
    if (!model) return next(new AppError('Modèle introuvable.', 404));
    if (model.status !== 'completed') return next(new AppError('Le modèle n\'est pas encore converti.', 400));

    const existing = await ARExperience.findOne({ where: { modelId } });
    if (existing) {
      const publicUrl = `${getClientUrl(req)}/view/${existing.slug}`;
      return res.status(200).json({
        status: 'success',
        data: { experience: existing, publicUrl }
      });
    }

    const slug = uuidv4().split('-')[0];
    const viewUrl = `${getClientUrl(req)}/view/${slug}`;
    const qrRedirectUrl = `${req.protocol}://${req.get('host')}/api/ar/qr/${slug}`;

    const qrCodeData = await qrService.generateQRCodeBase64(qrRedirectUrl);

    const experience = await ARExperience.create({
      modelId,
      slug,
      qrCodeData,
    });

    res.status(201).json({
      status: 'success',
      data: { experience, publicUrl: viewUrl }
    });
  } catch (error) {
    next(error);
  }
};

export const getExperienceBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const experience = await ARExperience.findOne({ 
      where: { slug },
      include: [{
        model: Model3D,
        attributes: ['id', 'userId', 'name', 'status', 'sizeBytes', 'format', 'createdAt', 'updatedAt'],
      }]
    });

    if (!experience) return next(new AppError('Expérience introuvable.', 404));

    experience.increment('viewsCount');

    const ua = req.get('user-agent') || null;
    const deviceType =
      ua && /iphone|ipad|ipod/i.test(ua) ? 'ios' :
      ua && /android/i.test(ua) ? 'android' :
      ua && /macintosh|windows|linux/i.test(ua) ? 'desktop' :
      'unknown';

    await ARExperienceEvent.create({
      experienceId: experience.id,
      eventType: 'open',
      deviceType,
      userAgent: ua,
    }).catch(() => null);

    res.status(200).json({
      status: 'success',
      data: { experience }
    });
  } catch (error) {
    next(error);
  }
};

export const trackQrAndRedirect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const experience = await ARExperience.findOne({ where: { slug } });
    if (!experience) return next(new AppError('Expérience introuvable.', 404));

    const ua = req.get('user-agent') || null;
    const deviceType =
      ua && /iphone|ipad|ipod/i.test(ua) ? 'ios' :
      ua && /android/i.test(ua) ? 'android' :
      ua && /macintosh|windows|linux/i.test(ua) ? 'desktop' :
      'unknown';

    await ARExperienceEvent.create({
      experienceId: experience.id,
      eventType: 'qr_scan',
      deviceType,
      userAgent: ua,
    }).catch(() => null);

    const clientUrl = getClientUrl(req);
    res.redirect(`${clientUrl}/view/${slug}`);
  } catch (error) {
    next(error);
  }
};

export const trackShare = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const experience = await ARExperience.findOne({ where: { slug } });
    if (!experience) return next(new AppError('Expérience introuvable.', 404));

    const ua = req.get('user-agent') || null;
    const deviceType =
      ua && /iphone|ipad|ipod/i.test(ua) ? 'ios' :
      ua && /android/i.test(ua) ? 'android' :
      ua && /macintosh|windows|linux/i.test(ua) ? 'desktop' :
      'unknown';

    await ARExperienceEvent.create({
      experienceId: experience.id,
      eventType: 'share',
      deviceType,
      userAgent: ua,
    }).catch(() => null);

    res.status(200).json({ status: 'success', message: 'Partage enregistré.' });
  } catch (error) {
    next(error);
  }
};
