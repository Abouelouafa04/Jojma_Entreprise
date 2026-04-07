import React from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, ArrowLeft, Wrench } from 'lucide-react';

export default function ModelsManagement() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestion des modèles</h1>
            <p className="mt-1 text-sm text-slate-500">Page en construction — fonctionnalités à venir pour gérer vos fichiers 3D, conversions et aperçus AR.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-slate-50 text-sm font-medium border border-slate-100 hover:bg-indigo-50 hover:text-indigo-600">
              <ArrowLeft className="w-4 h-4" /> Retour
            </Link>
            <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-400 px-3 py-2 text-white text-sm font-semibold shadow-md">
              <FilePlus className="w-4 h-4" /> Importer un modèle
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-8 text-center">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center justify-center h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 mb-4">
            <Wrench className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Gestion des modèles — En construction</h2>
          <p className="mt-2 text-sm text-slate-500">Nous travaillons sur une expérience dédiée pour organiser vos modèles 3D, gérer les conversions et visualiser des aperçus AR. Revenez bientôt.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link to="/dashboard/models" className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 bg-slate-50">Recevoir une alerte</Link>
            <Link to="/dashboard/conversions" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm">Voir les conversions</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
