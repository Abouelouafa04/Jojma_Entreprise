import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import User from '../modules/users/user.model';

export const protect = async (req: any, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Vous n\'êtes pas connecté.', 401, 'NOT_AUTHENTICATED'));
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const currentUser = await User.findByPk(decoded.id);

    if (!currentUser) {
      return next(new AppError('L\'utilisateur n\'existe plus.', 401, 'USER_NOT_FOUND'));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    next(new AppError('Token invalide ou expiré.', 401, 'INVALID_TOKEN'));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Vous n\'avez pas la permission d\'effectuer cette action.', 403));
    }
    next();
  };
};

export const authenticateJWT = protect;
export const authorizeAdmin = restrictTo('admin');
export const authMiddleware = [protect, restrictTo('admin')];
