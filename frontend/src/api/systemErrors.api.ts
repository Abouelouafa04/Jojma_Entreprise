import axios from 'axios';

const API_BASE_URL = '/api/admin/system-errors';

export interface SystemError {
  id: string;
  errorId: string;
  service: string;
  type: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  status: 'new' | 'analyzed' | 'resolved' | 'assigned';
  assignedTo?: string;
  stackTrace?: string;
  affectedUsers?: number;
  occurrences?: number;
}

export interface ErrorFilters {
  service?: string;
  severity?: string;
  status?: string;
  search?: string;
}

export interface ErrorResponse {
  success: boolean;
  data: SystemError[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ErrorStatsResponse {
  success: boolean;
  data: {
    total: number;
    info: number;
    warning: number;
    critical: number;
    analyzed: number;
    unresolved: number;
  };
}

// Core CRUD
export const getAllErrors = async (
  filters?: ErrorFilters,
  page: number = 1,
  limit: number = 10
): Promise<ErrorResponse> => {
  const params = new URLSearchParams();
  if (filters?.service) params.append('service', filters.service);
  if (filters?.severity) params.append('severity', filters.severity);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const response = await axios.get(`${API_BASE_URL}?${params}`);
  return response.data;
};

export const getErrorById = async (errorId: string): Promise<{ success: boolean; data: SystemError }> => {
  const response = await axios.get(`${API_BASE_URL}/${errorId}`);
  return response.data;
};

// Statistics
export const getErrorStats = async (): Promise<ErrorStatsResponse> => {
  const response = await axios.get(`${API_BASE_URL}/stats/overview`);
  return response.data;
};

export const getErrorsByService = async (service: string): Promise<ErrorResponse> => {
  const response = await axios.get(`${API_BASE_URL}/filter/by-service/${service}`);
  return response.data;
};

export const getErrorsBySeverity = async (severity: string): Promise<ErrorResponse> => {
  const response = await axios.get(`${API_BASE_URL}/filter/by-severity/${severity}`);
  return response.data;
};

export const getErrorsByStatus = async (status: string): Promise<ErrorResponse> => {
  const response = await axios.get(`${API_BASE_URL}/filter/by-status/${status}`);
  return response.data;
};

// Search
export const searchErrors = async (query: string): Promise<ErrorResponse> => {
  const response = await axios.get(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

// Update status
export const markAsAnalyzed = async (errorId: string): Promise<{ success: boolean; data: SystemError }> => {
  const response = await axios.patch(`${API_BASE_URL}/${errorId}/analyze`);
  return response.data;
};

export const assignError = async (errorId: string, technicianId: string): Promise<{ success: boolean; data: SystemError }> => {
  const response = await axios.patch(`${API_BASE_URL}/${errorId}/assign`, { technicianId });
  return response.data;
};

export const resolveError = async (errorId: string): Promise<{ success: boolean; data: SystemError }> => {
  const response = await axios.patch(`${API_BASE_URL}/${errorId}/resolve`);
  return response.data;
};

// Service operations
export const restartService = async (service: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post(`${API_BASE_URL}/services/${service}/restart`);
  return response.data;
};

export const getServiceStatus = async (service: string): Promise<{ success: boolean; data: { status: string; uptime: number; lastCheck: Date } }> => {
  const response = await axios.get(`${API_BASE_URL}/services/${service}/status`);
  return response.data;
};

// Export
export const exportErrors = async (filters?: ErrorFilters): Promise<Blob> => {
  const params = new URLSearchParams();
  if (filters?.service) params.append('service', filters.service);
  if (filters?.severity) params.append('severity', filters.severity);
  if (filters?.status) params.append('status', filters.status);
  params.append('format', 'csv');

  const response = await axios.get(`${API_BASE_URL}/export?${params}`, { responseType: 'blob' });
  return response.data;
};

// Analytics
export const getErrorTrends = async (days: number = 7): Promise<{ success: boolean; data: any[] }> => {
  const response = await axios.get(`${API_BASE_URL}/analytics/trends?days=${days}`);
  return response.data;
};

export const getMostFrequentErrors = async (limit: number = 10): Promise<{ success: boolean; data: SystemError[] }> => {
  const response = await axios.get(`${API_BASE_URL}/analytics/frequent?limit=${limit}`);
  return response.data;
};

export const getServiceHealthScore = async (): Promise<{ success: boolean; data: { [key: string]: number } }> => {
  const response = await axios.get(`${API_BASE_URL}/analytics/health-score`);
  return response.data;
};
