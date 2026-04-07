/// <reference types="vite/client" />
import axios from 'axios';

/**
 * Global Axios instance for JOJMA API.
 */
const DEFAULT_BACKEND_ORIGIN = `${window.location.protocol}//${window.location.hostname}:5000`;
const api = axios.create({
  // We keep "/api/..." in request paths and rely on Vite proxy in dev.
  // If VITE_API_URL is provided, it should be the full backend base (e.g. "http://localhost:5000").
  baseURL: import.meta.env.VITE_API_URL || '',
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

  const data = await response.json();
  if (!response.ok || !data?.success) {
    throw new Error(data?.error || `HTTP ${response.status}`);
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
  const data = await response.json();
  if (!response.ok || !data?.success) {
    throw new Error(data?.error || `HTTP ${response.status}`);
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
  const data = await response.json();
  if (!response.ok || !data?.success) {
    throw new Error(data?.error || `HTTP ${response.status}`);
  }
  return data.job as ConversionJobDto;
}

export function getFileUrl(relativePath: string): string {
  if (relativePath.startsWith("http")) return relativePath;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : DEFAULT_BACKEND_ORIGIN;
  const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return `${baseUrl}${cleanPath}`;
}
