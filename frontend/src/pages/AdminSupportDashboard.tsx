import React, { useState, useEffect } from 'react';
import {
  Headphones, Plus, Search, Filter, MoreVertical, MessageSquare, Check, Clock, AlertCircle,
  ChevronLeft, ChevronRight, Send, User, Zap, Tag, Calendar, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

interface Ticket {
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

interface TicketMessage {
  id: string;
  ticketId: string;
  sender: string;
  senderName: string;
  message: string;
  createdAt: string;
}

const CATEGORY_CONFIG = {
  'account': { label: 'Compte utilisateur', color: 'bg-blue-100 text-blue-800', icon: '👤' },
  'model': { label: 'Modèle 3D', color: 'bg-purple-100 text-purple-800', icon: '📦' },
  'conversion': { label: 'Conversion', color: 'bg-green-100 text-green-800', icon: '🔄' },
  'ar': { label: 'Réalité Augmentée', color: 'bg-pink-100 text-pink-800', icon: '📱' },
  'billing': { label: 'Facturation', color: 'bg-yellow-100 text-yellow-800', icon: '💳' },
  'technical': { label: 'Problème technique', color: 'bg-red-100 text-red-800', icon: '⚙️' },
};

const PRIORITY_CONFIG = {
  'low': { label: 'Faible', color: 'bg-slate-100 text-slate-800', dotColor: 'bg-slate-400', bgColor: 'bg-slate-50' },
  'normal': { label: 'Normal', color: 'bg-blue-100 text-blue-800', dotColor: 'bg-blue-400', bgColor: 'bg-blue-50' },
  'high': { label: 'Haute', color: 'bg-orange-100 text-orange-800', dotColor: 'bg-orange-400', bgColor: 'bg-orange-50' },
  'urgent': { label: 'Urgent', color: 'bg-red-100 text-red-800', dotColor: 'bg-red-400', bgColor: 'bg-red-50' },
};

const STATUS_CONFIG = {
  'open': { label: 'Ouvert', color: 'bg-blue-100 text-blue-800', dotColor: 'bg-blue-400', icon: MessageSquare },
  'assigned': { label: 'Assigné', color: 'bg-purple-100 text-purple-800', dotColor: 'bg-purple-400', icon: ArrowRight },
  'in-progress': { label: 'En cours', color: 'bg-amber-100 text-amber-800', dotColor: 'bg-amber-400', icon: Clock },
  'waiting': { label: 'En attente', color: 'bg-slate-100 text-slate-800', dotColor: 'bg-slate-400', icon: Clock },
  'resolved': { label: 'Résolu', color: 'bg-green-100 text-green-800', dotColor: 'bg-green-400', icon: Check },
  'closed': { label: 'Fermé', color: 'bg-slate-600 text-white', dotColor: 'bg-slate-500', icon: AlertCircle },
};

export default function AdminSupportDashboard() {
  const { t } = useLanguage();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const itemsPerPage = 10;

  // Mock data
  useEffect(() => {
    const mockTickets: Ticket[] = [
      {
        id: '1',
        ticketNumber: 'TKT-2026-001',
        userId: 'user-1',
        userName: 'Jean Dupont',
        userEmail: 'jean.dupont@example.com',
        subject: 'Impossible de télécharger mon modèle FBX',
        description: 'Erreur lors du téléchargement d\'un fichier FBX de 50MB',
        category: 'technical',
        priority: 'high',
        status: 'in-progress',
        createdAt: '2026-04-03',
        updatedAt: '2026-04-05',
        assignedTo: 'agent-1',
        assignedToName: 'Sophie Martin',
        messageCount: 3,
      },
      {
        id: '2',
        ticketNumber: 'TKT-2026-002',
        userId: 'user-2',
        userName: 'Marie Studio',
        userEmail: 'marie@studiodesign.com',
        subject: 'Augmenter limite de stockage',
        description: 'Besoin d\'augmenter mon quota de stockage pour 100GB',
        category: 'billing',
        priority: 'normal',
        status: 'assigned',
        createdAt: '2026-04-04',
        updatedAt: '2026-04-05',
        assignedTo: 'agent-2',
        assignedToName: 'Thomas Dupuis',
        messageCount: 2,
      },
      {
        id: '3',
        ticketNumber: 'TKT-2026-003',
        userId: 'user-3',
        userName: 'Pierre Créateur',
        userEmail: 'pierre.cr@email.com',
        subject: 'Modèle incompatible avec AR',
        description: 'Mon modèle 3D n\'apparaît pas en réalité augmentée',
        category: 'ar',
        priority: 'high',
        status: 'open',
        createdAt: '2026-04-05',
        updatedAt: '2026-04-05',
        messageCount: 0,
      },
      {
        id: '4',
        ticketNumber: 'TKT-2026-004',
        userId: 'user-4',
        userName: 'Sophie Leclerc',
        userEmail: 'sophie.l@company.com',
        subject: 'Conversion GLB en FBX',
        description: 'Comment convertir mon fichier GLB en FBX?',
        category: 'conversion',
        priority: 'normal',
        status: 'resolved',
        createdAt: '2026-03-15',
        updatedAt: '2026-03-20',
        assignedTo: 'agent-1',
        assignedToName: 'Sophie Martin',
        messageCount: 4,
      },
      {
        id: '5',
        ticketNumber: 'TKT-2026-005',
        userId: 'user-5',
        userName: 'Luc Moreau',
        userEmail: 'luc.moreau@example.com',
        subject: 'Problème de connexion',
        description: 'Je n\'arrive plus à me connecter à mon compte',
        category: 'account',
        priority: 'urgent',
        status: 'in-progress',
        createdAt: '2026-04-05',
        updatedAt: '2026-04-05',
        assignedTo: 'agent-3',
        assignedToName: 'Anne Rousseau',
        messageCount: 2,
      },
      {
        id: '6',
        ticketNumber: 'TKT-2026-006',
        userId: 'user-6',
        userName: 'Claire Designs',
        userEmail: 'claire@designs.fr',
        subject: 'Supprimer le compte',
        description: 'Je souhaite supprimer mon compte et toutes mes données',
        category: 'account',
        priority: 'normal',
        status: 'waiting',
        createdAt: '2026-04-02',
        updatedAt: '2026-04-04',
        assignedTo: 'agent-2',
        assignedToName: 'Thomas Dupuis',
        messageCount: 1,
      },
      {
        id: '7',
        ticketNumber: 'TKT-2026-007',
        userId: 'user-7',
        userName: 'Marc Innovation',
        userEmail: 'marc.i@innovation.com',
        subject: 'Nouveau modèle IA pour optimisation',
        description: 'Proposition de nouvelle fonctionnalité IA',
        category: 'technical',
        priority: 'low',
        status: 'open',
        createdAt: '2026-04-01',
        updatedAt: '2026-04-01',
        messageCount: 0,
      },
      {
        id: '8',
        ticketNumber: 'TKT-2026-008',
        userId: 'user-8',
        userName: 'Nathalie Agency',
        userEmail: 'nathalie@agency.com',
        subject: 'Modèle supprimé par erreur',
        description: 'J\'ai supprimé un modèle important par accident',
        category: 'model',
        priority: 'urgent',
        status: 'resolved',
        createdAt: '2026-04-01',
        updatedAt: '2026-04-03',
        assignedTo: 'agent-1',
        assignedToName: 'Sophie Martin',
        messageCount: 5,
      },
      {
        id: '9',
        ticketNumber: 'TKT-2026-009',
        userId: 'user-9',
        userName: 'Victor Créateur',
        userEmail: 'victor.c@example.com',
        subject: 'Performance de conversion lente',
        description: 'Les conversions de modèles prennent trop de temps',
        category: 'conversion',
        priority: 'high',
        status: 'in-progress',
        createdAt: '2026-04-04',
        updatedAt: '2026-04-05',
        assignedTo: 'agent-3',
        assignedToName: 'Anne Rousseau',
        messageCount: 1,
      },
      {
        id: '10',
        ticketNumber: 'TKT-2026-010',
        userId: 'user-10',
        userName: 'Emma Designs',
        userEmail: 'emma@designs.com',
        subject: 'Tarifs et facturation',
        description: 'Questions sur les tarifs de facturation',
        category: 'billing',
        priority: 'low',
        status: 'open',
        createdAt: '2026-04-05',
        updatedAt: '2026-04-05',
        messageCount: 0,
      },
    ];
    setTickets(mockTickets);
  }, []);

  // Calculate stats
  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    assigned: tickets.filter(t => t.status === 'assigned').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    totalTickets: tickets.length,
  };

  // Apply filters
  useEffect(() => {
    let result = [...tickets];

    if (searchTerm) {
      result = result.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      result = result.filter(ticket => ticket.category === categoryFilter);
    }

    if (priorityFilter) {
      result = result.filter(ticket => ticket.priority === priorityFilter);
    }

    if (statusFilter) {
      result = result.filter(ticket => ticket.status === statusFilter);
    }

    // Sorting
    if (sortBy === 'priority-urgent') {
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      result.sort((a, b) => priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    setCurrentPage(1);
    setFilteredTickets(result);
  }, [tickets, searchTerm, categoryFilter, priorityFilter, statusFilter, sortBy]);

  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const handleOpenTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    // Mock messages for demo
    setTicketMessages([
      {
        id: '1',
        ticketId: ticket.id,
        sender: 'user',
        senderName: ticket.userName,
        message: ticket.description,
        createdAt: ticket.createdAt,
      },
      {
        id: '2',
        ticketId: ticket.id,
        sender: 'agent',
        senderName: ticket.assignedToName || 'Support',
        message: 'Merci de contacter le support JOJMA. Nous examinons votre demande.',
        createdAt: new Date(new Date(ticket.createdAt).getTime() + 3600000).toISOString(),
      },
    ]);
    setShowTicketDetail(true);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    const newMessage: TicketMessage = {
      id: (ticketMessages.length + 1).toString(),
      ticketId: selectedTicket.id,
      sender: 'agent',
      senderName: 'Support Agent',
      message: replyMessage,
      createdAt: new Date().toISOString(),
    };

    setTicketMessages([...ticketMessages, newMessage]);
    setReplyMessage('');
  };

  const handleChangeStatus = (ticketId: string, newStatus: string) => {
    setTickets(tickets.map(t =>
      t.id === ticketId
        ? { ...t, status: newStatus as any, updatedAt: new Date().toISOString() }
        : t
    ));
  };

  const handleAssignTicket = (ticketId: string, agentName: string) => {
    setTickets(tickets.map(t =>
      t.id === ticketId
        ? { ...t, assignedTo: 'agent-x', assignedToName: agentName, status: 'assigned', updatedAt: new Date().toISOString() }
        : t
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Support et tickets</h2>
          <p className="text-slate-500 mt-1">
            Suivez les demandes des utilisateurs, priorisez les incidents et assurez un traitement efficace des tickets.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <Plus className="w-5 h-5" />
          Nouveau ticket
        </button>
      </div>

      {/* Ticket Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">Ouverts</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">{stats.open}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-purple-600 text-sm font-medium">Assignés</p>
          <p className="text-3xl font-bold text-purple-700 mt-2">{stats.assigned}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <p className="text-amber-600 text-sm font-medium">En cours</p>
          <p className="text-3xl font-bold text-amber-700 mt-2">{stats.inProgress}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-600 text-sm font-medium">Résolus</p>
          <p className="text-3xl font-bold text-green-700 mt-2">{stats.resolved}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="text-slate-600 text-sm font-medium">Total</p>
          <p className="text-3xl font-bold text-slate-700 mt-2">{stats.totalTickets}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par sujet, numéro de ticket ou utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Toutes les catégories</option>
              <option value="account">Compte utilisateur</option>
              <option value="model">Modèle 3D</option>
              <option value="conversion">Conversion</option>
              <option value="ar">Réalité Augmentée</option>
              <option value="billing">Facturation</option>
              <option value="technical">Problème technique</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Priorité</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Toutes les priorités</option>
              <option value="low">Faible</option>
              <option value="normal">Normal</option>
              <option value="high">Haute</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Tous les statuts</option>
              <option value="open">Ouvert</option>
              <option value="assigned">Assigné</option>
              <option value="in-progress">En cours</option>
              <option value="waiting">En attente</option>
              <option value="resolved">Résolu</option>
              <option value="closed">Fermé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tri</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Défaut</option>
              <option value="priority-urgent">Priorité (Urgent)</option>
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">#</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Utilisateur</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Sujet</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Catégorie</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Priorité</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Créé</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedTickets.map((ticket) => {
                const categoryConfig = CATEGORY_CONFIG[ticket.category];
                const priorityConfig = PRIORITY_CONFIG[ticket.priority];
                const statusConfig = STATUS_CONFIG[ticket.status];
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={ticket.id} className={`hover:bg-slate-50 transition-colors ${priorityConfig.bgColor}`}>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">{ticket.ticketNumber}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{ticket.userName}</p>
                        <p className="text-xs text-slate-500">{ticket.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleOpenTicket(ticket)}
                        className="text-sm font-medium text-slate-900 hover:text-red-600 transition-colors"
                      >
                        {ticket.subject}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryConfig.color}`}>
                        {categoryConfig.icon} {categoryConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${priorityConfig.color}`}>
                        {priorityConfig.label}
                      </span>
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
                      {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenTicket(ticket)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                          title="Ouvrir"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <div className="relative group">
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => handleChangeStatus(ticket.id, 'in-progress')}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-lg"
                            >
                              Marquer en cours
                            </button>
                            <button
                              onClick={() => handleChangeStatus(ticket.id, 'resolved')}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                            >
                              Marquer résolu
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                            >
                              Assigner
                            </button>
                            <button
                              onClick={() => handleChangeStatus(ticket.id, 'closed')}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 last:rounded-b-lg"
                            >
                              Fermer
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
            Affichage {Math.max(0, (currentPage - 1) * itemsPerPage + 1)} à {Math.min(currentPage * itemsPerPage, filteredTickets.length)} sur {filteredTickets.length} tickets
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

      {/* Ticket Detail Modal */}
      {showTicketDetail && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">{selectedTicket.ticketNumber}</h3>
              <button
                onClick={() => {
                  setShowTicketDetail(false);
                  setShowReplyForm(false);
                  setReplyMessage('');
                }}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Ticket Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
              <div>
                <p className="text-sm text-slate-600 font-medium">Utilisateur</p>
                <p className="text-slate-900">{selectedTicket.userName}</p>
                <p className="text-xs text-slate-500">{selectedTicket.userEmail}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Assigné à</p>
                <p className="text-slate-900">{selectedTicket.assignedToName || 'Non assigné'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Catégorie</p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${CATEGORY_CONFIG[selectedTicket.category].color}`}>
                  {CATEGORY_CONFIG[selectedTicket.category].label}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Priorité</p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${PRIORITY_CONFIG[selectedTicket.priority].color}`}>
                  {PRIORITY_CONFIG[selectedTicket.priority].label}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Statut</p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_CONFIG[selectedTicket.status].color}`}>
                  {STATUS_CONFIG[selectedTicket.status].label}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Date création</p>
                <p className="text-slate-900">{new Date(selectedTicket.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            {/* Subject */}
            <div className="mb-6 pb-6 border-b">
              <h4 className="font-semibold text-slate-900 mb-2">{selectedTicket.subject}</h4>
              <p className="text-slate-600 text-sm">{selectedTicket.description}</p>
            </div>

            {/* Messages */}
            <div className="mb-6 space-y-4 bg-slate-50 p-4 rounded-lg max-h-60 overflow-y-auto">
              {ticketMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'agent'
                      ? 'bg-red-100 text-slate-900'
                      : 'bg-white border border-slate-200 text-slate-900'
                  }`}>
                    <p className="text-xs font-semibold text-slate-600 mb-1">{msg.senderName}</p>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Form */}
            <div className="space-y-3">
              <textarea
                placeholder="Votre réponse..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSendReply}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Envoyer
                </button>
                <button
                  onClick={() => handleChangeStatus(selectedTicket.id, 'resolved')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Marquer résolu
                </button>
                <button
                  onClick={() => {
                    setShowTicketDetail(false);
                    setReplyMessage('');
                  }}
                  className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors"
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
