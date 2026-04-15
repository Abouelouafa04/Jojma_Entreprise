import { axiosInstance } from './api';

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  role: 'admin' | 'user' | 'support' | 'gestionnaire-technique';
  accountStatus: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

export interface CreateUserDTO {
  fullName: string;
  email: string;
  company?: string;
  role: UserData['role'];
  password: string;
}

export interface UpdateUserDTO {
  fullName?: string;
  email?: string;
  company?: string;
  role?: UserData['role'];
  accountStatus?: UserData['accountStatus'];
}

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    role?: string;
    status?: string;
    search?: string;
    sortBy?: string;
  }
) => {
  try {
    const response = await axiosInstance.get('/admin/users', {
      params: {
        page,
        limit,
        ...filters,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get a single user by ID (admin only)
 */
export const getUserById = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Create a new user (admin only)
 */
export const createUser = async (userData: CreateUserDTO) => {
  try {
    const response = await axiosInstance.post('/admin/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update a user (admin only)
 */
export const updateUser = async (userId: string, userData: UpdateUserDTO) => {
  try {
    const response = await axiosInstance.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Change user role (admin only)
 */
export const changeUserRole = async (userId: string, role: UserData['role']) => {
  try {
    const response = await axiosInstance.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error('Error changing user role:', error);
    throw error;
  }
};

/**
 * Activate/Deactivate user account (admin only)
 */
export const toggleUserStatus = async (userId: string, accountStatus: UserData['accountStatus']) => {
  try {
    const response = await axiosInstance.put(`/admin/users/${userId}/status`, { accountStatus });
    return response.data;
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw error;
  }
};

/**
 * Reset user password (admin only)
 */
export const resetUserPassword = async (userId: string) => {
  try {
    const response = await axiosInstance.post(`/admin/users/${userId}/reset-password`);
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

/**
 * Suspend user access (admin only)
 */
export const suspendUser = async (userId: string, reason?: string) => {
  try {
    const response = await axiosInstance.post(`/admin/users/${userId}/suspend`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error suspending user:', error);
    throw error;
  }
};

/**
 * Delete a user (admin only)
 */
export const deleteUser = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Get user activity logs (admin only)
 */
export const getUserActivityLogs = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/admin/users/${userId}/activity-logs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user activity:', error);
    throw error;
  }
};

/**
 * Export users data (admin only)
 */
export const exportUsers = async (format: 'csv' | 'json' = 'csv') => {
  try {
    const response = await axiosInstance.get('/admin/users/export', {
      params: { format },
      responseType: format === 'csv' ? 'blob' : 'json',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting users:', error);
    throw error;
  }
};
