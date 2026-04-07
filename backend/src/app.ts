import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middlewares/error.middleware';

import authRouter from './routes/auth.routes';
import dashboardRouter from './routes/dashboard.routes';
import modelRouter from './routes/model.routes';
import arRouter from './routes/ar.routes.js';
import experienceRouter from './routes/experience.routes';
import conversionRouter from './routes/conversion.routes';
import contactRouter from './routes/contact.routes';
import adminUsersRouter from './routes/admin-users.routes';
import adminModelsRouter from './routes/admin-models.routes';
import adminSupportRouter from './routes/admin-support.routes';
import adminActivityLogsRouter from './routes/admin-activity-logs.routes';
import adminSystemErrorsRouter from './routes/admin-system-errors.routes';
import adminPlatformSettingsRouter from './routes/admin-platform-settings.routes';
import userRouter from './routes/user.routes';

import chatRouter from './routes/chat.routes';
import arLibraryRouter from './routes/ar-library.routes';
import arGenerationRouter from './routes/ar-generation.routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

app.use(helmet({
  contentSecurityPolicy: false, // Nécessaire pour le dev avec Vite
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes API
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/models', modelRouter);
app.use('/api/conversion', conversionRouter);
app.use('/api/ar', arRouter);
app.use('/api/ar', experienceRouter);
app.use('/api/ar', arLibraryRouter);
app.use('/api/ar', arGenerationRouter);
app.use('/api/contact', contactRouter);
app.use('/api/chat', chatRouter);
app.use('/api/admin/users', adminUsersRouter);
app.use('/api/admin/models', adminModelsRouter);
app.use('/api/admin/support', adminSupportRouter);
app.use('/api/admin/activity-logs', adminActivityLogsRouter);
app.use('/api/admin/system-errors', adminSystemErrorsRouter);
app.use('/api/admin/platform-settings', adminPlatformSettingsRouter);
app.use('/api/user', userRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files from uploads (Node.js uploads)
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.glb')) {
      res.setHeader('Content-Type', 'model/gltf-binary');
    }
    if (filePath.endsWith('.usdz')) {
      res.setHeader('Content-Type', 'model/vnd.usdz+zip');
    }
  },
}));

// Serve static files from Python outputs directory (converted 3D files)
// Relative path from backend/src/app.ts: go up 2 levels to root, then python/outputs
const pythonOutputsDir = path.join(__dirname, '../../python/outputs');
console.log(`📁 Serving /outputs from: ${pythonOutputsDir}`);
app.use('/outputs', express.static(pythonOutputsDir));

app.use(errorHandler);

export default app;
