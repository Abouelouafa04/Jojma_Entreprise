import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Box, Lock, Mail, ArrowRight, CheckCircle2, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';

export default function Login() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/login', { email, password, rememberMe });
      const { token, data } = response.data;
      
      login(token, data.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden relative">
      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl text-slate-600 font-bold hover:text-[#1a3683] hover:border-[#1a3683] transition-all shadow-sm group"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        {t('nav.home')}
      </Link>
      {/* Left Side - Visual/Marketing */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a3683] relative items-center justify-center p-12 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/10 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl"></div>
        
        <div className="relative z-10 max-w-lg text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl mb-8 shadow-2xl">
              <Box className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-black mb-6 leading-tight tracking-tight">
              {t('auth.welcome_back')} <span className="text-[#00d1ff]">JOJMA</span>
            </h1>
            <p className="text-indigo-100 text-lg mb-12 leading-relaxed font-medium">
              {t('auth.login_desc')}
            </p>

            <div className="space-y-6">
              {[
                "Conversion ultra-rapide de vos fichiers",
                "Visualisation en temps réel",
                "Gestion de flotte de modèles 3D",
                "Intégration WebAR simplifiée"
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-6 h-6 rounded-full bg-[#00d1ff]/20 flex items-center justify-center text-[#00d1ff] group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-indigo-50 font-semibold">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating 3D-like element */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-slate-50/50">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 lg:hidden">
             <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1a3683] text-white rounded-xl mb-4 shadow-lg">
                <Box size={24} />
              </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-black text-[#1a3683] mb-2 tracking-tight">Connectez-vous à votre espace JOJMA</h2>
            <p className="text-slate-500 font-medium">Accédez à vos modèles 3D et expériences AR.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email professionnel</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#1a3683] transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-[#1a3683] transition-all outline-none font-medium shadow-sm"
                  placeholder="nom@entreprise.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-sm font-bold text-slate-700">Mot de passe</label>
                <Link to="/forgot-password" size="sm" className="text-sm text-[#1a3683] font-bold hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#1a3683] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-[#1a3683] transition-all outline-none font-medium shadow-sm"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 py-1">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 text-[#1a3683] border-slate-300 rounded focus:ring-[#1a3683] cursor-pointer"
                />
              </div>
              <label htmlFor="remember" className="text-sm text-slate-500 font-medium cursor-pointer">
                Se souvenir de moi
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#1a3683] text-white rounded-2xl font-black text-lg hover:bg-indigo-900 transition-all shadow-xl shadow-indigo-900/20 active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-[#1a3683] font-black hover:underline">
                S'inscrire gratuitement
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
