import React from 'react';
import '@google/model-viewer';



interface ARViewerProps {
  src: string;
  isUSDZ?: boolean;
}

export default function ARViewer({ src, isUSDZ }: ARViewerProps) {
  // WebGL ne peut pas rendre nativement les fichiers USDZ via model-viewer sur PC sans fallback.
  if (isUSDZ) {
    return (
      <div className="w-full h-[400px] md:h-[450px] bg-[#1a3170]/80 rounded-[1.5rem] border border-indigo-400/20 flex flex-col items-center justify-center p-8 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-fuchsia-500/10 rounded-bl-full shadow-[inset_0_0_20px_rgba(217,70,239,0.3)] pointer-events-none"></div>
        
        <div className="w-20 h-20 bg-[#254091] rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-indigo-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-fuchsia-300 opacity-90">
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <path d="M12 12v9" />
            <path d="m16 16-4-4-4 4" />
          </svg>
        </div>
        <h3 className="text-2xl text-white font-medium mb-3">Fichier USDZ prêt</h3>
        <p className="text-center text-indigo-200/80 max-w-md text-sm leading-relaxed">
          Les modèles .usdz sont optimisés exclusivement pour l'écosystème Apple. 
          Passez à l'étape suivante pour générer votre QR code et le tester en AR.
        </p>
      </div>
    );
  }

  // Rendu normal pour les fichiers .glb
  return (
    <div className="w-full h-[400px] md:h-[450px] bg-[#1a3170]/40 rounded-[1.5rem] border border-indigo-400/20 overflow-hidden shadow-inner relative">
      {/* @ts-ignore */}
      {src ? (
        // @ts-ignore
        <model-viewer
          src={src}
          alt="Aperçu interactif du modèle 3D"
          auto-rotate
          camera-controls
          shadow-intensity="1"
          style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
        ></model-viewer>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-400 p-6">Aucun modèle disponible</div>
      )}
    </div>
  );
}
