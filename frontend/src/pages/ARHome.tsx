import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Monitor, 
  Plus, 
  Zap, 
  Check, 
  PlayCircle, 
  Globe, 
  Eye, 
  Sparkles,
  TrendingUp,
  CheckCircle,
  Users,
  Code,
  Copy,
  Terminal,
  Lock,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

import s1 from '../photos/S1.jpg';
import s2 from '../photos/S2.jpg';
import s3 from '../photos/S3.jpg';
import s4 from '../photos/S4.jpg';
import arVideo from '../video/videoplayback.mp4';
const slides = [
  {
    id: 1,
    title: "World Tracking AR",
    subtitle: "Intégrez des expériences AR réalistes dans votre environnement",
    image: s1,
    buttonText: "Convertir mon modèle en AR"
  },
  {
    id: 2,
    title: "Expérience Immersive",
    subtitle: "Créez des portails AR et des hologrammes interactifs",
    image: s2,
    buttonText: "Convertir mon modèle en AR"
  },
  {
    id: 3,
    title: "Réalité Augmentée Web",
    subtitle: "Lancez des expériences AR directement depuis votre navigateur",
    image: s3,
    buttonText: "Convertir mon modèle en AR"
  },
  {
    id: 4,
    title: "Integrer AR dans votre site web",
    subtitle: "Copiez votre code AR pour satisfaire vos clients",
    image: s4,
    buttonText: "Convertir mon modèle en AR"
  }
];

export default function ARHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="bg-white">
      {/* Hero Slider Section */}
      <div className="relative h-screen w-full overflow-hidden bg-[#0a192f]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 }
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-nowrap transition-transform duration-1000 scale-105"
              style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#1a3683]/80 via-[#0a192f]/70 to-[#0a192f]"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
              >
                {slides[currentSlide].title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl md:text-2xl text-blue-100/80 mb-10 max-w-2xl"
              >
                {slides[currentSlide].subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Link
                  to="/ar/experiences"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-full hover:from-indigo-700 hover:to-blue-700 transition-all shadow-xl shadow-indigo-500/20 group"
                >
                  <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                  {slides[currentSlide].buttonText}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="absolute bottom-12 left-0 right-0 z-20 flex flex-col items-center gap-8">
          <div className="flex items-center gap-6">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentSlide ? 1 : -1);
                    setCurrentSlide(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a192f] mb-4">
              Pourquoi Choisir Notre Plateforme AR ?
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Une solution complète pour intégrer la réalité augmentée dans votre stratégie commerciale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Monitor,
                title: "Visualisation Immersive",
                desc: "Visualisez vos produits en 3D dans votre environnement réel avec une précision exceptionnelle. La réalité augmentée permet de voir vos produits dans leur contexte réel avec des proportions exactes et des détails précis."
              },
              {
                icon: Plus,
                title: "Interaction Intuitive",
                desc: "Manipulez et explorez vos modèles 3D de manière naturelle and intuitive. Zoom, rotation, déplacement : toutes les interactions sont fluides et adaptées à votre appareil."
              },
              {
                icon: Zap,
                title: "Performance Optimale",
                desc: "Une expérience fluide et réactive, optimisée pour tous les appareils. Notre technologie garantit des performances optimales, même sur les appareils mobiles les plus récents."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                  <feature.icon className="text-[#1a3683]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#0a192f] mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AR in Action Section */}
      <section className="py-24 px-4 bg-[#1a3683] text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold mb-8 leading-tight">
                Découvrez la Réalité Augmentée <br /> en Action
              </h2>
              <p className="text-blue-100/80 text-lg mb-10 leading-relaxed">
                Plongez dans une expérience immersive qui transforme votre vision du monde. Notre technologie WebAR combine la puissance de la réalité augmentée avec la simplicité du web pour créer des expériences uniques et engageantes.
              </p>
              
              <ul className="space-y-4 mb-12">
                {[
                  "Visualisation 3D interactive",
                  "Interaction en temps réel",
                  "Compatible tous appareils"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="w-6 h-6 rounded-full bg-blue-400/20 flex items-center justify-center shrink-0">
                      <Check className="text-blue-300" size={16} />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:w-1/2 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="rounded-3xl overflow-hidden shadow-2xl relative group"
              >
                <video 
                  src={arVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto object-cover aspect-video"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors flex items-center justify-center pointer-events-none">
                </div>
              </motion.div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <Link
              to="/ar/experiences"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-2xl shadow-blue-900/40 text-lg group"
            >
              <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-500" />
              Créer votre propre expérience AR
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a192f] mb-4">
              Les Avantages de la Réalité Augmentée
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Découvrez comment l'AR peut bénéficier à votre entreprise et à vos clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Businesses */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 p-10 rounded-3xl border border-slate-100"
            >
              <h3 className="text-2xl font-bold text-[#0a192f] mb-8">Pour les Entreprises</h3>
              <ul className="space-y-5">
                {[
                  "Réduisez les retours produits en permettant aux clients de visualiser avant l'achat",
                  "Améliorez l'engagement client avec des expériences interactives",
                  "Optimisez vos présentations commerciales avec des démonstrations immersives",
                  "Augmentez votre taux de conversion grâce à une meilleure visualisation des produits",
                  "Différenciez-vous de la concurrence avec une expérience client innovante"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <Check className="text-green-500 mt-1 shrink-0" size={20} />
                    <span className="text-slate-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* For Clients */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 p-10 rounded-3xl border border-slate-100"
            >
              <h3 className="text-2xl font-bold text-[#0a192f] mb-8">Pour les Clients</h3>
              <ul className="space-y-5">
                {[
                  "Visualisez les produits dans votre espace avant l'achat",
                  "Explorez les détails et fonctionnalités de manière interactive",
                  "Prenez des décisions d'achat plus éclairées",
                  "Économisez du temps en évitant les retours de produits",
                  "Profitez d'une expérience d'achat moderne et engageante"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <Check className="text-green-500 mt-1 shrink-0" size={20} />
                    <span className="text-slate-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Creative Immersive Experience Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#0a192f] via-[#1a3683] to-[#0a192f] text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Expérience Immersive Créative
            </h2>
            <p className="text-blue-100/70 text-lg max-w-3xl mx-auto leading-relaxed">
              Découvrez comment la réalité augmentée transforme l'expérience utilisateur en créant des interactions uniques et mémorables
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Globe,
                title: "Expérience 3D Interactive",
                desc: "Manipulez et explorez des objets en 3D avec une liberté totale de mouvement et des interactions naturelles"
              },
              {
                icon: Eye,
                title: "Visualisation Avancée",
                desc: "Découvrez vos produits sous tous les angles avec des effets visuels époustouflants et un rendu photoréaliste"
              },
              {
                icon: Sparkles,
                title: "Interactions Dynamiques",
                desc: "Créez des expériences interactives uniques avec des animations fluides et des transitions harmonieuses"
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/10 hover:bg-white/15 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-blue-100/60 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Large Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Innovative Tech */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-8">Technologies Innovantes</h3>
              <ul className="space-y-6">
                {[
                  "Tracking 3D avancé",
                  "Intelligence artificielle intégrée",
                  "Rendu temps réel optimisé",
                  "Compatibilité multi-plateformes"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <Check className="text-blue-400" size={16} />
                    </div>
                    <span className="text-blue-100/80 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* User Experience */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-8">Expérience Utilisateur</h3>
              <ul className="space-y-6">
                {[
                  "Interface intuitive et moderne",
                  "Interactions naturelles",
                  "Performances optimales",
                  "Design adaptatif"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <Check className="text-indigo-400" size={16} />
                    </div>
                    <span className="text-blue-100/80 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a192f] mb-4">
              Impact de la Réalité Augmentée
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Découvrez comment notre solution AR transforme l'expérience client
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: TrendingUp,
                value: "98%",
                label: "Taux de conversion AR",
                color: "bg-blue-50 text-blue-600"
              },
              {
                icon: CheckCircle,
                value: "-40%",
                label: "Réduction des retours",
                color: "bg-purple-50 text-purple-600"
              },
              {
                icon: Users,
                value: "+60%",
                label: "Engagement client",
                color: "bg-indigo-50 text-indigo-600"
              }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100 text-center flex flex-col items-center"
              >
                <div className={`w-16 h-16 rounded-2xl ${stat.color} flex items-center justify-center mb-6`}>
                  <stat.icon size={32} />
                </div>
                <div className="text-4xl font-bold text-[#0a192f] mb-2">{stat.value}</div>
                <div className="text-slate-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/services/convertisseur"
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 group"
            >
              <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
              Convertir mon modèle
            </Link>
          </div>
        </div>
      </section>

      {/* Automatic Code Generation Section */}
      <section className="py-24 px-4 bg-[#1a3683] text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Générez du Code Automatiquement
            </h2>
            <p className="text-blue-100/70 text-lg max-w-3xl mx-auto leading-relaxed">
              Notre plateforme vous permet de générer du code instantanément pour intégrer vos modèles 3D en réalité augmentée sur n'importe quel site web ou CMS
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Side: Features */}
            <div className="lg:w-1/2 space-y-6">
              {[
                {
                  title: "Code Universel",
                  desc: "Générez du code compatible avec tous les sites web et CMS (WordPress, Shopify, Wix, etc.) sans aucune modification nécessaire."
                },
                {
                  title: "Installation Facile",
                  desc: "Un simple copier-coller suffit pour intégrer la réalité augmentée à vos produits en quelques secondes."
                },
                {
                  title: "Solution Automatique",
                  desc: "Détection automatique de vos modèles 3D et génération de codes QR uniques pour chacun d'entre eux."
                }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10"
                >
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-blue-100/60 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}

              <div className="pt-6">
                <Link
                  to="/ar/experiences"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 group"
                >
                  <Code size={20} />
                  Générer mon code AR
                </Link>
              </div>
            </div>

            {/* Right Side: Code Editor Mockup */}
            <div className="lg:w-1/2 w-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-[#0a192f] rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
              >
                {/* Editor Header */}
                <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/10">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-blue-100/40 font-mono flex items-center gap-2">
                    <Terminal size={14} />
                    CodeGenerator.jsx
                  </div>
                </div>
                
                {/* Editor Content */}
                <div className="p-8 font-mono text-sm leading-relaxed overflow-x-auto">
                  <pre className="text-blue-100/80">
                    <code>
{`<!-- Code AR complet - Solution 100% automatique -->
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>

<style>
  .ar-container {
    text-align: center;
    margin: 40px 0;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .ar-button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 12px 24px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
  }
</style>`}
                    </code>
                  </pre>
                </div>

                {/* Editor Footer */}
                <div className="bg-white/5 px-6 py-4 flex justify-end border-t border-white/10">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all">
                    <Copy size={14} />
                    Copier le code
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
              Prêt à Créer votre Expérience AR ?
            </h2>
            <p className="text-slate-600 text-lg mb-12 max-w-2xl mx-auto">
              Transformez vos produits en expériences interactives en quelques clics
            </p>

            <div className="flex flex-col items-center gap-12">
              <Link
                to="/ar/experiences"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-2xl shadow-blue-500/30 text-lg group"
              >
                Commencer l'Aventure
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { icon: Zap, text: "Rapide & Intuitif", color: "text-blue-600", bg: "bg-blue-50" },
                  { icon: Lock, text: "100% Sécurisé", color: "text-purple-600", bg: "bg-purple-50" },
                  { icon: ShieldCheck, text: "Haute Qualité", color: "text-indigo-600", bg: "bg-indigo-50" }
                ].map((badge, idx) => (
                  <div 
                    key={idx}
                    className={`${badge.bg} ${badge.color} px-6 py-3 rounded-2xl flex items-center gap-3 font-semibold text-sm shadow-sm border border-white/50`}
                  >
                    <badge.icon size={18} />
                    {badge.text}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
