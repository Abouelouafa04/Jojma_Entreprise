import { axiosInstance } from './api';

export interface CreateTicketPayload {
  subject: string;
  description: string;
  category: 'account' | 'model' | 'conversion' | 'ar' | 'billing' | 'technical';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface UpdateTicketPayload {
  status?: 'open' | 'assigned' | 'in-progress' | 'waiting' | 'resolved' | 'closed';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  assignedTo?: string;
}

export interface TicketFilters {
  category?: string;
  priority?: string;
  status?: string;
  userId?: string;
  assignedTo?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface TicketResponse {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  category: 'account' | 'model' | 'conversion' | 'ar' | 'billing' | 'technical';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'assigned' | 'in-progress' | 'waiting' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  assignedToName?: string;
  messageCount: number;
}

export interface TicketMessageResponse {
  id: string;
  ticketId: string;
  sender: string;
  senderName: string;
  message: string;
  attachment?: {
    url: string;
    filename: string;
    size: number;
  };
  createdAt: string;
}

export interface TicketStatsResponse {
  total: number;
  open: number;
  assigned: number;
  inProgress: number;
  waiting: number;
  resolved: number;
  closed: number;
  averageResolutionTime: number;
  urgentCount: number;
}

export const supportApi = {
  // Ticket operations
  getAllTickets: async (filters?: TicketFilters) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await axiosInstance.get<{ tickets: TicketResponse[]; total: number }>(
      `/api/admin/support/tickets?${params.toString()}`
    );
    return response.data;
  },

  getTicketById: async (ticketId: string) => {
    const response = await axiosInstance.get<TicketResponse>(
      `/api/admin/support/tickets/${ticketId}`
    );
    return response.data;
  },

  createTicket: async (payload: CreateTicketPayload) => {
    const response = await axiosInstance.post<TicketResponse>(
      `/api/admin/support/tickets`,
      payload
    );
    return response.data;
  },

  updateTicket: async (ticketId: string, payload: UpdateTicketPayload) => {
    const response = await axiosInstance.put<TicketResponse>(
      `/api/admin/support/tickets/${ticketId}`,
      payload
    );
    return response.data;
  },

  assignTicket: async (ticketId: string, agentId: string) => {
    const response = await axiosInstance.post<TicketResponse>(
      `/api/admin/support/tickets/${ticketId}/assign`,
      { agentId }
    );
    return response.data;
  },

  reassignTicket: async (ticketId: string, agentId: string) => {
    const response = await axiosInstance.post<TicketResponse>(
      `/api/admin/support/tickets/${ticketId}/reassign`,
      { agentId }
    );
    return response.data;
  },

  changeTicketStatus: async (ticketId: string, status: string) => {
    const response = await axiosInstance.post<TicketResponse>(
      `/api/admin/support/tickets/${ticketId}/status`,
      { status }
    );
    return response.data;
  },

  changePriority: async (ticketId: string, priority: string) => {
    const response = await axiosInstance.post<TicketResponse>(
      `/api/admin/support/tickets/${ticketId}/priority`,
      { priority }
    );
    return response.data;
  },

  closeTicket: async (ticketId: string, resolution?: string) => {
    const response = await axiosInstance.post<TicketResponse>(
      `/api/admin/support/tickets/${ticketId}/close`,
      { resolution }
    );
    return response.data;
  },

  deleteTicket: async (ticketId: string) => {
    await axiosInstance.delete(`/api/admin/support/tickets/${ticketId}`);
  },

  // Message operations
  getTicketMessages: async (ticketId: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await axiosInstance.get<TicketMessageResponse[]>(
      `/api/admin/support/tickets/${ticketId}/messages?${params.toString()}`
    );
    return response.data;
  },

  addMessageToTicket: async (ticketId: string, message: string, attachment?: File) => {
    const formData = new FormData();
    formData.append('message', message);
    if (attachment) {
      formData.append('attachment', attachment);
    }

    const response = await axiosInstance.post<TicketMessageResponse>(
      `/api/admin/support/tickets/${ticketId}/messages`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  deleteMessage: async (ticketId: string, messageId: string) => {
    await axiosInstance.delete(
      `/api/admin/support/tickets/${ticketId}/messages/${messageId}`
    );
  },

  // Statistics
  getTicketStats: async () => {
    const response = await axiosInstance.get<TicketStatsResponse>(
      `/api/admin/support/stats`
    );
    return response.data;
  },

  getTicketsByCategory: async (category: string) => {
    const response = await axiosInstance.get<{ category: string; count: number; tickets: TicketResponse[] }>(
      `/api/admin/support/statistics/category/${category}`
    );
    return response.data;
  },

  getTicketsByPriority: async (priority: string) => {
    const response = await axiosInstance.get<{ priority: string; count: number; tickets: TicketResponse[] }>(
      `/api/admin/support/statistics/priority/${priority}`
    );
    return response.data;
  },

  getAgentStats: async (agentId: string) => {
    const response = await axiosInstance.get<{
      agentId: string;
      totalHandled: number;
      resolved: number;
      averageResolutionTime: number;
      satisfaction: number;
    }>(
      `/api/admin/support/agents/${agentId}/stats`
    );
    return response.data;
  },

  // Bulk operations
  bulkUpdateStatus: async (ticketIds: string[], status: string) => {
    const response = await axiosInstance.post(
      `/api/admin/support/tickets/bulk/status`,
      { ticketIds, status }
    );
    return response.data;
  },

  bulkAssign: async (ticketIds: string[], agentId: string) => {
    const response = await axiosInstance.post(
      `/api/admin/support/tickets/bulk/assign`,
      { ticketIds, agentId }
    );
    return response.data;
  },

  // Export
  exportTickets: async (filters?: TicketFilters) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);

    const response = await axiosInstance.get(
      `/api/admin/support/tickets/export?${params.toString()}`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  // SLA management
  getSLAConfiguration: async () => {
    const response = await axiosInstance.get(
      `/api/admin/support/sla/config`
    );
    return response.data;
  },

  updateSLAConfiguration: async (config: any) => {
    const response = await axiosInstance.put(
      `/api/admin/support/sla/config`,
      config
    );
    return response.data;
  },

  // Knowledge base
  searchKnowledgeBase: async (query: string) => {
    const response = await axiosInstance.get(
      `/api/admin/support/knowledge-base/search?query=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  addKnowledgeArticle: async (article: { title: string; content: string; category: string; tags: string[] }) => {
    const response = await axiosInstance.post(
      `/api/admin/support/knowledge-base/articles`,
      article
    );
    return response.data;
  },

  // Email templates
  getEmailTemplates: async () => {
    const response = await axiosInstance.get(
      `/api/admin/support/email-templates`
    );
    return response.data;
  },

  updateEmailTemplate: async (templateId: string, content: string) => {
    const response = await axiosInstance.put(
      `/api/admin/support/email-templates/${templateId}`,
      { content }
    );
    return response.data;
  },

  sendEmailTemplate: async (ticketId: string, templateId: string) => {
    const response = await axiosInstance.post(
      `/api/admin/support/tickets/${ticketId}/send-template`,
      { templateId }
    );
    return response.data;
  },
};

export default supportApi;
