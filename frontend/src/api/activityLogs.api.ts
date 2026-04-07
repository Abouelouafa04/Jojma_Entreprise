import { axiosInstance } from './api';

export interface ActivityLogFilters {
  userId?: string;
  action?: string;
  module?: string;
  result?: string;
  criticalityLevel?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface ActivityLogResponse {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  actionLabel: string;
  module: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure' | 'warning';
  statusCode?: number;
  errorMessage?: string;
  timestamp: string;
  criticalityLevel: 'low' | 'medium' | 'high' | 'critical';
  relatedResourceId?: string;
  relatedResourceType?: string;
  duration?: number;
}

export interface ActivityStatsResponse {
  totalLogs: number;
  successCount: number;
  failureCount: number;
  warningCount: number;
  criticalCount: number;
  averageResponseTime: number;
  mostActiveUser: {
    userId: string;
    userName: string;
    actionCount: number;
  };
  mostCommonAction: {
    action: string;
    count: number;
  };
  lastActivity: string;
}

export const activityLogsApi = {
  // Retrieve logs
  getAllLogs: async (filters?: ActivityLogFilters) => {
    const params = new URLSearchParams();
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.action) params.append('action', filters.action);
    if (filters?.module) params.append('module', filters.module);
    if (filters?.result) params.append('result', filters.result);
    if (filters?.criticalityLevel) params.append('criticalityLevel', filters.criticalityLevel);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await axiosInstance.get<{ logs: ActivityLogResponse[]; total: number }>(
      `/api/admin/activity-logs/logs?${params.toString()}`
    );
    return response.data;
  },

  getLogById: async (logId: string) => {
    const response = await axiosInstance.get<ActivityLogResponse>(
      `/api/admin/activity-logs/logs/${logId}`
    );
    return response.data;
  },

  // Statistics
  getActivityStats: async () => {
    const response = await axiosInstance.get<ActivityStatsResponse>(
      `/api/admin/activity-logs/stats`
    );
    return response.data;
  },

  getStatsByUser: async (userId: string) => {
    const response = await axiosInstance.get<{
      userId: string;
      userName: string;
      totalActions: number;
      successfulActions: number;
      failedActions: number;
      lastActivityDate: string;
      actionBreakdown: { action: string; count: number }[];
    }>(
      `/api/admin/activity-logs/users/${userId}/stats`
    );
    return response.data;
  },

  getStatsByModule: async (module: string) => {
    const response = await axiosInstance.get<{
      module: string;
      totalActions: number;
      successRate: number;
      mostCommonAction: string;
      mostActiveUser: string;
    }>(
      `/api/admin/activity-logs/modules/${module}/stats`
    );
    return response.data;
  },

  getStatsByAction: async (action: string) => {
    const response = await axiosInstance.get<{
      action: string;
      totalExecutions: number;
      successRate: number;
      averageResponseTime: number;
      topUsers: { userId: string; userName: string; count: number }[];
    }>(
      `/api/admin/activity-logs/actions/${action}/stats`
    );
    return response.data;
  },

  // Filtering and Search
  searchLogs: async (query: string, filters?: ActivityLogFilters) => {
    const params = new URLSearchParams();
    params.append('query', query);
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.action) params.append('action', filters.action);
    if (filters?.module) params.append('module', filters.module);

    const response = await axiosInstance.get<ActivityLogResponse[]>(
      `/api/admin/activity-logs/search?${params.toString()}`
    );
    return response.data;
  },

  getLogsByUser: async (userId: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await axiosInstance.get<ActivityLogResponse[]>(
      `/api/admin/activity-logs/users/${userId}/logs?${params.toString()}`
    );
    return response.data;
  },

  getLogsByModule: async (module: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await axiosInstance.get<ActivityLogResponse[]>(
      `/api/admin/activity-logs/modules/${module}/logs?${params.toString()}`
    );
    return response.data;
  },

  getLogsByAction: async (action: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await axiosInstance.get<ActivityLogResponse[]>(
      `/api/admin/activity-logs/actions/${action}/logs?${params.toString()}`
    );
    return response.data;
  },

  // Date Range Query
  getLogsByDateRange: async (dateFrom: string, dateTo: string) => {
    const response = await axiosInstance.get<ActivityLogResponse[]>(
      `/api/admin/activity-logs/date-range?dateFrom=${dateFrom}&dateTo=${dateTo}`
    );
    return response.data;
  },

  // Critical Events
  getCriticalLogs: async (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await axiosInstance.get<ActivityLogResponse[]>(
      `/api/admin/activity-logs/critical?${params.toString()}`
    );
    return response.data;
  },

  // Failed Operations
  getFailedOperations: async (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await axiosInstance.get<ActivityLogResponse[]>(
      `/api/admin/activity-logs/failures?${params.toString()}`
    );
    return response.data;
  },

  // Export
  exportLogs: async (filters?: ActivityLogFilters) => {
    const params = new URLSearchParams();
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.action) params.append('action', filters.action);
    if (filters?.module) params.append('module', filters.module);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);

    const response = await axiosInstance.get(
      `/api/admin/activity-logs/export?${params.toString()}`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Retention
  getRetentionPolicy: async () => {
    const response = await axiosInstance.get(
      `/api/admin/activity-logs/retention-policy`
    );
    return response.data;
  },

  updateRetentionPolicy: async (policy: { retentionDays: number; archiveAfterDays: number }) => {
    const response = await axiosInstance.put(
      `/api/admin/activity-logs/retention-policy`,
      policy
    );
    return response.data;
  },

  // Cleanup
  deleteOldLogs: async (olderThanDays: number) => {
    const response = await axiosInstance.post(
      `/api/admin/activity-logs/cleanup`,
      { olderThanDays }
    );
    return response.data;
  },

  archiveLogs: async (dateFrom: string, dateTo: string) => {
    const response = await axiosInstance.post(
      `/api/admin/activity-logs/archive`,
      { dateFrom, dateTo }
    );
    return response.data;
  },

  // Alerts & Monitoring
  getSuspiciousActivity: async () => {
    const response = await axiosInstance.get(
      `/api/admin/activity-logs/suspicious-activity`
    );
    return response.data;
  },

  getFailureRate: async (timeWindowMinutes: number = 60) => {
    const response = await axiosInstance.get(
      `/api/admin/activity-logs/failure-rate?timeWindowMinutes=${timeWindowMinutes}`
    );
    return response.data;
  },

  getPerformanceMetrics: async (action?: string) => {
    const params = new URLSearchParams();
    if (action) params.append('action', action);

    const response = await axiosInstance.get(
      `/api/admin/activity-logs/performance-metrics?${params.toString()}`
    );
    return response.data;
  },

  // User Activity Timeline
  getUserTimeline: async (userId: string, days?: number) => {
    const params = new URLSearchParams();
    if (days) params.append('days', days.toString());

    const response = await axiosInstance.get(
      `/api/admin/activity-logs/users/${userId}/timeline?${params.toString()}`
    );
    return response.data;
  },

  // Audit Trail
  getAuditTrail: async (resourceId: string, resourceType: string) => {
    const response = await axiosInstance.get(
      `/api/admin/activity-logs/audit-trail?resourceId=${resourceId}&resourceType=${resourceType}`
    );
    return response.data;
  },

  // Security Events
  getSecurityEvents: async (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await axiosInstance.get(
      `/api/admin/activity-logs/security-events?${params.toString()}`
    );
    return response.data;
  },

  reportSecurityIncident: async (incident: { title: string; description: string; severity: string; logIds: string[] }) => {
    const response = await axiosInstance.post(
      `/api/admin/activity-logs/security-incident`,
      incident
    );
    return response.data;
  },
};

export default activityLogsApi;
