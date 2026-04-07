import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Box, HeadphonesIcon, Settings, LogOut, Home, ArrowLeft, Shield, Activity, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

/**
 * Layout for admin back-office pages.
 */
export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: t('admin.overview'), path: '/admin' },
    { icon: Users, label: t('admin.users'), path: '/admin/users' },
    { icon: Box, label: t('admin.models'), path: '/admin/models' },
    { icon: HeadphonesIcon, label: t('admin.support'), path: '/admin/support' },
    { icon: Activity, label: t('admin.logs'), path: '/admin/logs' },
    { icon: AlertTriangle, label: t('admin.errors'), path: '/admin/errors' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b">
          <Link to="/admin" className="flex items-center gap-2 font-bold text-2xl text-red-600">
            <Shield className="w-8 h-8" />
            <span>JOJMA Admin</span>
          </Link>
          <p className="text-xs text-slate-500 mt-1">Panneau d'administration</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-all group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t space-y-2">
          {/* Bouton retour au dashboard utilisateur */}
          <Link
            to="/dashboard"
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-md hover:shadow-slate-200 hover:shadow-lg hover:from-slate-600 hover:to-slate-700 transition-all duration-300 relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            <span className="font-semibold tracking-wide">Espace client</span>
            <ArrowLeft className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Link>

          <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-all">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Paramètres</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="w-6 h-6 text-red-600" />
            <h1 className="font-semibold text-slate-800">{t('admin.title')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 text-sm font-medium uppercase"
            >
              {language}
            </button>
            {/* Bouton retour au dashboard utilisateur */}
            <Link
              to="/dashboard"
              title={t('admin.client_area')}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all duration-200 text-sm font-medium"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline">{t('admin.client_area')}</span>
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
              <Shield className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">{user?.fullName || t('admin.admin')}</span>
            </div>
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}