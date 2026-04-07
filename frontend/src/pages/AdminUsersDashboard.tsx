import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, ChevronDown, Lock, Unlock, Trash2, Edit2, 
  Filter, MoreVertical, Shield, User, Headphones, Settings as SettingsIcon,
  ChevronUp, ChevronLeft, ChevronRight, AlertCircle, Check
} from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';
import {
  getAllUsers,
  changeUserRole,
  toggleUserStatus,
  deleteUser,
  resetUserPassword,
} from '../api/users.api';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  role: 'admin' | 'user' | 'support' | 'gestionnaire-technique';
  accountStatus: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

const ROLE_CONFIG = {
  'admin': { label: 'Admin', color: 'bg-red-100 text-red-800', icon: Shield },
  'user': { label: 'Utilisateur', color: 'bg-blue-100 text-blue-800', icon: User },
  'support': { label: 'Support', color: 'bg-purple-100 text-purple-800', icon: Headphones },
  'gestionnaire-technique': { label: 'Gestionnaire technique', color: 'bg-green-100 text-green-800', icon: SettingsIcon },
};

const STATUS_CONFIG = {
  'active': { label: 'Actif', color: 'bg-emerald-100 text-emerald-800', dotColor: 'bg-emerald-400' },
  'inactive': { label: 'Inactif', color: 'bg-slate-100 text-slate-800', dotColor: 'bg-slate-400' },
  'suspended': { label: 'Suspendu', color: 'bg-red-100 text-red-800', dotColor: 'bg-red-400' },
};

export default function AdminUsersDashboard() {
  const { language, setLanguage, t } = useLanguage();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [activityFilter, setActivityFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const itemsPerPage = 10;

  // Mock data for demo
  useEffect(() => {
    const mockUsers: UserData[] = [
      {
        id: '1',
        fullName: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        company: 'Dupont & Co',
        role: 'admin',
        accountStatus: 'active',
        createdAt: '2025-01-15',
        lastLogin: '2025-04-05',
      },
      {
        id: '2',
        fullName: 'Marie Martin',
        email: 'marie.martin@example.com',
        company: 'Martin Studio',
        role: 'user',
        accountStatus: 'active',
        createdAt: '2025-02-20',
        lastLogin: '2025-04-04',
      },
      {
        id: '3',
        fullName: 'Pierre Bernard',
        email: 'pierre.bernard@example.com',
        company: 'Tech Solutions',
        role: 'gestionnaire-technique',
        accountStatus: 'active',
        createdAt: '2025-03-10',
        lastLogin: '2025-04-03',
      },
      {
        id: '4',
        fullName: 'Sophie Leclerc',
        email: 'sophie.leclerc@example.com',
        company: 'Support Center',
        role: 'support',
        accountStatus: 'active',
        createdAt: '2025-01-05',
        lastLogin: '2025-04-02',
      },
      {
        id: '5',
        fullName: 'Luc Moreau',
        email: 'luc.moreau@example.com',
        company: 'Moreau Creative',
        role: 'user',
        accountStatus: 'inactive',
        createdAt: '2025-02-01',
        lastLogin: '2025-03-15',
      },
      {
        id: '6',
        fullName: 'Claire Rousseau',
        email: 'claire.rousseau@example.com',
        company: 'Design Pro',
        role: 'user',
        accountStatus: 'suspended',
        createdAt: '2025-03-05',
        lastLogin: '2025-03-20',
      },
      {
        id: '7',
        fullName: 'Marc Fontaine',
        email: 'marc.fontaine@example.com',
        company: 'Innovation Hub',
        role: 'gestionnaire-technique',
        accountStatus: 'active',
        createdAt: '2025-01-20',
        lastLogin: '2025-04-05',
      },
      {
        id: '8',
        fullName: 'Nathalie Robert',
        email: 'nathalie.robert@example.com',
        company: 'Robert Agency',
        role: 'user',
        accountStatus: 'active',
        createdAt: '2025-02-14',
        lastLogin: '2025-04-01',
      },
    ];
    setUsers(mockUsers);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...users];

    // Search filter
    if (searchTerm) {
      result = result.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter) {
      result = result.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter) {
      result = result.filter(user => user.accountStatus === statusFilter);
    }

    // Date filter
    if (dateFilter === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      result = result.filter(user => new Date(user.createdAt) > thirtyDaysAgo);
    } else if (dateFilter === 'old') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      result = result.filter(user => new Date(user.createdAt) < sixMonthsAgo);
    }

    // Activity filter
    if (activityFilter === 'active') {
      result = result.filter(user => user.lastLogin && 
        new Date(user.lastLogin).getTime() > new Date().getTime() - (7 * 24 * 60 * 60 * 1000));
    } else if (activityFilter === 'inactive') {
      result = result.filter(user => !user.lastLogin || 
        new Date(user.lastLogin).getTime() < new Date().getTime() - (30 * 24 * 60 * 60 * 1000));
    }

    // Sorting
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.fullName.localeCompare(a.fullName));
    } else if (sortBy === 'date-new') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'date-old') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    setCurrentPage(1);
    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter, dateFilter, activityFilter, sortBy]);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowCreateModal(true);
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, accountStatus: user.accountStatus === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleChangeUserRole = (userId: string, newRole: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, role: newRole as any }
        : user
    ));
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Gestion des utilisateurs</h2>
          <p className="text-slate-500 mt-1">
            Administrez les comptes utilisateurs, contrôlez les rôles et les autorisations, et assurez une gestion sécurisée des accès à la plateforme JOJMA.
          </p>
        </div>
        <button
          onClick={handleCreateUser}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Créer un compte
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Total utilisateurs</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Actifs</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {users.filter(u => u.accountStatus === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Inactifs</p>
          <p className="text-2xl font-bold text-slate-500 mt-1">
            {users.filter(u => u.accountStatus === 'inactive').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Suspendus</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {users.filter(u => u.accountStatus === 'suspended').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou entreprise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Rôle</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Tous les rôles</option>
              <option value="admin">Admin</option>
              <option value="user">Utilisateur</option>
              <option value="support">Support</option>
              <option value="gestionnaire-technique">Gestionnaire technique</option>
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
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="suspended">Suspendu</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Inscription</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Toutes les dates</option>
              <option value="recent">30 derniers jours</option>
              <option value="old">Plus de 6 mois</option>
            </select>
          </div>

          {/* Activity Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Activité</label>
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Toutes les activités</option>
              <option value="active">Actif cette semaine</option>
              <option value="inactive">Inactif depuis 30j</option>
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
              <option value="date-new">Plus récent</option>
              <option value="date-old">Plus ancien</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchTerm || roleFilter || statusFilter || dateFilter || activityFilter || sortBy) && (
          <div className="flex flex-wrap gap-2 pt-2">
            {searchTerm && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm inline-flex items-center gap-2">
                {searchTerm}
                <button onClick={() => setSearchTerm('')} className="hover:text-red-600">×</button>
              </span>
            )}
            {roleFilter && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm inline-flex items-center gap-2">
                Rôle: {roleFilter}
                <button onClick={() => setRoleFilter('')} className="hover:text-red-600">×</button>
              </span>
            )}
            {statusFilter && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm inline-flex items-center gap-2">
                Statut: {statusFilter}
                <button onClick={() => setStatusFilter('')} className="hover:text-red-600">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Nom complet</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Entreprise</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Rôle</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Inscription</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Dernière connexion</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedUsers.map((user) => {
                const roleConfig = ROLE_CONFIG[user.role];
                const statusConfig = STATUS_CONFIG[user.accountStatus];
                const RoleIcon = roleConfig.icon;

                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">{user.fullName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.company || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 ${roleConfig.color} rounded-full flex items-center justify-center`}>
                          <RoleIcon className="w-4 h-4" />
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${roleConfig.color}`}>
                          {roleConfig.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`} />
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.accountStatus === 'active'
                              ? 'hover:bg-red-100 text-red-600'
                              : 'hover:bg-green-100 text-green-600'
                          }`}
                          title={user.accountStatus === 'active' ? 'Désactiver' : 'Activer'}
                        >
                          {user.accountStatus === 'active' ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <Unlock className="w-4 h-4" />
                          )}
                        </button>
                        <div className="relative group">
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => {
                                const newRole = prompt('Nouveau rôle (admin/user/support/gestionnaire-technique):', user.role);
                                if (newRole && ['admin', 'user', 'support', 'gestionnaire-technique'].includes(newRole)) {
                                  handleChangeUserRole(user.id, newRole);
                                }
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-lg"
                            >
                              Changer rôle
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg"
                            >
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
            Affichage {Math.max(0, (currentPage - 1) * itemsPerPage + 1)} à {Math.min(currentPage * itemsPerPage, filteredUsers.length)} sur {filteredUsers.length} utilisateurs
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

      {/* Create/Edit Modal (simplified for now) */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {showCreateModal ? 'Créer un novo conta' : 'Modifier l\'utilisateur'}
            </h3>
            <p className="text-slate-600 mb-6">Formulaire de gestion utilisateurs (Intégration API backend requis)</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
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
