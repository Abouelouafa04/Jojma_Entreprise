import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  subscribeNewsletter: boolean;
}

interface SubmitResponse {
  success: boolean;
  message: string;
  data?: {
    requestNumber: string;
    email: string;
    submittedAt: string;
  };
}

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    subscribeNewsletter: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [requestNumber, setRequestNumber] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000/api`;

      const response = await fetch(`${apiBaseUrl}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Parse response safely (handle non-JSON responses)
      let data: SubmitResponse | null = null;
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (err) {
          console.warn('Réponse JSON invalide pour /contact/submit', err);
        }
      }

      if (response.ok && data && data.success) {
        setSubmitStatus('success');
        setSubmitMessage(data.message);
        setRequestNumber(data.data?.requestNumber || '');

        // Réinitialiser le formulaire après succès
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
          subscribeNewsletter: false,
        });

        // Masquer le message de succès après 8 secondes
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 8000);
      } else {
        // Prefer server-provided message when available, otherwise try to read text
        let message = data?.message;
        if (!message) {
          try {
            const text = await response.text();
            if (text) message = text;
          } catch (err) {
            // ignore
          }
        }

        setSubmitStatus('error');
        setSubmitMessage(message || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setSubmitStatus('error');
      setSubmitMessage('Erreur réseau. Veuillez vérifier votre connexion et réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f] py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            {t('contact.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-blue-100/80 text-lg max-w-3xl mx-auto leading-relaxed"
          >
            {t('contact.subtitle')}
          </motion.p>
        </div>

        {/* Contact Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
        >
          {/* Left Side - Info */}
          <div className="lg:w-2/5 bg-[#1a3683] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-10">Contact <span className="text-blue-300">Us</span></h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                    <MapPin className="text-blue-300" size={24} />
                  </div>
                  <div>
                    <p className="text-blue-100/60 text-sm mb-1 uppercase tracking-wider font-semibold">Adresse</p>
                    <p className="text-lg leading-relaxed">
                      134 Angle Route Ouled Ziane et Rue Aswane Immeuble B étage N° 3, Casablanca 20250
                    </p>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="rounded-2xl overflow-hidden h-40 bg-white/5 border border-white/10 relative group">
                  <img 
                    src="https://maps.googleapis.com/maps/api/staticmap?center=Casablanca&zoom=13&size=400x200&key=YOUR_API_KEY" 
                    alt="Map"
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-sm font-medium hover:bg-white/20 transition-colors border border-white/20"
                    >
                      View on Maps
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                    <Phone className="text-blue-300" size={24} />
                  </div>
                  <div>
                    <p className="text-blue-100/60 text-sm mb-1 uppercase tracking-wider font-semibold">Téléphone</p>
                    <p className="text-lg">+212 660 339 034</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                    <Mail className="text-blue-300" size={24} />
                  </div>
                  <div>
                    <p className="text-blue-100/60 text-sm mb-1 uppercase tracking-wider font-semibold">Email</p>
                    <p className="text-lg break-all">Augmentedrealitymaroc@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                    <Clock className="text-blue-300" size={24} />
                  </div>
                  <div>
                    <p className="text-blue-100/60 text-sm mb-1 uppercase tracking-wider font-semibold">Disponibilité</p>
                    <p className="text-lg">24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:w-3/5 p-8 md:p-12 bg-white">
            {submitStatus === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="mb-6 p-4 rounded-full bg-green-100">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-4">
                  Merci ! ✅
                </h3>
                <p className="text-lg text-slate-600 mb-3">
                  Votre demande a bien été envoyée.
                </p>
                <p className="text-base text-slate-500 mb-6 max-w-md leading-relaxed">
                  Notre équipe vous répondra dans les plus brefs délais. Un email de confirmation a été envoyé à votre adresse.
                </p>
                {requestNumber && (
                  <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-slate-600 mb-1">Numéro de demande</p>
                    <p className="text-xl font-mono font-bold text-blue-600">{requestNumber}</p>
                  </div>
                )}
                <p className="text-sm text-slate-500">
                  Conservez ce numéro pour suivre votre demande.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitStatus === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{submitMessage}</p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 ml-1">Prenom</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Votre prénom" 
                      required
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1a3683] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 ml-1">Nom</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Votre nom" 
                      required
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1a3683] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 ml-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre.email@exemple.com" 
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1a3683] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 ml-1">Telephone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+212 000 000 000" 
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1a3683] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 ml-1">Votre Message</label>
                  <textarea 
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Comment pouvons-nous vous aider ?" 
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1a3683] transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center gap-3 ml-1">
                  <input 
                    type="checkbox" 
                    id="newsletter"
                    name="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded-lg border-slate-300 text-[#1a3683] focus:ring-[#1a3683] cursor-pointer"
                  />
                  <label htmlFor="newsletter" className="text-sm text-slate-600 cursor-pointer select-none">
                    Envoie-moi ta newsletter
                  </label>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-[#1a3683] text-white font-bold rounded-2xl hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 text-lg group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer Message
                      <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
