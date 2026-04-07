import React, { useState, useEffect } from 'react';
import {
  Activity, Search, Filter, Download, Eye, Clock, User, Zap, AlertCircle, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, Shield, LogOut, Upload, Play, Link2, Settings, Trash2
} from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: 'login' | 'logout' | 'import_model' | 'start_conversion' | 'generate_ar_link' | 'modify_settings' | 'delete_file' | 'create_user' | 'update_user' | 'delete_user' | 'assign_ticket' | 'export_data' | 'change_permissions' | 'ban_user';
  actionLabel: string;
  module: 'auth' | 'models' | 'conversion' | 'ar' | 'settings' | 'users' | 'support' | 'billing' | 'admin';
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

const ACTION_CONFIG = {
  'login': { label: 'Connexion', icon: LogOut, color: 'text-blue-600', bgColor: 'bg-blue-50', severity: 'low' },
  'logout': { label: 'Déconnexion', icon: LogOut, color: 'text-slate-600', bgColor: 'bg-slate-50', severity: 'low' },
  'import_model': { label: 'Import modèle', icon: Upload, color: 'text-purple-600', bgColor: 'bg-purple-50', severity: 'medium' },
  'start_conversion': { label: 'Lancer conversion', icon: Play, color: 'text-green-600', bgColor: 'bg-green-50', severity: 'medium' },
  'generate_ar_link': { label: 'Générer lien AR', icon: Link2, color: 'text-pink-600', bgColor: 'bg-pink-50', severity: 'low' },
  'modify_settings': { label: 'Modifier paramètres', icon: Settings, color: 'text-orange-600', bgColor: 'bg-orange-50', severity: 'high' },
  'delete_file': { label: 'Supprimer fichier', icon: Trash2, color: 'text-red-600', bgColor: 'bg-red-50', severity: 'high' },
  'create_user': { label: 'Créer utilisateur', icon: User, color: 'text-blue-600', bgColor: 'bg-blue-50', severity: 'medium' },
  'update_user': { label: 'Modifier utilisateur', icon: User, color: 'text-blue-600', bgColor: 'bg-blue-50', severity: 'medium' },
  'delete_user': { label: 'Supprimer utilisateur', icon: User, color: 'text-red-600', bgColor: 'bg-red-50', severity: 'critical' },
  'assign_ticket': { label: 'Assigner ticket', icon: Zap, color: 'text-purple-600', bgColor: 'bg-purple-50', severity: 'low' },
  'export_data': { label: 'Exporter données', icon: Download, color: 'text-indigo-600', bgColor: 'bg-indigo-50', severity: 'medium' },
  'change_permissions': { label: 'Changer permissions', icon: Shield, color: 'text-red-600', bgColor: 'bg-red-50', severity: 'critical' },
  'ban_user': { label: 'Bannir utilisateur', icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50', severity: 'critical' },
};

const MODULE_CONFIG = {
  'auth': { label: 'Authentification', color: 'bg-blue-100 text-blue-800' },
  'models': { label: 'Modèles 3D', color: 'bg-purple-100 text-purple-800' },
  'conversion': { label: 'Conversion', color: 'bg-green-100 text-green-800' },
  'ar': { label: 'Réalité Augmentée', color: 'bg-pink-100 text-pink-800' },
  'settings': { label: 'Paramètres', color: 'bg-yellow-100 text-yellow-800' },
  'users': { label: 'Utilisateurs', color: 'bg-blue-100 text-blue-800' },
  'support': { label: 'Support', color: 'bg-purple-100 text-purple-800' },
  'billing': { label: 'Facturation', color: 'bg-orange-100 text-orange-800' },
  'admin': { label: 'Administration', color: 'bg-red-100 text-red-800' },
};

const RESULT_CONFIG = {
  'success': { label: 'Succès', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
  'failure': { label: 'Échec', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
  'warning': { label: 'Avertissement', icon: AlertCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
};

const CRITICALITY_CONFIG = {
  'low': { label: 'Faible', color: 'bg-slate-100 text-slate-800', dotColor: 'bg-slate-400' },
  'medium': { label: 'Moyen', color: 'bg-blue-100 text-blue-800', dotColor: 'bg-blue-400' },
  'high': { label: 'Haute', color: 'bg-orange-100 text-orange-800', dotColor: 'bg-orange-400' },
  'critical': { label: 'Critique', color: 'bg-red-100 text-red-800', dotColor: 'bg-red-400' },
};

export default function AdminActivityLogsDashboard() {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [moduleFilter, setModuleFilter] = useState<string>('');
  const [criticalityFilter, setCriticalityFilter] = useState<string>('');
  const [resultFilter, setResultFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const itemsPerPage = 15;

  // Mock data
  useEffect(() => {
    const mockLogs: ActivityLog[] = [
      {
        id: '1',
        userId: 'user-1',
        userName: 'Jean Dupont',
        userEmail: 'jean@example.com',
        action: 'login',
        actionLabel: 'Connexion',
        module: 'auth',
        description: 'Connexion réussie via email',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 Chrome/91.0',
        result: 'success',
        statusCode: 200,
        timestamp: '2026-04-05T14:30:00',
        criticalityLevel: 'low',
      },
      {
        id: '2',
        userId: 'user-2',
        userName: 'Marie Studio',
        userEmail: 'marie@studio.com',
        action: 'import_model',
        actionLabel: 'Import modèle',
        module: 'models',
        description: 'Upload du fichier FBX (45MB) - Modèle statue',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 Firefox/89.0',
        result: 'success',
        statusCode: 201,
        timestamp: '2026-04-05T14:25:30',
        criticalityLevel: 'medium',
        relatedResourceId: 'model-123',
        relatedResourceType: 'Model',
        duration: 15000,
      },
      {
        id: '3',
        userId: 'admin-1',
        userName: 'Sophie Admin',
        userEmail: 'sophie@admin.com',
        action: 'create_user',
        actionLabel: 'Créer utilisateur',
        module: 'users',
        description: 'Création utilisateur: support@jojma.com (Rôle: Support)',
        ipAddress: '192.168.1.50',
        userAgent: 'Mozilla/5.0 Safari/530.17',
        result: 'success',
        statusCode: 201,
        timestamp: '2026-04-05T14:20:15',
        criticalityLevel: 'medium',
        relatedResourceId: 'user-new-1',
        relatedResourceType: 'User',
      },
      {
        id: '4',
        userId: 'user-3',
        userName: 'Pierre Créateur',
        userEmail: 'pierre@example.com',
        action: 'start_conversion',
        actionLabel: 'Lancer conversion',
        module: 'conversion',
        description: 'Conversion GLB → USDZ (Qualité: Haute)',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 Chrome/91.0',
        result: 'success',
        statusCode: 200,
        timestamp: '2026-04-05T14:15:45',
        criticalityLevel: 'medium',
        relatedResourceId: 'conversion-456',
        relatedResourceType: 'Conversion',
        duration: 8500,
      },
      {
        id: '5',
        userId: 'user-4',
        userName: 'Sophie Leclerc',
        userEmail: 'sophie@company.com',
        action: 'generate_ar_link',
        actionLabel: 'Générer lien AR',
        module: 'ar',
        description: 'Lien AR généré pour modèle: Statue-Greco',
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 Chrome/91.0',
        result: 'success',
        statusCode: 200,
        timestamp: '2026-04-05T14:10:20',
        criticalityLevel: 'low',
        relatedResourceId: 'ar-link-789',
        relatedResourceType: 'ARLink',
      },
      {
        id: '6',
        userId: 'admin-1',
        userName: 'Sophie Admin',
        userEmail: 'sophie@admin.com',
        action: 'modify_settings',
        actionLabel: 'Modifier paramètres',
        module: 'settings',
        description: 'Modification des paramètres: Limite de stockage par utilisateur (100GB → 150GB)',
        ipAddress: '192.168.1.50',
        userAgent: 'Mozilla/5.0 Safari/530.17',
        result: 'success',
        statusCode: 200,
        timestamp: '2026-04-05T14:05:00',
        criticalityLevel: 'high',
      },
      {
        id: '7',
        userId: 'user-5',
        userName: 'Luc Moreau',
        userEmail: 'luc@example.com',
        action: 'delete_file',
        actionLabel: 'Supprimer fichier',
        module: 'models',
        description: 'Suppression du fichier: old-model-v1.fbx',
        ipAddress: '192.168.1.104',
        userAgent: 'Mozilla/5.0 Chrome/91.0',
        result: 'success',
        statusCode: 204,
        timestamp: '2026-04-05T13:50:30',
        criticalityLevel: 'high',
        relatedResourceId: 'file-old-v1',
        relatedResourceType: 'File',
      },
      {
        id: '8',
        userId: 'user-6',
        userName: 'Claire Designs',
        userEmail: 'claire@designs.fr',
        action: 'import_model',
        actionLabel: 'Import modèle',
        module: 'models',
        description: 'Upload du fichier OBJ (78MB) - Échec: Fichier trop volumineux',
        ipAddress: '192.168.1.105',
        userAgent: 'Mozilla/5.0 Edge/91.0',
        result: 'failure',
        statusCode: 413,
        errorMessage: 'File size exceeds maximum allowed (50MB)',
        timestamp: '2026-04-05T13:45:15',
        criticalityLevel: 'medium',
        relatedResourceType: 'Model',
      },
      {
        id: '9',
        userId: 'admin-1',
        userName: 'Sophie Admin',
        userEmail: 'sophie@admin.com',
        action: 'change_permissions',
        actionLabel: 'Changer permissions',
        module: 'admin',
        description: 'Changement de rôle: jean@example.com (User → Gestionnaire-Technique)',
        ipAddress: '192.168.1.50',
        userAgent: 'Mozilla/5.0 Safari/530.17',
        result: 'success',
        statusCode: 200,
        timestamp: '2026-04-05T13:30:45',
        criticalityLevel: 'critical',
        relatedResourceId: 'user-1',
        relatedResourceType: 'User',
      },
      {
        id: '10',
        userId: 'user-7',
        userName: 'Marc Innovation',
        userEmail: 'marc@innovation.com',
        action: 'logout',
        actionLabel: 'Déconnexion',
        module: 'auth',
        description: 'Déconnexion utilisateur',
        ipAddress: '192.168.1.106',
        userAgent: 'Mozilla/5.0 Chrome/91.0',
        result: 'success',
        statusCode: 200,
        timestamp: '2026-04-05T13:20:00',
        criticalityLevel: 'low',
      },
      {
        id: '11',
        userId: 'admin-1',
        userName: 'Sophie Admin',
        userEmail: 'sophie@admin.com',
        action: 'export_data',
        actionLabel: 'Exporter données',
        module: 'admin',
        description: 'Export des données utilisateurs (CSV) - 150 enregistrements',
        ipAddress: '192.168.1.50',
        userAgent: 'Mozilla/5.0 Safari/530.17',
        result: 'success',
        statusCode: 200,
        timestamp: '2026-04-05T13:10:30',
        criticalityLevel: 'medium',
        duration: 2500,
      },
      {
        id: '12',
        userId: 'user-8',
        userName: 'Nathalie Agency',
        userEmail: 'nathalie@agency.com',
        action: 'assign_ticket',
        actionLabel: 'Assigner ticket',
        module: 'support',
        description: 'Ticket TKT-2026-001 assigné à agent-1',
        ipAddress: '192.168.1.107',
        userAgent: 'Mozilla/5.0 Chrome/91.0',
        result: 'success',
        statusCode: 200,
        timestamp: '2026-04-05T12:55:00',
        criticalityLevel: 'low',
        relatedResourceId: 'ticket-1',
        relatedResourceType: 'Ticket',
      },
    ];
    setLogs(mockLogs);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...logs];

    if (searchTerm) {
      result = result.filter(log =>
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm)
      );
    }

    if (userFilter) {
      result = result.filter(log => log.userId === userFilter);
    }

    if (actionFilter) {
      result = result.filter(log => log.action === actionFilter);
    }

    if (moduleFilter) {
      result = result.filter(log => log.module === moduleFilter);
    }

    if (criticalityFilter) {
      result = result.filter(log => log.criticalityLevel === criticalityFilter);
    }

    if (resultFilter) {
      result = result.filter(log => log.result === resultFilter);
    }

    if (dateFrom) {
      result = result.filter(log => new Date(log.timestamp) >= new Date(dateFrom));
    }

    if (dateTo) {
      result = result.filter(log => new Date(log.timestamp) <= new Date(dateTo + 'T23:59:59'));
    }

    // Sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } else if (sortBy === 'critical-first') {
      const criticalityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      result.sort((a, b) => 
        criticalityOrder[a.criticalityLevel as keyof typeof criticalityOrder] - 
        criticalityOrder[b.criticalityLevel as keyof typeof criticalityOrder]
      );
    }

    setCurrentPage(1);
    setFilteredLogs(result);
  }, [logs, searchTerm, userFilter, actionFilter, moduleFilter, criticalityFilter, resultFilter, dateFrom, dateTo, sortBy]);

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const handleViewDetails = (log: ActivityLog) => {
    setSelectedLog(log);
    setShowDetails(true);
  };

  const handleExport = () => {
    const csv = [
      ['Date', 'Utilisateur', 'Email', 'Action', 'Module', 'Criticité', 'Résultat', 'IP', 'Description'].join(','),
      ...filteredLogs.map(log =>
        [
          new Date(log.timestamp).toLocaleString('fr-FR'),
          log.userName,
          log.userEmail,
          log.actionLabel,
          MODULE_CONFIG[log.module as keyof typeof MODULE_CONFIG].label,
          log.criticalityLevel,
          log.result,
          log.ipAddress,
          `"${log.description}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Logs d'activité</h2>
          <p className="text-slate-500 mt-1">
            Consultez l'historique complet des actions réalisées sur JOJMA afin d'assurer la traçabilité, l'analyse des usages et le contrôle des opérations sensibles.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          Exporter CSV
        </button>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-600 text-sm font-medium">Succès</p>
          <p className="text-3xl font-bold text-green-700 mt-2">
            {logs.filter(l => l.result === 'success').length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600 text-sm font-medium">Échecs</p>
          <p className="text-3xl font-bold text-red-700 mt-2">
            {logs.filter(l => l.result === 'failure').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-yellow-600 text-sm font-medium">Avertissements</p>
          <p className="text-3xl font-bold text-yellow-700 mt-2">
            {logs.filter(l => l.result === 'warning').length}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <p className="text-orange-600 text-sm font-medium">Critique</p>
          <p className="text-3xl font-bold text-orange-700 mt-2">
            {logs.filter(l => l.criticalityLevel === 'critical').length}
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="text-slate-600 text-sm font-medium">Total</p>
          <p className="text-3xl font-bold text-slate-700 mt-2">{logs.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par utilisateur, email, IP ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Action</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les actions</option>
              {Object.entries(ACTION_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Module</label>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les modules</option>
              {Object.entries(MODULE_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Criticité</label>
            <select
              value={criticalityFilter}
              onChange={(e) => setCriticalityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les niveaux</option>
              <option value="low">Faible</option>
              <option value="medium">Moyen</option>
              <option value="high">Haute</option>
              <option value="critical">Critique</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Résultat</label>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les résultats</option>
              <option value="success">Succès</option>
              <option value="failure">Échec</option>
              <option value="warning">Avertissement</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Du</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Au</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tri</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
              <option value="critical-first">Critique d'abord</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date/Heure</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Utilisateur</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Action</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Module</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Criticité</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Résultat</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">IP</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedLogs.map((log) => {
                const actionConfig = ACTION_CONFIG[log.action as keyof typeof ACTION_CONFIG];
                const moduleConfig = MODULE_CONFIG[log.module as keyof typeof MODULE_CONFIG];
                const resultConfig = RESULT_CONFIG[log.result as keyof typeof RESULT_CONFIG];
                const criticalityConfig = CRITICALITY_CONFIG[log.criticalityLevel as keyof typeof CRITICALITY_CONFIG];
                const ActionIcon = actionConfig.icon;
                const ResultIcon = resultConfig.icon;

                return (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4" />
                        {new Date(log.timestamp).toLocaleString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{log.userName}</p>
                        <p className="text-xs text-slate-500">{log.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 text-sm font-medium ${actionConfig.color}`}>
                        <ActionIcon className="w-4 h-4" />
                        {actionConfig.label}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${moduleConfig.color}`}>
                        {moduleConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${criticalityConfig.dotColor}`} />
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${criticalityConfig.color}`}>
                          {criticalityConfig.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full w-fit ${resultConfig.bgColor}`}>
                        <ResultIcon className="w-3 h-3" />
                        {resultConfig.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">{log.ipAddress}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(log)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Affichage {Math.max(0, (currentPage - 1) * itemsPerPage + 1)} à {Math.min(currentPage * itemsPerPage, filteredLogs.length)} sur {filteredLogs.length} entrées
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Détails de l'activité</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Log Details Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b">
              <div>
                <p className="text-sm text-slate-600 font-medium">Utilisateur</p>
                <p className="text-slate-900 font-medium">{selectedLog.userName}</p>
                <p className="text-xs text-slate-500">{selectedLog.userEmail}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 font-medium">Adresse IP</p>
                <p className="text-slate-900 font-mono">{selectedLog.ipAddress}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 font-medium">Date et Heure</p>
                <p className="text-slate-900">{new Date(selectedLog.timestamp).toLocaleString('fr-FR')}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 font-medium">Action</p>
                <p className="text-slate-900">{ACTION_CONFIG[selectedLog.action as keyof typeof ACTION_CONFIG].label}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 font-medium">Module</p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${MODULE_CONFIG[selectedLog.module as keyof typeof MODULE_CONFIG].color}`}>
                  {MODULE_CONFIG[selectedLog.module as keyof typeof MODULE_CONFIG].label}
                </span>
              </div>

              <div>
                <p className="text-sm text-slate-600 font-medium">Criticité</p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${CRITICALITY_CONFIG[selectedLog.criticalityLevel as keyof typeof CRITICALITY_CONFIG].color}`}>
                  {CRITICALITY_CONFIG[selectedLog.criticalityLevel as keyof typeof CRITICALITY_CONFIG].label}
                </span>
              </div>

              <div>
                <p className="text-sm text-slate-600 font-medium">Résultat</p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${RESULT_CONFIG[selectedLog.result as keyof typeof RESULT_CONFIG].bgColor}`}>
                  {RESULT_CONFIG[selectedLog.result as keyof typeof RESULT_CONFIG].label}
                </span>
              </div>

              {selectedLog.statusCode && (
                <div>
                  <p className="text-sm text-slate-600 font-medium">Code HTTP</p>
                  <p className={`font-mono ${selectedLog.statusCode >= 200 && selectedLog.statusCode < 300 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedLog.statusCode}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6 pb-6 border-b">
              <p className="text-sm text-slate-600 font-medium mb-2">Description</p>
              <p className="text-slate-900 bg-slate-50 p-4 rounded-lg">{selectedLog.description}</p>
            </div>

            {/* Additional Info */}
            <div className="mb-6 pb-6 border-b space-y-4">
              {selectedLog.duration && (
                <div>
                  <p className="text-sm text-slate-600 font-medium">Durée</p>
                  <p className="text-slate-900">{(selectedLog.duration / 1000).toFixed(2)}s</p>
                </div>
              )}

              {selectedLog.errorMessage && (
                <div>
                  <p className="text-sm text-slate-600 font-medium">Message d'erreur</p>
                  <p className="text-red-600 bg-red-50 p-3 rounded">{selectedLog.errorMessage}</p>
                </div>
              )}

              {selectedLog.relatedResourceId && (
                <div>
                  <p className="text-sm text-slate-600 font-medium">Ressource concernée</p>
                  <p className="text-slate-900">{selectedLog.relatedResourceType}: {selectedLog.relatedResourceId}</p>
                </div>
              )}
            </div>

            {/* User Agent */}
            <div className="mb-4">
              <p className="text-sm text-slate-600 font-medium mb-2">User Agent</p>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded font-mono break-all">{selectedLog.userAgent}</p>
            </div>

            <button
              onClick={() => setShowDetails(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
