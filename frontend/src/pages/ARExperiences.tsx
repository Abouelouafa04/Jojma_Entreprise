import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ARExperiences() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] lg:min-h-screen w-full bg-[#1b347a] relative overflow-hidden -m-8 p-10 flex flex-col items-center">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #93c5fd 1px, transparent 1px), linear-gradient(to bottom, #93c5fd 1px, transparent 1px)`,
          backgroundSize: '2.5rem 2.5rem'
        }}
      />
      
      <div className="relative z-10 w-full max-w-[1000px] mx-auto flex flex-col items-center mt-8 md:mt-16">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-black mb-6 tracking-wide text-center drop-shadow-sm">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-300">
            Réalité Augmentée
          </span>
        </h1>
        <p className="text-base md:text-lg text-indigo-100/90 mb-16 text-center font-light tracking-wide">
          Choisissez votre plateforme pour commencer l'expérience AR
        </p>

        {/* Main Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[900px]">
          {/* Android Card */}
          <div 
            onClick={() => navigate('/ar/experiences/android')}
            className="group relative rounded-[1.5rem] p-[3px] bg-gradient-to-br from-teal-400 via-emerald-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_0_2rem_-0.5rem_#2dd4bf] hover:-translate-y-1"
          >
            <div className="bg-[#182e69] w-full h-full rounded-[1.35rem] p-8 flex items-center gap-6 hover:bg-[#1a3272] transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-bl-full shadow-[inset_0_0_20px_rgba(20,184,166,0.3)] pointer-events-none group-hover:scale-110 transition-transform"></div>
              
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#324b89] flex items-center justify-center shrink-0 shadow-inner relative z-10 transition-transform duration-300 group-hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 fill-black drop-shadow-sm opacity-90">
                  <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.18-0.29-0.54-0.38-0.83-0.22c-0.3,0.16-0.42,0.54-0.26,0.85l1.84,3.18 c-3.13,1.69-5.18,4.92-5.38,8.51h22C22.78,14.41,20.73,11.18,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 S6.31,12.75,7,12.75S8.25,13.31,8.25,14S7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25s0.56-1.25,1.25-1.25 s1.25,0.56,1.25,1.25S17.69,15.25,17,15.25z"/>
                </svg>
              </div>
              <div className="flex flex-col flex-1 items-start relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Android</h3>
                <p className="text-sm md:text-base text-indigo-100/90 leading-tight font-light">
                  Convertissez et visualisez des modèles 3D en GLB
                </p>
              </div>
            </div>
          </div>

          {/* iPhone Card */}
          <div 
            onClick={() => navigate('/ar/experiences/ios')}
            className="group relative rounded-[1.5rem] p-[3px] bg-gradient-to-br from-fuchsia-500 via-purple-500 to-pink-500 hover:from-fuchsia-400 hover:to-pink-400 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_0_2rem_-0.5rem_#d946ef] hover:-translate-y-1"
          >
            <div className="bg-[#182e69] w-full h-full rounded-[1.35rem] p-8 flex items-center gap-6 hover:bg-[#1a3272] transition-colors relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-bl-full shadow-[inset_0_0_20px_rgba(217,70,239,0.3)] pointer-events-none group-hover:scale-110 transition-transform"></div>
               
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#324b89] flex items-center justify-center shrink-0 shadow-inner relative z-10 transition-transform duration-300 group-hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-8 h-8 md:w-9 md:h-9 fill-black drop-shadow-sm opacity-90">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 48.6-.3 76.5-56 95.2-92.5-30.7-13.6-54.6-43.2-54.3-80.1zM267.5 73.1c18.2-22.1 30.6-50.6 27.2-73.1-21.4 .9-51.2 14.5-70.1 36.4-16.7 19.3-30.8 48.7-26.7 70.4 23.3 1.8 51.5-11.6 69.6-33.7z"/>
                </svg>
              </div>
              <div className="flex flex-col flex-1 items-start relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">iPhone</h3>
                <p className="text-sm md:text-base text-indigo-100/90 leading-tight font-light">
                  Uploadez et visualisez des modèles USDZ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1000px] mt-20 pb-12">
          <div className="rounded-[1.25rem] border border-indigo-400/20 bg-[#162A62]/60 backdrop-blur p-7 shadow-lg hover:bg-[#1A3172]/80 transition-colors">
            <h4 className="text-xl font-bold text-[#8baef2] mb-3">Simple</h4>
            <p className="text-sm md:text-[0.95rem] text-indigo-100/80 leading-relaxed font-light">
              Interface intuitive pour une expérience utilisateur fluide
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-indigo-400/20 bg-[#162A62]/60 backdrop-blur p-7 shadow-lg hover:bg-[#1A3172]/80 transition-colors">
            <h4 className="text-xl font-bold text-[#8baef2] mb-3">Rapide</h4>
            <p className="text-sm md:text-[0.95rem] text-indigo-100/80 leading-relaxed font-light">
              Conversion et visualisation instantanée de vos modèles
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-indigo-400/20 bg-[#162A62]/60 backdrop-blur p-7 shadow-lg hover:bg-[#1A3172]/80 transition-colors">
            <h4 className="text-xl font-bold text-[#8baef2] mb-3">Compatible</h4>
            <p className="text-sm md:text-[0.95rem] text-indigo-100/80 leading-relaxed font-light">
              Support complet pour Android et iOS
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
