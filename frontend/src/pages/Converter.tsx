import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, ChevronDown, Upload, Play, Box, ShieldCheck, Globe, Timer, Library, Cloud, Smartphone } from 'lucide-react';
import { cn } from '../utils/utils';
import ConversionSystem from '../components/ConversionSystem';
import objPhoto from '../photos/obj.jpg';

export default function Converter() {

  return (
    <div className="bg-white min-h-screen py-12 lg:py-20">
      
      <ConversionSystem redirectToPipeline={false} />

      {/* Info Section */}
      <section className="mt-20 bg-[#1a3683] py-20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Image/Diagram */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 w-full"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-video lg:aspect-square max-h-[500px] mx-auto">
                <img 
                  src={objPhoto} 
                  alt="3D Conversion Diagram"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Overlay to mimic the diagram look */}
                <div className="absolute inset-0 bg-indigo-900/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-8 p-8 w-full max-w-md">
                    {['X3D', 'GLTF', 'FBX', 'PLY', 'DAE', 'ABC', 'USDZ', 'GLB'].map((fmt, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                          {fmt}
                        </div>
                      </div>
                    ))}
                    <div className="col-span-3 flex justify-center mt-4">
                      <div className="px-8 py-4 bg-white rounded-2xl text-[#1a3683] font-black text-2xl shadow-xl">
                        OBJ / STL
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 text-white"
            >
              <h2 className="text-3xl lg:text-5xl font-bold mb-8 leading-tight">
                Un convertisseur rapide et efficace
              </h2>
              <p className="text-indigo-100 text-lg leading-relaxed mb-8">
                Notre convertisseur 3D est un outil puissant qui prend en charge les formats STL, OBJ, FBX et PNG et les convertit en GLB ou GLTF en un clic. Conçu pour les professionnels et amateurs, il garantit une conversion rapide, intuitive et fiable.
              </p>
              <p className="text-indigo-100 text-lg leading-relaxed">
                Grâce à son interface fluide, il simplifie le processus de transformation des fichiers 3D pour la visualisation WebAR et les applications interactives. En quelques secondes, obtenez un fichier optimisé, prêt à être utilisé dans vos projets de modélisation, d'animation ou d'intégration en réalité augmentée.
              </p>
              
              <div className="mt-12 flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <RefreshCw size={20} className="text-white" />
                  </div>
                  <span className="font-bold">Conversion Rapide</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Box size={20} className="text-white" />
                  </div>
                  <span className="font-bold">Formats Multiples</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Formats Supportés Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-[#1a3683] text-center mb-16"
          >
            Formats Supportés
          </motion.h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {[
              'ABC', 'FBX', 'DAE', 'OBJ', 'PLY',
              'STL', 'X3D', 'GLTF', 'GLB', 'USDZ'
            ].map((format, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center group"
              >
                <div className="relative w-16 h-20 mb-4 transition-transform duration-300 group-hover:-translate-y-1">
                  {/* File Icon Shape */}
                  <svg viewBox="0 0 40 50" className="w-full h-full drop-shadow-md">
                    <path 
                      d="M0 4C0 1.79086 1.79086 0 4 0H28L40 12V46C40 48.2091 38.2091 50 36 50H4C1.79086 50 0 48.2091 0 46V4Z" 
                      fill="white"
                      stroke="#1a3683"
                      strokeWidth="1"
                    />
                    <path d="M28 0V12H40L28 0Z" fill="#f1f5f9" />
                    
                    {/* 3D Cubes Icon inside */}
                    <g transform="translate(8, 15) scale(0.8)" className="text-[#1a3683] fill-current">
                      <path d="M14.5 0.5L2.5 7.5V21.5L14.5 28.5L26.5 21.5V7.5L14.5 0.5Z" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M14.5 0.5V14.5L2.5 7.5" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M14.5 14.5L26.5 7.5" fill="none" stroke="currentColor" strokeWidth="2" />
                    </g>
                  </svg>
                  
                  {/* Format Label Badge */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#1a3683] text-white text-[10px] font-black py-1 text-center rounded-b-sm">
                    {format}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 max-w-6xl mx-auto">
            {[
              {
                icon: <Smartphone size={40} />,
                title: "Comment convertir un fichier 3D",
                text: "Déposez vos fichiers STL, OBJ, FBX ou PNG ci-dessus. Choisissez le format de sortie GLB ou GLTF et cliquez sur 'Convertir'. Téléchargez votre fichier converti en quelques secondes."
              },
              {
                icon: <ShieldCheck size={40} />,
                title: "Traitement sécurisé des fichiers en ligne",
                text: "Votre confidentialité est garantie. Vos fichiers 3D sont traités de manière sécurisée et supprimés définitivement de nos serveurs après une heure."
              },
              {
                icon: <Globe size={40} />,
                title: "Compatible avec toutes les plateformes",
                text: "Notre convertisseur 3D fonctionne sur tous les systèmes d'exploitation via un navigateur web. Aucune installation requise, utilisez-le sur Windows, Mac ou Linux."
              },
              {
                icon: <Timer size={40} />,
                title: "Conversion rapide et efficace",
                text: "Convertissez vos modèles 3D en quelques secondes. Notre outil est optimisé pour une conversion rapide sans perte de qualité, parfait pour la visualisation WebAR et les applications interactives."
              },
              {
                icon: <Library size={40} />,
                title: "Formats de fichiers supportés",
                text: "Nous prenons en charge les fichiers STL, OBJ, FBX et PNG et les convertissons en GLB ou GLTF, assurant une compatibilité maximale avec les logiciels et plateformes modernes."
              },
              {
                icon: <Cloud size={40} />,
                title: "Conversion dans le cloud",
                text: "Effectuez vos conversions directement en ligne sans utiliser les ressources de votre ordinateur. Notre solution cloud garantit une rapidité et une efficacité accrues."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-2xl bg-indigo-50 text-[#1a3683] flex items-center justify-center mb-8 group-hover:bg-[#1a3683] group-hover:text-white transition-all duration-500 shadow-sm">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-[#1a3683] mb-4">{feature.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed px-4">
                  {feature.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
