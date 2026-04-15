import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Box, Menu, X, ChevronDown, Globe, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/utils';
import ChatbotWidget from "../components/ChatbotWidget";
import { useLanguage } from '../utils/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

/**
 * Layout for public-facing pages (Home, Landing, etc.)
 */
export default function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const isAuthPage = ['/login', '/register', '/welcome'].includes(location.pathname);

  // Close menu when location changes
  React.useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
    setIsLangOpen(false);
  }, [location]);

  const navItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    {
      label: t('nav.services'),
      dropdown: [
        { label: t('nav.converter'), path: '/services/convertisseur' },
        { label: t('nav.packs'), path: '/services/packs-ar' },
      ],
    },
    {
      label: t('nav.ar'),
      dropdown: [
        { label: t('nav.ar_home'), path: '/ar' },
        { label: t('nav.ar_experiences'), path: '/ar/experiences' },
      ],
    },
    { label: t('nav.contact'), path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {isAuthPage ? (
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
                <Box size={20} />
              </div>
              <span className="text-lg font-semibold tracking-tight text-slate-900">JOJMA</span>
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:text-[#1a3683] hover:border-[#1a3683] transition-all"
              >
                <Globe size={16} />
                <span className="uppercase">{language}</span>
                <ChevronDown size={14} className={cn("transition-transform", isLangOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden"
                  >
                    <button
                      onClick={() => { setLanguage('fr'); setIsLangOpen(false); }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm font-medium hover:bg-slate-50 transition-colors",
                        language === 'fr' ? "text-[#1a3683] bg-indigo-50/50" : "text-slate-600"
                      )}
                    >
                      Français (FR)
                    </button>
                    <button
                      onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm font-medium hover:bg-slate-50 transition-colors",
                        language === 'en' ? "text-[#1a3683] bg-indigo-50/50" : "text-slate-600"
                      )}
                    >
                      English (EN)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
                  <Box size={24} />
                </div>
                <span className="text-2xl font-bold tracking-tight text-slate-900">JOJMA</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8">
                {navItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative group"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.dropdown ? (
                      <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors py-2">
                        {item.label}
                        <ChevronDown size={16} className={cn("transition-transform duration-200", activeDropdown === item.label && "rotate-180")} />
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        className={cn(
                          "text-sm font-medium transition-colors py-2",
                          location.pathname === item.path ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
                        )}
                      >
                        {item.label}
                      </Link>
                    )}

                    {/* Dropdown Menu */}
                    {item.dropdown && (
                      <AnimatePresence>
                        {activeDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 mt-1 overflow-hidden"
                          >
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.label}
                                to={subItem.path}
                                className="block px-6 py-2.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}
              </nav>

              {/* Auth & Language Buttons */}
              <div className="hidden lg:flex items-center gap-6">
                {/* Language Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:text-[#1a3683] hover:border-[#1a3683] transition-all"
                  >
                    <Globe size={16} />
                    <span className="uppercase">{language}</span>
                    <ChevronDown size={14} className={cn("transition-transform", isLangOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {isLangOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden"
                      >
                        <button
                          onClick={() => { setLanguage('fr'); setIsLangOpen(false); }}
                          className={cn(
                            "w-full px-4 py-2 text-left text-sm font-medium hover:bg-slate-50 transition-colors",
                            language === 'fr' ? "text-[#1a3683] bg-indigo-50/50" : "text-slate-600"
                          )}
                        >
                          Français (FR)
                        </button>
                        <button
                          onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                          className={cn(
                            "w-full px-4 py-2 text-left text-sm font-medium hover:bg-slate-50 transition-colors",
                            language === 'en' ? "text-[#1a3683] bg-indigo-50/50" : "text-slate-600"
                          )}
                        >
                          English (EN)
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-all"
                      >
                        <User size={16} />
                        <span>{user?.fullName?.split(' ')[0] || 'Utilisateur'}</span>
                        <ChevronDown size={14} className={cn("transition-transform", activeDropdown === 'user' && "rotate-180")} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === 'user' && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden"
                          >
                            <Link
                              to="/dashboard/profile"
                              className="block px-4 py-2.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                            >
                              Mon profil
                            </Link>
                            <Link
                              to="/dashboard/conversions"
                              className="block px-4 py-2.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                            >
                              Tableau de bord
                            </Link>
                            {user?.role === 'admin' && (
                              <>
                                <Link
                                  to="/admin"
                                  className="block px-4 py-2.5 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors font-medium"
                                >
                                  Administration
                                </Link>
                              </>
                            )}
                            {user?.role !== 'admin' && (
                              <>
                                {/* Paramètres supprimés du Dashboard */}
                              </>
                            )}
                            <div className="border-t border-slate-100 mt-2 pt-2">
                              <button
                                onClick={logout}
                                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2"
                              >
                                <LogOut size={16} />
                                Déconnexion
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link
                      to="/login"
                      className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      {t('auth.login')}
                    </Link>
                    <Link
                      to="/register"
                      className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-100 hover:shadow-indigo-200"
                    >
                      {t('auth.register')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden flex items-center gap-4">
                <button
                  onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                  className="p-2 text-slate-600 hover:text-[#1a3683] transition-colors font-bold text-sm uppercase"
                >
                  {language}
                </button>
                <button
                  className="p-2 text-slate-600 hover:text-indigo-600 transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
              >
                <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                  {navItems.map((item) => (
                    <div key={item.label}>
                      {item.dropdown ? (
                        <div className="flex flex-col gap-2">
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mt-2">
                            {item.label}
                          </div>
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.label}
                              to={subItem.path}
                              className="block px-2 py-2 text-base font-medium text-slate-600 hover:text-indigo-600"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          className={cn(
                            "block px-2 py-2 text-base font-medium",
                            location.pathname === item.path ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
                          )}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                  <div className="pt-4 flex flex-col gap-3 border-t border-slate-100">
                    {isAuthenticated ? (
                      <>
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="block px-2 py-2 text-base font-medium text-indigo-600 hover:text-indigo-700"
                          >
                            Admin Panel
                          </Link>
                        )}
                        <Link
                          to="/dashboard/profile"
                          className="block px-2 py-2 text-base font-medium text-slate-600 hover:text-indigo-600"
                        >
                          Mon profil
                        </Link>
                        <Link
                          to="/dashboard/conversions"
                          className="block px-2 py-2 text-base font-medium text-slate-600 hover:text-indigo-600"
                        >
                          Tableau de bord
                        </Link>
                        {user?.role === 'admin' ? (
                          <>
                            <Link
                              to="/admin"
                              className="block px-2 py-2 text-base font-medium text-indigo-600 hover:text-indigo-700"
                            >
                              Administration
                            </Link>
                          </>
                        ) : (
                          <>
                            {/* Paramètres supprimés du Dashboard */}
                          </>
                        )}
                        <button
                          onClick={logout}
                          className="w-full py-3 bg-slate-600 text-white text-center font-semibold rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <LogOut size={16} />
                          Déconnexion
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-2 py-2 text-base font-medium text-slate-600 hover:text-indigo-600"
                        >
                          {t('auth.login')}
                        </Link>
                        <Link
                          to="/register"
                          className="w-full py-3 bg-indigo-600 text-white text-center font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                          {t('auth.register')}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      {!isAuthPage && (
        <footer className="bg-[#1a3683] text-white py-16 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-400/10 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl pointer-events-none"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              {/* Column 1: Augmented Reality */}
              <div>
                <h3 className="text-[#00d1ff] text-2xl font-bold mb-6">{t('footer.ar_title')}</h3>
                <p className="text-slate-300 leading-relaxed max-w-sm">
                  {t('footer.ar_desc')}
                </p>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h3 className="text-[#00d1ff] text-2xl font-bold mb-6">{t('footer.links_title')}</h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/" className="text-slate-300 hover:text-white transition-colors">{t('nav.home')}</Link>
                  </li>
                  <li>
                    <Link to="/login" className="text-slate-300 hover:text-white transition-colors">{t('auth.login')}</Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-slate-300 hover:text-white transition-colors">{t('auth.register')}</Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">{t('nav.contact')}</Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Follow Us */}
              <div>
                <h3 className="text-[#00d1ff] text-2xl font-bold mb-6">{t('footer.follow_title')}</h3>
                <div className="flex items-center gap-6">
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.19-2.41.04-3.45.21-.94 1.35-5.71 1.35-5.71s-.34-.69-.34-1.71c0-1.6 1.05-2.8 2.09-2.8.98 0 1.46.74 1.46 1.63 0 .99-.63 2.47-.96 3.84-.27 1.15.58 2.09 1.71 2.09 2.05 0 3.63-2.17 3.63-5.29 0-2.77-1.99-4.71-4.83-4.71-3.3 0-5.23 2.47-5.23 5.03 0 1 .38 2.07.86 2.65.1.12.11.22.08.33-.09.37-.28 1.14-.32 1.29-.05.21-.16.25-.37.15-1.39-.65-2.26-2.68-2.26-4.31 0-3.51 2.55-6.74 7.36-6.74 3.86 0 6.86 2.75 6.86 6.43 0 3.84-2.42 6.93-5.78 6.93-1.13 0-2.19-.59-2.55-1.28l-.7 2.65c-.25.97-.93 2.18-1.39 2.92 1.12.35 2.31.54 3.54.54 6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/10 text-center">
              <p className="text-slate-400 text-sm">
                {t('footer.rights')}
              </p>
            </div>
          </div>
        </footer>
      )}
      <ChatbotWidget />
    </div>
  );
}
