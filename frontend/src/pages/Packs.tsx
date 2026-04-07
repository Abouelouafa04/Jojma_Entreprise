import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, CheckCircle2, ArrowRight, Headset, ThumbsUp, Cpu, Globe, Award, Box, RefreshCw, Smartphone, Link as LinkIcon, X, Maximize2, AlertCircle, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

import befor1 from '../photos/befor1.png';
import after1 from '../photos/after1.png';
import befor2 from '../photos/befor2.png';
import after2 from '../photos/after2.png';
import befor3 from '../photos/befor3.png';
import after3 from '../photos/after3.png';

type PacksFormData = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  domain: string;
  message: string;
};

export default function Packs() {
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
  const [formData, setFormData] = useState<PacksFormData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    domain: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [requestNumber, setRequestNumber] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000/api`;

  const formFieldsCount = Object.keys(formData).length;
  const completedFieldsCount = (Object.values(formData) as string[]).filter((value) => value.trim() !== '').length;
  const completionPercent = Math.round((completedFieldsCount / formFieldsCount) * 100);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: PacksFormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`${apiBaseUrl}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: `${formData.message}\n\nAdresse: ${formData.address}\nDomaine: ${formData.domain}`,
          subscribeNewsletter: false,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setSubmitMessage(data.message || 'Votre demande a bien été envoyée.');
        setRequestNumber(data.data?.requestNumber || '');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          address: '',
          phone: '',
          domain: '',
          message: '',
        });
        setTimeout(() => setSubmitStatus('idle'), 8000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.message || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      setSubmitStatus('error');
      setSubmitMessage('Erreur réseau. Veuillez vérifier votre connexion et réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section / Intro */}
      <section className="py-12 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left: Video Player Placeholder */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 w-full"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 aspect-video group">
                {/* Video Placeholder Styling */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play size={40} className="text-white fill-current ml-2" />
                  </div>
                </div>
                
                {/* Video Controls Mockup */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="h-1 w-full bg-white/20 rounded-full mb-4">
                    <div className="h-full w-1/3 bg-indigo-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between text-white/80 text-xs">
                    <span>0:00 / 2:45</span>
                    <div className="flex gap-4">
                      <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
                      <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl lg:text-5xl font-extrabold text-[#1a3683] mb-8 leading-tight">
                Transformez votre idée en réalité 3D et AR !
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Notre service de pack complet est conçu pour les professionnels qui souhaitent intégrer la 3D et AR dans leurs produits sans avoir de connaissances techniques. Que vous soyez dans le domaine de l'architecture, du design, de l'industrie ou de la publicité, nous vous accompagnons à chaque étape : de la modélisation à la visualisation en passant par l'impression 3D et l'animation.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed mb-10">
                Notre objectif est de vous fournir un service clé en main pour optimiser votre projet avec des solutions adaptées à vos besoins et à votre budget.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a3683] text-white font-bold rounded-lg hover:bg-indigo-900 transition-all shadow-lg"
                >
                  Découvrir nos Packs
                  <ArrowRight size={20} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Step by Step Process Section */}
      <section className="py-20 bg-[#1a3683] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-bold mb-6"
            >
              Le processus étape par étape
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-indigo-100 text-lg"
            >
              Découvrez comment nous transformons votre idée en réalité augmentée.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                icon: <Headset size={32} />,
                title: "Contact initial",
                desc: "Vous remplissez le formulaire avec vos besoins."
              },
              {
                icon: <ThumbsUp size={32} />,
                title: "Analyse du produit",
                desc: "Notre équipe examine votre produit (photos, dimensions, etc.)."
              },
              {
                icon: <Cpu size={32} />,
                title: "Création 3D",
                desc: "Nous modélisons votre produit en STL puis le convertissons en GLB."
              },
              {
                icon: <Globe size={32} />,
                title: "Intégration AR",
                desc: "Nous préparons l'expérience AR et vous fournissons un lien/QR code."
              },
              {
                icon: <Award size={32} />,
                title: "Livraison",
                desc: "Vous recevez tout, prêt à être utilisé sur votre site ou partagé."
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center group hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-500/30 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h4 className="text-xl font-bold mb-3 text-white">{step.title}</h4>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-[#1a3683] mb-6"
            >
              Commencez <span className="relative inline-block">votre projet 3D<span className="absolute bottom-2 left-0 w-full h-1 bg-indigo-500 rounded-full -z-10 opacity-30"></span></span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-600 text-lg"
            >
              Remplissez ce formulaire et nous vous contacterons dans les 24 heures pour discuter de votre projet.
            </motion.p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-[#1a3683]">Progression</span>
                <span className="text-sm font-bold text-indigo-600">{completionPercent}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${completionPercent}%` }}></div>
              </div>
            </div>

            {/* Form Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-xl border border-slate-100"
            >
              {submitStatus === 'success' ? (
                <div className="text-center py-12 px-6">
                  <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Merci ! Votre demande est bien envoyée.</h3>
                  <p className="text-slate-600 mb-4">Notre équipe vous contactera dans les 24 heures pour discuter de votre projet.</p>
                  {requestNumber && (
                    <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-green-50 border border-green-200 text-green-700">
                      <span className="font-semibold">Numéro de demande :</span>
                      <span className="font-mono">{requestNumber}</span>
                    </div>
                  )}
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {submitStatus === 'error' && (
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">
                      <AlertCircle className="w-5 h-5 mt-1" />
                      <p>{submitMessage}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Nom</label>
                      <input 
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Indiquez votre nom complet" 
                        required
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Prénom</label>
                      <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Indiquez votre prénom" 
                        required
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="votre.email@exemple.com" 
                        required
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Adresse</label>
                      <input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Votre adresse complète (rue, ville, code postal)" 
                        required
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Téléphone</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+212 123 456 789" 
                        required
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Domaine d'activité</label>
                      <select
                        name="domain"
                        value={formData.domain}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Sélectionner un domaine</option>
                        <option value="architecture">Architecture</option>
                        <option value="design">Design</option>
                        <option value="industrie">Industrie</option>
                        <option value="publicite">Publicité</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Décrivez votre besoin</label>
                    <textarea 
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Expliquez votre projet en détail (ex. type de produit, objectif, attentes...)" 
                      required
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-5 bg-[#1a3683] text-white font-bold rounded-xl hover:bg-indigo-900 transition-all shadow-lg shadow-indigo-900/20 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      'Envoyer ma demande'
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-400 mt-4">
                    En soumettant ce formulaire, vous acceptez que nous utilisions vos informations pour vous contacter au sujet de votre projet.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-20 bg-[#1a3683] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-5xl font-bold mb-6"
          >
            Ce que vous obtenez
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-indigo-100 text-lg mb-16 max-w-2xl mx-auto"
          >
            Tout ce dont vous avez besoin pour passer de votre produit à une expérience AR complète.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Box size={32} />,
                title: "Modélisation 3D",
                desc: "Nous transformons votre produit en un fichier STL prêt à l'emploi."
              },
              {
                icon: <RefreshCw size={32} />,
                title: "Conversion en GLB",
                desc: "Votre fichier STL est converti en GLB pour une visualisation AR fluide."
              },
              {
                icon: <Smartphone size={32} />,
                title: "Expérience AR",
                desc: "Accès via QR code (PC) ou caméra directe (mobile) pour voir votre produit en AR."
              },
              {
                icon: <LinkIcon size={32} />,
                title: "Lien AR personnalisé",
                desc: "Un lien unique à intégrer sur votre site pour vos produits en AR."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl text-[#1a3683] flex flex-col items-center group hover:scale-105 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-6 text-[#1a3683] group-hover:bg-[#1a3683] group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Examples Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-5xl font-bold text-[#1a3683] mb-6"
          >
            Exemples visuels
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-lg mb-16 max-w-2xl mx-auto"
          >
            Découvrez comment vos produits peuvent prendre vie en réalité augmentée.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                before: befor1,
                after: after1
              },
              {
                before: befor2,
                after: after2
              },
              {
                before: befor3,
                after: after3
              }
            ].map((example, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl overflow-hidden shadow-xl aspect-[16/9] flex group"
              >
                <div 
                  className="relative w-1/2 h-full overflow-hidden cursor-pointer group/item"
                  onClick={() => setSelectedImage({ url: example.before, title: "Avant" })}
                >
                  <img src={example.before} alt="Avant" className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/20 transition-colors flex items-center justify-center">
                    <Maximize2 className="text-white opacity-0 group-hover/item:opacity-100 transition-opacity" size={24} />
                  </div>
                  <div className="absolute top-4 left-4 bg-[#1a3683] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">
                    Avant
                  </div>
                </div>
                <div 
                  className="relative w-1/2 h-full overflow-hidden border-l-2 border-white cursor-pointer group/item"
                  onClick={() => setSelectedImage({ url: example.after, title: "Après" })}
                >
                  <img src={example.after} alt="Après" className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/20 transition-colors flex items-center justify-center">
                    <Maximize2 className="text-white opacity-0 group-hover/item:opacity-100 transition-opacity" size={24} />
                  </div>
                  <div className="absolute top-4 right-4 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">
                    Après
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full max-h-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-indigo-400 transition-colors p-2"
              >
                <X size={32} />
              </button>
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.title} 
                  className="max-w-full max-h-[80vh] object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-white font-bold text-xl tracking-wide uppercase">{selectedImage.title}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Additional Packs Info (Optional but recommended for a full page) */}

    </div>
  );
}
