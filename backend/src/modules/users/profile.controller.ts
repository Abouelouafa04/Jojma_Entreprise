import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../../utils/AppError';
import User from './user.model';

const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  phone: z
    .string()
    .trim()
    .min(6)
    .max(30)
    .optional()
    .or(z.literal('')),
  location: z.string().trim().min(2).max(120).optional().or(z.literal('')),
  company: z.string().trim().min(2).max(120).optional().or(z.literal('')),
  industry: z.string().trim().min(2).max(120).optional().or(z.literal('')),
  jobTitle: z.string().trim().min(2).max(120).optional().or(z.literal('')),
  accountType: z.enum(['creator', 'company', 'studio', 'agency']).optional(),
});

function serializeUserProfile(user: User) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    prenom: user.prenom ?? null,
    nom: user.nom ?? null,
    accountType: user.accountType,
    role: user.role,
    phone: user.phone ?? null,
    location: user.location ?? null,
    company: user.company ?? null,
    industry: user.industry ?? null,
    jobTitle: user.jobTitle ?? null,
    profilePhotoUrl: user.profilePhotoUrl ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const getMyProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User | undefined;
    if (!user) return next(new AppError("Vous n'êtes pas connecté.", 401));

    const freshUser = await User.findByPk(user.id);
    if (!freshUser) return next(new AppError("L'utilisateur n'existe plus.", 401, 'USER_NOT_FOUND'));

    res.status(200).json({
      status: 'success',
      data: {
        profile: serializeUserProfile(freshUser),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User | undefined;
    if (!user) return next(new AppError("Vous n'êtes pas connecté.", 401, 'NOT_AUTHENTICATED'));

    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || 'Données invalides.';
      return next(new AppError(message, 400));
    }

    const payload = parsed.data;
    const currentUser = await User.findByPk(user.id);
    if (!currentUser) return next(new AppError("L'utilisateur n'existe plus.", 401, 'USER_NOT_FOUND'));

    if (typeof payload.fullName === 'string') {
      const normalizedFullName = payload.fullName.trim();
      currentUser.fullName = normalizedFullName;
      const [derivedPrenom = '', ...lastNameParts] = normalizedFullName.split(/\s+/).filter(Boolean);
      currentUser.prenom = derivedPrenom || null;
      currentUser.nom = lastNameParts.join(' ') || null;
    }

    const nullableFields: Array<keyof typeof payload> = ['phone', 'location', 'company', 'industry', 'jobTitle'];
    for (const field of nullableFields) {
      const value = payload[field];
      if (typeof value === 'string') {
        (currentUser as any)[field] = value.trim() === '' ? null : value.trim();
      }
    }

    if (payload.accountType) {
      currentUser.accountType = payload.accountType;
    }

    await currentUser.save();

    res.status(200).json({
      status: 'success',
      message: 'Profil mis à jour.',
      data: {
        profile: serializeUserProfile(currentUser),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyPhoto = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User | undefined;
    if (!user) return next(new AppError("Vous n'êtes pas connecté.", 401, 'NOT_AUTHENTICATED'));

    const file = req.file as Express.Multer.File | undefined;
    if (!file) return next(new AppError('Aucun fichier reçu.', 400));

    const currentUser = await User.findByPk(user.id);
    if (!currentUser) return next(new AppError("L'utilisateur n'existe plus.", 401, 'USER_NOT_FOUND'));

    const urlPath = `/uploads/profile/${file.filename}`;
    currentUser.profilePhotoUrl = urlPath;
    await currentUser.save();

    res.status(200).json({
      status: 'success',
      message: 'Photo mise à jour.',
      data: {
        profile: serializeUserProfile(currentUser),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMyAccount = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User | undefined;
    if (!user) return next(new AppError("Vous n'êtes pas connecté.", 401, 'NOT_AUTHENTICATED'));

    const currentUser = await User.findByPk(user.id);
    if (!currentUser) return next(new AppError("L'utilisateur n'existe plus.", 401, 'USER_NOT_FOUND'));

    // Soft-delete (désactivation + anonymisation) pour éviter les problèmes de clés étrangères.
    currentUser.isActive = false;
    currentUser.emailVerified = false;
    currentUser.fullName = 'Utilisateur supprimé';
    currentUser.prenom = null;
    currentUser.nom = null;
    currentUser.phone = null;
    currentUser.location = null;
    currentUser.company = null;
    currentUser.industry = null;
    currentUser.jobTitle = null;
    currentUser.profilePhotoUrl = null;

    // Ensure unique email while preventing re-login with previous email.
    currentUser.email = `deleted+${currentUser.id}@jojma.local`;

    await currentUser.save();

    res.status(200).json({
      status: 'success',
      message: 'Compte supprimé.',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

