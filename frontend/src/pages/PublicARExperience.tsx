import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Smartphone } from 'lucide-react';
import api, { getFileUrl } from '../api/api';

type ExperienceResponse = {
  status: 'success';
  data: {
    experience: {
      slug: string;
      qrCodeData: string;
      viewsCount: number;
      Model3D?: any;
      model3d?: any;
      Model?: any;
      model?: any;
      Model3DModel?: any;
      modelId?: string;
      Model3D: {
        id: string;
        name: string;
        convertedFileName?: string | null;
      };
    };
  };
};

export default function PublicARExperience() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('Expérience AR');

  useEffect(() => {
    const run = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<ExperienceResponse>(`/api/ar/view/${slug}`);
        const exp = res.data.data.experience as any;
        const model = exp.Model3D || exp.model || exp.Model || null;
        setTitle(model?.name || `Expérience AR • ${slug}`);
        const file = model?.convertedFileName ? `/outputs/${model.convertedFileName}` : '';
        setModelUrl(file ? getFileUrl(file) : '');
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Expérience introuvable.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [slug]);

  const androidUrl = useMemo(() => {
    if (!modelUrl) return '';
    const p = new URLSearchParams({ platform: 'android', url: modelUrl });
    return `/ar/view?${p.toString()}`;
  }, [modelUrl]);

  const iosUrl = useMemo(() => {
    if (!modelUrl) return '';
    const p = new URLSearchParams({ platform: 'ios', url: modelUrl });
    return `/ar/view?${p.toString()}`;
  }, [modelUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <span className="text-sm font-semibold">Chargement de l’expérience...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
        <div className="max-w-xl w-full rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-lg font-semibold">Erreur</p>
          <p className="mt-2 text-sm text-white/70">{error}</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a192f] text-white p-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-200 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            Retour
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-indigo-100/80">
            <Smartphone className="h-4 w-4" />
            Expérience AR
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">{title}</h1>
          <p className="mt-2 text-sm text-indigo-100/70">Choisissez votre appareil pour lancer la réalité augmentée.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              to={androidUrl}
              className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 text-center font-semibold hover:from-indigo-700 hover:to-blue-700 transition"
            >
              Ouvrir sur Android
            </Link>
            <Link
              to={iosUrl}
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center font-semibold hover:bg-white/10 transition"
            >
              Ouvrir sur iPhone/iPad
            </Link>
          </div>

          {!modelUrl && (
            <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-rose-100">
              L’URL du modèle est indisponible pour cette expérience.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

