import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CloudUpload, CheckCircle, Smartphone, Link as LinkIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import ARViewer from '../components/ARViewer';
import api from '../api/api';

export default function ARPlatformExperience() {
  const { platform } = useParams<{ platform: string }>();
  const navigate = useNavigate();
  
  // États de l'application
  const [step, setStep] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [recommendedLanHost, setRecommendedLanHost] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Normalisation du format accepté selon la plateforme
  const isIOS = platform === 'ios';
  const format = isIOS ? '.usdz' : '.glb';

  // Nettoyage de l'URL objet pour éviter les fuites de mémoire
  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  const apiBaseUrl = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000/api`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/ar/public-base`);
        const data = await res.json();
        if (!cancelled && res.ok && data?.success && typeof data.baseUrl === 'string') {
          const parsed = new URL(data.baseUrl);
          setRecommendedLanHost(parsed.hostname);
        }
      } catch {
        // no-op: fallback handled in getQrCodeUrl
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl]);

  const processFile = async (file: File) => {
    // Vérification basique du type
    if (!file.name.toLowerCase().endsWith(format)) {
      alert(`Veuillez fournir un fichier au format ${format}`);
      return;
    }

    try {
      setIsUploading(true);
      
      const url = URL.createObjectURL(file);
      setFileName(file.name);
      setFileUrl(url); // Rendu local
      
      const formData = new FormData();
      formData.append('file', file);
      // Backend expects "iphone" or "android"
      formData.append('platform', isIOS ? 'iphone' : 'android');

      // Persist in DB + generate ARExperience
      const response = await api.post('/api/ar/upload-and-generate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response?.data?.status === 'success') {
        // The createExperience controller returns { experience, publicUrl }
        setPublicUrl(response.data.data.publicUrl);
        setStep(2);
      } else {
        throw new Error(response?.data?.message || "Erreur inconnue");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert("Erreur réseau: Impossible d'envoyer le fichier.");
      setFileUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const sendEmailLink = async () => {
    if (!publicUrl || !fileName) {
      setEmailStatus('Aucun lien AR disponible pour l’envoi.');
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailStatus('Veuillez saisir une adresse email valide.');
      return;
    }

    setIsSendingEmail(true);
    setEmailStatus(null);

    try {
      const response = await fetch(`${apiBaseUrl}/ar/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          qrUrl: publicUrl,
          fileName,
          platform: isIOS ? 'iphone' : 'android',
        }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setEmailStatus('Le lien AR a été envoyé dans votre boîte mail.');
      } else {
        setEmailStatus(result.message || 'Impossible d’envoyer le lien par email.');
      }
    } catch (error: any) {
      console.error('Email send error:', error);
      setEmailStatus('Erreur réseau : impossible d’envoyer le lien par email.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const getQrCodeUrl = () => {
    if (!publicUrl) {
      return window.location.origin;
    }

    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const base = (() => {
      if (!isLocalhost || !recommendedLanHost) return window.location.origin;
      const port = window.location.port || '5173';
      return `${window.location.protocol}//${recommendedLanHost}:${port}`;
    })();

    const qrTarget = new URL('/ar/view', base);
    qrTarget.searchParams.set('platform', isIOS ? 'ios' : 'android');
    qrTarget.searchParams.set('url', publicUrl);
    return qrTarget.toString();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] lg:min-h-screen w-full bg-[#1b347a] relative overflow-hidden -m-8 p-10 flex flex-col items-center font-sans">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #93c5fd 1px, transparent 1px), linear-gradient(to bottom, #93c5fd 1px, transparent 1px)`,
          backgroundSize: '2.5rem 2.5rem'
        }}
      />
      
      <div className="relative z-10 w-full max-w-[1000px] mx-auto flex flex-col items-center mt-4 md:mt-8">
        
        {/* Header Section */}
        <div className="w-full flex flex-col items-center relative mb-10">
          <button 
            onClick={() => navigate('/ar/experiences')} 
            className="absolute left-0 top-2 flex items-center gap-2 text-indigo-300 hover:text-white transition-colors group px-4 py-2"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline font-medium tracking-wide">Retour</span>
          </button>

          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold mb-4 tracking-wide text-center drop-shadow-sm mt-12 md:mt-0">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-300">
              Augmented Reality
            </span>
          </h1>
          <p className="text-base md:text-lg text-indigo-100/90 text-center font-light tracking-wide">
            Transformez vos modèles 3D en expériences AR immersives
          </p>
        </div>

        {/* Desktop Badge */}
        <div className="flex items-center gap-3 px-6 py-2.5 rounded-full border border-indigo-400/30 bg-[#162A62]/80 backdrop-blur shadow-sm mb-12">
          <div className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse" />
          <span className="text-sm font-light tracking-wide text-indigo-100">
            Mode Desktop détecté - Utilisation du QR Code
          </span>
        </div>

        {/* Steps Illumination */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
          {[
            { num: '1', title: 'Importez', desc: `Déposez votre fichier 3D (${format} )` },
            { num: '2', title: 'Prévisualisez', desc: 'Vérifiez votre modèle en 3D' },
            { num: '3', title: 'Visualisez', desc: 'Voir en AR ou générer le code' }
          ].map((item, idx) => {
            const isActive = step >= idx + 1;
            const isCurrent = step === idx + 1;
            return (
              <div 
                key={idx} 
                className={`border rounded-[1rem] p-6 shadow-sm flex flex-col items-start transition-all duration-500 ${
                  isCurrent 
                    ? 'bg-[#1e3b8a]/90 border-blue-400 ring-2 ring-blue-500/20 shadow-[0_0_15px_rgba(96,165,250,0.15)] scale-[1.02]' 
                    : isActive 
                      ? 'bg-[#193275]/80 border-indigo-400/40 opacity-90' 
                      : 'bg-[#152a65]/50 border-[#243e85] opacity-50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className={`text-2xl font-bold transition-colors duration-300 ${isActive ? 'text-[#8baef2]' : 'text-[#4261b0]'}`}>{item.num}</span>
                  {isActive && !isCurrent && (
                    <CheckCircle className="w-5 h-5 text-teal-400 opacity-80" strokeWidth={2} />
                  )}
                </div>
                <h3 className={`text-[1.1rem] font-medium mb-1 tracking-wide transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {item.title}
                </h3>
                <p className={`text-[0.9rem] font-light leading-relaxed transition-colors ${isActive ? 'text-indigo-100/80' : 'text-indigo-300/40'}`}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dynamic Content Area based on Step */}
        <div className="w-full flex-1 flex flex-col transition-all duration-300">
          
          {/* STEP 1: Upload */}
          {step === 1 && (
            <>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept={format}
                className="hidden" 
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full rounded-[1.25rem] border-2 border-dashed ${
                  isDragging 
                    ? 'border-[#8baef2] bg-[#1c3682]/80' 
                    : 'border-[#3051a8] bg-[#1a2f6c]/40'
                } transition-all duration-300 flex flex-col items-center justify-center py-20 cursor-pointer hover:border-[#5279d6] hover:bg-[#1c3682]/60`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="mb-6">
                  {isUploading ? (
                    <div className="w-14 h-14 border-4 border-[#8baef2]/30 border-t-[#8baef2] rounded-full animate-spin"></div>
                  ) : (
                    <CloudUpload className="w-14 h-14 text-[#8baef2]" strokeWidth={1.5} />
                  )}
                </div>
                <h3 className="text-[1.35rem] text-white font-medium tracking-wide mb-3 text-center px-4">
                  {isUploading ? 'Analyse et finalisation AR en cours...' : 'Sélectionnez ou déposez votre fichier 3D'}
                </h3>
                <p className="text-[0.95rem] text-indigo-100/50 font-light text-center">
                  Formats acceptés : {format}
                </p>
              </div>
            </>
          )}

          {/* STEP 2: Preview */}
          {step === 2 && fileUrl && (
            <div className="w-full flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
              <div className="w-full mb-4 px-2 flex justify-between items-end">
                <span className="text-indigo-200/80 text-sm font-light flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Fichier chargé : <strong className="text-white font-medium">{fileName}</strong>
                </span>
              </div>
              
              <ARViewer src={fileUrl} isUSDZ={isIOS} />
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => { setStep(1); setFileUrl(null); }}
                  className="px-6 py-3.5 rounded-xl border border-indigo-500/30 text-indigo-200 hover:bg-indigo-500/10 hover:text-white transition-colors text-sm md:text-base"
                >
                  Changer de fichier
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6d28d9] text-white font-medium shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <Smartphone className="w-5 h-5" />
                  Générer l'Expérience AR
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: AR Generation & QR Code */}
          {step === 3 && fileUrl && (
            <div className="w-full flex flex-col items-center bg-[#182e69]/80 border border-indigo-400/20 rounded-[1.5rem] p-8 md:p-12 shadow-xl animate-[fadeIn_0.5s_ease-out]">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
                Votre Expérience AR est Prête
              </h3>
              <p className="text-indigo-200/80 mb-10 max-w-lg text-center leading-relaxed">
                Scannez le QR Code ci-dessous avec l'appareil photo de votre <strong className="text-white">{isIOS ? 'iPhone / iPad' : 'téléphone Android'}</strong> pour projeter le modèle 3D dans votre environnement réel.
              </p>
              
              <div className="bg-white p-5 rounded-3xl shadow-[0_0_40px_rgba(96,165,250,0.15)] mb-10 hover:scale-105 transition-transform duration-500">
                <QRCodeSVG 
                  value={getQrCodeUrl()} 
                  size={220}
                  level="H"
                  includeMargin={true}
                  fgColor="#1b347a"
                />
              </div>

              <div className="w-full bg-[#11214b]/80 border border-indigo-500/20 rounded-[1.5rem] p-6 mb-10">
                <h4 className="text-xl font-semibold text-white mb-3">Alternative par email</h4>
                <p className="text-indigo-200/80 mb-4 text-sm leading-relaxed">
                  Si le scan du QR code échoue, recevez directement le lien AR sur votre adresse email pour ouvrir l’expérience depuis votre téléphone.
                </p>
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-end">
                  <label className="flex flex-col text-sm text-indigo-100">
                    Adresse email
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="mt-2 w-full rounded-2xl border border-indigo-400/30 bg-[#0f204a]/90 px-4 py-3 text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={sendEmailLink}
                    disabled={isSendingEmail}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white font-medium shadow-lg hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSendingEmail ? 'Envoi en cours...' : 'Envoyer le lien AR'}
                  </button>
                </div>
                {emailStatus && (
                  <p className="mt-4 text-sm text-indigo-100/90">{emailStatus}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl border border-indigo-500/30 text-indigo-200 hover:bg-indigo-500/10 hover:text-white transition-colors flex items-center justify-center"
                >
                  Retour
                </button>
                <button 
                  onClick={() => {
                    if (publicUrl) {
                      const linkToCopy = getQrCodeUrl();
                      navigator.clipboard.writeText(linkToCopy);
                      alert('Lien AR copié dans le presse-papier !');
                    }
                  }}
                  className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-blue-500/10 text-blue-100 hover:bg-blue-500/20 hover:text-white border border-blue-400/40 transition-colors flex items-center justify-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  Copier le lien AR
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
