import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../utils/LanguageContext';
import api from '../api/api';

export default function ForgotPassword() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateEmail(email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess("Si un compte existe, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.");
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden relative">
      <Link to="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl text-slate-600 font-bold hover:text-[#1a3683] hover:border-[#1a3683] transition-all shadow-sm group">
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        Retour
      </Link>

      <div className="hidden lg:flex lg:w-1/2 bg-[#1a3683] relative items-center justify-center p-12 overflow-hidden">
        <div className="relative z-10 max-w-lg text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl font-black mb-6 leading-tight tracking-tight">Mot de passe oublié</h1>
            <p className="text-indigo-100 text-lg mb-12 leading-relaxed font-medium">Saisissez votre adresse email professionnelle pour recevoir les instructions de réinitialisation.</p>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-slate-50/50">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-3xl font-black text-[#1a3683] mb-2 tracking-tight">Réinitialiser votre mot de passe</h2>
            <p className="text-slate-500 font-medium">Nous vous enverrons un lien par email pour définir un nouveau mot de passe.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-bold">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email professionnel</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#1a3683] transition-colors" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-[#1a3683] transition-all outline-none font-medium shadow-sm" placeholder="nom@entreprise.com" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link to="/login" className="text-sm text-slate-500 hover:underline">Retour à la connexion</Link>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-4 bg-[#1a3683] text-white rounded-2xl font-black text-lg hover:bg-indigo-900 transition-all shadow-xl shadow-indigo-900/20 active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? (
                <><Loader2 size={20} className="animate-spin"/> Envoi...</>
              ) : (
                'Envoyer le lien de réinitialisation'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
