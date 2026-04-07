import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../users/user.model';
import EmailVerificationToken from '../users/emailVerificationToken.model';
import { AppError } from '../../utils/AppError';

const signToken = (id: string) => {
  return jwt.sign({ id }, (process.env.JWT_SECRET || 'secret') as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, password, confirmPassword, accountType, agreeToTerms } = req.body;

    const normalizedFullName = typeof fullName === 'string' ? fullName.trim() : '';
    const [derivedPrenom = '', ...lastNameParts] = normalizedFullName.split(/\s+/).filter(Boolean);
    const derivedNom = lastNameParts.join(' ');

    // Validation
    if (!normalizedFullName || !email || !password || !confirmPassword || !accountType) {
      return next(new AppError('Tous les champs sont requis.', 400));
    }

    if (password !== confirmPassword) {
      return next(new AppError('Les mots de passe ne correspondent pas.', 400));
    }

    if (!agreeToTerms) {
      return next(new AppError('Vous devez accepter les conditions d\'utilisation.', 400));
    }

    if (password.length < 8) {
      return next(new AppError('Le mot de passe doit contenir au moins 8 caractères.', 400));
    }

    // Créer l'utilisateur actif immédiatement (activation email désactivée)
    const newUser = await User.create({
      fullName: normalizedFullName,
      prenom: derivedPrenom || null,
      nom: derivedNom || null,
      email,
      password,
      accountType,
      termsAccepted: agreeToTerms,
      isActive: true,
      emailVerified: true
    });

    res.status(201).json({
      status: 'success',
      message: 'Compte créé avec succès. Vous pouvez vous connecter immédiatement.',
      data: { user: { id: newUser.id, email: newUser.email, fullName: newUser.fullName } }
    });
  } catch (error: any) {
    console.error('❌ Register error:', {
      name: error?.name,
      message: error?.message,
      parentMessage: error?.parent?.message,
      sqlMessage: error?.original?.sqlMessage,
      sql: error?.sql
    });

    if (error.name === 'SequelizeUniqueConstraintError') {
      return next(new AppError('Cet email est déjà utilisé.', 400));
    }

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
      const debugDetail = error?.original?.sqlMessage || error?.parent?.message || error?.message;
      const message =
        process.env.NODE_ENV === 'development'
          ? `Erreur SQL inscription: ${debugDetail}`
          : 'Erreur lors de la création du compte.';
      return next(new AppError(message, 400));
    }

    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;

    if (!token) {
      return next(new AppError('Token de vérification manquant.', 400));
    }

    // Trouver le token
    const verificationToken = await EmailVerificationToken.findOne({
      where: { token },
      include: [{ model: User, as: 'user' }]
    });

    if (!verificationToken) {
      return next(new AppError('Token de vérification invalide.', 400));
    }

    if (verificationToken.expiresAt < new Date()) {
      return next(new AppError('Token de vérification expiré.', 400));
    }

    // Activer l'utilisateur
    const user = await User.findByPk(verificationToken.userId);
    if (!user) {
      return next(new AppError('Utilisateur non trouvé.', 404));
    }

    user.isActive = true;
    user.emailVerified = true;
    await user.save();

    // Supprimer le token
    await verificationToken.destroy();

    // Rediriger vers la page de bienvenue
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/welcome`);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return next(new AppError('Veuillez fournir un email et un mot de passe.', 400));
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Email ou mot de passe incorrect.', 401));
    }

    const token = signToken(user.id);

    // Cookie sécurisé
    res.cookie('jojma_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 7 jours ou 1 jour
    });

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          accountType: user.accountType,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Supprimer le cookie
    res.clearCookie('jojma_token');
    res.status(200).json({
      status: 'success',
      message: 'Déconnexion réussie.'
    });
  } catch (error) {
    next(error);
  }
};
