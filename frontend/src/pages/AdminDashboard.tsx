import { Users, Box, RefreshCw, Smartphone, Activity, AlertTriangle, TrendingUp, QrCode, Link as LinkIcon } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total utilisateurs', value: '1,247', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total modèles 3D', value: '3,492', icon: Box, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Conversions aujourd\'hui', value: '127', icon: RefreshCw, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Erreurs système', value: '3', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Tickets support ouverts', value: '12', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Liens AR actifs', value: '856', icon: LinkIcon, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'QR codes générés', value: '2,134', icon: QrCode, color: 'text-cyan-600', bg: 'bg-cyan-100' },
    { label: 'Croissance mensuelle', value: '+18%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const recentActivity = [
    { type: 'user', action: 'Nouveau utilisateur inscrit', details: 'john.doe@example.com', time: 'Il y a 5 min' },
    { type: 'conversion', action: 'Conversion terminée', details: 'model_123.fbx → GLB', time: 'Il y a 12 min' },
    { type: 'error', action: 'Erreur système détectée', details: 'Timeout API conversion', time: 'Il y a 18 min' },
    { type: 'support', action: 'Nouveau ticket support', details: 'Problème de conversion AR', time: 'Il y a 23 min' },
    { type: 'model', action: 'Modèle supprimé', details: 'fauteuil_old.obj (signalé)', time: 'Il y a 1h' },
  ];

  const systemStatus = [
    { service: 'API Backend', status: 'healthy', uptime: '99.9%' },
    { service: 'Base de données', status: 'healthy', uptime: '99.8%' },
    { service: 'Service conversion', status: 'warning', uptime: '97.2%' },
    { service: 'Service QR', status: 'healthy', uptime: '99.9%' },
    { service: 'Service email', status: 'healthy', uptime: '99.5%' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Panneau d'administration</h2>
        <p className="text-slate-500">Vue d'ensemble de la plateforme JOJMA</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="font-bold text-slate-900">Activité récente</h3>
          </div>
          <div className="divide-y">
            {recentActivity.map((activity, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'conversion' ? 'bg-purple-100 text-purple-600' :
                    activity.type === 'error' ? 'bg-red-100 text-red-600' :
                    activity.type === 'support' ? 'bg-orange-100 text-orange-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {activity.type === 'user' && <Users className="w-5 h-5" />}
                    {activity.type === 'conversion' && <RefreshCw className="w-5 h-5" />}
                    {activity.type === 'error' && <AlertTriangle className="w-5 h-5" />}
                    {activity.type === 'support' && <Activity className="w-5 h-5" />}
                    {activity.type === 'model' && <Box className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{activity.action}</p>
                    <p className="text-sm text-slate-500">{activity.details} • {activity.time}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  activity.type === 'error' ? 'bg-red-100 text-red-600' :
                  activity.type === 'support' ? 'bg-orange-100 text-orange-600' :
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  {activity.type === 'error' ? 'Erreur' :
                   activity.type === 'support' ? 'Support' :
                   'Succès'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="font-bold text-slate-900">État du système</h3>
          </div>
          <div className="divide-y">
            {systemStatus.map((service, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'healthy' ? 'bg-emerald-500' :
                    service.status === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-semibold text-slate-800">{service.service}</p>
                    <p className="text-sm text-slate-500">Disponibilité: {service.uptime}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  service.status === 'healthy' ? 'bg-emerald-100 text-emerald-600' :
                  service.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {service.status === 'healthy' ? 'Opérationnel' :
                   service.status === 'warning' ? 'Attention' :
                   'Hors service'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left">
            <Users className="w-6 h-6 text-indigo-600 mb-2" />
            <h4 className="font-semibold text-slate-800">Gérer les utilisateurs</h4>
            <p className="text-sm text-slate-500">Voir, modifier ou suspendre des comptes</p>
          </button>
          <button className="p-4 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all text-left">
            <Box className="w-6 h-6 text-purple-600 mb-2" />
            <h4 className="font-semibold text-slate-800">Modérer les modèles</h4>
            <p className="text-sm text-slate-500">Vérifier et supprimer du contenu</p>
          </button>
          <button className="p-4 border border-slate-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all text-left">
            <Activity className="w-6 h-6 text-orange-600 mb-2" />
            <h4 className="font-semibold text-slate-800">Tickets support</h4>
            <p className="text-sm text-slate-500">Répondre aux demandes utilisateurs</p>
          </button>
        </div>
      </div>
    </div>
  );
}