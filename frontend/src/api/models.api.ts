import { axiosInstance } from './api';

export interface Model3D {
  id: string;
  name: string;
  owner: string;
  ownerId: string;
  format: string;
  fileSize: number;
  importDate: string;
  status: 'valid' | 'incomplete' | 'corrupted' | 'pending-review' | 'processing';
  arCompatibility: 'compatible' | 'partial' | 'incompatible' | 'unknown';
  qualityScore: number;
  polygonCount: number;
  textureCount: number;
  lastModified: string;
  isArchived: boolean;
}

export interface CreateModel3DDTO {
  name: string;
  format: string;
  fileSize: number;
  ownerId: string;
}

export interface UpdateModel3DDTO {
  name?: string;
  arCompatibility?: string;
  qualityScore?: number;
  isArchived?: boolean;
}

/**
 * Get all 3D models with filtering and pagination
 */
export const getAllModels = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    format?: string;
    userId?: string;
    status?: string;
    arCompatibility?: string;
    search?: string;
    sortBy?: string;
  }
) => {
  try {
    const response = await axiosInstance.get('/api/admin/models', {
      params: {
        page,
        limit,
        ...filters,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};

/**
 * Get a single model by ID
 */
export const getModelById = async (modelId: string) => {
  try {
    const response = await axiosInstance.get(`/api/admin/models/${modelId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching model:', error);
    throw error;
  }
};

/**
 * Update model metadata
 */
export const updateModel = async (modelId: string, modelData: UpdateModel3DDTO) => {
  try {
    const response = await axiosInstance.put(`/api/admin/models/${modelId}`, modelData);
    return response.data;
  } catch (error) {
    console.error('Error updating model:', error);
    throw error;
  }
};

/**
 * Re-run quality analysis on a model
 */
export const rerunAnalysis = async (modelId: string) => {
  try {
    const response = await axiosInstance.post(`/api/admin/models/${modelId}/rerun-analysis`);
    return response.data;
  } catch (error) {
    console.error('Error running analysis:', error);
    throw error;
  }
};

/**
 * Force conversion of a model
 */
export const forceConversion = async (modelId: string, targetFormat?: string) => {
  try {
    const response = await axiosInstance.post(`/api/admin/models/${modelId}/force-conversion`, {
      targetFormat,
    });
    return response.data;
  } catch (error) {
    console.error('Error forcing conversion:', error);
    throw error;
  }
};

/**
 * Archive a model
 */
export const archiveModel = async (modelId: string) => {
  try {
    const response = await axiosInstance.post(`/api/admin/models/${modelId}/archive`);
    return response.data;
  } catch (error) {
    console.error('Error archiving model:', error);
    throw error;
  }
};

/**
 * Restore an archived model
 */
export const restoreModel = async (modelId: string) => {
  try {
    const response = await axiosInstance.post(`/api/admin/models/${modelId}/restore`);
    return response.data;
  } catch (error) {
    console.error('Error restoring model:', error);
    throw error;
  }
};

/**
 * Delete a model permanently
 */
export const deleteModel = async (modelId: string) => {
  try {
    const response = await axiosInstance.delete(`/api/admin/models/${modelId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting model:', error);
    throw error;
  }
};

/**
 * Get model statistics
 */
export const getModelStats = async () => {
  try {
    const response = await axiosInstance.get('/api/admin/models/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

/**
 * Get models by user
 */
export const getModelsByUser = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/api/admin/users/${userId}/models`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user models:', error);
    throw error;
  }
};

/**
 * Bulk delete models
 */
export const bulkDeleteModels = async (modelIds: string[]) => {
  try {
    const response = await axiosInstance.post('/api/admin/models/bulk-delete', {
      modelIds,
    });
    return response.data;
  } catch (error) {
    console.error('Error bulk deleting models:', error);
    throw error;
  }
};

/**
 * Bulk archive models
 */
export const bulkArchiveModels = async (modelIds: string[]) => {
  try {
    const response = await axiosInstance.post('/api/admin/models/bulk-archive', {
      modelIds,
    });
    return response.data;
  } catch (error) {
    console.error('Error bulk archiving models:', error);
    throw error;
  }
};

/**
 * Export models data
 */
export const exportModels = async (format: 'csv' | 'json' = 'csv', filters?: any) => {
  try {
    const response = await axiosInstance.get('/api/admin/models/export', {
      params: { format, ...filters },
      responseType: format === 'csv' ? 'blob' : 'json',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting models:', error);
    throw error;
  }
};

/**
 * Get model conversion queue
 */
export const getConversionQueue = async () => {
  try {
    const response = await axiosInstance.get('/api/admin/models/conversion-queue');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversion queue:', error);
    throw error;
  }
};

/**
 * Get model processing errors
 */
export const getProcessingErrors = async (modelId: string) => {
  try {
    const response = await axiosInstance.get(`/api/admin/models/${modelId}/errors`);
    return response.data;
  } catch (error) {
    console.error('Error fetching model errors:', error);
    throw error;
  }
};
