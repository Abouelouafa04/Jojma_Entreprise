import axios from 'axios';

const API_BASE_URL = '/api/admin/platform-settings';

export interface PlatformSettings {
  general: {
    platformName: string;
    mainUrl: string;
    defaultLanguage: string;
    timezone: string;
    logo: string;
  };
  technical: {
    maxUploadSize: number;
    acceptedFormats: string[];
    conversionFormats: string[];
    processingTimeout: number;
    storagePerUser: number;
  };
  security: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
    sessionDuration: number;
    twoFactorAuth: boolean;
    loginAttemptLimit: number;
    ipWhitelist: string[];
  };
  notifications: {
    emailNotifications: boolean;
    systemAlerts: boolean;
    criticalErrorAlerts: boolean;
    supportTicketNotifications: boolean;
  };
}

export interface SettingsResponse {
  success: boolean;
  data: PlatformSettings;
}

// Get all settings
export const getAllSettings = async (): Promise<SettingsResponse> => {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data;
};

// Get specific setting sections
export const getGeneralSettings = async (): Promise<{ success: boolean; data: PlatformSettings['general'] }> => {
  const response = await axios.get(`${API_BASE_URL}/general`);
  return response.data;
};

export const getTechnicalSettings = async (): Promise<{ success: boolean; data: PlatformSettings['technical'] }> => {
  const response = await axios.get(`${API_BASE_URL}/technical`);
  return response.data;
};

export const getSecuritySettings = async (): Promise<{ success: boolean; data: PlatformSettings['security'] }> => {
  const response = await axios.get(`${API_BASE_URL}/security`);
  return response.data;
};

export const getNotificationSettings = async (): Promise<{ success: boolean; data: PlatformSettings['notifications'] }> => {
  const response = await axios.get(`${API_BASE_URL}/notifications`);
  return response.data;
};

// Update settings
export const updateAllSettings = async (settings: PlatformSettings): Promise<SettingsResponse> => {
  const response = await axios.put(`${API_BASE_URL}`, settings);
  return response.data;
};

export const updateGeneralSettings = async (settings: Partial<PlatformSettings['general']>): Promise<SettingsResponse> => {
  const response = await axios.patch(`${API_BASE_URL}/general`, settings);
  return response.data;
};

export const updateTechnicalSettings = async (settings: Partial<PlatformSettings['technical']>): Promise<SettingsResponse> => {
  const response = await axios.patch(`${API_BASE_URL}/technical`, settings);
  return response.data;
};

export const updateSecuritySettings = async (settings: Partial<PlatformSettings['security']>): Promise<SettingsResponse> => {
  const response = await axios.patch(`${API_BASE_URL}/security`, settings);
  return response.data;
};

export const updateNotificationSettings = async (settings: Partial<PlatformSettings['notifications']>): Promise<SettingsResponse> => {
  const response = await axios.patch(`${API_BASE_URL}/notifications`, settings);
  return response.data;
};

// Password policy
export const validatePassword = async (password: string): Promise<{ success: boolean; valid: boolean; errors: string[] }> => {
  const response = await axios.post(`${API_BASE_URL}/validate-password`, { password });
  return response.data;
};

export const updatePasswordPolicy = async (policy: Partial<PlatformSettings['security']['passwordPolicy']>): Promise<SettingsResponse> => {
  const response = await axios.patch(`${API_BASE_URL}/security/password-policy`, policy);
  return response.data;
};

// IP Whitelist
export const addIpToWhitelist = async (ip: string): Promise<SettingsResponse> => {
  const response = await axios.post(`${API_BASE_URL}/security/ip-whitelist`, { ip });
  return response.data;
};

export const removeIpFromWhitelist = async (ip: string): Promise<SettingsResponse> => {
  const response = await axios.delete(`${API_BASE_URL}/security/ip-whitelist/${encodeURIComponent(ip)}`);
  return response.data;
};

// Format management
export const addAcceptedFormat = async (format: string): Promise<SettingsResponse> => {
  const response = await axios.post(`${API_BASE_URL}/technical/formats`, { format, type: 'accepted' });
  return response.data;
};

export const removeAcceptedFormat = async (format: string): Promise<SettingsResponse> => {
  const response = await axios.delete(`${API_BASE_URL}/technical/formats/${format}?type=accepted`);
  return response.data;
};

export const addConversionFormat = async (format: string): Promise<SettingsResponse> => {
  const response = await axios.post(`${API_BASE_URL}/technical/formats`, { format, type: 'conversion' });
  return response.data;
};

export const removeConversionFormat = async (format: string): Promise<SettingsResponse> => {
  const response = await axios.delete(`${API_BASE_URL}/technical/formats/${format}?type=conversion`);
  return response.data;
};

// Validation
export const validateSettings = async (settings: Partial<PlatformSettings>): Promise<{ success: boolean; valid: boolean; errors: string[] }> => {
  const response = await axios.post(`${API_BASE_URL}/validate`, settings);
  return response.data;
};

// Backup & Restore
export const backupSettings = async (): Promise<Blob> => {
  const response = await axios.get(`${API_BASE_URL}/backup`, { responseType: 'blob' });
  return response.data;
};

export const restoreSettings = async (file: File): Promise<SettingsResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_BASE_URL}/restore`, formData);
  return response.data;
};

// Reset to defaults
export const resetToDefaults = async (): Promise<SettingsResponse> => {
  const response = await axios.post(`${API_BASE_URL}/reset-defaults`);
  return response.data;
};

// Audit log
export const getSettingsAuditLog = async (limit: number = 50): Promise<{ success: boolean; data: any[] }> => {
  const response = await axios.get(`${API_BASE_URL}/audit-log?limit=${limit}`);
  return response.data;
};
