import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Box, RefreshCw, Smartphone, User, LogOut, Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

/**
 * Layout for authenticated dashboard pages.
 */
export default function DashboardLayout() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem('jojma_token');
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: t('dashboard.overview'), path: '/dashboard' },
    { icon: RefreshCw, label: t('dashboard.conversions'), path: '/dashboard/conversions' },
    { icon: Smartphone, label: t('dashboard.ar'), path: '/dashboard/ar' },
    { icon: User, label: t('dashboard.profile'), path: '/dashboard/profile' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-2xl text-indigo-600">
            <Box className="w-8 h-8" />
            <span>JOJMA</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t space-y-2">
          {/* Bouton retour à l'accueil */}
          <Link
            to="/"
            className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-indigo-200 hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            <span className="font-semibold tracking-wide">Accueil</span>
            <ArrowLeft className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
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
        <h1 className="font-semibold text-slate-800">{t('dashboard.title')}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 text-sm font-medium uppercase"
          >
            {language}
          </button>
          <Link
            to="/"
            title="Retourner à l'accueil"
            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 text-sm font-medium"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline">{t('nav.home')}</span>
          </Link>
        </div>
      </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
