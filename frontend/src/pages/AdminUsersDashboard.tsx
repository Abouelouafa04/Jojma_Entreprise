import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, ChevronDown, Lock, Unlock, Trash2, Edit2, 
  Filter, MoreVertical, Shield, User, Headphones, Settings as SettingsIcon,
  ChevronUp, ChevronLeft, ChevronRight, AlertCircle, Check
} from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
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
  const { logout } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [formFullName, setFormFullName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserData['role']>('user');
  const [formAccountStatus, setFormAccountStatus] = useState<UserData['accountStatus']>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastActionResult, setLastActionResult] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [activityFilter, setActivityFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const itemsPerPage = 10;
  const [limit] = useState(itemsPerPage);


  // Fetch users from backend
  const fetchUsers = async (page = currentPage) => {
    setLoading(true);
    try {
      const res: any = await getAllUsers(page, limit, {
        role: roleFilter || undefined,
        status: statusFilter || undefined,
        search: searchTerm || undefined,
        sortBy: sortBy || undefined,
      });

      const usersData = res?.data?.users || [];
      const pagination = res?.data?.pagination || { page: 1, limit, total: usersData.length, totalPages: 1 };
      setUsers(usersData.map((u: any) => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        company: u.company || '',
        role: u.role,
        accountStatus: u.accountStatus || 'active',
        createdAt: u.createdAt,
      })));
      setTotalUsers(pagination.total || usersData.length);
      setCurrentPage(pagination.page || 1);
    } catch (err) {
      console.error('Failed to fetch users', err);
      const e: any = err;
      const status = e?.response?.status;
      const code = e?.response?.data?.code;
      const detail = e?.response?.data?.message || e?.response?.data?.detail || e?.message || 'Échec du chargement des utilisateurs.';

      if (status === 401 && (code === 'USER_NOT_FOUND' || /n['’]existe plus/i.test(String(detail)))) {
        try {
          await logout();
        } catch (logoutErr) {
          console.warn('Logout failed', logoutErr);
        }
        try { alert("Votre session n'est plus valide : l'utilisateur lié au token n'existe plus. Vous allez être redirigé vers la page de connexion."); } catch(e) {}
        window.location.href = '/login';
        return;
      }

      alert(`Échec du chargement des utilisateurs: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount & when filters change
  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, statusFilter, sortBy]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      fetchUsers(1);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

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
  const totalPages = Math.max(1, Math.ceil(totalUsers / limit));

  // When current page changes, fetch that page from backend
  useEffect(() => {
    fetchUsers(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setFormFullName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('user');
    setFormAccountStatus('active');
    setShowCreateModal(true);
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setFormFullName(user.fullName);
    setFormEmail(user.email);
    setFormPassword('');
    setFormRole(user.role);
    setFormAccountStatus(user.accountStatus);
    setShowEditModal(true);
  };

  const handleToggleUserStatus = (userId: string) => {
    (async () => {
      try {
        const u = users.find(u => u.id === userId);
        if (!u) return;
        const newStatus = u.accountStatus === 'active' ? 'inactive' : 'active';
        await toggleUserStatus(userId, newStatus as any);
        setLastActionResult(`Statut modifié: ${userId} → ${newStatus}`);
        fetchUsers(currentPage);
      } catch (err) {
        console.error('Toggle status failed', err);
        const e: any = err;
        const detail = e?.response?.data?.message || e?.response?.data?.detail || e?.message || 'Échec de la modification du statut.';
        setLastActionResult(`Échec toggle status: ${detail}`);
        alert(`Échec de la modification du statut utilisateur: ${detail}`);
      }
    })();
  };

  const handleChangeUserRole = (userId: string, newRole: string) => {
    (async () => {
      try {
        await changeUserRole(userId, newRole as any);
        setLastActionResult(`Rôle modifié: ${userId} → ${newRole}`);
        fetchUsers(currentPage);
      } catch (err) {
        console.error('Change role failed', err);
        const e: any = err;
        const detail = e?.response?.data?.message || e?.response?.data?.detail || e?.message || 'Échec du changement de rôle.';
        setLastActionResult(`Échec change role: ${detail}`);
        alert(`Échec du changement de rôle: ${detail}`);
      }
    })();
  };

  const handleDeleteUser = (userId: string) => {
    (async () => {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
      try {
        await deleteUser(userId);
        setLastActionResult(`Utilisateur supprimé: ${userId}`);
        fetchUsers(Math.max(1, currentPage));
      } catch (err) {
        console.error('Delete user failed', err);
        const e: any = err;
        const detail = e?.response?.data?.message || e?.response?.data?.detail || e?.message || 'Échec de la suppression.';
        setLastActionResult(`Échec suppression: ${detail}`);
        alert(`Échec de la suppression utilisateur: ${detail}`);
      }
    })();
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
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalUsers}</p>
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
            Affichage {Math.max(0, (currentPage - 1) * limit + 1)} à {Math.min(currentPage * limit, totalUsers)} sur {totalUsers} utilisateurs
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

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (isSubmitting) return;
              setIsSubmitting(true);
              setFormError('');
              try {
                if (showCreateModal) {
                  if (!formPassword || formPassword.length < 6) {
                    setFormError('Le mot de passe doit contenir au moins 6 caractères');
                    setIsSubmitting(false);
                    return;
                  }
                  await createUser({ fullName: formFullName, email: formEmail, password: formPassword, role: formRole });
                  alert('Utilisateur créé avec succès');
                  setShowCreateModal(false);
                  setSelectedUser(null);
                  fetchUsers(1);
                } else if (selectedUser) {
                  // Prepare patch for fields backend expects (name/email).
                  const patch: any = {};
                  if (formFullName !== selectedUser.fullName) patch.fullName = formFullName;
                  if (formEmail !== selectedUser.email) patch.email = formEmail;

                  // Only call updateUser if there is something to update there
                  if (Object.keys(patch).length > 0) {
                    await updateUser(selectedUser.id, patch);
                  }

                  // If role changed, call dedicated endpoint
                  if (formRole !== selectedUser.role) {
                    await changeUserRole(selectedUser.id, formRole as any);
                  }

                  // If account status changed, call dedicated endpoint
                  if (formAccountStatus !== selectedUser.accountStatus) {
                    await toggleUserStatus(selectedUser.id, formAccountStatus as any);
                  }

                  alert('Utilisateur mis à jour');
                  setShowEditModal(false);
                  setSelectedUser(null);
                  fetchUsers(currentPage);
                }
              } catch (err) {
                console.error('Save user failed', err);
                const e: any = err;
                const detail = e?.response?.data?.message || e?.response?.data?.detail || e?.message || 'Échec lors de l\'enregistrement utilisateur';
                setFormError(String(detail));
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {showCreateModal ? 'Créer un compte' : 'Modifier l\'utilisateur'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Nom complet</label>
                <input
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Email</label>
                <input
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  type="email"
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              {showCreateModal && (
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Mot de passe</label>
                  <input
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    type="password"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-slate-700 mb-1">Rôle</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as any)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Admin</option>
                  <option value="support">Support</option>
                  <option value="gestionnaire-technique">Gestionnaire technique</option>
                </select>
              </div>

              {!showCreateModal && (
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Statut du compte</label>
                  <select
                    value={formAccountStatus}
                      onChange={(e) => setFormAccountStatus(e.target.value as any)}
                      disabled={isSubmitting}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="suspended">Suspendu</option>
                  </select>
                </div>
              )}
            </div>

              {formError && (
                <div className="text-sm text-red-600 mb-3">{formError}</div>
              )}

              <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${isSubmitting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                  disabled={isSubmitting}
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Dev action result (visible on localhost only) */}
      {window.location.hostname === 'localhost' && (
        <div className="fixed bottom-4 right-4 bg-white border p-3 rounded shadow-md text-sm z-50 w-80">
          <div className="font-semibold text-slate-700 mb-1">Dernière action</div>
          <div className="text-slate-600">{lastActionResult || 'Aucune'}</div>
        </div>
      )}
    </div>
  );
}
