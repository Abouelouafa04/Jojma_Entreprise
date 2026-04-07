import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Box, Upload, Zap, BarChart3, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Welcome() {
  const actions = [
    {
      icon: Upload,
      title: 'Importer mon premier modèle',
      description: 'Téléchargez et convertissez vos fichiers 3D',
      link: '/dashboard/models',
      color: 'bg-blue-500'
    },
    {
      icon: Zap,
      title: 'Générer une expérience AR',
      description: 'Créez des expériences immersives en quelques clics',
      link: '/dashboard/ar',
      color: 'bg-purple-500'
    },
    {
      icon: BarChart3,
      title: 'Découvrir le tableau de bord',
      description: 'Explorez vos statistiques et gestion centralisée',
      link: '/dashboard',
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-[#1a3683] text-white rounded-3xl mb-8 shadow-2xl"
          >
            <CheckCircle2 size={40} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-black text-[#1a3683] mb-6"
          >
            Bienvenue sur JOJMA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-slate-600 font-medium max-w-2xl mx-auto"
          >
            Votre compte a été activé avec succès ! Commencez dès maintenant à explorer toutes les fonctionnalités de notre plateforme 3D et AR.
          </motion.p>
        </div>

        {/* Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-3 gap-8 mb-12"
        >
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + (index * 0.1) }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={action.link}
                className="block h-full p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${action.color} text-white rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <action.icon size={32} />
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-[#1a3683] transition-colors">
                  {action.title}
                </h3>

                <p className="text-slate-600 font-medium leading-relaxed mb-6">
                  {action.description}
                </p>

                <div className="flex items-center text-[#1a3683] font-bold group-hover:text-indigo-700 transition-colors">
                  Commencer
                  <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200">
            <Box className="w-6 h-6 text-[#1a3683]" />
            <span className="text-slate-700 font-semibold">
              Prêt à transformer vos idées en réalité ?
            </span>
          </div>

          <p className="mt-6 text-slate-500 font-medium">
            Besoin d'aide ? Consultez notre{' '}
            <Link to="/help" className="text-[#1a3683] font-bold hover:underline">
              centre d'aide
            </Link>{' '}
            ou contactez notre support.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}