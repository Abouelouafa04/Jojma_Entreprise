import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, MapPin, CalendarCheck, Image as ImageIcon, Edit3, Activity, Mail, Phone, X, Check } from 'lucide-react';
import { getFileUrl } from '../api/api';
import { deleteMyAccount, getMyProfile, updateMyProfile, updateMyProfilePhoto, type AccountType, type UserProfile } from '../api/profile.api';
import { useAuth } from '../contexts/AuthContext';

const profileTypeLabels: Record<string, string> = {
  creator: 'Créateur',
  company: 'Entreprise',
  studio: 'Studio',
  agency: 'Agence',
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, token, logout, updateUser } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [draft, setDraft] = useState({
    fullName: '',
    phone: '',
    location: '',
    company: '',
    industry: '',
    jobTitle: '',
    accountType: 'company' as AccountType,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  const initials = useMemo(() => {
    const name = (profile?.fullName || user?.fullName || 'Utilisateur').trim();
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .filter(Boolean)
      .join('');
  }, [profile?.fullName, user?.fullName]);

  const resolvedPhotoUrl = useMemo(() => {
    if (photoPreviewUrl) return photoPreviewUrl;
    const url = profile?.profilePhotoUrl || user?.profilePhotoUrl || null;
    return url ? getFileUrl(url) : null;
  }, [photoPreviewUrl, profile?.profilePhotoUrl, user?.profilePhotoUrl]);

  useEffect(() => {
    if (!token) return;

    let mounted = true;
    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const p = await getMyProfile();
        if (!mounted) return;
        setProfile(p);
        setDraft({
          fullName: p.fullName || '',
          phone: p.phone || '',
          location: p.location || '',
          company: p.company || '',
          industry: p.industry || '',
          jobTitle: p.jobTitle || '',
          accountType: p.accountType,
        });
        updateUser({
          fullName: p.fullName,
          accountType: p.accountType,
          phone: p.phone,
          location: p.location,
          company: p.company,
          industry: p.industry,
          jobTitle: p.jobTitle,
          profilePhotoUrl: p.profilePhotoUrl,
        });
      } catch (e: any) {
        const msg = e?.message || 'Impossible de charger le profil.';
        setError(msg);
        if (msg.toLowerCase().includes('token') || msg.includes('401')) {
          await logout();
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [token, logout, updateUser]);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const usageLabel = profileTypeLabels[(profile?.accountType || user?.accountType || 'company') as AccountType] || 'Utilisateur';

  const validateDraft = () => {
    const fullName = draft.fullName.trim();
    if (fullName.length < 2) return 'Le nom complet doit contenir au moins 2 caractères.';
    if (draft.phone && draft.phone.trim().length < 6) return 'Le téléphone semble invalide.';
    return null;
  };

  const handleStartEdit = () => {
    if (!profile) return;
    setSuccess(null);
    setError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (!profile) return;
    setDraft({
      fullName: profile.fullName || '',
      phone: profile.phone || '',
      location: profile.location || '',
      company: profile.company || '',
      industry: profile.industry || '',
      jobTitle: profile.jobTitle || '',
      accountType: profile.accountType,
    });
    setError(null);
    setSuccess(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const validationError = validateDraft();
    if (validationError) {
      setError(validationError);
      setSuccess(null);
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await updateMyProfile({
        fullName: draft.fullName.trim(),
        phone: draft.phone.trim(),
        location: draft.location.trim(),
        company: draft.company.trim(),
        industry: draft.industry.trim(),
        jobTitle: draft.jobTitle.trim(),
        accountType: draft.accountType,
      });
      setProfile(res.data.profile);
      updateUser({
        fullName: res.data.profile.fullName,
        accountType: res.data.profile.accountType,
        phone: res.data.profile.phone,
        location: res.data.profile.location,
        company: res.data.profile.company,
        industry: res.data.profile.industry,
        jobTitle: res.data.profile.jobTitle,
        profilePhotoUrl: res.data.profile.profilePhotoUrl,
      });
      setIsEditing(false);
      setSuccess(res.message || 'Profil mis à jour.');
    } catch (e: any) {
      setError(e?.message || 'Échec de la mise à jour.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePickPhoto = () => {
    setSuccess(null);
    setError(null);
    fileInputRef.current?.click();
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) return;
    setIsUploadingPhoto(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await updateMyProfilePhoto(photoFile);
      setProfile(res.data.profile);
      updateUser({ profilePhotoUrl: res.data.profile.profilePhotoUrl });
      setPhotoFile(null);
      setSuccess(res.message || 'Photo mise à jour.');
    } catch (e: any) {
      setError(e?.message || 'Échec de la mise à jour de la photo.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteMyAccount();
      await logout();
      navigate('/login', { replace: true });
    } catch (e: any) {
      setError(e?.message || 'Impossible de supprimer le compte.');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setDeleteConfirm('');
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="flex items-center gap-3 text-slate-700">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
          <span className="text-sm font-semibold">Chargement du profil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 font-medium text-slate-700">
                <User className="h-4 w-4 text-indigo-600" />
                Profil
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Identité & aperçu du compte</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Profil utilisateur</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Retrouvez vos informations personnelles et professionnelles, gérez votre identité sur JOJMA et améliorez votre expérience au quotidien.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {!isEditing ? (
              <button
                type="button"
                onClick={handleStartEdit}
                disabled={isLoading || !profile}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
              >
                <Edit3 className="h-4 w-4" />
                Modifier le profil
              </button>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-60"
                >
                  <X className="h-4 w-4" />
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {isSaving ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Enregistrement...
                    </span>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Enregistrer
                    </>
                  )}
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={handlePickPhoto}
              disabled={isLoading || !profile}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-60"
            >
              <ImageIcon className="h-4 w-4" />
              Mettre à jour la photo
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              <Activity className="h-4 w-4" />
              Historique
            </button>
          </div>
        </div>
      </div>

      {(error || success) && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              <strong className="font-semibold">Erreur:</strong> {error}
            </div>
          )}
          {success && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <strong className="font-semibold">Succès:</strong> {success}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-12">
        <section className="space-y-6 xl:col-span-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-5">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-25 blur" />
                  <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg ring-1 ring-white/20">
                    {resolvedPhotoUrl ? (
                      <img src={resolvedPhotoUrl} alt="Photo de profil" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold tracking-tight">{initials || 'U'}</span>
                    )}
                  </div>
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-2xl font-semibold tracking-tight text-slate-900">{profile?.fullName || user?.fullName || 'Utilisateur JOJMA'}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                      {usageLabel}
                    </span>
                    <span className="text-sm text-slate-500">{profile?.email || user?.email || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:w-[420px]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-medium text-slate-500">Projets</p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">—</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-medium text-slate-500">Modèles</p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">—</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-medium text-slate-500">Liens AR</p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">—</p>
                </div>
              </div>
            </div>
          </div>

          <div id="informations" className="grid gap-6 lg:grid-cols-2 scroll-mt-24">
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Informations personnelles</h3>
                  <p className="mt-1 text-sm text-slate-500">Coordonnées et localisation.</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
              </div>

              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <dt className="flex items-center gap-2 text-slate-600">
                    <User className="h-4 w-4 text-indigo-600" />
                    Nom complet
                  </dt>
                  <dd className="font-medium text-slate-900">
                    {isEditing ? (
                      <input
                        value={draft.fullName}
                        onChange={(e) => setDraft((d) => ({ ...d, fullName: e.target.value }))}
                        placeholder="Votre nom"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                      />
                    ) : (
                      profile?.fullName || user?.fullName || '—'
                    )}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <dt className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4 text-indigo-600" />
                    Email
                  </dt>
                  <dd className="truncate font-medium text-slate-900">{profile?.email || user?.email || '—'}</dd>
                </div>
                <div className="flex items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <dt className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4 text-indigo-600" />
                    Téléphone
                  </dt>
                  <dd className="font-medium text-slate-900">
                    {isEditing ? (
                      <input
                        value={draft.phone}
                        onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                        placeholder="+33 6 12 34 56 78"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                      />
                    ) : (
                      profile?.phone || '—'
                    )}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <dt className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                    Localisation
                  </dt>
                  <dd className="font-medium text-slate-900">
                    {isEditing ? (
                      <input
                        value={draft.location}
                        onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                        placeholder="France / Paris"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                      />
                    ) : (
                      profile?.location || '—'
                    )}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Informations professionnelles</h3>
                  <p className="mt-1 text-sm text-slate-500">Rôle, entreprise et secteur.</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                  <Briefcase className="h-5 w-5 text-indigo-600" />
                </div>
              </div>

              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <dt className="text-slate-600">Poste</dt>
                  <dd className="font-medium text-slate-900">
                    {isEditing ? (
                      <input
                        value={draft.jobTitle}
                        onChange={(e) => setDraft((d) => ({ ...d, jobTitle: e.target.value }))}
                        placeholder="Architecte"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                      />
                    ) : (
                      profile?.jobTitle || '—'
                    )}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <dt className="text-slate-600">Entreprise</dt>
                  <dd className="font-medium text-slate-900">
                    {isEditing ? (
                      <input
                        value={draft.company}
                        onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))}
                        placeholder="JOJMA Studio"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                      />
                    ) : (
                      profile?.company || '—'
                    )}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <dt className="text-slate-600">Secteur</dt>
                  <dd className="font-medium text-slate-900">
                    {isEditing ? (
                      <input
                        value={draft.industry}
                        onChange={(e) => setDraft((d) => ({ ...d, industry: e.target.value }))}
                        placeholder="Architecture & Design"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                      />
                    ) : (
                      profile?.industry || '—'
                    )}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <dt className="text-slate-600">Type d’utilisation</dt>
                  <dd className="font-medium text-slate-900">
                    {isEditing ? (
                      <select
                        value={draft.accountType}
                        onChange={(e) => setDraft((d) => ({ ...d, accountType: e.target.value as AccountType }))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="creator">Créateur</option>
                        <option value="company">Entreprise</option>
                        <option value="studio">Studio</option>
                        <option value="agency">Agence</option>
                      </select>
                    ) : (
                      usageLabel
                    )}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </section>

        <aside className="space-y-6 xl:col-span-4">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Résumé du compte</h3>
                <p className="mt-1 text-sm text-slate-500">Vos métriques clés, en un coup d’œil.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <CalendarCheck className="h-5 w-5 text-indigo-600" />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-xs font-medium text-slate-500">Date d’inscription</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-xs font-medium text-slate-500">Projets créés</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">—</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-xs font-medium text-slate-500">Modèles importés</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">—</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-xs font-medium text-slate-500">Liens AR générés</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">—</p>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setPhotoFile(file);
          if (e.target) e.target.value = '';
        }}
      />

      {photoFile && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">Aperçu de la nouvelle photo</p>
              <p className="mt-1 text-sm text-slate-500 truncate">{photoFile.name}</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPhotoFile(null)}
                disabled={isUploadingPhoto}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-60"
              >
                <X className="h-4 w-4" />
                Annuler
              </button>
              <button
                type="button"
                onClick={handleUploadPhoto}
                disabled={isUploadingPhoto}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {isUploadingPhoto ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Upload...
                  </span>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Mettre à jour
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Gérer le compte</h3>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">Supprimer le compte</p>
            <p className="mt-1 text-sm text-slate-500">Supprime définitivement votre compte JOJMA.</p>
          </div>
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
          >
            Supprimer
          </button>
        </div>
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => (!isDeleting ? setDeleteModalOpen(false) : null)} />
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-base font-semibold text-slate-900">Supprimer votre compte ?</h4>
                <p className="mt-1 text-sm text-slate-600">
                  Cette action est irréversible. Tapez <span className="font-semibold">SUPPRIMER</span> pour confirmer.
                </p>
              </div>
              <button
                type="button"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="SUPPRIMER"
              className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-rose-400 focus:outline-none"
              disabled={isDeleting}
            />

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                Annuler
              </button>
              <button
                type="button"
                className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirm.trim().toUpperCase() !== 'SUPPRIMER'}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer le compte'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
