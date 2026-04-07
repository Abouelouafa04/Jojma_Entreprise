import { ArrowRight, Play, Monitor, CloudDownload, Share2, Check, Box, Globe, Quote, Phone, MessageCircle, Instagram, BookOpen, Rss, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useLanguage } from '../utils/LanguageContext';
import heroVideo from '../video/81ca029b43b14e75838c57d237f95b88.mp4';

export default function Home() {
  const { t } = useLanguage();

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "Comment fonctionne la Réalité Augmentée ?",
      answer: "La réalité augmentée superpose des éléments numériques à votre environnement réel en utilisant une caméra et un écran."
    },
    {
      question: "Quels appareils sont compatibles ?",
      answer: "La plupart des smartphones modernes sont compatibles : les appareils Apple supportant ARKit et les appareils Android supportant ARCore."
    },
    {
      question: "Comment intégrer l'AR à mon site web ?",
      answer: "Grâce à notre plateforme, vous pouvez intégrer une visionneuse 3D/AR directement via un simple bout de code (iframe)."
    },
    {
      question: "Puis-je utiliser mes propres modèles 3D ?",
      answer: "Absolument. Vous pouvez importer vos fichiers 3D existants sur notre plateforme et nous les optimiserons automatiquement pour la Réalité."
    },
    {
      question: "L'AR fonctionne-t-elle sans application mobile ?",
      answer: "Oui ! Nous utilisons le WebAR qui permet à vos clients de voir les modèles en AR directement depuis leur navigateur mobile."
    },
    {
      question: "Quels formats de fichiers 3D sont pris en charge ?",
      answer: "Nous prenons en charge les formats standards de l'industrie tels que GLB, GLTF, USDZ, OBJ, et FBX."
    },
    {
      question: "Comment générer un lien AR partageable ?",
      answer: "Une fois votre modèle uploadé, notre système génère automatiquement un lien unique et un QR Code."
    },
    {
      question: "Les modèles 3D conservent-ils leurs textures en AR ?",
      answer: "Oui, notre processus de conversion respecte et optimise les textures, les couleurs et les matériaux."
    }
  ];

  const DOMAINS = [
    {
      id: 'tableau',
      label: t('home.domain_tableau'),
      title: t('home.domain_tableau'),
      video: '',
      poster: ''
    },
    {
      id: 'sculpture',
      label: t('home.domain_sculpture'),
      title: t('home.domain_sculpture'),
      video: '',
      poster: ''
    },
    {
      id: 'moderne',
      label: t('home.domain_moderne'),
      title: t('home.domain_moderne'),
      video: '',
      poster: 'h'
    },
    {
      id: 'abstraite',
      label: t('home.domain_abstraite'),
      title: t('home.domain_abstraite'),
      video: '',
      poster: ''
    }
  ];

  const [activeDomain, setActiveDomain] = useState(DOMAINS[0]);

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-50 border border-indigo-100"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  Animez votre vision
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]"
              >
                {t('home.hero_title')}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-600 mb-10 leading-relaxed"
              >
                {t('home.hero_desc')}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Link to="/ar/experiences" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group">
                  {t('home.hero_cta')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Right Content - Videos */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-[2rem] overflow-hidden bg-[#151b2b] shadow-2xl shadow-indigo-200/60 border-[6px] border-white">
                <div className="h-[400px] lg:h-[550px] relative w-full">
                  <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-100"
                    poster=""
                  >
                    <source src={heroVideo} type="video/mp4" />
                  </video>
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* VR Badge Overlay */}
                  <div className="absolute top-8 left-[25%] -translate-x-1/2 z-20 pointer-events-none">
                    <span className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest border border-white/10 shadow-lg">
                      VR
                    </span>
                  </div>

                  {/* Result Badge Overlay */}
                  <div className="absolute top-8 right-[25%] translate-x-1/2 z-20 pointer-events-none">
                    <span className="px-5 py-2 bg-[#4939f5] rounded-full text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/30">
                      RESULT
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-100 rounded-full -z-10 blur-2xl opacity-60" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-50 rounded-full -z-10 blur-3xl opacity-80" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#1a3683] py-20 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 items-start">
            {/* Stat 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col text-white"
            >
              <span className="text-4xl font-bold mb-2">#1</span>
              <h3 className="text-xl font-bold mb-4">{t('home.stats_title')}</h3>
              <p className="text-slate-300 text-sm leading-relaxed max-w-[240px]">
                {t('home.stats_desc')}
              </p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col text-white lg:pt-1"
            >
              <span className="text-4xl lg:text-5xl font-bold mb-4">6.5M+</span>
              <p className="text-slate-300 text-sm leading-relaxed max-w-[240px]">
                {t('home.stats_users')}
              </p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col text-white lg:pt-1"
            >
              <span className="text-4xl lg:text-5xl font-bold mb-4">150k+</span>
              <p className="text-slate-300 text-sm leading-relaxed max-w-[240px]">
                {t('home.stats_models')}
              </p>
            </motion.div>

            {/* Stat 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col text-white lg:pt-1"
            >
              <span className="text-4xl lg:text-5xl font-bold mb-4">50k+</span>
              <p className="text-slate-300 text-sm leading-relaxed max-w-[240px]">
                {t('home.stats_countries')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4"
            >
              {t('home.services_title')}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto"
            >
              {t('home.services_subtitle')}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Service 1: Convertisseur 3D Gratuit */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">{t('home.service_free_title')}</h3>
              <Link to="/services/convertisseur" className="w-full py-3 px-6 bg-indigo-600 text-white rounded-full font-bold text-center hover:bg-indigo-700 transition-colors mb-8">
                {t('home.choose_plan')}
              </Link>
              <ul className="space-y-4 flex-1">
                {t('home.service_free_features').split('|').map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Service 2: Modélisation 3D & Réalité Augmentée (Recommended) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-2xl shadow-indigo-200/50 border-2 border-indigo-600 relative flex flex-col scale-105 z-10"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="text-yellow-400">★</span> {t('home.recommended')}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">{t('home.service_pro_title')}</h3>
              <Link to="/ar/experiences" className="w-full py-3 px-6 bg-indigo-600 text-white rounded-full font-bold text-center hover:bg-indigo-700 transition-colors mb-8">
                {t('home.choose_plan')}
              </Link>
              <ul className="space-y-4 flex-1">
                {t('home.service_pro_features').split('|').map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Service 3: Solution AR sur Mesure */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">{t('home.service_custom_title')}</h3>
              <Link to="/ar/experiences" className="w-full py-3 px-6 bg-indigo-600 text-white rounded-full font-bold text-center hover:bg-indigo-700 transition-colors mb-8">
                {t('home.choose_plan')}
              </Link>
              <ul className="space-y-4 flex-1">
                {t('home.service_custom_features').split('|').map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Domain Section */}
      <section className="py-24 bg-[#1a3683] relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-extrabold text-white mb-12"
            >
              {t('home.domain_title')}
            </motion.h2>

            {/* Tabs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap justify-center gap-4 mb-16"
            >
              {DOMAINS.map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomain(domain)}
                  className={`px-8 py-2.5 rounded-full font-medium transition-all border ${
                    activeDomain.id === domain.id
                      ? 'bg-white text-[#1a3683] border-white'
                      : 'bg-transparent text-white border-white/30 hover:border-white/60'
                  }`}
                >
                  {domain.label}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Video Display Area */}
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDomain.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-[2rem] overflow-hidden bg-slate-900 shadow-2xl aspect-video group"
              >
                <video
                  key={activeDomain.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  poster={activeDomain.poster}
                >
                  <source src={activeDomain.video} type="video/mp4" />
                </video>
                
                {/* Overlay with Title */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-8 left-8">
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold text-white"
                  >
                    {activeDomain.title}
                  </motion.h3>
                </div>

                {/* Play Button Overlay (Visual only) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#1a3683] shadow-lg">
                      <Play fill="currentColor" size={24} className="ml-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-extrabold text-[#1a3683] mb-6"
            >
              {t('home.platform_title')}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed"
            >
              {t('home.platform_subtitle')}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Visualisation 3D */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#3b5498] rounded-2xl p-10 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-8 border border-white/20 group-hover:scale-110 transition-transform">
                <Monitor size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('home.feature_viz_title')}</h3>
              <p className="text-white/80 leading-relaxed">
                {t('home.feature_viz_desc')}
              </p>
            </motion.div>

            {/* Feature 2: Conversion de Modèles */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#3b5498] rounded-2xl p-10 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-8 border border-white/20 group-hover:scale-110 transition-transform">
                <CloudDownload size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('home.feature_conv_title')}</h3>
              <p className="text-white/80 leading-relaxed">
                {t('home.feature_conv_desc')}
              </p>
            </motion.div>

            {/* Feature 3: Partage Facile */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#3b5498] rounded-2xl p-10 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-8 border border-white/20 group-hover:scale-110 transition-transform">
                <Share2 size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('home.feature_share_title')}</h3>
              <p className="text-white/80 leading-relaxed">
                {t('home.feature_share_desc')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="py-24 bg-[#1a3683] relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Image Area */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 relative"
            >
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200" 
                  alt="AR Platform in use" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-indigo-900/20 mix-blend-multiply" />
                
                {/* Floating UI Elements (Mocks) */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                  className="absolute top-8 left-8 bg-white rounded-xl p-4 shadow-xl flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <Box size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none mb-1">Formats Supportés</p>
                    <p className="text-sm font-bold text-slate-900 leading-none">GLB, GLTF, USDZ</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                  className="absolute bottom-12 right-8 bg-white rounded-xl p-5 shadow-xl max-w-[180px]"
                >
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-3">
                    <CloudDownload size={16} />
                  </div>
                  <p className="text-xs font-bold text-slate-900 mb-1">Sauvegardes de fichiers</p>
                  <p className="text-[10px] text-slate-500 leading-tight">Téléchargez ou restaurez vos sauvegardes du site</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Content Area */}
            <div className="flex-1 text-white">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl lg:text-5xl font-extrabold mb-12 leading-tight"
              >
                {t('home.platform_detail_title')}
              </motion.h2>

              <div className="space-y-8 mb-12">
                {t('home.platform_detail_features').split('|').map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 bg-emerald-500/20 rounded-full p-1 border border-emerald-500/30">
                      <Check className="text-emerald-400 w-4 h-4" />
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {feature}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Link to="/login" className="inline-block px-10 py-4 bg-white text-[#1a3683] rounded-full font-bold text-lg hover:bg-slate-100 transition-all shadow-xl">
                  {t('home.try_now')}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Left: Dashboard Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
                {/* Dashboard Header */}
                <div className="bg-[#1a3683] p-6 flex items-center gap-4 text-white">
                  <div className="w-10 h-10 bg-indigo-500/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Globe size={24} className="text-white" />
                  </div>
                  <h4 className="text-lg font-bold uppercase tracking-widest">Convertisseur 3D</h4>
                </div>

                {/* Dashboard Content */}
                <div className="p-8">
                  <p className="text-slate-900 font-bold mb-6">{t('home.dashboard_formats_title')}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">92</div>
                      <span className="text-xs text-slate-600 font-medium">{t('home.dashboard_supported_ext')}</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-600 font-medium">{t('home.dashboard_used')}</span>
                        <span className="text-xs font-bold text-slate-900">10</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="w-[30%] h-full bg-[#1a3683]" />
                      </div>
                    </div>
                  </div>

                  {/* Format Tags */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {['STL', 'GLB', 'GLTF', 'PLY', 'FBX', 'ABC', 'X3D', 'USDZ', 'DAE', 'OBJ'].map((format) => (
                      <div key={format} className="bg-slate-100 py-3 rounded-lg text-center text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-default">
                        {format}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-600 text-white"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {t('home.dashboard_badge')}
                </span>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-8 leading-tight"
              >
                {t('home.dashboard_title')}
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-slate-600 mb-6 leading-relaxed"
              >
                {t('home.dashboard_desc1')}
              </motion.p>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-slate-600 mb-10 leading-relaxed"
              >
                {t('home.dashboard_desc2')}
              </motion.p>

              <div className="space-y-4 mb-12">
                {t('home.dashboard_features').split('|').map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="flex items-center gap-3"
                  >
                    <Check className="text-emerald-500 w-5 h-5" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                <Link to="/login" className="inline-block px-10 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                  {t('home.explore_features')}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 bg-[#1a3683] relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Left: Content */}
            <div className="flex-1 text-white">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl lg:text-5xl font-extrabold mb-12 leading-tight"
              >
                {t('home.support_title')}
              </motion.h2>

              <div className="space-y-8 mb-12">
                {t('home.support_features').split('|').map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 bg-indigo-400/20 rounded-full p-1 border border-indigo-400/30">
                      <Check className="text-indigo-300 w-4 h-4" />
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {feature}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/contact" className="inline-block px-10 py-4 bg-indigo-500 text-white rounded-full font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-900/20">
                  {t('home.contact_support')}
                </Link>
              </motion.div>
            </div>

            {/* Right: Chat Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 w-full max-w-2xl"
            >
              <div className="bg-[#e3f0ff] rounded-[2.5rem] p-8 lg:p-12 shadow-2xl relative">
                {/* Online Status Badge */}
                <div className="absolute top-8 right-8 bg-[#1a3683] text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  En ligne
                </div>

                <div className="space-y-8">
                  {/* User Message */}
                  <div className="flex items-start gap-4">
                    <img 
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" 
                      alt="User" 
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                      referrerPolicy="no-referrer"
                    />
                    <div className="bg-[#1a3683] text-white p-5 rounded-2xl rounded-tl-none max-w-[80%] shadow-lg">
                      <p className="text-sm leading-relaxed">
                        {t('home.chat_user_msg')}
                      </p>
                    </div>
                  </div>

                  {/* Support Message 1 */}
                  <div className="flex items-start gap-4 flex-row-reverse">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" 
                      alt="Support" 
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                      referrerPolicy="no-referrer"
                    />
                    <div className="bg-[#a855f7] text-white p-5 rounded-2xl rounded-tr-none max-w-[80%] shadow-lg">
                      <p className="text-sm leading-relaxed">
                        {t('home.chat_support_msg1')}
                      </p>
                    </div>
                  </div>

                  {/* Support Message 2 */}
                  <div className="flex items-start gap-4 flex-row-reverse">
                    <div className="w-10" /> {/* Spacer for avatar alignment */}
                    <div className="bg-[#a855f7] text-white p-6 rounded-2xl rounded-tr-none max-w-[80%] shadow-lg">
                      <ol className="text-sm space-y-3 list-decimal ml-4">
                        {t('home.chat_support_steps').split('|').map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Left: Team Image */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[3/4] group">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" 
                  alt="JOJMA Team" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-indigo-900/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-transparent to-transparent" />
              </div>
            </motion.div>

            {/* Right: Mission Content */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <Quote size={48} className="text-indigo-600 opacity-20" />
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-2xl lg:text-3xl font-bold text-[#1a3683] mb-8 leading-relaxed"
              >
                {t('home.mission_title')}
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-slate-600 mb-10 leading-relaxed text-lg"
              >
                {t('home.mission_desc')}
              </motion.p>

              <div className="h-px bg-slate-200 w-full mb-10" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="space-y-1"
              >
                <h4 className="text-xl font-bold text-[#1a3683]">Mohammed Jamal</h4>
                <p className="text-slate-500 font-medium">{t('home.founder_role')}</p>
                <a href="https://www.jojma.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline block pt-2">
                  www.jojma.com
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-12"
              >
                <Link to="/about" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
                  {t('home.read_full_story')} <ArrowRight size={20} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1a3683] text-center">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-5xl font-extrabold text-white mb-6 leading-tight"
          >
            {t('home.cta_title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg mb-10 max-w-2xl mx-auto"
          >
            {t('home.cta_desc')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/ar/experiences" className="inline-block px-12 py-4 bg-indigo-500 text-white rounded-xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl">
              {t('home.get_started')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final Support Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-5xl font-extrabold text-[#1a3683] mb-4"
            >
              {t('home.final_support_title')}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 text-lg"
            >
              {t('home.final_support_desc')}
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
            {[
              { icon: Phone, label: t('home.support_phone_label'), info: t('home.support_phone_info') },
              { icon: MessageCircle, label: t('home.support_chat_label'), info: t('home.support_chat_info') },
              { icon: Instagram, label: t('home.support_insta_label'), info: t('home.support_insta_info') },
              { icon: BookOpen, label: t('home.support_faq_label'), info: t('home.support_faq_info') },
              { icon: Rss, label: t('home.support_blog_label'), info: t('home.support_blog_info') },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1a3683] mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-indigo-100 group-hover:-translate-y-1">
                  <item.icon size={28} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">{item.label}</h4>
                <p className="text-xs text-slate-500">{item.info}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#1a3683]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-5xl font-extrabold text-white mb-4"
            >
              Des Questions ? Nous avons les Réponses.
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-w-[1000px] mx-auto mb-10">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col rounded-xl text-white transition-all overflow-hidden bg-[#827DFF]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex items-center justify-between p-6 w-full text-left font-semibold text-[15px] lg:text-[16px] hover:bg-white/5 transition-colors"
                >
                  <span className="pr-4">{faq.question}</span>
                  <div className="shrink-0 text-white">
                    {openFaq === index ? <Minus size={22} strokeWidth={2.5} /> : <Plus size={22} strokeWidth={2.5} />}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-6 text-[14px] text-white leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/faq" className="inline-block px-10 py-3.5 bg-[#827DFF] text-white rounded-xl font-bold hover:bg-[#6c67eb] transition-all shadow-lg text-sm lg:text-base">
                Voir plus
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-5xl font-extrabold text-[#1a3683]"
          >
            {t('home.testimonials_title')}
          </motion.h2>
        </div>

        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-8 py-4">
            {[
              { text: t('home.testimonial_1_text'), role: t('home.testimonial_1_role'), date: "17 Juin", name: "Marc D." },
              { text: t('home.testimonial_2_text'), role: t('home.testimonial_2_role'), date: "15 Juin", name: "Sophie L." },
              { text: t('home.testimonial_3_text'), role: t('home.testimonial_3_role'), date: "12 Juin", name: "Thomas B." },
              { text: t('home.testimonial_4_text'), role: t('home.testimonial_4_role'), date: "10 Juin", name: "Elena R." },
              { text: t('home.testimonial_5_text'), role: t('home.testimonial_5_role'), date: "8 Juin", name: "Julien M." },
            ].map((testimonial, i) => (
              <div 
                key={i}
                className="inline-block w-[350px] lg:w-[450px] bg-white rounded-3xl p-8 shadow-xl border border-slate-100 whitespace-normal"
              >
                <div className="mb-6">
                  <Quote size={40} className="text-indigo-600 opacity-20" />
                </div>
                <p className="text-slate-700 text-lg font-medium mb-8 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <img 
                    src={`https://i.pravatar.cc/150?u=${i}`} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 leading-none mb-1">{testimonial.name}</h4>
                    <p className="text-xs text-slate-500">{testimonial.role} — {testimonial.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Duplicate for seamless loop */}
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-8 py-4 ml-8">
            {[
              { text: t('home.testimonial_1_text'), role: t('home.testimonial_1_role'), date: "17 Juin", name: "Marc D." },
              { text: t('home.testimonial_2_text'), role: t('home.testimonial_2_role'), date: "15 Juin", name: "Sophie L." },
              { text: t('home.testimonial_3_text'), role: t('home.testimonial_3_role'), date: "12 Juin", name: "Thomas B." },
              { text: t('home.testimonial_4_text'), role: t('home.testimonial_4_role'), date: "10 Juin", name: "Elena R." },
              { text: t('home.testimonial_5_text'), role: t('home.testimonial_5_role'), date: "8 Juin", name: "Julien M." },
            ].map((testimonial, i) => (
              <div 
                key={i}
                className="inline-block w-[350px] lg:w-[450px] bg-white rounded-3xl p-8 shadow-xl border border-slate-100 whitespace-normal"
              >
                <div className="mb-6">
                  <Quote size={40} className="text-indigo-600 opacity-20" />
                </div>
                <p className="text-slate-700 text-lg font-medium mb-8 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <img 
                    src={`https://i.pravatar.cc/150?u=${i + 5}`} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 leading-none mb-1">{testimonial.name}</h4>
                    <p className="text-xs text-slate-500">{testimonial.role} — {testimonial.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
