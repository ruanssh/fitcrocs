import axios from 'axios';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.20),transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.14),transparent_40%),linear-gradient(180deg,#f8fafc_0%,#eef6f3_100%)]" />

      <section className="w-full max-w-md rounded-3xl border border-white/60 bg-white/92 p-8 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.45)] backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
          {t('common:brand')}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          {t('auth:register.title')}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {t('auth:register.subtitle')}
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              {t('auth:register.name')}
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              minLength={2}
              required
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none ring-emerald-500 transition focus:border-emerald-500 focus:bg-white focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              {t('auth:register.email')}
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none ring-emerald-500 transition focus:border-emerald-500 focus:bg-white focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              {t('auth:register.password')}
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none ring-emerald-500 transition focus:border-emerald-500 focus:bg-white focus:ring-2"
            />
          </label>

          <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {t('auth:register.confirmPassword')}
              </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none ring-emerald-500 transition focus:border-emerald-500 focus:bg-white focus:ring-2"
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t('auth:register.submitting') : t('auth:register.submit')}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          {t('auth:register.hasAccount')}{' '}
          <Link className="font-semibold text-emerald-700 hover:text-emerald-800" to="/login">
            {t('auth:register.signIn')}
          </Link>
        </p>
      </section>
    </main>
  );
}
