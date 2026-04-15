import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AppError } from '../utils/AppError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      err = new AppError('Fichier trop volumineux (max 5MB).', 400);
    } else {
      err = new AppError(`Erreur upload: ${err.message}`, 400);
    }
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥', {
      method: req.method,
      path: req.originalUrl,
      statusCode: err.statusCode,
      message: err.message,
      stack: err.stack,
    });
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      code: err.code,
      stack: err.stack
    });
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(err.code ? { code: err.code } : {})
      });
    } else {
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Quelque chose a mal tourné.'
      });
    }
  }
};
