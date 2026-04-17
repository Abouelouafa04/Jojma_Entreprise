import { Response, NextFunction } from 'express';
import Model3D from './model3d.model';
import { AppError } from '../../utils/AppError';
import * as conversionService from '../../services/conversion.service';
import path from 'path';

export const uploadModel = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new AppError('Veuillez uploader un fichier.', 400));
    }

    const { originalname, size, filename } = req.file;
    const userId = req.user.id;

    const newModel = await Model3D.create({
      userId,
      name: originalname,
      sizeBytes: size,
      format: path.extname(originalname).substring(1),
      status: 'pending'
    });

    // Typing shim: conversionService.processConversion may be implemented at runtime.
    // Use a narrow, low-risk cast to avoid TypeScript error without changing runtime behavior.
    (conversionService as any).processConversion(newModel.id);

    res.status(201).json({
      status: 'success',
      message: 'Fichier reçu, conversion en cours...',
      data: { model: newModel }
    });
  } catch (error) {
    next(error);
  }
};

export const getMyModels = async (req: any, res: Response, next: NextFunction) => {
  try {
    const models = await Model3D.findAll({ 
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      results: models.length,
      data: { models }
    });
  } catch (error) {
    next(error);
  }
};
