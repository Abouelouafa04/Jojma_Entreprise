import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, Phone, Calendar, ChevronRight, MessageSquare, CheckCircle, Clock } from 'lucide-react';

interface ContactRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  requestNumber: string;
  status: 'pending' | 'read' | 'responded';
  createdAt: string;
}

interface ContactResponse {
  id: string;
  adminName: string;
  response: string;
  createdAt: string;
}

export default function AdminContactDashboard() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [responses, setResponses] = useState<ContactResponse[]>([]);
  const [responseText, setResponseText] = useState('');
  const [adminName, setAdminName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' as 'success' | 'error' });

  const apiBaseUrl = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000/api`;

  // Charger les demandes
  useEffect(() => {
    fetchRequests();
  }, []);

  // Charger les réponses quand une demande est sélectionnée
  useEffect(() => {
    if (selectedRequest) {
      fetchResponses(selectedRequest.id);
    }
  }, [selectedRequest]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/contact/list?page=1&limit=50`);
      const data = await response.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
      setMessage({ text: 'Erreur lors du chargement des demandes.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResponses = async (requestId: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/contact/${requestId}/responses`);
      const data = await response.json();
      if (data.success && data.data) {
        setResponses(data.data.responses || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réponses:', error);
    }
  };

  const handleSendResponse = async () => {
    if (!selectedRequest || !responseText.trim() || !adminName.trim()) {
      setMessage({ text: 'Veuillez remplir tous les champs.', type: 'error' });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/contact/${selectedRequest.id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminName: adminName.trim(),
          response: responseText.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessage({ text: 'Réponse envoyée avec succès au client !', type: 'success' });
        setResponseText('');
        
        // Rechargez les données
        await fetchRequests();
        await fetchResponses(selectedRequest.id);
        
        // Mettre à jour la demande sélectionnée
        if (selectedRequest) {
          setSelectedRequest({ ...selectedRequest, status: 'responded' });
        }

        // Masquer le message après 3 secondes
        setTimeout(() => {
          setMessage({ text: '', type: 'success' });
        }, 3000);
      } else {
        setMessage({ text: data.message || 'Erreur lors de l\'envoi.', type: 'error' });
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      setMessage({ text: 'Erreur réseau lors de l\'envoi.', type: 'error' });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 flex items-center gap-1">
            <Clock className="w-3 h-3" /> En attente
          </span>
        );
      case 'read':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            Lue
          </span>
        );
      case 'responded':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Répondue
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Tableau de Bord <span className="text-blue-400">Demandes de Contact</span>
          </h1>
          <p className="text-blue-100/70">Gérez et répondez aux demandes des clients</p>
        </motion.div>

        {/* Message de statut */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-500/20 border border-green-500/50 text-green-200'
                : 'bg-red-500/20 border border-red-500/50 text-red-200'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des demandes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-[#1a2f61]/80 border border-indigo-400/20 rounded-lg p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              Demandes ({requests.length})
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {requests.map((request) => (
                  <motion.button
                    key={request.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedRequest(request)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedRequest?.id === request.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-[#162a62] text-indigo-100 hover:bg-[#1a3575]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm truncate">
                        {request.firstName} {request.lastName}
                      </p>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    <p className="text-xs opacity-80 truncate">{request.email}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-300">{request.requestNumber}</span>
                      {getStatusBadge(request.status)}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Détails et formulaire de réponse */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-[#1a2f61]/80 border border-indigo-400/20 rounded-lg p-6"
          >
            {selectedRequest ? (
              <>
                {/* Détails de la demande */}
                <div className="mb-6 pb-6 border-b border-indigo-400/30">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {selectedRequest.firstName} {selectedRequest.lastName}
                  </h2>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-indigo-200/60">Email</p>
                      <p className="text-white font-semibold">{selectedRequest.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-indigo-200/60">Téléphone</p>
                      <p className="text-white font-semibold">{selectedRequest.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-indigo-200/60">Numéro de demande</p>
                      <p className="text-white font-mono font-bold">{selectedRequest.requestNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-indigo-200/60">Statut</p>
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-indigo-200/60 mb-2">Date de soumission</p>
                    <p className="text-gray-300 text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedRequest.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Message du client */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    Message du client
                  </h3>
                  <div className="bg-[#0f204a]/50 p-4 rounded-lg border border-indigo-400/10">
                    <p className="text-indigo-100 leading-relaxed whitespace-pre-wrap">
                      {selectedRequest.message}
                    </p>
                  </div>
                </div>

                {/* Réponses précédentes */}
                {responses.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Réponses précédentes ({responses.length})
                    </h3>
                    <div className="space-y-3">
                      {responses.map((resp) => (
                        <div key={resp.id} className="bg-[#0f204a]/50 p-4 rounded-lg border border-green-400/20">
                          <p className="text-sm text-green-300 mb-2">
                            Par {resp.adminName} • {new Date(resp.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-indigo-100 leading-relaxed whitespace-pre-wrap">
                            {resp.response}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formulaire de réponse */}
                <div className="border-t border-indigo-400/30 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Envoyer une réponse</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-indigo-200 mb-2 block">Votre nom / Signature</label>
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        placeholder="ex: Jean Dupont - Support"
                        className="w-full px-4 py-2 bg-[#0f204a]/50 border border-indigo-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-indigo-200 mb-2 block">Votre réponse</label>
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Répondez à la demande du client..."
                        rows={5}
                        className="w-full px-4 py-2 bg-[#0f204a]/50 border border-indigo-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSendResponse}
                      disabled={isSending}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Envoyer la réponse par email
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-96 text-center">
                <div>
                  <MessageSquare className="w-16 h-16 text-indigo-400/50 mx-auto mb-4" />
                  <p className="text-indigo-200/70">Sélectionnez une demande pour voir les détails</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
