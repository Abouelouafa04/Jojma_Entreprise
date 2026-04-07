import React, { useMemo, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import '@google/model-viewer';
import { ArrowLeft, Box, AlertCircle } from 'lucide-react';

type Platform = 'android' | 'ios';

function getPlatform(raw: string | null): Platform {
  return raw === 'ios' ? 'ios' : 'android';
}

export default function ARMobileView() {
  const [params] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const platform = getPlatform(params.get('platform'));
  const url = params.get('url') || '';
  const modelViewerRef = useRef<any>(null);

  const normalizedUrl = useMemo(() => {
    try {
      if (!url) return '';
      return new URL(url, window.location.origin).toString();
    } catch {
      return url;
    }
  }, [url]);

  const title = platform === 'ios' ? 'Ouvrir en AR (iPhone/iPad)' : 'Ouvrir en AR (Android)';

  const canRender = Boolean(normalizedUrl);

  const activateAR = async () => {
    setError(null);
    try {
      const el = modelViewerRef.current;
      if (!el || typeof el.activateAR !== 'function') {
        throw new Error("AR indisponible sur cet appareil / navigateur.");
      }
      await el.activateAR();
    } catch (e: any) {
      setError(e?.message || 'Impossible de lancer la réalité augmentée.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a192f] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link to="/ar/experiences" className="inline-flex items-center gap-2 text-indigo-200 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            Retour
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-indigo-100/80">
            <Box className="h-4 w-4" />
            Vue mobile AR
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide mb-2">{title}</h1>
          <p className="text-sm text-indigo-100/70 mb-6">
            Si le QR code a été scanné avec l’appareil photo, cette page doit permettre de lancer l’AR.
          </p>

          {!canRender && (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-rose-100 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-semibold">Lien manquant</p>
                <p className="text-sm text-rose-100/80">Aucune URL de modèle n’a été fournie dans le QR code.</p>
              </div>
            </div>
          )}

          {canRender && (
            <div className="grid gap-4">
              <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/20">
                {/* @ts-ignore */}
                <model-viewer
                  ref={modelViewerRef}
                  src={normalizedUrl}
                  ios-src={platform === 'ios' ? normalizedUrl : undefined}
                  alt="Modèle 3D AR"
                  camera-controls
                  auto-rotate
                  ar
                  ar-modes="scene-viewer webxr quick-look"
                  shadow-intensity="1"
                  style={{ width: '100%', height: 420, backgroundColor: 'transparent' }}
                ></model-viewer>
              </div>

              <button
                type="button"
                onClick={activateAR}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 font-semibold hover:from-indigo-700 hover:to-blue-700 transition shadow-xl shadow-indigo-900/30"
              >
                Lancer la Réalité Augmentée
              </button>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-indigo-100/60 break-all">
                  URL: {normalizedUrl}
                </p>
              </div>

              {error && (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-amber-100 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="font-semibold">AR non lancée</p>
                    <p className="text-sm text-amber-100/80">{error}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

