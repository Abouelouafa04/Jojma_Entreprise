import { AxiosError } from 'axios';
import { axiosInstance } from './api';

export type ARModelStatus = 'pending' | 'completed' | 'error';

export type ARLibraryItem = {
  id: string;
  title: string;
  status: ARModelStatus;
  format: string;
  sizeBytes: number;
  generatedAt: string;
  updatedAt: string;
  fileUrl: string | null;
  experience: null | {
    slug: string;
    publicUrl: string | null;
    qrCodeData: string;
    opens: number;
    qrScans: number;
    shares: number;
    devices: Record<string, number>;
  };
};

export type ARStats = {
  opens: number;
  qrScans: number;
  shares: number;
  devices: Record<string, number>;
};

function extractApiMessage(error: unknown): string {
  const err = error as AxiosError<any>;
  return err?.response?.data?.message || err?.message || 'Une erreur est survenue.';
}

export async function getARStats(): Promise<ARStats> {
  try {
    const res = await axiosInstance.get<{ status: 'success'; data: ARStats }>('/ar/stats');
    return res.data.data;
  } catch (e) {
    throw new Error(extractApiMessage(e));
  }
}

export async function getARLibrary(): Promise<ARLibraryItem[]> {
  try {
    const res = await axiosInstance.get<{ status: 'success'; data: { items: ARLibraryItem[] } }>('/ar/library');
    return res.data.data.items;
  } catch (e) {
    throw new Error(extractApiMessage(e));
  }
}

export async function generateExperience(modelId: string) {
  try {
    const res = await axiosInstance.post('/ar/generate', { modelId });
    return res.data;
  } catch (e) {
    throw new Error(extractApiMessage(e));
  }
}

export async function trackShare(slug: string) {
  try {
    const res = await axiosInstance.post(`/ar/experience/${slug}/share`, {});
    return res.data;
  } catch (e) {
    throw new Error(extractApiMessage(e));
  }
}

