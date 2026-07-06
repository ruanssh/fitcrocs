import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';
import { Field } from '../components/ui/form-field';

export function RegisterPage() {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = useMemo(() => {
    const state = location.state as { from?: { pathname?: string } } | null;
    return state?.from?.pathname ?? '/dashboard';
  }, [location.state]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t('auth:register.passwordMismatch'));
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ name, email, password });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        if (typeof message === 'string') {
          setError(message);
        } else if (Array.isArray(message) && message.length > 0) {
          setError(String(message[0]));
        } else {
          setError(t('auth:register.genericError'));
        }
      } else {
        setError(t('auth:register.genericError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Paper className="w-full max-w-md p-8">
        <Typography variant="overline" color="primary" component="p">
          {t('common:brand')}
        </Typography>
        <Typography variant="h4" component="h1" sx={{ mt: 1.5, color: 'var(--enamel)' }}>
          {t('auth:register.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('auth:register.subtitle')}
        </Typography>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <Field
            label={t('auth:register.name')}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
            slotProps={{ input: { minLength: 2 } }}
          />

          <Field
            label={t('auth:register.email')}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <Field
            label={t('auth:register.password')}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
            slotProps={{ input: { minLength: 6 } }}
          />

          <Field
            label={t('auth:register.confirmPassword')}
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
            slotProps={{ input: { minLength: 6 } }}
          />

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? t('auth:register.submitting') : t('auth:register.submit')}
          </Button>
        </form>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          {t('auth:register.hasAccount')}{' '}
          <Link component={RouterLink} to="/login">
            {t('auth:register.signIn')}
          </Link>
        </Typography>
      </Paper>
    </main>
  );
}
