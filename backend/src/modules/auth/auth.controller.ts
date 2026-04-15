import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import os from 'os';
import User from '../users/user.model';
import EmailVerificationToken from '../users/emailVerificationToken.model';
import PasswordResetToken from '../users/passwordResetToken.model';
import EmailService from '../../services/email.service';
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
      message: 'compte créé avec succès. Vous pouvez vous connecter immédiatement.',
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

    // Trouver le token (no eager include to avoid association mismatch in tests)
    const verificationToken = await EmailVerificationToken.findOne({
      where: { token }
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

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError('Veuillez fournir un email.', 400));
    }

    const user = await User.findOne({ where: { email } });

    // Always respond with success to avoid email enumeration
    if (user) {
      // Remove existing tokens for this user
      await PasswordResetToken.destroy({ where: { userId: user.id } });

      const plainToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');
      const expiresAt = new Date(Date.now() + (60 * 60 * 1000)); // 1 hour

      await PasswordResetToken.create({ userId: user.id, token: hashedToken, expiresAt });

      const getLocalNetworkIp = (): string | null => {
        const nets = os.networkInterfaces();
        for (const name of Object.keys(nets)) {
          const net = (nets as any)[name];
          for (const iface of net) {
            if (iface.family === 'IPv4' && !iface.internal) {
              return iface.address;
            }
          }
        }
        return null;
      };

      const buildFrontendUrl = (req: Request) => {
        const envUrl = process.env.FRONTEND_URL;
        if (envUrl) return envUrl.replace(/\/$/, '');

        // In development try to use local network IP so mobile devices on the LAN can access
        if ((process.env.NODE_ENV || 'development') === 'development') {
          const protocol = process.env.FRONTEND_PROTOCOL || 'http';
          const port = process.env.FRONTEND_PORT || '5173';
          const ip = getLocalNetworkIp();
          if (ip) return `${protocol}://${ip}:${port}`;
        }

        // Final fallback to localhost with port (kept for safety)
        return `http://localhost:${process.env.FRONTEND_PORT || '5173'}`;
      };

      const frontend = buildFrontendUrl(req);
      const resetUrl = `${frontend}/reset-password?token=${plainToken}&id=${user.id}`;

      try {
        await EmailService.sendPasswordResetEmail(user.email, resetUrl, user.fullName);
      } catch (emailErr) {
        // log but do not reveal email errors to client
        console.error('Email send error:', emailErr?.message || emailErr);
      }
    }

    res.status(200).json({ status: 'success', message: 'Si un compte existe, vous recevrez un email contenant les instructions pour réinitialiser votre mot de passe.' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Accept token and id from several possible locations (body, query, params)
    const body: any = req.body || {};
    const tokenRaw: string | undefined = body.token || (req.query && (req.query.token as string)) || (req.params && (req.params.token as string));
    let userId: string | undefined = body.id || (req.query && (req.query.id as string)) || (req.params && (req.params.id as string));
    const password: string | undefined = body.password;
    const confirmPassword: string | undefined = body.confirmPassword;

    if (!tokenRaw || !password || !confirmPassword) {
      return next(new AppError('Tous les champs sont requis.', 400));
    }

    if (password !== confirmPassword) {
      return next(new AppError('Les mots de passe ne correspondent pas.', 400));
    }

    if (password.length < 8) {
      return next(new AppError('Le mot de passe doit contenir au moins 8 caractères.', 400));
    }

    // Debug: log incoming token snippet (never log full token in production)
    if ((process.env.NODE_ENV || 'development') === 'development') {
      try {
        console.debug('[resetPassword] incoming token snippet', { tokenSnippet: tokenRaw ? `${String(tokenRaw).slice(0, 8)}...` : null, userIdProvided: !!userId });
      } catch (e) {}
    }

    // Hash incoming plain token to compare with stored hashed token
    const hashedToken = crypto.createHash('sha256').update(tokenRaw).digest('hex');

    // Try to find token record. If userId is provided, prefer a lookup with both fields.
    let tokenRecord = null as any;
    if (userId) {
      tokenRecord = await PasswordResetToken.findOne({ where: { userId, token: hashedToken } });
    }

    if (!tokenRecord) {
      // Fallback: search by token only (useful if id wasn't passed correctly)
      tokenRecord = await PasswordResetToken.findOne({ where: { token: hashedToken } });
      if (tokenRecord) {
        userId = tokenRecord.userId;
      }
    }

    if (!tokenRecord) {
      if ((process.env.NODE_ENV || 'development') === 'development') {
        try {
          console.debug('[resetPassword] token not found - hashedToken snippet', { hashedTokenSnippet: `${hashedToken.slice(0, 8)}...` });
        } catch (e) {}
      }
      return next(new AppError('Token invalide ou expiré.', 400));
    }

    if (tokenRecord.expiresAt < new Date()) {
      await tokenRecord.destroy();
      return next(new AppError('Token expiré.', 400));
    }

    const user = await User.findByPk(userId as string);

    if (!user) {
      return next(new AppError('Utilisateur non trouvé.', 404));
    }

    try {
      const newHashedPassword = await bcrypt.hash(password, 12);
      user.password = newHashedPassword;
      await user.save();
    } catch (saveErr: any) {
      console.error('Error saving new password:', saveErr?.message || saveErr);
      return next(new AppError('Impossible de mettre à jour le mot de passe.', 500));
    }

    // Destroy token after successful password update
    try {
      await tokenRecord.destroy();
    } catch (destroyErr: any) {
      console.warn('Failed to destroy password reset token:', destroyErr?.message || destroyErr);
    }

    res.status(200).json({ status: 'success', message: 'Mot de passe réinitialisé avec succès.' });
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
