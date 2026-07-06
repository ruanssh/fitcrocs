import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';
import { Field } from '../components/ui/form-field';

export function LoginPage() {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    setIsSubmitting(true);
    setError(null);

    try {
      await login({ email, password });
      navigate(redirectPath, { replace: true });
    } catch {
      setError(t('auth:login.error'));
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
          {t('auth:login.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('auth:login.subtitle')}
        </Typography>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <Field
            label={t('auth:login.email')}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <Field
            label={t('auth:login.password')}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? t('auth:login.submitting') : t('auth:login.submit')}
          </Button>
        </form>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          {t('auth:login.noAccount')}{' '}
          <Link component={RouterLink} to="/register">
            {t('auth:login.createAccount')}
          </Link>
        </Typography>
      </Paper>
    </main>
  );
}
