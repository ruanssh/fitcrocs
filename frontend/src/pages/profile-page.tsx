import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
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
        <Typography variant="overline" color="primary" component="p">
          {t('profilePage.badge')}
        </Typography>
        <Typography variant="h4" component="h1" sx={{ mt: 1, color: 'var(--enamel)' }}>
          {t('profilePage.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('profilePage.subtitle')}
        </Typography>
      </div>

      <Paper className="grid gap-4 p-6 sm:grid-cols-2">
        <article>
          <p className="text-xs font-semibold uppercase tracking-wide text-ash">
            {t('profilePage.fields.name')}
          </p>
          <p className="mt-1 text-sm font-medium text-cement">{user?.name ?? '-'}</p>
        </article>

        <article>
          <p className="text-xs font-semibold uppercase tracking-wide text-ash">
            {t('profilePage.fields.email')}
          </p>
          <p className="mt-1 text-sm font-medium text-cement">{user?.email ?? '-'}</p>
        </article>
      </Paper>

      <Paper className="mt-6 p-6">
        <Typography variant="h6" component="h2" sx={{ color: 'var(--enamel)' }}>
          {t('profilePage.photo.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {t('profilePage.photo.subtitle')}
        </Typography>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar
            src={previewPhoto ?? undefined}
            alt={t('profilePage.photo.previewAlt')}
            sx={{ width: 96, height: 96 }}
          >
            {t('profilePage.photo.previewAlt')}
          </Avatar>

          <div className="flex flex-col gap-2">
            <Button component="label">
              {t('profilePage.photo.choose')}
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                hidden
              />
            </Button>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="contained"
                onClick={handleSavePhoto}
                disabled={isSavingPhoto}
              >
                {isSavingPhoto
                  ? t('profilePage.photo.saving')
                  : t('profilePage.photo.save')}
              </Button>

              <Button
                color="error"
                onClick={handleRemovePhoto}
                disabled={isSavingPhoto}
              >
                {t('profilePage.photo.remove')}
              </Button>
            </div>
          </div>
        </div>

        {photoError ? (
          <Alert severity="error" sx={{ mt: 3 }}>
            {photoError}
          </Alert>
        ) : null}

        {photoSuccess ? (
          <Alert severity="success" sx={{ mt: 3 }}>
            {photoSuccess}
          </Alert>
        ) : null}
      </Paper>
    </main>
  );
}
