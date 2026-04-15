import React, { useEffect, useMemo, useState } from 'react';
import {
  FileText,
  RefreshCw,
  Download,
  Trash2,
  Info,
  CheckCircle,
  Clock3,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';
import { getFileUrl, listMyConversionJobs, deleteConversionJob, ConversionJobDto } from '../api/api';
import { useSearchParams } from 'react-router-dom';

function computeOverview(jobs: ConversionJobDto[]) {
  const total = jobs.length;
  const success = jobs.filter((j) => j.status === 'success').length;
  const successRate = total > 0 ? Math.round((success / total) * 100) : 0;

  const formats = jobs
    .flatMap((j) => [j.targetFormat])
    .filter(Boolean);
  const top = Object.entries(
    formats.reduce<Record<string, number>>((acc, f) => {
      acc[f] = (acc[f] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([f]) => f)
    .join(', ') || '—';

  return [
    { label: 'Total des conversions', value: String(total), icon: FileText, meta: '' },
    { label: 'Taux de réussite', value: `${successRate}%`, icon: CheckCircle, meta: '' },
    { label: 'Jobs en cours', value: String(jobs.filter((j) => j.status === 'processing').length), icon: Clock3, meta: '' },
    { label: 'Formats les plus utilisés', value: top, icon: BarChart3, meta: '' },
  ];
}

const STATUS_MAP: Record<string, { className: string; icon: any; label: string }> = {
  pending: { className: 'bg-slate-100 text-slate-700', icon: Clock3, label: 'En attente' },
  processing: { className: 'bg-amber-100 text-amber-700', icon: RefreshCw, label: 'En cours' },
  success: { className: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, label: 'Terminé' },
  failed: { className: 'bg-rose-100 text-rose-700', icon: AlertTriangle, label: 'Échoué' },
};

function MetricCard({ label, value, Icon, meta }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Icon className="w-6 h-6 text-indigo-500" />
        </div>
      </div>
      {meta && <p className="mt-3 text-xs text-slate-400">{meta}</p>}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = STATUS_MAP[status] || { className: 'bg-slate-100 text-slate-700', icon: Info, label: String(status) };
  const Icon = map.icon;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${map.className}`}>
      <Icon className="w-3 h-3" />
      {map.label}
    </span>
  );
}

function formatDateTime(iso) {
  const d = new Date(iso);
  try {
    return d.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
  } catch (e) {
    return d.toLocaleString();
  }
}

function groupByDay(items) {
  const groups = {};
  const today = new Date();
  items.forEach((it) => {
    const d = new Date(it.createdAt);
    const diff = Math.floor((+today - +d) / (24 * 3600 * 1000));
    let key = '';
    if (diff === 0) key = "Aujourd'hui";
    else if (diff === 1) key = 'Hier';
    else {
      key = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    }
    if (!groups[key]) groups[key] = [];
    groups[key].push(it);
  });
  return groups;
}

export default function ConversionPipeline() {
  const [searchParams] = useSearchParams();
  const focusJobId = searchParams.get('job');

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [formatFilter, setFormatFilter] = useState('Tous');
  const [compatFilter, setCompatFilter] = useState('Tous');
  const [sort, setSort] = useState('recent');
  const [expanded, setExpanded] = useState(null);
  const [jobs, setJobs] = useState<ConversionJobDto[]>([]);
  const overviewMetrics = useMemo(() => computeOverview(jobs), [jobs]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let alive = true;

    async function refresh() {
      try {
        setError('');
        const data = await listMyConversionJobs();
        if (!alive) return;
        setJobs(data);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : 'Erreur lors du chargement');
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    refresh();
    const interval = setInterval(refresh, 2000); // simple "temps réel" via polling
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  const statuses = ['Tous', ...new Set(jobs.map((t) => t.status))].map((s) => (s === 'success' ? 'success' : s));
  const formats = ['Tous', ...new Set(jobs.flatMap((t) => [t.sourceFormat, t.targetFormat]))];

  const filtered = useMemo(() => {
    let list = [...jobs];
    if (query.trim()) {
      list = list.filter((t) =>
        (t.originalFileName || '').toLowerCase().includes(query.toLowerCase()) ||
        (t.id || '').toLowerCase().includes(query.toLowerCase())
      );
    }
    if (statusFilter !== 'Tous') list = list.filter((t) => t.status === statusFilter);
    if (formatFilter !== 'Tous') list = list.filter((t) => t.sourceFormat === formatFilter || t.targetFormat === formatFilter);
    // compatFilter is kept for UI consistency; compatibility is not yet computed in backend job DTO
    if (sort === 'recent') list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    else list.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    return list;
  }, [jobs, query, statusFilter, formatFilter, compatFilter, sort]);

  const groups = useMemo(() => groupByDay(filtered), [filtered]);

  const handleToggle = (id) => setExpanded((prev) => (prev === id ? null : id));

  const handleAction = async (action, item: ConversionJobDto) => {
    console.log(action, item.id);
    if (action === 'download') {
      if (!item.outputUrl) return alert('Fichier non disponible (job non terminé).');
      window.open(getFileUrl(item.outputUrl), '_blank', 'noreferrer');
      return;
    }
    if (action === 'delete') {
      const ok = confirm("Voulez-vous vraiment supprimer ce job ? Cette action est irréversible.");
      if (!ok) return;

      try {
        await deleteConversionJob(item.id);
        // Optimistic UI update: remove job locally
        setJobs((prev) => prev.filter((j) => j.id !== item.id));
        if (expanded === item.id) setExpanded(null);
        return;
      } catch (e) {
        alert(e instanceof Error ? e.message : 'Erreur lors de la suppression');
      }
      return;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Pipeline de conversion</h1>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Système actif</span>
              <span className="ml-2 text-sm text-slate-500">Suivi en temps réel des tâches de conversion 3D</span>
            </div>
            <p className="mt-2 text-sm text-slate-500 max-w-2xl">Historique, statut, actions et diagnostics pour chaque job. Gagnez du temps grâce à un suivi clair et des actions contextuelles.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            {overviewMetrics.map((m) => (
              <MetricCard key={m.label} label={m.label} value={m.value} Icon={m.icon} meta={m.meta} />
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par nom de fichier ou ID (ex: C-2048)"
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={formatFilter} onChange={(e) => setFormatFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              {formats.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <select value={compatFilter} onChange={(e) => setCompatFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <option>Tous</option>
              <option>WebAR</option>
              <option>iOS</option>
              <option>Android</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="recent">Trier: plus récent</option>
              <option value="oldest">Trier: plus ancien</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline / History */}
      <section className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Historique des conversions</h2>
            <p className="text-sm text-slate-500">Gestion complète des conversions avec statuts, logs et actions.</p>
          </div>
        </div>

        <div className="p-6">
          {loading && <div className="text-sm text-slate-500">Chargement du pipeline...</div>}
          {error && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-lg p-3 mb-4">{error}</div>}
          {Object.keys(groups).length === 0 && <div className="text-sm text-slate-500">Aucun résultat.</div>}
          {Object.entries(groups).map(([group, items]) => (
            <div key={group} className="mb-6">
              <h3 className="text-sm font-semibold text-slate-600 mb-3">{group} · {items.length} tâches</h3>
              <div className="space-y-4">
                {items.map((task) => (
                  <article
                    key={task.id}
                    className={`rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition ${
                      focusJobId === task.id ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-100'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs text-slate-400">{task.id}</p>
                            <h4 className="text-lg font-semibold text-slate-900 mt-1">{task.originalFileName}</h4>
                            <div className="mt-2 flex items-center gap-2 text-sm">
                              <span className="rounded-full bg-slate-50 px-2 py-1 text-slate-600">{task.sourceFormat} → {task.targetFormat}</span>
                              <StatusBadge status={task.status} />
                              <span className="text-xs text-slate-400">{formatDateTime(task.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-sm text-slate-500">
                              {task.status === 'processing' ? `Progression: ${Math.min(99, Math.max(0, task.progress || 0))}%` : ''}
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleAction('download', task)} title="Télécharger" className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-xs text-white">
                                <Download className="w-4 h-4" /> Télécharger
                              </button>
                              <button onClick={() => handleToggle(task.id)} title="Détails" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700">
                                <Info className="w-4 h-4" /> Détails
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="rounded-xl bg-slate-50 p-3 text-sm">
                            <p className="text-xs text-slate-500">Statut</p>
                            <p className="font-semibold text-slate-900">{STATUS_MAP[task.status]?.label || task.status}</p>
                          </div>
                          <div className="rounded-xl bg-slate-50 p-3 text-sm">
                            <p className="text-xs text-slate-500">Progression</p>
                            <p className="font-semibold text-slate-900">{task.progress ?? 0}%</p>
                          </div>
                          <div className="rounded-xl bg-slate-50 p-3 text-sm">
                            <p className="text-xs text-slate-500">Début</p>
                            <p className="font-semibold text-slate-900">{task.startedAt ? formatDateTime(task.startedAt) : '—'}</p>
                          </div>
                          <div className="rounded-xl bg-slate-50 p-3 text-sm">
                            <p className="text-xs text-slate-500">Fin</p>
                            <p className="font-semibold text-slate-900">{task.finishedAt ? formatDateTime(task.finishedAt) : '—'}</p>
                          </div>
                        </div>

                        {expanded === task.id && (
                          <div className="mt-4 rounded-lg border border-slate-100 bg-white p-4">
                            <h5 className="text-sm font-semibold text-slate-800">Détails techniques</h5>
                            <div className="mt-2 text-sm text-slate-600 grid gap-2 sm:grid-cols-2">
                              <div><strong>Fichier:</strong> {task.originalFileName}</div>
                              <div><strong>Formats:</strong> {task.sourceFormat} → {task.targetFormat}</div>
                              <div><strong>Erreur:</strong> {task.errorMessage || '—'}</div>
                              <div><strong>Sortie:</strong> {task.outputUrl ? task.outputUrl : '—'}</div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <button onClick={() => handleAction('delete', task)} className="inline-flex items-center gap-2 text-xs text-rose-600 hover:underline">
                                <Trash2 className="w-4 h-4" /> Supprimer
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
