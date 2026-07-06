import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAuth } from './use-auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('auth');
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border border-soot bg-surface px-6 py-4 text-sm font-medium uppercase tracking-wide text-ash">
          {t('protectedRoute.loadingSession')}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
