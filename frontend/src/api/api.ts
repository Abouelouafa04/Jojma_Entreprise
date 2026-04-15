/// <reference types="vite/client" />
import axios from 'axios';

/**
 * Global Axios instance for JOJMA API.
 */
const DEFAULT_BACKEND_ORIGIN = `${window.location.protocol}//${window.location.hostname}:5000`;
const api = axios.create({
  // Default to '/api' so Vite proxy routes to http://127.0.0.1:5000 in dev.
  // VITE_API_URL overrides this (e.g. "http://localhost:5000/api" for direct calls).
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jojma_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor: handle auth issues (deleted user, invalid token)
api.interceptors.response.use(
  (response) => response,
  (error: any) => {
    const status = error?.response?.status;
    const errData = error?.response?.data || {};
    const code = errData?.code;
    const message = errData?.message || errData?.detail || error?.message || '';

    // If backend indicates the user no longer exists, clear local session and redirect to login
    if (
      status === 401 &&
      (code === 'USER_NOT_FOUND' || /n['’]existe plus/i.test(String(message)))
    ) {
      const token = localStorage.getItem('jojma_token');
      try {
        if (token) {
          // best-effort server logout to clear cookies
          fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }).catch(() => {});
        }
      } catch (e) {
        // ignore
      }

      localStorage.removeItem('jojma_token');
      localStorage.removeItem('jojma_user');

      try {
        window.alert("Votre session n'est plus valide : l'utilisateur lié au token n'existe plus. Vous allez être redirigé vers la page de connexion.");
      } catch (e) {}
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
export const axiosInstance = api;

const API_BASE_URL = import.meta.env.VITE_API_URL || `${DEFAULT_BACKEND_ORIGIN}/api`;

export interface Convert3DFileParams {
  file: File;
  sourceFormat: string;
  targetFormat: string;
}

export interface Convert3DFileResponse {
  success: boolean;
  filename: string;
  original_filename: string;
  output_url: string;
  source_format: string;
  target_format: string;
}

export type ConversionJobStatus = 'pending' | 'processing' | 'success' | 'failed';

export interface ConversionJobDto {
  id: string;
  originalFileName: string;
  sourceFormat: string;
  targetFormat: string;
  status: ConversionJobStatus;
  progress: number;
  outputUrl: string | null;
  errorMessage: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ErrorResponse {
  detail?: string;
}

export async function convert3DFile({
  file,
  sourceFormat,
  targetFormat,
}: Convert3DFileParams): Promise<Convert3DFileResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("source_format", sourceFormat.toLowerCase());
  formData.append("target_format", targetFormat.toLowerCase());

  // Use public endpoint (no JWT required)
  const apiUrl = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/conversion/convert`
    : `${API_BASE_URL}/conversion/convert`;

  let response: Response;

  try {
    console.log(`[API] Conversion request to: ${apiUrl}`);
    console.log(`[API] Format: ${sourceFormat} -> ${targetFormat}`);
    console.log(`[API] File size: ${file.size} bytes`);
    
    // Call the Node.js backend PUBLIC endpoint (no auth needed)
    response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      // No headers needed - FormData will set Content-Type automatically
    });
    
    console.log(`[API] Response status: ${response.status}`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[API] Fetch error: ${errorMsg}`);
    throw new Error(`Le backend est inaccessible: ${errorMsg}`);
  }

  const contentType = response.headers.get("content-type") || "";
  let data: Convert3DFileResponse | ErrorResponse;

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    console.error(`[API] Non-JSON response: ${text}`);
    data = { detail: text };
  }

  if (!response.ok) {
    const errorMsg = (data as ErrorResponse).detail || `HTTP ${response.status}`;
    console.error(`[API] Conversion failed: ${errorMsg}`);
    throw new Error(`Échec de la conversion: ${errorMsg}`);
  }

  console.log(`[API] Conversion success: ${(data as Convert3DFileResponse).filename}`);
  return data as Convert3DFileResponse;
}

function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/conversion`
    : `${API_BASE_URL}/conversion`;
}

export async function createConversionJob(params: Convert3DFileParams): Promise<ConversionJobDto> {
  const { file, sourceFormat, targetFormat } = params;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('source_format', sourceFormat.toLowerCase());
  formData.append('target_format', targetFormat.toLowerCase());

  const url = `${getApiBaseUrl()}/jobs`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: {
      // Auth header (same convention used by axios interceptor)
      ...(localStorage.getItem('jojma_token')
        ? { Authorization: `Bearer ${localStorage.getItem('jojma_token')}` }
        : {}),
    },
  });

  const contentType = response.headers.get('content-type') || '';
  let data: any = null;

  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (err) {
      const txt = await response.text().catch(() => '');
      console.error('[API] createConversionJob: failed to parse JSON', { url, err, txt });
      throw new Error('Réponse du serveur invalide (JSON attendu).');
    }
  } else {
    const txt = await response.text().catch(() => '');
    console.error('[API] createConversionJob: non-JSON response', { url, txt });
    data = { detail: txt };
  }

  if (response.status === 401) {
    throw new Error('Non autorisé — veuillez vous connecter.');
  }

  if (!response.ok || !data?.success) {
    throw new Error(data?.error || data?.detail || `HTTP ${response.status}`);
  }

  return data.job as ConversionJobDto;
}

export async function listMyConversionJobs(): Promise<ConversionJobDto[]> {
  const url = `${getApiBaseUrl()}/jobs`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...(localStorage.getItem('jojma_token')
        ? { Authorization: `Bearer ${localStorage.getItem('jojma_token')}` }
        : {}),
    },
  });
  const contentType = response.headers.get('content-type') || '';
  let data: any = null;

  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (err) {
      const txt = await response.text().catch(() => '');
      console.error('[API] listMyConversionJobs: failed to parse JSON', { url, err, txt });
      throw new Error('Réponse du serveur invalide (JSON attendu).');
    }
  } else {
    const txt = await response.text().catch(() => '');
    console.error('[API] listMyConversionJobs: non-JSON response', { url, txt });
    data = { detail: txt };
  }

  if (response.status === 401) {
    throw new Error('Non autorisé — veuillez vous connecter.');
  }

  if (!response.ok || !data?.success) {
    throw new Error(data?.error || data?.detail || `HTTP ${response.status}`);
  }

  return (data.jobs || []) as ConversionJobDto[];
}

export async function retryConversionJob(jobId: string): Promise<ConversionJobDto> {
  const url = `${getApiBaseUrl()}/jobs/${jobId}/retry`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('jojma_token')
        ? { Authorization: `Bearer ${localStorage.getItem('jojma_token')}` }
        : {}),
    },
  });
  const contentType = response.headers.get('content-type') || '';
  let data: any = null;

  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (err) {
      const txt = await response.text().catch(() => '');
      console.error('[API] retryConversionJob: failed to parse JSON', { url, err, txt });
      throw new Error('Réponse du serveur invalide (JSON attendu).');
    }
  } else {
    const txt = await response.text().catch(() => '');
    console.error('[API] retryConversionJob: non-JSON response', { url, txt });
    data = { detail: txt };
  }

  if (response.status === 401) {
    throw new Error('Non autorisé — veuillez vous connecter.');
  }

  if (!response.ok || !data?.success) {
    throw new Error(data?.error || data?.detail || `HTTP ${response.status}`);
  }

  return data.job as ConversionJobDto;
}

export async function deleteConversionJob(jobId: string): Promise<void> {
  const url = `${getApiBaseUrl()}/jobs/${jobId}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('jojma_token')
        ? { Authorization: `Bearer ${localStorage.getItem('jojma_token')}` }
        : {}),
    },
  });

  const contentType = response.headers.get('content-type') || '';
  let data: any = null;

  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (err) {
      const txt = await response.text().catch(() => '');
      console.error('[API] deleteConversionJob: failed to parse JSON', { url, err, txt });
      throw new Error('Réponse du serveur invalide (JSON attendu).');
    }
  } else {
    const txt = await response.text().catch(() => '');
    console.error('[API] deleteConversionJob: non-JSON response', { url, txt });
    data = { detail: txt };
  }

  if (response.status === 401) {
    throw new Error('Non autorisé — veuillez vous connecter.');
  }

  if (!response.ok || !data?.success) {
    throw new Error(data?.error || data?.detail || `HTTP ${response.status}`);
  }

  return;
}

export function getFileUrl(relativePath: string): string {
  if (relativePath.startsWith("http")) return relativePath;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : DEFAULT_BACKEND_ORIGIN;
  const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return `${baseUrl}${cleanPath}`;
}
