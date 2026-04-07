import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, QrCode, Copy, Share2, Play, File, BarChart3, Layers, RefreshCw } from 'lucide-react';
import { getFileUrl } from '../api/api';
import { generateExperience, getARLibrary, getARStats, trackShare, type ARLibraryItem } from '../api/arLibrary.api';

export default function AR() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ opens: number; qrScans: number; shares: number; devices: Record<string, number> } | null>(null);
  const [items, setItems] = useState<ARLibraryItem[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrTitle, setQrTitle] = useState<string>('QR Code');

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const [s, list] = await Promise.all([getARStats(), getARLibrary()]);
        if (!mounted) return;
        setStats(s);
        setItems(list);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'Impossible de charger la bibliothèque AR.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const devicesLabel = useMemo(() => {
    if (!stats) return '—';
    const entries = Object.entries(stats.devices || {}).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) return '—';
    return entries.slice(0, 3).map(([k, v]) => `${k} ${v}`).join(' · ');
  }, [stats]);

  const formatSize = (bytes: number) => {
    if (!bytes) return '—';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(mb >= 10 ? 1 : 2)} Mo`;
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('fr-FR', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  };

  const statusBadge = (status: ARLibraryItem['status']) => {
    if (status === 'completed') return 'bg-emerald-100 text-emerald-700';
    if (status === 'pending') return 'bg-amber-100 text-amber-700';
    return 'bg-rose-100 text-rose-700';
  };

  const statusLabel = (status: ARLibraryItem['status']) => {
    if (status === 'completed') return 'Prêt';
    if (status === 'pending') return 'En préparation';
    return 'Erreur';
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setToast('Lien copié.');
  };

  const handleGenerate = async (modelId: string) => {
    setBusyId(modelId);
    setError(null);
    try {
      await generateExperience(modelId);
      const [s, list] = await Promise.all([getARStats(), getARLibrary()]);
      setStats(s);
      setItems(list);
      setToast('Lien AR généré.');
    } catch (e: any) {
      setError(e?.message || 'Échec génération lien AR.');
    } finally {
      setBusyId(null);
    }
  };

  const handleShare = async (item: ARLibraryItem) => {
    if (!item.experience?.slug || !item.experience?.publicUrl) return;
    try {
      await trackShare(item.experience.slug);
      await handleCopy(item.experience.publicUrl);
    } catch (e: any) {
      setError(e?.message || 'Impossible de partager.');
    }
  };

  const handleShowQr = async (item: ARLibraryItem) => {
    setError(null);
    try {
      if (!item.experience) {
        await handleGenerate(item.id);
        const refreshed = await getARLibrary();
        const nextItem = refreshed.find((x) => x.id === item.id) || null;
        if (!nextItem?.experience?.qrCodeData) throw new Error('QR code indisponible.');
        setQrTitle(nextItem.title);
        setQrDataUrl(nextItem.experience.qrCodeData);
        setQrOpen(true);
        return;
      }
      setQrTitle(item.title);
      setQrDataUrl(item.experience.qrCodeData);
      setQrOpen(true);
    } catch (e: any) {
      setError(e?.message || 'QR code indisponible.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Réalité Augmentée</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Transformez vos modèles 3D en expériences immersives. JOJMA vous permet de préparer, visualiser, tester et partager vos contenus en Réalité Augmentée de manière simple et professionnelle.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="flex items-center gap-3 text-slate-700">
              <Smartphone className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-semibold">Bibliothèque AR</span>
            </div>
          </div>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-700 mb-4">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900">Statistiques AR</h2>
          </div>
          <div className="space-y-4 text-sm text-slate-700">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-slate-500">Nombre d’ouvertures</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stats?.opens ?? '—'}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-slate-500">Nombre de scans QR</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stats?.qrScans ?? '—'}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-slate-500">Nombre de partages</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stats?.shares ?? '—'}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-slate-500">Appareils utilisés</p>
              <p className="mt-2 text-sm text-slate-900">{devicesLabel}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-700 mb-4">
            <Layers className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900">Actions principales</h2>
          </div>
          <div className="grid gap-3">
            <Link
              to="/dashboard/models"
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transition"
            >
              <div className="flex items-center gap-3">
                <File className="h-4 w-4" />
                Importer un modèle
              </div>
            </Link>
            <Link
              to="/dashboard/conversions"
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transition"
            >
              <div className="flex items-center gap-3">
                <RefreshCw className="h-4 w-4" />
                Lancer une conversion
              </div>
            </Link>
            <button type="button" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transition text-left">
              <div className="flex items-center gap-3">
                <QrCode className="h-4 w-4" />
                Générer un lien AR
              </div>
            </button>
            <button type="button" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transition text-left">
              <div className="flex items-center gap-3">
                <Copy className="h-4 w-4" />
                Copier un lien AR
              </div>
            </button>
            <button type="button" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transition text-left">
              <div className="flex items-center gap-3">
                <Play className="h-4 w-4" />
                Tester sur mobile
              </div>
            </button>
            <button type="button" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transition text-left">
              <div className="flex items-center gap-3">
                <Share2 className="h-4 w-4" />
                Partager avec un client
              </div>
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Bibliothèque AR</h2>
            <p className="mt-1 text-sm text-slate-500">Liste des modèles prêts pour AR et leur statut de génération.</p>
          </div>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">Vue aérée</span>
        </div>

        {toast && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {toast}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
              Chargement de la bibliothèque AR...
            </span>
          </div>
        )}

        {!loading && (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 lg:grid-cols-[240px_1fr]">
              <div className="flex flex-col gap-4">
                <div className="h-40 rounded-3xl bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
                  Aperçu
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-900">{item.title}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(item.status)}`}>
                      {statusLabel(item.status)}
                    </span>
                  </div>
                  <p>Compatibilité : Android / iOS / WebAR</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Format utilisé</p>
                    <p className="mt-2 text-slate-900 font-semibold">{item.format || '—'}</p>
                  </div>
                  <div className="rounded-3xl bg-white border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Taille du fichier</p>
                    <p className="mt-2 text-slate-900 font-semibold">{formatSize(item.sizeBytes)}</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Date de génération</p>
                    <p className="mt-2 text-slate-900 font-semibold">{formatDate(item.generatedAt)}</p>
                  </div>
                  <div className="rounded-3xl bg-white border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Dernière mise à jour</p>
                    <p className="mt-2 text-slate-900 font-semibold">{formatDate(item.updatedAt)}</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl bg-white border border-slate-200 p-4 text-center">
                    <p className="text-sm text-slate-500">Ouvertures</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{item.experience?.opens ?? 0}</p>
                  </div>
                  <div className="rounded-3xl bg-white border border-slate-200 p-4 text-center">
                    <p className="text-sm text-slate-500">Scans QR</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{item.experience?.qrScans ?? 0}</p>
                  </div>
                  <div className="rounded-3xl bg-white border border-slate-200 p-4 text-center">
                    <p className="text-sm text-slate-500">Partages</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{item.experience?.shares ?? 0}</p>
                  </div>
                </div>
                <div className="rounded-3xl bg-white border border-slate-200 p-4 text-sm text-slate-700">
                  <p className="text-slate-500">Appareils utilisés</p>
                  <p className="mt-2 text-slate-900">
                    {item.experience?.devices && Object.keys(item.experience.devices).length
                      ? Object.entries(item.experience.devices)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 3)
                          .map(([k, v]) => `${k} ${v}`)
                          .join(' · ')
                      : '—'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleShowQr(item)}
                    disabled={busyId === item.id || item.status !== 'completed'}
                    className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-60"
                  >
                    <QrCode className="h-4 w-4" />
                    QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (item.experience?.publicUrl) return handleCopy(item.experience.publicUrl);
                      return handleGenerate(item.id);
                    }}
                    disabled={busyId === item.id || item.status !== 'completed'}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transition disabled:opacity-60"
                  >
                    <Copy className="h-4 w-4" />
                    {busyId === item.id ? 'Génération...' : item.experience?.publicUrl ? 'Copier lien AR' : 'Générer lien AR'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = item.fileUrl ? getFileUrl(item.fileUrl) : '';
                      if (!url) {
                        setError("URL du modèle indisponible.");
                        return;
                      }
                      const p = new URLSearchParams({ platform: 'android', url });
                      window.open(`/ar/view?${p.toString()}`, '_blank');
                    }}
                    disabled={!item.fileUrl}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transition disabled:opacity-60"
                  >
                    <Play className="h-4 w-4" />
                    Tester mobile
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare(item)}
                    disabled={!item.experience?.publicUrl}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transition disabled:opacity-60"
                  >
                    <Share2 className="h-4 w-4" />
                    Partager
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </section>

      {qrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setQrOpen(false)} />
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">QR Code</p>
                <p className="mt-1 text-sm text-slate-500 truncate">{qrTitle}</p>
              </div>
              <button
                type="button"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                onClick={() => setQrOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 p-6">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code AR" className="h-56 w-56" />
              ) : (
                <div className="text-sm text-slate-500">QR code indisponible</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
