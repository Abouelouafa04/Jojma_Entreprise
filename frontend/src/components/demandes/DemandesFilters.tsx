import React, { useState } from 'react';

interface Props {
  filters: Record<string, any>;
  setFilters: (f: Record<string, any>) => void;
}

export default function DemandesFilters({ filters, setFilters }: Props) {
  const [local, setLocal] = useState(filters || {});

  function apply() {
    setFilters({ ...local, page: 1 });
  }

  function clear() {
    const base = { page: 1, perPage: 25 };
    setLocal(base);
    setFilters(base);
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm mb-4 border">
      <div className="flex flex-col md:flex-row gap-2 md:items-end">
        <div className="flex-1">
          <label className="block text-sm text-slate-600">Recherche</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1 mt-1"
            placeholder="Nom, email, téléphone, entreprise, contenu..."
            value={local.q || ''}
            onChange={(e) => setLocal({ ...local, q: e.target.value })}
          />
        </div>

        <div className="w-40">
          <label className="block text-sm text-slate-600">Type</label>
          <select
            className="w-full border rounded px-2 py-1 mt-1"
            value={local.type_demande || ''}
            onChange={(e) => setLocal({ ...local, type_demande: e.target.value || undefined })}
          >
            <option value="">Tous</option>
            <option value="projet_3d">Projet 3D</option>
            <option value="contact">Contact</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div className="w-40">
          <label className="block text-sm text-slate-600">Statut</label>
          <select
            className="w-full border rounded px-2 py-1 mt-1"
            value={local.statut || ''}
            onChange={(e) => setLocal({ ...local, statut: e.target.value || undefined })}
          >
            <option value="">Tous</option>
            <option value="nouveau">Nouveau</option>
            <option value="lu">Lu</option>
            <option value="en_cours">En cours</option>
            <option value="en_attente">En attente</option>
            <option value="traite">Traité</option>
            <option value="archive">Archivé</option>
            <option value="rejete">Rejeté</option>
          </select>
        </div>

        <div className="w-40">
          <label className="block text-sm text-slate-600">Priorité</label>
          <select
            className="w-full border rounded px-2 py-1 mt-1"
            value={local.priorite || ''}
            onChange={(e) => setLocal({ ...local, priorite: e.target.value || undefined })}
          >
            <option value="">Toutes</option>
            <option value="basse">Basse</option>
            <option value="normale">Normale</option>
            <option value="haute">Haute</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button onClick={apply} className="bg-blue-600 text-white px-4 py-2 rounded">Appliquer</button>
          <button onClick={clear} className="border px-4 py-2 rounded">Effacer</button>
        </div>
      </div>
    </div>
  );
}
