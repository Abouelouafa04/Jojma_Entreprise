import React, { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, AlertOctagon, Info, Settings, LogOut, Repeat2, Download, Search, Filter } from 'lucide-react';

interface SystemError {
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

interface ErrorStats {
  total: number;
  info: number;
  warning: number;
  critical: number;
  analyzed: number;
  unresolved: number;
}

const SERVICE_CONFIG = {
  auth: { label: 'Authentification', icon: '🔐', color: 'bg-blue-50' },
  database: { label: 'Base de données', icon: '🗄️', color: 'bg-purple-50' },
  upload: { label: 'Upload fichiers', icon: '📤', color: 'bg-indigo-50' },
  conversion: { label: 'Conversion 3D', icon: '⚙️', color: 'bg-cyan-50' },
  ar: { label: 'Génération AR', icon: '📱', color: 'bg-green-50' },
  api: { label: 'API publique', icon: '🔌', color: 'bg-yellow-50' },
  admin: { label: 'Espace admin', icon: '⚡', color: 'bg-red-50' }
};

const ERROR_TYPE_CONFIG = {
  connection: { label: 'Connexion', color: 'text-blue-600' },
  timeout: { label: 'Délai', color: 'text-yellow-600' },
  permission: { label: 'Permission', color: 'text-orange-600' },
  resource: { label: 'Ressource', color: 'text-purple-600' },
  validation: { label: 'Validation', color: 'text-indigo-600' },
  crash: { label: 'Crash', color: 'text-red-600' },
  data: { label: 'Données', color: 'text-pink-600' }
};

const SEVERITY_CONFIG = {
  info: { label: 'Info', icon: Info, color: 'bg-blue-100 text-blue-800', border: 'border-blue-300' },
  warning: { label: 'Avertissement', icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-300' },
  critical: { label: 'Critique', icon: AlertOctagon, color: 'bg-red-100 text-red-800', border: 'border-red-300' }
};

const STATUS_CONFIG = {
  new: { label: 'Nouveau', color: 'bg-red-50 text-red-700', badge: '🔴' },
  analyzed: { label: 'Analysé', color: 'bg-yellow-50 text-yellow-700', badge: '🟡' },
  resolved: { label: 'Résolu', color: 'bg-green-50 text-green-700', badge: '🟢' },
  assigned: { label: 'Assigné', color: 'bg-blue-50 text-blue-700', badge: '🔵' }
};

const MOCK_ERRORS: SystemError[] = [
  {
    id: '1',
    errorId: 'ERR-2024-001',
    service: 'database',
    type: 'connection',
    severity: 'critical',
    message: 'Timeout de connexion à la base de données primaire',
    timestamp: new Date(Date.now() - 15 * 60000),
    status: 'new',
    occurrences: 47,
    affectedUsers: 234
  },
  {
    id: '2',
    errorId: 'ERR-2024-002',
    service: 'conversion',
    type: 'timeout',
    severity: 'warning',
    message: 'Conversion 3D dépassée 30 minutes',
    timestamp: new Date(Date.now() - 45 * 60000),
    status: 'analyzed',
    assignedTo: 'Jean Dupont',
    occurrences: 12
  },
  {
    id: '3',
    errorId: 'ERR-2024-003',
    service: 'upload',
    type: 'resource',
    severity: 'warning',
    message: 'Espace disque insuffisant sur serveur upload',
    timestamp: new Date(Date.now() - 1 * 3600000),
    status: 'assigned',
    assignedTo: 'Marie Martin',
    occurrences: 5
  },
  {
    id: '4',
    errorId: 'ERR-2024-004',
    service: 'ar',
    type: 'crash',
    severity: 'critical',
    message: 'Service de génération AR non réactif',
    timestamp: new Date(Date.now() - 2 * 3600000),
    status: 'new',
    stackTrace: 'Memory leak detected in WebGL context',
    affectedUsers: 89
  },
  {
    id: '5',
    errorId: 'ERR-2024-005',
    service: 'auth',
    type: 'permission',
    severity: 'info',
    message: 'Tentatives d\'authentification échouées détectées',
    timestamp: new Date(Date.now() - 3 * 3600000),
    status: 'resolved',
    occurrences: 156
  },
  {
    id: '6',
    errorId: 'ERR-2024-006',
    service: 'api',
    type: 'validation',
    severity: 'warning',
    message: 'Paramètres API invalides reçus',
    timestamp: new Date(Date.now() - 4 * 3600000),
    status: 'analyzed',
    occurrences: 89
  },
  {
    id: '7',
    errorId: 'ERR-2024-007',
    service: 'admin',
    type: 'data',
    severity: 'critical',
    message: 'Corruption détectée dans les données d\'administration',
    timestamp: new Date(Date.now() - 6 * 3600000),
    status: 'assigned',
    assignedTo: 'Tech Admin',
    affectedUsers: 0
  },
  {
    id: '8',
    errorId: 'ERR-2024-008',
    service: 'conversion',
    type: 'validation',
    severity: 'info',
    message: 'Format de fichier automatiquement converti',
    timestamp: new Date(Date.now() - 8 * 3600000),
    status: 'resolved',
    occurrences: 234
  }
];

export default function AdminSystemErrorsDashboard() {
  const [errors, setErrors] = useState<SystemError[]>(MOCK_ERRORS);
  const [stats, setStats] = useState<ErrorStats>({
    total: 8,
    info: 2,
    warning: 3,
    critical: 3,
    analyzed: 2,
    unresolved: 6
  });
  const [selectedError, setSelectedError] = useState<SystemError | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const itemsPerPage = 10;
  const totalPages = Math.ceil(errors.length / itemsPerPage);

  const filteredErrors = errors.filter(error => {
    if (selectedService && error.service !== selectedService) return false;
    if (selectedSeverity && error.severity !== selectedSeverity) return false;
    if (selectedStatus && error.status !== selectedStatus) return false;
    if (searchQuery && !error.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const paginatedErrors = filteredErrors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleMarkAnalyzed = (errorId: string) => {
    setErrors(errors.map(e =>
      e.id === errorId ? { ...e, status: 'analyzed' } : e
    ));
  };

  const handleAssign = (errorId: string) => {
    setErrors(errors.map(e =>
      e.id === errorId ? { ...e, status: 'assigned', assignedTo: 'Agent ' + Math.floor(Math.random() * 100) } : e
    ));
  };

  const handleRestart = (service: string) => {
    alert(`Service ${SERVICE_CONFIG[service as keyof typeof SERVICE_CONFIG]?.label} redémarré avec succès`);
  };

  const handleExport = () => {
    const csv = [
      ['ID Erreur', 'Service', 'Type', 'Gravité', 'Message', 'Date/Heure', 'Statut'],
      ...filteredErrors.map(e => [
        e.errorId,
        SERVICE_CONFIG[e.service as keyof typeof SERVICE_CONFIG]?.label,
        ERROR_TYPE_CONFIG[e.type as keyof typeof ERROR_TYPE_CONFIG]?.label,
        SEVERITY_CONFIG[e.severity as keyof typeof SEVERITY_CONFIG]?.label,
        e.message,
        e.timestamp.toLocaleString('fr-FR'),
        STATUS_CONFIG[e.status as keyof typeof STATUS_CONFIG]?.label
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `erreurs-systeme-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Erreurs système</h1>
        <p className="text-gray-600 mt-2">Surveillez les incidents techniques de la plateforme</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600 mt-1">Total</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-400">
          <div className="text-3xl font-bold text-blue-400">{stats.info}</div>
          <div className="text-sm text-gray-600 mt-1">Info</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="text-3xl font-bold text-yellow-600">{stats.warning}</div>
          <div className="text-sm text-gray-600 mt-1">Avertissements</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
          <div className="text-sm text-gray-600 mt-1">Critiques</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-3xl font-bold text-green-600">{stats.analyzed}</div>
          <div className="text-sm text-gray-600 mt-1">Analysés</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="text-3xl font-bold text-purple-600">{stats.unresolved}</div>
          <div className="text-sm text-gray-600 mt-1">Non résolus</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center border rounded-lg px-3">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par message..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 px-2 py-2 outline-none"
            />
          </div>
          <select
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border rounded-lg bg-white cursor-pointer"
          >
            <option value="">Tous les services</option>
            {Object.entries(SERVICE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <select
            value={selectedSeverity}
            onChange={(e) => {
              setSelectedSeverity(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border rounded-lg bg-white cursor-pointer"
          >
            <option value="">Toutes les gravités</option>
            {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border rounded-lg bg-white cursor-pointer"
          >
            <option value="">Tous les statuts</option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Download size={18} />
            Exporter
          </button>
        </div>
      </div>

      {/* Errors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID Erreur</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Service</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Gravité</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Message</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date/Heure</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedErrors.map((error) => {
              const severityConfig = SEVERITY_CONFIG[error.severity];
              const serviceConfig = SERVICE_CONFIG[error.service as keyof typeof SERVICE_CONFIG];
              const statusConfig = STATUS_CONFIG[error.status as keyof typeof STATUS_CONFIG];
              return (
                <tr key={error.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{error.errorId}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${serviceConfig?.color}`}>
                      {serviceConfig?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {ERROR_TYPE_CONFIG[error.type as keyof typeof ERROR_TYPE_CONFIG]?.label}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${severityConfig.color} ${severityConfig.border}`}>
                      {severityConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{error.message}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{error.timestamp.toLocaleString('fr-FR')}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                      {statusConfig.badge} {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => setSelectedError(error)}
                      className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      Détails
                    </button>
                    {error.status === 'new' && (
                      <>
                        <button
                          onClick={() => handleMarkAnalyzed(error.id)}
                          className="px-2 py-1 text-yellow-600 hover:bg-yellow-50 rounded"
                        >
                          Analyser
                        </button>
                        <button
                          onClick={() => handleAssign(error.id)}
                          className="px-2 py-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          Assigner
                        </button>
                      </>
                    )}
                    {error.service !== 'admin' && (
                      <button
                        onClick={() => handleRestart(error.service)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                        title="Redémarrer le service"
                      >
                        <Repeat2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-2 rounded ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Details Modal */}
      {selectedError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedError.errorId}</h2>
                  <p className="text-sm text-gray-600">{selectedError.service.toUpperCase()}</p>
                </div>
                <button
                  onClick={() => setSelectedError(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Message</label>
                  <p className="mt-1 text-gray-700">{selectedError.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Service</label>
                    <p className="mt-1">{SERVICE_CONFIG[selectedError.service as keyof typeof SERVICE_CONFIG]?.label}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Type</label>
                    <p className="mt-1">{ERROR_TYPE_CONFIG[selectedError.type as keyof typeof ERROR_TYPE_CONFIG]?.label}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Gravité</label>
                    <p className="mt-1">{SEVERITY_CONFIG[selectedError.severity as keyof typeof SEVERITY_CONFIG]?.label}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Statut</label>
                    <p className="mt-1">{STATUS_CONFIG[selectedError.status as keyof typeof STATUS_CONFIG]?.label}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Date/Heure</label>
                  <p className="mt-1">{selectedError.timestamp.toLocaleString('fr-FR')}</p>
                </div>

                {selectedError.assignedTo && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Assigné à</label>
                    <p className="mt-1">{selectedError.assignedTo}</p>
                  </div>
                )}

                {selectedError.occurrences && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Occurrences</label>
                    <p className="mt-1">{selectedError.occurrences}</p>
                  </div>
                )}

                {selectedError.affectedUsers && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Utilisateurs affectés</label>
                    <p className="mt-1">{selectedError.affectedUsers}</p>
                  </div>
                )}

                {selectedError.stackTrace && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Stack Trace</label>
                    <pre className="mt-1 bg-gray-100 p-3 rounded text-xs overflow-x-auto">{selectedError.stackTrace}</pre>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setSelectedError(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
