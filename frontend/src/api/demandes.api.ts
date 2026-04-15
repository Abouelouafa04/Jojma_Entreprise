import { axiosInstance } from './api';

export interface Demande {
  id: string;
  type_demande: string;
  source_formulaire?: string | null;
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  telephone?: string | null;
  entreprise?: string | null;
  domaine_activite?: string | null;
  sujet?: string | null;
  message?: string | null;
  statut: string;
  priorite: string;
  est_lu: boolean;
  assigne_a?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  archived_at?: string | null;
}

export interface DemandeLog {
  id: string;
  demande_id: string;
  admin_id?: string | null;
  action_type: string;
  description?: string | null;
  meta?: any;
  created_at: string;
}

const demandesApi = {
  submitDemande: async (payload: any) => {
    const res = await axiosInstance.post('/demandes/submit', payload);
    return res.data;
  },

  getStats: async () => {
    const res = await axiosInstance.get('/admin/demandes/stats');
    return res.data;
  },

  getDemandes: async (filters: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters || {}).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return;
      params.append(k, String(v));
    });
    const res = await axiosInstance.get(`/admin/demandes?${params.toString()}`);
    return res.data; // { data: Demande[], meta: { total, page, perPage } }
  },

  getDemandeById: async (id: string) => {
    const res = await axiosInstance.get(`/admin/demandes/${id}`);
    return res.data;
  },

  updateDemande: async (id: string, payload: any) => {
    const res = await axiosInstance.patch(`/admin/demandes/${id}`, payload);
    return res.data;
  },

  addNote: async (id: string, note: string) => {
    const res = await axiosInstance.post(`/admin/demandes/${id}/notes`, { note });
    return res.data;
  },

  archiveDemande: async (id: string) => {
    const res = await axiosInstance.post(`/admin/demandes/${id}/archive`);
    return res.data;
  },

  deleteDemande: async (id: string) => {
    const res = await axiosInstance.delete(`/admin/demandes/${id}`);
    return res.data;
  }
};

export default demandesApi;
