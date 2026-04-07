import React, { useState } from 'react';
import { Save, RefreshCw, Lock, Mail, Server, Shield } from 'lucide-react';

interface PlatformSettings {
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

const DEFAULT_SETTINGS: PlatformSettings = {
  general: {
    platformName: 'JOJMA Enterprise',
    mainUrl: 'https://jojma.com',
    defaultLanguage: 'fr',
    timezone: 'Europe/Paris',
    logo: '/logo.png'
  },
  technical: {
    maxUploadSize: 500,
    acceptedFormats: ['obj', 'fbx', 'gltf', 'glb', 'usdz', 'ply'],
    conversionFormats: ['obj', 'fbx', 'gltf', 'glb', 'usdz'],
    processingTimeout: 1800,
    storagePerUser: 10000
  },
  security: {
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    sessionDuration: 3600,
    twoFactorAuth: true,
    loginAttemptLimit: 5,
    ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8']
  },
  notifications: {
    emailNotifications: true,
    systemAlerts: true,
    criticalErrorAlerts: true,
    supportTicketNotifications: true
  }
};

export default function AdminPlatformSettingsDashboard() {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<'general' | 'technical' | 'security' | 'notifications'>('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    // TODO: Call API to save settings
    console.log('Settings saved:', settings);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const handleGeneralChange = (field: keyof typeof DEFAULT_SETTINGS.general, value: any) => {
    setSettings({
      ...settings,
      general: { ...settings.general, [field]: value }
    });
  };

  const handleTechnicalChange = (field: keyof typeof DEFAULT_SETTINGS.technical, value: any) => {
    setSettings({
      ...settings,
      technical: { ...settings.technical, [field]: value }
    });
  };

  const handleSecurityChange = (field: string, value: any) => {
    if (field === 'passwordPolicy') {
      setSettings({
        ...settings,
        security: {
          ...settings.security,
          passwordPolicy: value
        }
      });
    } else {
      setSettings({
        ...settings,
        security: { ...settings.security, [field]: value }
      });
    }
  };

  const handleNotificationChange = (field: keyof typeof DEFAULT_SETTINGS.notifications, value: boolean) => {
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [field]: value }
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres plateforme</h1>
        <p className="text-gray-600 mt-2">Configurez les options globales de JOJMA</p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          ✓ Paramètres sauvegardés avec succès
        </div>
      )}

      {/* Tabs & Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex gap-2 flex-wrap">
          {(['general', 'technical', 'security', 'notifications'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              {tab === 'general' && '⚙️ Général'}
              {tab === 'technical' && '🔧 Technique'}
              {tab === 'security' && '🔐 Sécurité'}
              {tab === 'notifications' && '📬 Notifications'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Réinitialiser
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Save size={18} />
            Enregistrer
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-6">
        
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de la plateforme</label>
              <input
                type="text"
                value={settings.general.platformName}
                onChange={(e) => handleGeneralChange('platformName', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">URL principale</label>
              <input
                type="url"
                value={settings.general.mainUrl}
                onChange={(e) => handleGeneralChange('mainUrl', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Langue par défaut</label>
                <select
                  value={settings.general.defaultLanguage}
                  onChange={(e) => handleGeneralChange('defaultLanguage', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fuseau horaire</label>
                <select
                  value={settings.general.timezone}
                  onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Europe/Paris">Europe/Paris</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Logo</label>
              <input
                type="text"
                value={settings.general.logo}
                onChange={(e) => handleGeneralChange('logo', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/path/to/logo.png"
              />
            </div>
          </div>
        )}

        {/* Technical Settings */}
        {activeTab === 'technical' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Taille maximale d'upload (MB)</label>
              <input
                type="number"
                value={settings.technical.maxUploadSize}
                onChange={(e) => handleTechnicalChange('maxUploadSize', parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Formats acceptés</label>
              <div className="flex flex-wrap gap-2">
                {settings.technical.acceptedFormats.map((format, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    .{format}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Formats de conversion disponibles</label>
              <div className="flex flex-wrap gap-2">
                {settings.technical.conversionFormats.map((format, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    .{format}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Délai de traitement (sec)</label>
                <input
                  type="number"
                  value={settings.technical.processingTimeout}
                  onChange={(e) => handleTechnicalChange('processingTimeout', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stockage par utilisateur (MB)</label>
                <input
                  type="number"
                  value={settings.technical.storagePerUser}
                  onChange={(e) => handleTechnicalChange('storagePerUser', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Politique de mot de passe</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Longueur minimale</label>
                  <input
                    type="number"
                    value={settings.security.passwordPolicy.minLength}
                    onChange={(e) => handleSecurityChange('passwordPolicy', {
                      ...settings.security.passwordPolicy,
                      minLength: parseInt(e.target.value)
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.security.passwordPolicy.requireUppercase}
                    onChange={(e) => handleSecurityChange('passwordPolicy', {
                      ...settings.security.passwordPolicy,
                      requireUppercase: e.target.checked
                    })}
                    className="w-4 h-4 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Exiger majuscules</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.security.passwordPolicy.requireNumbers}
                    onChange={(e) => handleSecurityChange('passwordPolicy', {
                      ...settings.security.passwordPolicy,
                      requireNumbers: e.target.checked
                    })}
                    className="w-4 h-4 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Exiger chiffres</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.security.passwordPolicy.requireSpecialChars}
                    onChange={(e) => handleSecurityChange('passwordPolicy', {
                      ...settings.security.passwordPolicy,
                      requireSpecialChars: e.target.checked
                    })}
                    className="w-4 h-4 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Exiger caractères spéciaux</label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Durée de session (secondes)</label>
              <input
                type="number"
                value={settings.security.sessionDuration}
                onChange={(e) => handleSecurityChange('sessionDuration', parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label className="ml-2 text-sm font-semibold text-gray-700">Double authentification</label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Limite tentatives de connexion</label>
              <input
                type="number"
                value={settings.security.loginAttemptLimit}
                onChange={(e) => handleSecurityChange('loginAttemptLimit', parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">IPs autorisées</label>
              <div className="space-y-2">
                {settings.security.ipWhitelist.map((ip, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <code className="flex-1 text-sm">{ip}</code>
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        security: {
                          ...settings.security,
                          ipWhitelist: settings.security.ipWhitelist.filter((_, i) => i !== idx)
                        }
                      })}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Notifications email</h3>
                <p className="text-sm text-gray-600">Activer les notifications par email</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.emailNotifications}
                onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                className="w-6 h-6 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Alertes système</h3>
                <p className="text-sm text-gray-600">Alertes globales du système</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.systemAlerts}
                onChange={(e) => handleNotificationChange('systemAlerts', e.target.checked)}
                className="w-6 h-6 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Alertes erreurs critiques</h3>
                <p className="text-sm text-gray-600">Notifications pour erreurs critiques urgentes</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.criticalErrorAlerts}
                onChange={(e) => handleNotificationChange('criticalErrorAlerts', e.target.checked)}
                className="w-6 h-6 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Notifications tickets support</h3>
                <p className="text-sm text-gray-600">Nouveaux tickets et réponses clients</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.supportTicketNotifications}
                onChange={(e) => handleNotificationChange('supportTicketNotifications', e.target.checked)}
                className="w-6 h-6 rounded"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
