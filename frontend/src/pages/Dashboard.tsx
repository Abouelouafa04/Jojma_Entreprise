import { Box, RefreshCw, Smartphone, Layers, ArrowRight, FilePlus, Clock3, Database, Activity, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function KpiCard({ label, value, Icon, color = 'text-indigo-600', bg = 'bg-indigo-50', delta }) {
  return (
    <div className="group rounded-2xl bg-white border border-slate-100 p-5 shadow-sm hover:shadow-xl transform transition duration-200 hover:-translate-y-1 focus-within:ring-4 focus-within:ring-indigo-50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <div className="mt-2 flex items-baseline gap-3">
            <p className="text-2xl font-semibold text-slate-900">{value}</p>
            {delta && (
              <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${delta.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {delta.positive ? '+' : ''}{delta.value}
              </span>
            )}
          </div>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${bg}`}> 
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <div className="h-2 w-28 overflow-hidden rounded bg-slate-100">
          <div className="h-2 w-12 bg-indigo-300/60" />
        </div>
        <div className="text-right">&nbsp;</div>
      </div>
    </div>
  );
}

function QuickActionTile({ label, description, Icon, href }) {
  return (
    <Link
      to={href}
      className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:scale-[1.02] transform transition duration-150 focus:outline-none focus:ring-4 focus:ring-indigo-50"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition" />
    </Link>
  );
}

function MiniDonut({ percent = 60, size = 48, stroke = 6, color = '#6366F1' }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (percent / 100) * circumference;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <defs>
        <linearGradient id="g1" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#6C5CFF" />
          <stop offset="100%" stopColor="#3AB0FF" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} stroke="#E6E9F2" fill="none" />
      <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} stroke="url(#g1)" strokeLinecap="round" fill="none" strokeDasharray={`${dash} ${circumference - dash}`} />
    </svg>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const overviewStats = [
    { label: 'Total de modèles 3D', value: '12', icon: Box, color: 'text-indigo-600', bg: 'bg-indigo-50', delta: { value: '4.2%', positive: true } },
    { label: 'Conversions effectuées', value: '48', icon: RefreshCw, color: 'text-purple-600', bg: 'bg-purple-50', delta: { value: '1.1%', positive: true } },
    { label: 'Expériences AR publiées', value: '8', icon: Smartphone, color: 'text-cyan-600', bg: 'bg-cyan-50', delta: { value: '-0.4%', positive: false } },
    { label: 'Stockage utilisé', value: '15.8 Go', icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-50', delta: { value: '2.3%', positive: true } },
    { label: 'Projets actifs', value: '6', icon: Layers, color: 'text-slate-600', bg: 'bg-slate-50', delta: { value: '0.0%', positive: true } },
  ];

  const recentActivities = [
    { title: 'Fichier importé', description: 'Chaise_design.glb', time: '15 min', icon: FilePlus, type: 'import' },
    { title: 'Conversion terminée', description: 'Maison_moderne.obj → .glb', time: '45 min', icon: RefreshCw, type: 'conversion' },
    { title: 'Lien AR généré', description: 'Visite_showroom.usdz', time: '1 h', icon: Smartphone, type: 'ar' },
    { title: 'Compte mis à jour', description: 'Profil professionnel modifié', time: '2 h', icon: Activity, type: 'system' },
  ];

  const quickActions = [
    { label: 'Importer un modèle', description: 'Ajoutez un nouveau fichier 3D', icon: FilePlus, href: '/dashboard/models' },
    { label: 'Lancer une conversion', description: 'Convertissez un modèle vers le bon format', icon: RefreshCw, href: '/dashboard/conversions' },
    { label: 'Générer un lien AR', description: 'Créez un aperçu AR partageable', icon: Smartphone, href: '/dashboard/ar' },
    { label: 'Consulter le catalogue', description: 'Voir tous vos modèles et projets', icon: Layers, href: '/dashboard/models' },
  ];

  const statusOverview = [
    { label: 'Projets en cours', value: '4', icon: Layers, color: 'text-slate-700', percent: 42 },
    { label: 'Conversions terminées', value: '38', icon: CheckCircle, color: 'text-emerald-600', percent: 78 },
    { label: 'Conversions en attente', value: '5', icon: Clock3, color: 'text-orange-600', percent: 12 },
    { label: 'Compatibilité mobile AR', value: 'iPhone & Android', icon: Smartphone, color: 'text-purple-600', percent: 96 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Vue d’ensemble</h1>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Compte Pro</span>
              <span className="ml-2 text-sm text-slate-500">{user?.companyName || ''}</span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Suivez vos modèles 3D, conversions et expériences AR. Actions rapides, activité en temps réel et indicateurs clés pour piloter vos projets.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Link to="/dashboard/models" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-400 px-4 py-2 text-white text-sm font-semibold shadow-md hover:opacity-95 focus:outline-none">
                <FilePlus className="h-4 w-4" /> Importer un modèle
              </Link>
              <Link to="/dashboard/conversions" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:shadow-sm focus:outline-none">
                <RefreshCw className="h-4 w-4 text-slate-600" /> Lancer une conversion
              </Link>
            </div>
          </div>
          <div className="mt-4 lg:mt-0 lg:flex lg:items-center lg:gap-4">
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">Tableau de bord</div>
            <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 border border-slate-100 shadow-sm">Dernières 30 jours</div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-6">
          {/* KPI grid */}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {overviewStats.map((s) => (
              <KpiCard key={s.label} label={s.label} value={s.value} Icon={s.icon} color={s.color} bg={s.bg} delta={s.delta} />
            ))}
          </div>

          {/* Activity timeline */}
          <section className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
            <div className="border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Activité récente</h2>
                  <p className="text-sm text-slate-500">Derniers fichiers importés, conversions et liens AR générés.</p>
                </div>
                <div className="text-xs text-slate-400">Live</div>
              </div>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-6">
                  {recentActivities.map((a, idx) => {
                    const color = a.type === 'import' ? 'bg-blue-500' : a.type === 'conversion' ? 'bg-emerald-500' : a.type === 'ar' ? 'bg-purple-500' : 'bg-slate-400';
                    return (
                      <li key={idx} className="mb-6">
                        <div className="relative pl-8">
                          <span className={`absolute left-0 top-1 h-3 w-3 rounded-full ${color} ring-4 ring-white`} />
                          <div className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                                  <a.icon className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                                  <p className="text-sm text-slate-500">{a.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-500">{a.time}</span>
                                <Link to="#" className="inline-flex items-center rounded-md px-3 py-1 text-xs bg-slate-50 text-slate-700 border border-slate-100 hover:bg-indigo-50 transition">Voir</Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          {/* Quick actions */}
          <section className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
            <div className="px-4 py-3">
              <h3 className="text-lg font-semibold text-slate-900">Raccourcis rapides</h3>
              <p className="text-sm text-slate-500">Actions intelligentes pour lancer vos projets.</p>
            </div>
            <div className="grid gap-3 p-4">
              {quickActions.map((q) => (
                <QuickActionTile key={q.label} label={q.label} description={q.description} Icon={q.icon} href={q.href} />
              ))}
            </div>
          </section>

          {/* Global status */}
          <section className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
            <div className="flex items-center justify-between px-2 py-1">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">État global</h3>
                <p className="text-sm text-slate-500">Suivez l’avancement et les indicateurs clés.</p>
              </div>
              <Clock3 className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="mt-3 grid gap-3">
              {statusOverview.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <MiniDonut percent={s.percent} />
                    <div>
                      <p className="text-sm font-medium text-slate-700">{s.label}</p>
                      <p className="text-sm text-slate-500">{s.value}</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">&nbsp;</div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
