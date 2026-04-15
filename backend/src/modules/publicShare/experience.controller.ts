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
  // Prefer an explicit CLIENT_URL when provided and not pointing to localhost.
  const envUrlRaw = process.env.CLIENT_URL;
  const envUrl = envUrlRaw?.replace(/\/$/, '');
  const forwardedProto = req.get('x-forwarded-proto') || req.protocol || 'http';
  const hostHeader = req.get('x-forwarded-host') || req.get('host') || `localhost:${process.env.PORT || 5000}`;

  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }

  // Try to infer the frontend origin from the Referer header. This is helpful
  // during development when the frontend runs on a different port (Vite).
  const referer = (req.get('referer') || req.get('referrer') || '') as string;
  if (referer) {
    try {
      const parsedRef = new URL(referer);
      // If the referer already points to a non-localhost host, use it directly.
      if (!parsedRef.hostname.includes('localhost') && !parsedRef.hostname.includes('127.0.0.1')) {
        return `${parsedRef.protocol}//${parsedRef.host.replace(/\/$/, '')}`;
      }

      // If referer is localhost but we can detect a LAN IP, substitute it and keep the port.
      const localIp = getLocalNetworkIp();
      if (localIp) {
        const port = parsedRef.port || String(process.env.FRONTEND_PORT || '5173');
        return `${parsedRef.protocol}//${localIp}:${port}`;
      }
    } catch (e) {
      // ignore parse errors and fallback below
    }
  }

  // Fallback: if host header contains localhost, try to swap with LAN IP.
  if (hostHeader.includes('localhost') || hostHeader.includes('127.0.0.1')) {
    const localIp = getLocalNetworkIp();
    if (localIp) {
      const port = hostHeader.split(':')[1] || String(process.env.PORT || 5000);
      return `${forwardedProto}://${localIp}:${port}`;
    }
  }

  // Final fallback: use the host header as-is.
  return `${forwardedProto}://${hostHeader}`;
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
      console.debug('[createExperience] existing publicUrl =', publicUrl);
      // Attempt to compute a public file URL for the model (best-effort).
      let publicFileUrl: string | undefined = undefined;
      try {
        const modelRecord: any = await Model3D.findOne({ where: { id: modelId } });
        if (modelRecord && modelRecord.convertedFileName) {
          const filePath = `outputs/${modelRecord.convertedFileName}`;
          const requestHost = req.get('host') || `localhost:${process.env.PORT || 5000}`;
          const requestScheme = req.get('x-forwarded-proto') || req.protocol || 'http';
          if (requestHost.includes('localhost') || requestHost.includes('127.0.0.1')) {
            const localIp = getLocalNetworkIp();
            if (localIp) {
              const port = requestHost.split(':')[1] || process.env.PORT || 5000;
              publicFileUrl = `http://${localIp}:${port}/${filePath}`;
            }
          }
          if (!publicFileUrl) {
            publicFileUrl = `${requestScheme}://${requestHost}/${filePath}`;
          }
        }
      } catch (err) {
        // non-fatal - continue without publicFileUrl
      }

      return res.status(200).json({
        status: 'success',
        data: { experience: existing, publicUrl, publicFileUrl }
      });
    }

    const slug = uuidv4().split('-')[0];

    // Compute a safe absolute frontend URL to encode in the QR code.
    // Prefer the client URL computed by getClientUrl(). If it contains
    // localhost/127.0.0.1, try to replace with a LAN IP when available,
    // or fall back to an explicit CLIENT_URL environment variable.
    let clientBase = getClientUrl(req) || `${req.protocol}://${req.get('host')}`;
    try {
      const parsed = new URL(clientBase);
      if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
        const localIp = getLocalNetworkIp();
        if (localIp) {
          parsed.hostname = localIp;
          clientBase = parsed.origin;
        } else if (process.env.CLIENT_URL && !process.env.CLIENT_URL.includes('localhost') && !process.env.CLIENT_URL.includes('127.0.0.1')) {
          clientBase = process.env.CLIENT_URL.replace(/\/$/, '');
        }
      }
    } catch (e) {
      // ignore parse errors and keep clientBase as-is
    }

    const viewUrl = `${clientBase}/view/${slug}`;

    // Generate QR that points directly to the frontend view (absolute URL).
    console.debug('[createExperience] viewUrl =', viewUrl);
    const qrCodeData = await qrService.generateQRCodeBase64(viewUrl);

    const experience = await ARExperience.create({
      modelId,
      slug,
      qrCodeData,
    });
    console.debug('[createExperience] created experience slug =', experience.slug, 'publicUrl =', viewUrl);

    // Best-effort: attach a public file URL to the response when possible.
    let publicFileUrl: string | undefined = undefined;
    try {
      const modelRecord: any = await Model3D.findOne({ where: { id: modelId } });
      if (modelRecord && modelRecord.convertedFileName) {
        const filePath = `outputs/${modelRecord.convertedFileName}`;
        const requestHost = req.get('host') || `localhost:${process.env.PORT || 5000}`;
        const requestScheme = req.get('x-forwarded-proto') || req.protocol || 'http';
        if (requestHost.includes('localhost') || requestHost.includes('127.0.0.1')) {
          const localIp = getLocalNetworkIp();
          if (localIp) {
            const port = requestHost.split(':')[1] || process.env.PORT || 5000;
            publicFileUrl = `http://${localIp}:${port}/${filePath}`;
          }
        }
        if (!publicFileUrl) {
          publicFileUrl = `${requestScheme}://${requestHost}/${filePath}`;
        }
      }
    } catch (err) {
      // non-fatal - continue without publicFileUrl
    }

    res.status(201).json({
      status: 'success',
      data: { experience, publicUrl: viewUrl, publicFileUrl }
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
        // Include converted file info so public view can locate the correct output file
        attributes: ['id', 'userId', 'name', 'status', 'sizeBytes', 'format', 'convertedFormat', 'convertedFileName', 'conversionDate', 'createdAt', 'updatedAt'],
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

    // Convert to plain object and attach a public file URL for the included Model3D
    const expObj = (experience as any).get ? (experience as any).get({ plain: true }) : experience;
    try {
      const model = expObj?.Model3D || expObj?.model || null;
      if (model?.convertedFileName) {
        const filePath = `outputs/${model.convertedFileName}`;
        const requestHost = req.get('host') || `localhost:${process.env.PORT || 5000}`;
        const requestScheme = req.get('x-forwarded-proto') || req.protocol || 'http';
        let publicFileUrl = `${requestScheme}://${requestHost}/${filePath}`;
        if (requestHost.includes('localhost') || requestHost.includes('127.0.0.1')) {
          const localIp = getLocalNetworkIp();
          if (localIp) {
            const port = requestHost.split(':')[1] || process.env.PORT || 5000;
            publicFileUrl = `http://${localIp}:${port}/${filePath}`;
          }
        }
        if (expObj.Model3D) expObj.Model3D.publicFileUrl = publicFileUrl;
        else if (expObj.model) expObj.model.publicFileUrl = publicFileUrl;
      }
    } catch (err) {
      // non-fatal - continue without publicFileUrl
    }

    res.status(200).json({
      status: 'success',
      data: { experience: expObj }
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
    console.debug('[trackQrAndRedirect] redirecting to', `${clientUrl}/view/${slug}`);
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
