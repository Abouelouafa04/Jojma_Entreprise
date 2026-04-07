import React, { useState, useEffect } from 'react';
import {
  Box, Plus, Search, Filter, MoreVertical, Eye, Edit2, Trash2, Archive,
  ChevronLeft, ChevronRight, AlertCircle, CheckCircle, Clock, Zap,
  FileText, HardDrive, Calendar, User, RefreshCw, Maximize2
} from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

interface Model3D {
  id: string;
  name: string;
  owner: string;
  ownerId: string;
  format: string; // FBX, OBJ, GLTF, GLB, etc
  fileSize: number; // in bytes
  importDate: string;
  status: 'valid' | 'incomplete' | 'corrupted' | 'pending-review' | 'processing';
  arCompatibility: 'compatible' | 'partial' | 'incompatible' | 'unknown';
  qualityScore: number; // 0-100
  polygonCount: number;
  textureCount: number;
  lastModified: string;
  isArchived: boolean;
}

const STATUS_CONFIG = {
  'valid': { label: 'Valide', color: 'bg-emerald-100 text-emerald-800', dotColor: 'bg-emerald-400', icon: CheckCircle },
  'incomplete': { label: 'Incomplet', color: 'bg-amber-100 text-amber-800', dotColor: 'bg-amber-400', icon: AlertCircle },
  'corrupted': { label: 'Corrompu', color: 'bg-red-100 text-red-800', dotColor: 'bg-red-400', icon: AlertCircle },
  'pending-review': { label: 'En attente', color: 'bg-blue-100 text-blue-800', dotColor: 'bg-blue-400', icon: Clock },
  'processing': { label: 'En cours', color: 'bg-purple-100 text-purple-800', dotColor: 'bg-purple-400', icon: RefreshCw },
};

const AR_COMPATIBILITY_CONFIG = {
  'compatible': { label: 'Compatible', color: 'bg-emerald-100 text-emerald-800' },
  'partial': { label: 'Partiel', color: 'bg-amber-100 text-amber-800' },
  'incompatible': { label: 'Incompatible', color: 'bg-red-100 text-red-800' },
  'unknown': { label: 'Inconnu', color: 'bg-slate-100 text-slate-800' },
};

const FORMAT_COLORS = {
  'FBX': 'bg-blue-50 text-blue-700 border-blue-200',
  'OBJ': 'bg-purple-50 text-purple-700 border-purple-200',
  'GLTF': 'bg-green-50 text-green-700 border-green-200',
  'GLB': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'USD': 'bg-pink-50 text-pink-700 border-pink-200',
  'USDZ': 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function Admin3DModelsDashboard() {
  const { language, t } = useLanguage();
  const [models, setModels] = useState<Model3D[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model3D[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formatFilter, setFormatFilter] = useState<string>('');
  const [userFilter, setUserFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [arFilter, setArFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedModel, setSelectedModel] = useState<Model3D | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const itemsPerPage = 10;

  // Mock data
  useEffect(() => {
    const mockModels: Model3D[] = [
      {
        id: '1',
        name: 'Fauteuil Design Moderne',
        owner: 'Studio Design Pro',
        ownerId: 'user-2',
        format: 'FBX',
        fileSize: 5242880,
        importDate: '2025-03-15',
        status: 'valid',
        arCompatibility: 'compatible',
        qualityScore: 95,
        polygonCount: 45000,
        textureCount: 8,
        lastModified: '2025-04-01',
        isArchived: false,
      },
      {
        id: '2',
        name: 'Table Bois Chêne',
        owner: 'Furniture Creator',
        ownerId: 'user-3',
        format: 'OBJ',
        fileSize: 3145728,
        importDate: '2025-03-10',
        status: 'valid',
        arCompatibility: 'compatible',
        qualityScore: 88,
        polygonCount: 32000,
        textureCount: 4,
        lastModified: '2025-04-02',
        isArchived: false,
      },
      {
        id: '3',
        name: 'Chaise Scandinave',
        owner: 'Nordic Designs',
        ownerId: 'user-4',
        format: 'GLB',
        fileSize: 2097152,
        importDate: '2025-03-20',
        status: 'valid',
        arCompatibility: 'compatible',
        qualityScore: 92,
        polygonCount: 28000,
        textureCount: 6,
        lastModified: '2025-04-03',
        isArchived: false,
      },
      {
        id: '4',
        name: 'Lampadaire LED',
        owner: 'Lighting Experts',
        ownerId: 'user-5',
        format: 'GLTF',
        fileSize: 1572864,
        importDate: '2025-03-25',
        status: 'incomplete',
        arCompatibility: 'partial',
        qualityScore: 72,
        polygonCount: 15000,
        textureCount: 3,
        lastModified: '2025-03-28',
        isArchived: false,
      },
      {
        id: '5',
        name: 'Canapé Cuir Marron',
        owner: 'Studio Design Pro',
        ownerId: 'user-2',
        format: 'FBX',
        fileSize: 8388608,
        importDate: '2025-03-22',
        status: 'valid',
        arCompatibility: 'compatible',
        qualityScore: 94,
        polygonCount: 68000,
        textureCount: 12,
        lastModified: '2025-04-04',
        isArchived: false,
      },
      {
        id: '6',
        name: 'Miroir Doré Antique',
        owner: 'Antique Collectibles',
        ownerId: 'user-6',
        format: 'OBJ',
        fileSize: 786432,
        importDate: '2025-03-18',
        status: 'corrupted',
        arCompatibility: 'unknown',
        qualityScore: 45,
        polygonCount: 8000,
        textureCount: 2,
        lastModified: '2025-03-20',
        isArchived: false,
      },
      {
        id: '7',
        name: 'Plante Verte Monstera',
        owner: 'Green Living',
        ownerId: 'user-7',
        format: 'GLB',
        fileSize: 4194304,
        importDate: '2025-03-28',
        status: 'pending-review',
        arCompatibility: 'unknown',
        qualityScore: 0,
        polygonCount: 42000,
        textureCount: 5,
        lastModified: '2025-03-28',
        isArchived: false,
      },
      {
        id: '8',
        name: 'Bureau Bois Minimaliste',
        owner: 'Minimalist Furniture',
        ownerId: 'user-8',
        format: 'GLTF',
        fileSize: 2621440,
        importDate: '2025-04-01',
        status: 'processing',
        arCompatibility: 'unknown',
        qualityScore: 0,
        polygonCount: 22000,
        textureCount: 4,
        lastModified: '2025-04-01',
        isArchived: false,
      },
      {
        id: '9',
        name: 'Cloche Verre Vintage',
        owner: 'Vintage Shop',
        ownerId: 'user-9',
        format: 'USDZ',
        fileSize: 1048576,
        importDate: '2025-02-15',
        status: 'valid',
        arCompatibility: 'compatible',
        qualityScore: 85,
        polygonCount: 12000,
        textureCount: 2,
        lastModified: '2025-03-15',
        isArchived: false,
      },
      {
        id: '10',
        name: 'Étagère Murale Moderne',
        owner: 'Interior Designs',
        ownerId: 'user-10',
        format: 'FBX',
        fileSize: 3932160,
        importDate: '2025-02-20',
        status: 'valid',
        arCompatibility: 'compatible',
        qualityScore: 90,
        polygonCount: 35000,
        textureCount: 7,
        lastModified: '2025-03-20',
        isArchived: false,
      },
    ];
    setModels(mockModels);
  }, []);

  // Calculate stats
  const stats = {
    valid: models.filter(m => m.status === 'valid' && !m.isArchived).length,
    incomplete: models.filter(m => m.status === 'incomplete' && !m.isArchived).length,
    corrupted: models.filter(m => m.status === 'corrupted' && !m.isArchived).length,
    pendingReview: models.filter(m => m.status === 'pending-review' && !m.isArchived).length,
    processing: models.filter(m => m.status === 'processing' && !m.isArchived).length,
    total: models.filter(m => !m.isArchived).length,
  };

  // Apply filters
  useEffect(() => {
    let result = [...models].filter(m => !m.isArchived);

    if (searchTerm) {
      result = result.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (formatFilter) {
      result = result.filter(model => model.format === formatFilter);
    }

    if (userFilter) {
      result = result.filter(model => model.ownerId === userFilter);
    }

    if (statusFilter) {
      result = result.filter(model => model.status === statusFilter);
    }

    if (arFilter) {
      result = result.filter(model => model.arCompatibility === arFilter);
    }

    // Sorting
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'size-large') {
      result.sort((a, b) => b.fileSize - a.fileSize);
    } else if (sortBy === 'size-small') {
      result.sort((a, b) => a.fileSize - b.fileSize);
    } else if (sortBy === 'quality') {
      result.sort((a, b) => b.qualityScore - a.qualityScore);
    } else if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.importDate).getTime() - new Date(a.importDate).getTime());
    }

    setCurrentPage(1);
    setFilteredModels(result);
  }, [models, searchTerm, formatFilter, userFilter, statusFilter, arFilter, sortBy]);

  const paginatedModels = filteredModels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredModels.length / itemsPerPage);

  const handleViewDetails = (model: Model3D) => {
    setSelectedModel(model);
    setShowDetailsModal(true);
  };

  const handleArchiveModel = (modelId: string) => {
    setModels(models.map(m =>
      m.id === modelId ? { ...m, isArchived: true } : m
    ));
  };

  const handleDeleteModel = (modelId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce modèle définitivement ?')) {
      setModels(models.filter(m => m.id !== modelId));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getQualityColor = (score: number): string => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Gestion des modèles 3D</h2>
          <p className="text-slate-500 mt-1">
            Centralisez, contrôlez et administrez tous les modèles 3D de la plateforme afin de garantir leur qualité, leur compatibilité et leur bonne organisation.
          </p>
        </div>
      </div>

      {/* Quality Control Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <p className="text-emerald-600 text-sm font-medium">Modèles valides</p>
          <p className="text-3xl font-bold text-emerald-700 mt-2">{stats.valid}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <p className="text-amber-600 text-sm font-medium">Incomplets</p>
          <p className="text-3xl font-bold text-amber-700 mt-2">{stats.incomplete}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600 text-sm font-medium">Corrompus</p>
          <p className="text-3xl font-bold text-red-700 mt-2">{stats.corrupted}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">À vérifier</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">{stats.pendingReview}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-purple-600 text-sm font-medium">En traitement</p>
          <p className="text-3xl font-bold text-purple-700 mt-2">{stats.processing}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom de modèle ou propriétaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Format Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Tous les formats</option>
              <option value="FBX">FBX</option>
              <option value="OBJ">OBJ</option>
              <option value="GLTF">GLTF</option>
              <option value="GLB">GLB</option>
              <option value="USD">USD</option>
              <option value="USDZ">USDZ</option>
            </select>
          </div>

          {/* User Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Utilisateur</label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Tous les utilisateurs</option>
              <option value="user-2">Studio Design Pro</option>
              <option value="user-3">Furniture Creator</option>
              <option value="user-4">Nordic Designs</option>
              <option value="user-5">Lighting Experts</option>
              <option value="user-6">Antique Collectibles</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Tous les statuts</option>
              <option value="valid">Valide</option>
              <option value="incomplete">Incomplet</option>
              <option value="corrupted">Corrompu</option>
              <option value="pending-review">En attente</option>
              <option value="processing">En cours</option>
            </select>
          </div>

          {/* AR Compatibility Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Compatibilité AR</label>
            <select
              value={arFilter}
              onChange={(e) => setArFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Toutes</option>
              <option value="compatible">Compatible</option>
              <option value="partial">Partielle</option>
              <option value="incompatible">Incompatible</option>
              <option value="unknown">Inconnu</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tri</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Défaut</option>
              <option value="name-asc">Nom (A-Z)</option>
              <option value="name-desc">Nom (Z-A)</option>
              <option value="recent">Plus récent</option>
              <option value="quality">Qualité</option>
              <option value="size-large">Taille (grand)</option>
              <option value="size-small">Taille (petit)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Models Table */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Nom du modèle</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Propriétaire</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Format</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Taille</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Import</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">AR</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Qualité</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedModels.map((model) => {
                const statusConfig = STATUS_CONFIG[model.status];
                const arConfig = AR_COMPATIBILITY_CONFIG[model.arCompatibility];
                const formatColor = FORMAT_COLORS[model.format as keyof typeof FORMAT_COLORS] || 'bg-gray-50 text-gray-700 border-gray-200';
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={model.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">{model.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{model.owner}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded border ${formatColor}`}>
                        {model.format}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatFileSize(model.fileSize)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(model.importDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`} />
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${arConfig.color}`}>
                        {arConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {model.qualityScore > 0 ? (
                        <span className={`text-sm font-bold ${getQualityColor(model.qualityScore)}`}>
                          {model.qualityScore}%
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(model)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleArchiveModel(model.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                          title="Archiver"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                        <div className="relative group">
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                            <button
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-lg flex items-center gap-2"
                            >
                              <Zap className="w-4 h-4" />
                              Forcer conversion
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Relancer analyse
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Modifier métadonnées
                            </button>
                            <button
                              onClick={() => handleDeleteModel(model.id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
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
            Affichage {Math.max(0, (currentPage - 1) * itemsPerPage + 1)} à {Math.min(currentPage * itemsPerPage, filteredModels.length)} sur {filteredModels.length} modèles
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
                    ? 'bg-red-600 text-white'
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
      {showDetailsModal && selectedModel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">{selectedModel.name}</h3>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-slate-600 font-medium">Propriétaire</p>
                <p className="text-slate-900">{selectedModel.owner}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Format</p>
                <p className="text-slate-900">{selectedModel.format}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Taille du fichier</p>
                <p className="text-slate-900">{formatFileSize(selectedModel.fileSize)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Date d'import</p>
                <p className="text-slate-900">{new Date(selectedModel.importDate).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Statut</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[selectedModel.status].dotColor}`} />
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_CONFIG[selectedModel.status].color}`}>
                    {STATUS_CONFIG[selectedModel.status].label}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Compatibilité AR</p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${AR_COMPATIBILITY_CONFIG[selectedModel.arCompatibility].color}`}>
                  {AR_COMPATIBILITY_CONFIG[selectedModel.arCompatibility].label}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Score de qualité</p>
                <p className={`text-lg font-bold ${getQualityColor(selectedModel.qualityScore)}`}>
                  {selectedModel.qualityScore > 0 ? `${selectedModel.qualityScore}%` : 'Non évalué'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Modification</p>
                <p className="text-slate-900">{new Date(selectedModel.lastModified).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Polygons</p>
                <p className="text-slate-900">{selectedModel.polygonCount.toLocaleString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Textures</p>
                <p className="text-slate-900">{selectedModel.textureCount}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
