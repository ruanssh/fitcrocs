import axios from 'axios';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/use-auth';

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsDataURL(file);
  });
}

export function ProfilePage() {
  const { t } = useTranslation('common');
  const { user, updateMyPhoto } = useAuth();
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPhotoError(null);
    setPhotoSuccess(null);

    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setPendingPhoto(null);
      setPhotoError(t('profilePage.photo.invalidType'));
      return;
    }

    if (file.size > MAX_PHOTO_BYTES) {
      setPendingPhoto(null);
      setPhotoError(t('profilePage.photo.invalidSize'));
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setPendingPhoto(base64);
    } catch {
      setPendingPhoto(null);
      setPhotoError(t('profilePage.photo.genericError'));
    }
  }

  async function handleSavePhoto() {
    if (!pendingPhoto) {
      setPhotoError(t('profilePage.photo.noSelection'));
      return;
    }

    setIsSavingPhoto(true);
    setPhotoError(null);
    setPhotoSuccess(null);

    try {
      await updateMyPhoto(pendingPhoto);
      setPendingPhoto(null);
      setPhotoSuccess(t('profilePage.photo.success'));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        if (typeof message === 'string') {
          setPhotoError(message);
        } else {
          setPhotoError(t('profilePage.photo.genericError'));
        }
      } else {
        setPhotoError(t('profilePage.photo.genericError'));
      }
    } finally {
      setIsSavingPhoto(false);
    }
  }

  async function handleRemovePhoto() {
    setIsSavingPhoto(true);
    setPhotoError(null);
    setPhotoSuccess(null);

    try {
      await updateMyPhoto(null);
      setPendingPhoto(null);
      setPhotoSuccess(t('profilePage.photo.removeSuccess'));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        if (typeof message === 'string') {
          setPhotoError(message);
        } else {
          setPhotoError(t('profilePage.photo.genericError'));
        }
      } else {
        setPhotoError(t('profilePage.photo.genericError'));
      }
    } finally {
      setIsSavingPhoto(false);
    }
  }

  const previewPhoto = pendingPhoto ?? user?.photoBase64 ?? null;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          {t('profilePage.badge')}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          {t('profilePage.title')}
        </h1>
        <p className="mt-2 text-sm text-slate-600">{t('profilePage.subtitle')}</p>
      </div>

      <section className="grid gap-4 rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.35)] sm:grid-cols-2">
        <article>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('profilePage.fields.name')}
          </p>
          <p className="mt-1 text-sm font-medium text-slate-900">{user?.name ?? '-'}</p>
        </article>

        <article>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('profilePage.fields.email')}
          </p>
          <p className="mt-1 text-sm font-medium text-slate-900">{user?.email ?? '-'}</p>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.35)]">
        <h2 className="text-lg font-semibold text-slate-900">{t('profilePage.photo.title')}</h2>
        <p className="mt-1 text-sm text-slate-600">{t('profilePage.photo.subtitle')}</p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          {previewPhoto ? (
            <img
              src={previewPhoto}
              alt={t('profilePage.photo.previewAlt')}
              className="h-24 w-24 rounded-full border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-500">
              {t('profilePage.photo.previewAlt')}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              {t('profilePage.photo.choose')}
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSavePhoto}
                disabled={isSavingPhoto}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSavingPhoto
                  ? t('profilePage.photo.saving')
                  : t('profilePage.photo.save')}
              </button>

              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={isSavingPhoto}
                className="inline-flex items-center justify-center rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {t('profilePage.photo.remove')}
              </button>
            </div>
          </div>
        </div>

        {photoError ? (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {photoError}
          </p>
        ) : null}

        {photoSuccess ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {photoSuccess}
          </p>
        ) : null}
      </section>
    </main>
  );
}
