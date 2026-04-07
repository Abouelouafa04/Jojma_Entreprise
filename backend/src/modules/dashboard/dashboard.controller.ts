import { Response, NextFunction } from 'express';
import Model3D from '../models3d/model3d.model';

export const getStats = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    const usedConversions = await Model3D.count({ where: { userId } });
    const totalSizeBytes = await Model3D.sum('sizeBytes', { where: { userId } }) || 0;
    const usedStorageMb = Math.round(Number(totalSizeBytes) / (1024 * 1024));

    const plan = { name: 'Free', maxConversions: 50, maxStorageMb: 500 };

    res.status(200).json({
      status: 'success',
      data: {
        conversions: {
          used: usedConversions,
          total: plan.maxConversions,
          percentage: (usedConversions / plan.maxConversions) * 100
        },
        storage: {
          used: usedStorageMb,
          total: plan.maxStorageMb,
          unit: 'MB'
        },
        recentActivity: await Model3D.findAll({
          where: { userId },
          limit: 5,
          order: [['createdAt', 'DESC']]
        })
      }
    });
  } catch (error) {
    next(error);
  }
};
