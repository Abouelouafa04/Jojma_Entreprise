import { Request, Response } from 'express';
import AppError from '../utils/AppError';

// Mock data
const mockErrors = [
  {
    id: '1',
    errorId: 'ERR-2024-001',
    service: 'database',
    type: 'connection',
    severity: 'critical',
    message: 'Timeout de connexion à la base de données primaire',
    timestamp: new Date(Date.now() - 15 * 60000),
    status: 'new' as const,
    occurrences: 47,
    affectedUsers: 234
  },
  {
    id: '2',
    errorId: 'ERR-2024-002',
    service: 'conversion',
    type: 'timeout',
    severity: 'warning',
    message: 'Conversion 3D dépassée 30 minutes',
    timestamp: new Date(Date.now() - 45 * 60000),
    status: 'analyzed' as const,
    assignedTo: 'Jean Dupont',
    occurrences: 12
  },
  {
    id: '3',
    errorId: 'ERR-2024-003',
    service: 'upload',
    type: 'resource',
    severity: 'warning',
    message: 'Espace disque insuffisant sur serveur upload',
    timestamp: new Date(Date.now() - 1 * 3600000),
    status: 'assigned' as const,
    assignedTo: 'Marie Martin',
    occurrences: 5
  }
];

// CRUD Operations
export const getAllErrors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { service, severity, status, search, page = 1, limit = 10 } = req.query;

    // TODO: Replace with actual DB query
    // const errors = await SystemError.findAndCountAll({
    //   where: { ...(service && { service }), ...(severity && { severity }) },
    //   limit: parseInt(limit as string),
    //   offset: (parseInt(page as string) - 1) * parseInt(limit as string)
    // });

    const filtered = mockErrors.filter(e => {
      if (service && e.service !== service) return false;
      if (severity && e.severity !== severity) return false;
      if (status && e.status !== status) return false;
      if (search && !e.message.toLowerCase().includes((search as string).toLowerCase())) return false;
      return true;
    });

    res.status(200).json({
      success: true,
      data: filtered.slice(0, parseInt(limit as string)),
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: filtered.length,
        pages: Math.ceil(filtered.length / parseInt(limit as string))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: AppError.handle(error) });
  }
};

export const getErrorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { errorId } = req.params;

    // TODO: Replace with DB query
    const error = mockErrors.find(e => e.id === errorId);
    if (!error) {
      res.status(404).json({ success: false, error: 'Erreur non trouvée' });
      return;
    }

    res.status(200).json({ success: true, data: error });
  } catch (error) {
    res.status(500).json({ success: false, error: AppError.handle(error) });
  }
};

// Statistics
export const getErrorStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // TODO: Replace with DB aggregation
    const stats = {
      total: mockErrors.length,
      info: mockErrors.filter(e => e.severity === 'info').length,
      warning: mockErrors.filter(e => e.severity === 'warning').length,
      critical: mockErrors.filter(e => e.severity === 'critical').length,
      analyzed: mockErrors.filter(e => e.status === 'analyzed').length,
      unresolved: mockErrors.filter(e => ['new', 'assigned'].includes(e.status)).length
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: AppError.handle(error) });
  }
};

export const getErrorsByService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { service } = req.params;

    // TODO: Replace with DB query
    const errors = mockErrors.filter(e => e.service === service);

    res.status(200).json({ success: true, data: errors });
  } catch (error) {
    res.status(500).json({ success: false, error: AppError.handle(error) });
  }
};

export const getErrorsBySeverity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { severity } = req.params;

    // TODO: Replace with DB query
    const errors = mockErrors.filter(e => e.severity === severity);

    res.status(200).json({ success: true, data: errors });
  } catch (error) {
    res.status(500).json({ success: false, error: AppError.handle(error) });
  }
};

export const getErrorsByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.params;

    // TODO: Replace with DB query
    const errors = mockErrors.filter(e => e.status === status);

    res.status(200).json({ success: true, data: errors });
  } catch (error) {
    res.status(500).json({ success: false, error: AppError.handle(error) });
  }
};

// Search
export const searchErrors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;

    // TODO: Replace with DB search
    const errors = mockErrors.filter(e =>
      e.message.toLowerCase().includes((query as string).toLowerCase()) ||
      e.errorId.toLowerCase().includes((query as string).toLowerCase())
    );

    res.status(200).json({ success: true, data: errors });
  } catch (error) {
    res.status(500).json({ success: false, error: AppError.handle(error) });
  }
};

// Update Status
export const markAsAnalyzed = async (req: Request, res: Response): Promise<void> => {
  try {
    const { errorId } = req.params;

    // TODO: Update DB record
    const error = mockErrors.find(e => e.id === errorId);
    if (error) {
      (error as any).status = 'analyzed';
    }

    res.status(200).json({ success: true, data: error });
  } catch (error) {
    res.status(500).json({ success: false, error: AppError.handle(error) });
  }
};

export const assignError = async (req: Request, res: Response): Promise<void> => {
  try {
    const { errorId } = req.params;
    const { technicianId } = req.body;

    // TODO: Update DB record
    const error = mockErrors.find(e => e.id === errorId);
    if (error) {
      (error as any).status = 'assigned';
      (error as any).assignedTo = `Technician ${technicianId}`;
    }

    res.status(200).json({ success: true, data: error });
  } catch (error) {
    res.status(500).json({ success: false, error: AppError.handle(error) });
  }
};

export const resolveError = async (req: Request, res: Response): Promise<void> => {
  try {
    const { errorId } = req.params;

    // TODO: Update DB record
    const error = mockErrors.find(e => e.id === errorId);
    if (error) {
      (error as any).status = 'resolved';
    }

    res.status(200).json({ success: true, data: error });
  } catch (error) {
    res.status(500).json({ success: false, error: AppError.handle(error) });
  }
};

// Service Operations
export const restartService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { service } = req.params;

    // TODO: Call service restart logic
    res.status(200).json({ success: true, message: `Service ${service} redémarré` });
  } catch (error) {
    res.status(500).json({ success: false, error: AppError.handle(error) });
  }
};

export const getServiceStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { service } = req.params;

    // TODO: Get real service status
    res.status(200).json({
      success: true,
      data: { status: 'operational', uptime: 99.9, lastCheck: new Date() }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: AppError.handle(error) });
  }
};

// Analytics
export const getErrorTrends = async (req: Request, res: Response): Promise<void> => {
  try {
    const { days = 7 } = req.query;

    // TODO: Get trend data from DB
    const trendData = Array.from({ length: parseInt(days as string) }, (_, i) => ({
      date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
      errors: Math.floor(Math.random() * 50)
    }));

    res.status(200).json({ success: true, data: trendData });
  } catch (error) {
    res.status(500).json({ success: false, error: AppError.handle(error) });
  }
};

export const getMostFrequentErrors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 10 } = req.query;

    // TODO: Get from DB
    res.status(200).json({ success: true, data: mockErrors.slice(0, parseInt(limit as string)) });
  } catch (error) {
    res.status(500).json({ success: false, error: AppError.handle(error) });
  }
};

export const getServiceHealthScore = async (req: Request, res: Response): Promise<void> => {
  try {
    // TODO: Calculate from real metrics
    const scores = {
      auth: 99.8,
      database: 98.5,
      upload: 97.2,
      conversion: 96.8,
      ar: 99.1,
      api: 99.5,
      admin: 99.9
    };

    res.status(200).json({ success: true, data: scores });
  } catch (error) {
    res.status(500).json({ success: false, error: AppError.handle(error) });
  }
};

// Export
export const exportErrors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { service, severity, status, format = 'csv' } = req.query;

    // TODO: Generate CSV from DB
    const filtered = mockErrors.filter(e => {
      if (service && e.service !== service) return false;
      if (severity && e.severity !== severity) return false;
      if (status && e.status !== status) return false;
      return true;
    });

    const csv = [
      ['ID Erreur', 'Service', 'Type', 'Gravité', 'Message', 'Date', 'Statut'],
      ...filtered.map(e => [e.errorId, e.service, e.type, e.severity, e.message, e.timestamp.toISOString(), e.status])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="erreurs-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, error: AppError.handle(error) });
  }
};
