import React from 'react';
import { Demande } from '../../api/demandes.api';

function getStatusClasses(s?: string) {
  const status = String(s || '').toLowerCase();
  switch (status) {
    case 'nouveau':
    case 'new':
      return 'bg-blue-50 text-blue-700';
    case 'lu':
      return 'bg-slate-50 text-slate-700';
    case 'en_cours':
    case 'encours':
    case 'en cours':
      return 'bg-amber-50 text-amber-800';
    case 'en_attente':
    case 'en attente':
      return 'bg-amber-100 text-amber-800';
    case 'traite':
    case 'traite':
      return 'bg-emerald-50 text-emerald-700';
    case 'archive':
      return 'bg-slate-100 text-slate-700';
    case 'rejete':
    case 'rejeté':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-slate-50 text-slate-700';
  }
}

function getPriorityClasses(p?: string) {
  const pr = String(p || '').toLowerCase();
  switch (pr) {
    case 'basse':
      return 'bg-slate-100 text-slate-700';
    case 'normale':
      return 'bg-blue-50 text-blue-700';
    case 'haute':
      return 'bg-amber-50 text-amber-800';
    case 'urgente':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-slate-50 text-slate-700';
  }
}

interface Props {
  data: Demande[];
  meta: { total: number; page: number; perPage: number };
  loading?: boolean;
  onView: (d: Demande) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onPageChange?: (page: number) => void;
}

export default function DemandesTable({ data, meta, loading, onView, onArchive, onDelete, onPageChange }: Props) {
  return (
    <div className="bg-white rounded shadow-sm border overflow-x-auto">
      <table className="min-w-full divide-y table-auto">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left text-sm text-slate-600">ID</th>
            <th className="px-3 py-2 text-left text-sm text-slate-600">Type</th>
            <th className="px-3 py-2 text-left text-sm text-slate-600">Nom</th>
            <th className="px-3 py-2 text-left text-sm text-slate-600">Email</th>
            <th className="px-3 py-2 text-left text-sm text-slate-600">Téléphone</th>
            <th className="px-3 py-2 text-left text-sm text-slate-600">Sujet</th>
            <th className="px-3 py-2 text-left text-sm text-slate-600">Statut</th>
            <th className="px-3 py-2 text-left text-sm text-slate-600">Priorité</th>
            <th className="px-3 py-2 text-left text-sm text-slate-600">Créé</th>
            <th className="px-3 py-2 text-left text-sm text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {loading ? (
            <tr><td colSpan={10} className="p-4">Chargement...</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={10} className="p-4">Aucune demande.</td></tr>
          ) : (
            data.map((d) => (
              <tr key={d.id}>
                <td className="px-3 py-2 text-sm">{d.id}</td>
                <td className="px-3 py-2 text-sm">{d.type_demande}</td>
                <td className="px-3 py-2 text-sm">{d.prenom} {d.nom}</td>
                <td className="px-3 py-2 text-sm">{d.email}</td>
                <td className="px-3 py-2 text-sm">{d.telephone}</td>
                <td className="px-3 py-2 text-sm">{d.sujet}</td>
                <td className="px-3 py-2 text-sm">
                  <span className={`${getStatusClasses(d.statut)} px-2 py-1 rounded text-xs font-semibold`}>{d.statut}</span>
                </td>
                <td className="px-3 py-2 text-sm">
                  <span className={`${getPriorityClasses(d.priorite)} px-2 py-1 rounded text-xs font-semibold`}>{d.priorite}</span>
                </td>
                <td className="px-3 py-2 text-sm">{new Date(d.created_at).toLocaleString()}</td>
                <td className="px-3 py-2 text-sm">
                  <div className="flex gap-2">
                    <button onClick={() => onView(d)} className="text-blue-600">Voir</button>
                    <button onClick={() => onArchive(d.id)} className="text-amber-600">Archiver</button>
                    <button onClick={() => onDelete(d.id)} className="text-red-600">Suppr</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="p-3 flex items-center justify-between">
        <div className="text-sm text-slate-600">{meta.total} résultats</div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange && onPageChange(Math.max(1, meta.page - 1))}
            className="px-3 py-1 border rounded"
          >Préc</button>
          <div className="px-3 py-1 border rounded">{meta.page}</div>
          <button
            onClick={() => onPageChange && onPageChange(meta.page + 1)}
            className="px-3 py-1 border rounded"
          >Suiv</button>
        </div>
      </div>
    </div>
  );
}
