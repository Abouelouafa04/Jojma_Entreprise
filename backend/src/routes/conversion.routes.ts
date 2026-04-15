import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { protect } from '../middlewares/auth.middleware';
import ConversionJob from '../modules/conversionJobs/conversionJob.model';
// Avoid using import.meta in tests; compute app directory from globals or cwd

const router = Router();

// Configure multer for in-memory file storage
const upload = multer({ storage: multer.memoryStorage() });

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://127.0.0.1:8000';

const appDirname = (typeof (globalThis as any).__dirname !== 'undefined')
  ? (globalThis as any).__dirname
  : ((typeof (globalThis as any).__filename !== 'undefined')
    ? path.dirname((globalThis as any).__filename)
    : path.join(process.cwd(), 'src'));

const UPLOADS_ROOT = path.join(appDirname, '..', 'uploads');
const CONVERSION_INPUT_DIR = path.join(UPLOADS_ROOT, 'conversion', 'input');

function ensureDirSync(dirPath: string) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

type JobDto = {
  id: string;
  originalFileName: string;
  sourceFormat: string;
  targetFormat: string;
  status: string;
  progress: number;
  outputUrl: string | null;
  errorMessage: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function toJobDto(job: any): JobDto {
  return {
    id: job.id,
    originalFileName: job.originalFileName,
    sourceFormat: job.sourceFormat,
    targetFormat: job.targetFormat,
    status: job.status,
    progress: job.progress,
    outputUrl: job.outputFileName ? `/outputs/${job.outputFileName}` : null,
    errorMessage: job.errorMessage ?? null,
    startedAt: job.startedAt ? new Date(job.startedAt).toISOString() : null,
    finishedAt: job.finishedAt ? new Date(job.finishedAt).toISOString() : null,
    createdAt: new Date(job.createdAt).toISOString(),
    updatedAt: new Date(job.updatedAt).toISOString(),
  };
}

// -----------------------------
// Minimal in-process job queue
// -----------------------------
const processingQueue = new Set<string>();
let queueRunnerStarted = false;

async function processJob(jobId: string): Promise<void> {
  const job = await ConversionJob.findByPk(jobId);
  if (!job) return;

  if (job.status === 'processing') return;
  if (job.status === 'success') return;

  await job.update({
    status: 'processing',
    progress: Math.max(job.progress ?? 0, 5),
    startedAt: new Date(),
    finishedAt: null,
    errorMessage: null,
  });

  const inputPath = job.storedInputPath;
  if (!inputPath || !fs.existsSync(inputPath)) {
    await job.update({
      status: 'failed',
      progress: 0,
      errorMessage: 'Fichier source introuvable sur le serveur',
      finishedAt: new Date(),
    });
    return;
  }

  // Build FormData from file stream for Python API
  const formData = new FormData();
  formData.append('file', fs.createReadStream(inputPath), {
    filename: job.originalFileName,
    contentType: 'application/octet-stream',
  });
  formData.append('source_format', String(job.sourceFormat).toLowerCase());
  formData.append('target_format', String(job.targetFormat).toLowerCase());

  await job.update({ progress: 20 });

  const pythonResponse = await fetch(`${PYTHON_API_URL}/api/convert`, {
    method: 'POST',
    body: formData as any,
    headers: (formData as any).getHeaders ? (formData as any).getHeaders() : {},
  });

  const text = await pythonResponse.text();
  if (!pythonResponse.ok) {
    await job.update({
      status: 'failed',
      progress: 0,
      errorMessage: `Conversion échouée: ${text.substring(0, 2000)}`,
      finishedAt: new Date(),
    });
    return;
  }

  let result: any;
  try {
    result = JSON.parse(text);
  } catch (e) {
    await job.update({
      status: 'failed',
      progress: 0,
      errorMessage: `Réponse Python invalide: ${text.substring(0, 2000)}`,
      finishedAt: new Date(),
    });
    return;
  }

  await job.update({
    status: 'success',
    progress: 100,
    outputFileName: result.filename ?? null,
    outputFilePath: result.output_url ?? null,
    finishedAt: new Date(),
  });
}

function startQueueRunner() {
  if (queueRunnerStarted) return;
  queueRunnerStarted = true;

  // Single-worker loop (simple + deterministic)
  setInterval(async () => {
    const next = processingQueue.values().next();
    if (next.done) return;
    const jobId = next.value;
    processingQueue.delete(jobId);
    try {
      await processJob(jobId);
    } catch (err) {
      try {
        const job = await ConversionJob.findByPk(jobId);
        if (job) {
          await job.update({
            status: 'failed',
            progress: 0,
            errorMessage: err instanceof Error ? err.message : 'Erreur serveur inconnue',
            finishedAt: new Date(),
          });
        }
      } catch {
        // swallow secondary errors
      }
    }
  }, 750);
}

function enqueueJob(jobId: string) {
  startQueueRunner();
  processingQueue.add(jobId);
}

/**
 * Helper function to handle conversion
 */
async function handleConversion(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'Aucun fichier fourni',
      });
      return;
    }

    const { source_format, target_format } = req.body;
    const userId = (req as any).user?.id || 'anonymous';

    // Validate inputs
    if (!source_format || !target_format) {
      res.status(400).json({
        success: false,
        error: 'Formats source et cible requis',
      });
      return;
    }

    console.log(`[Conversion] Début (${userId}): ${req.file.originalname} de ${source_format} vers ${target_format}`);
    console.log(`[Conversion] Python API URL: ${PYTHON_API_URL}`);

    // Create FormData for Python API with proper stream handling
    const formData = new FormData();
    
    // Append buffer with filename and mimetype
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: 'application/octet-stream'
    });
    formData.append('source_format', source_format.toLowerCase());
    formData.append('target_format', target_format.toLowerCase());

    console.log(`[Conversion] FormData prepared with formats: ${source_format} -> ${target_format}`);

    // Call Python API with proper headers
    const pythonResponse = await fetch(`${PYTHON_API_URL}/api/convert`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders ? formData.getHeaders() : {},
    });

    if (!pythonResponse.ok) {
      const errorData = await pythonResponse.text();
      console.error(`[Conversion] Erreur Python (${pythonResponse.status}):`, errorData);
      res.status(pythonResponse.status).json({
        success: false,
        error: `Conversion échouée: ${errorData}`,
      });
      return;
    }

    const result = await pythonResponse.json();
    
    console.log(`[Conversion] Succès (${userId}): ${result.filename}`);

    res.json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error('[Conversion] Erreur:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur serveur inconnue',
    });
  }
}

/**
 * POST /api/conversion/convert (PUBLIC - NO AUTH REQUIRED)
 * Public conversion endpoint for unlimited conversions
 */
router.post('/convert', upload.single('file'), handleConversion);

/**
 * POST /api/conversion/convert-auth (PROTECTED - JWT REQUIRED)
 * Protected conversion endpoint with user tracking
 */
router.post('/convert-auth', protect, upload.single('file'), handleConversion);

export default router;

/**
 * -----------------------------
 * JOB WORKFLOW (PRO)
 * -----------------------------
 *
 * POST   /api/conversion/jobs            -> create job (store file in Node uploads) + enqueue
 * GET    /api/conversion/jobs            -> list my jobs
 * GET    /api/conversion/jobs/:id        -> job details
 * POST   /api/conversion/jobs/:id/retry  -> retry failed job
 * GET    /api/conversion/jobs/:id/download -> redirect to output file (if ready)
 */

router.post('/jobs', protect, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Non authentifié' });

    if (!req.file) return res.status(400).json({ success: false, error: 'Aucun fichier fourni' });

    const { source_format, target_format } = req.body;
    if (!source_format || !target_format) {
      return res.status(400).json({ success: false, error: 'Formats source et cible requis' });
    }

    ensureDirSync(CONVERSION_INPUT_DIR);

    const job = await ConversionJob.create({
      userId,
      originalFileName: req.file.originalname,
      storedInputPath: '', // set after we know job.id
      sourceFormat: String(source_format).toUpperCase(),
      targetFormat: String(target_format).toUpperCase(),
      status: 'pending',
      progress: 0,
    } as any);

    const safeName = req.file.originalname.replace(/[^\w.\-() ]+/g, '_');
    const storedPath = path.join(CONVERSION_INPUT_DIR, `${job.id}__${safeName}`);
    fs.writeFileSync(storedPath, req.file.buffer);

    await job.update({ storedInputPath: storedPath, progress: 5 });

    enqueueJob(job.id);

    return res.status(201).json({ success: true, job: toJobDto(job) });
  } catch (error) {
    console.error('[ConversionJob] create error:', error);
    return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Erreur serveur' });
  }
});

router.get('/jobs', protect, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Non authentifié' });

    const jobs = await ConversionJob.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 200,
    } as any);

    return res.json({ success: true, jobs: jobs.map(toJobDto) });
  } catch (error) {
    console.error('[ConversionJob] list error:', error);
    return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Erreur serveur' });
  }
});

router.get('/jobs/:id', protect, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Non authentifié' });

    const job = await ConversionJob.findByPk(req.params.id);
    if (!job || job.userId !== userId) return res.status(404).json({ success: false, error: 'Job introuvable' });

    return res.json({ success: true, job: toJobDto(job) });
  } catch (error) {
    console.error('[ConversionJob] get error:', error);
    return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Erreur serveur' });
  }
});

router.post('/jobs/:id/retry', protect, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Non authentifié' });

    const job = await ConversionJob.findByPk(req.params.id);
    if (!job || job.userId !== userId) return res.status(404).json({ success: false, error: 'Job introuvable' });

    await job.update({
      status: 'pending',
      progress: 0,
      errorMessage: null,
      startedAt: null,
      finishedAt: null,
      outputFileName: null,
      outputFilePath: null,
    });

    enqueueJob(job.id);
    return res.json({ success: true, job: toJobDto(job) });
  } catch (error) {
    console.error('[ConversionJob] retry error:', error);
    return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Erreur serveur' });
  }
});

router.get('/jobs/:id/download', protect, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Non authentifié' });

    const job = await ConversionJob.findByPk(req.params.id);
    if (!job || job.userId !== userId) return res.status(404).json({ success: false, error: 'Job introuvable' });
    if (job.status !== 'success' || !job.outputFileName) {
      return res.status(409).json({ success: false, error: 'Fichier non disponible (job non terminé)' });
    }

    return res.redirect(`/outputs/${job.outputFileName}`);
  } catch (error) {
    console.error('[ConversionJob] download error:', error);
    return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Erreur serveur' });
  }
});

/**
 * DELETE /api/conversion/jobs/:id -> delete job (owner only)
 */
router.delete('/jobs/:id', protect, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Non authentifié' });

    const job = await ConversionJob.findByPk(req.params.id);
    if (!job || job.userId !== userId) return res.status(404).json({ success: false, error: 'Job introuvable' });

    // Remove stored input file if exists
    try {
      if (job.storedInputPath && fs.existsSync(job.storedInputPath)) {
        fs.unlinkSync(job.storedInputPath);
      }
    } catch (e) {
      console.warn('[ConversionJob] failed to remove input file:', e instanceof Error ? e.message : String(e));
    }

    // Attempt to remove output file from python outputs if present
    try {
      if (job.outputFileName) {
        const pythonOutputsDir = path.join(appDirname, '..', '..', 'python', 'outputs');
        const outPath = path.join(pythonOutputsDir, job.outputFileName);
        if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
      }
    } catch (e) {
      console.warn('[ConversionJob] failed to remove output file:', e instanceof Error ? e.message : String(e));
    }

    await job.destroy();

    return res.json({ success: true });
  } catch (error) {
    console.error('[ConversionJob] delete error:', error);
    return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Erreur serveur' });
  }
});

// Debug endpoint - test conversion without auth (REMOVE IN PRODUCTION)
router.post('/test-convert', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('[DEBUG] Test conversion endpoint called');
    
    if (!req.file) {
      res.status(400).json({ success: false, error: 'Aucun fichier fourni' });
      return;
    }

    const { source_format, target_format } = req.body;

    if (!source_format || !target_format) {
      res.status(400).json({ success: false, error: 'Formats requis' });
      return;
    }

    console.log(`[DEBUG] Test: ${req.file.originalname} de ${source_format} vers ${target_format}`);

    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: 'application/octet-stream'
    });
    formData.append('source_format', source_format.toLowerCase());
    formData.append('target_format', target_format.toLowerCase());

    const pythonResponse = await fetch(`${PYTHON_API_URL}/api/convert`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders ? formData.getHeaders() : {},
    });

    const responseText = await pythonResponse.text();
    console.log(`[DEBUG] Python response status: ${pythonResponse.status}`);
    console.log(`[DEBUG] Python response: ${responseText.substring(0, 500)}`);

    if (!pythonResponse.ok) {
      res.status(pythonResponse.status).json({
        success: false,
        error: `Python API error: ${responseText}`
      });
      return;
    }

    const result = JSON.parse(responseText);
    res.json({ success: true, ...result });

  } catch (error) {
    console.error('[DEBUG] Test error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

