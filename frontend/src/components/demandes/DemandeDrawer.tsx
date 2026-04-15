import React, { useState } from 'react';
import { Demande, DemandeLog } from '../../api/demandes.api';
import demandesApi from '../../api/demandes.api';

function getStatusClasses(s?: string) {
  const status = String(s || '').toLowerCase();
  switch (status) {
    case 'nouveau': return 'bg-blue-50 text-blue-700';
    case 'lu': return 'bg-slate-50 text-slate-700';
    case 'en_cours': case 'encours': case 'en cours': return 'bg-amber-50 text-amber-800';
    case 'en_attente': case 'en attente': return 'bg-amber-100 text-amber-800';
    case 'traite': return 'bg-emerald-50 text-emerald-700';
    case 'archive': return 'bg-slate-100 text-slate-700';
    case 'rejete': case 'rejeté': return 'bg-red-50 text-red-700';
    default: return 'bg-slate-50 text-slate-700';
  }
}

function getPriorityClasses(p?: string) {
  const pr = String(p || '').toLowerCase();
  switch (pr) {
    case 'basse': return 'bg-slate-100 text-slate-700';
    case 'normale': return 'bg-blue-50 text-blue-700';
    case 'haute': return 'bg-amber-50 text-amber-800';
    case 'urgente': return 'bg-red-50 text-red-700';
    default: return 'bg-slate-50 text-slate-700';
  }
}

interface Props {
  open: boolean;
  demande: Demande | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export default function DemandeDrawer({ open, demande, onClose, onUpdated }: Props) {
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  if (!open || !demande) return null;

  async function submitNote() {
    if (!note) return;
    setSaving(true);
    try {
      await demandesApi.addNote(demande.id, note);
      setNote('');
      onUpdated && onUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(statut: string) {
    setSaving(true);
    try {
      await demandesApi.updateDemande(demande.id, { statut });
      onUpdated && onUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1" onClick={onClose} />
      <div className="w-96 bg-white h-full shadow-xl p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Demande #{demande.id}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`${getStatusClasses(demande.statut)} px-2 py-0.5 rounded text-xs font-semibold`}>{demande.statut}</span>
              <span className={`${getPriorityClasses(demande.priorite)} px-2 py-0.5 rounded text-xs font-semibold`}>{demande.priorite}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-600">Fermer</button>
        </div>

        <div className="space-y-2 mb-4">
          <div><strong>Nom:</strong> {demande.prenom} {demande.nom}</div>
          <div><strong>Email:</strong> {demande.email}</div>
          <div><strong>Téléphone:</strong> {demande.telephone}</div>
          <div><strong>Type:</strong> {demande.type_demande}</div>
          <div><strong>Sujet:</strong> {demande.sujet}</div>
          <div><strong>Message:</strong>
            <div className="mt-2 p-2 bg-slate-50 rounded border">{demande.message}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <button onClick={() => changeStatus('LU')} className="px-3 py-1 border rounded">Marquer lu</button>
            <button onClick={() => changeStatus('EN_COURS')} className="px-3 py-1 border rounded">En cours</button>
            <button onClick={() => changeStatus('TRAITE')} className="px-3 py-1 border rounded">Traité</button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-slate-600">Notes internes</label>
          <textarea className="w-full border rounded p-2 mt-1" rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="flex justify-end mt-2">
            <button onClick={submitNote} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">Ajouter note</button>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Historique</h4>
          {/* Les logs sont récupérés depuis l'API parent (le hook). Si la demande inclut logs, on les affiche */}
          {((demande as any).logs || []).map((l: DemandeLog) => (
            <div key={l.id} className="mb-2 p-2 bg-slate-50 rounded border">
              <div className="text-xs text-slate-500">{new Date(l.created_at).toLocaleString()} — {l.action_type}</div>
              <div className="text-sm">{l.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
