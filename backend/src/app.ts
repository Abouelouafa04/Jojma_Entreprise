import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { errorHandler } from './middlewares/error.middleware';

import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import adminDemandesRouter from './routes/admin-demandes.routes';
import adminUsersRouter from './routes/admin-users.routes';
import demandesRouter from './routes/demandes.routes';

// Compute a reliable app directory without using `import.meta`
// (avoids SyntaxError under CommonJS/Jest where `import.meta` is invalid).
const appDirname = (typeof (globalThis as any).__dirname !== 'undefined')
  ? (globalThis as any).__dirname
  : ((typeof (globalThis as any).__filename !== 'undefined')
    ? path.dirname((globalThis as any).__filename)
    : path.join(process.cwd(), 'src'));

const app: Application = express();

app.use(helmet({
  contentSecurityPolicy: false, // Nécessaire pour le dev avec Vite
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes API (minimal set to avoid loading optional/ESM-heavy modules during tests)
app.use('/api/auth', authRouter);
app.use('/api/demandes', demandesRouter);
app.use('/api/admin/demandes', adminDemandesRouter);
app.use('/api/admin/users', adminUsersRouter);
app.use('/api/user', userRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files from uploads (Node.js uploads)
const uploadsDir = path.join(appDirname, 'uploads');
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, filePath) => {
    // Allow cross-origin access to uploaded files (useful for mobile AR viewers).
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Allow the resource to be fetched from other origins (avoid same-origin restriction).
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
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
const pythonOutputsDir = path.join(appDirname, '../../python/outputs');
console.log(`📁 Serving /outputs from: ${pythonOutputsDir}`);
app.use('/outputs', express.static(pythonOutputsDir, {
  setHeaders: (res, filePath) => {
    // Allow cross-origin access to converted outputs (required for mobile AR viewers).
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    if (filePath.endsWith('.glb')) {
      res.setHeader('Content-Type', 'model/gltf-binary');
    }
    if (filePath.endsWith('.usdz')) {
      res.setHeader('Content-Type', 'model/vnd.usdz+zip');
    }
  },
}));

app.use(errorHandler);

export default app;
