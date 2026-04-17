import { BarChart3, ChevronDown, ClipboardList, LogOut, User } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';

function navClassName(isActive: boolean) {
  if (isActive) {
    return 'inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-800';
  }

  return 'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900';
}

export function AppLayout() {
  const { t } = useTranslation('common');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const initials = useMemo(() => {
    const name = user?.name?.trim();
    if (!name) return 'U';

    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? 'U';

    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }, [user?.name]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!userMenuRef.current) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.14),transparent_44%),linear-gradient(180deg,#f6faf9_0%,#edf4f2_100%)]" />

      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                {t('brand')}
              </p>
            </div>

            <nav className="flex items-center gap-1">
              <NavLink to="/dashboard" className={({ isActive }) => navClassName(isActive)}>
                <BarChart3 className="h-4 w-4" />
                {t('dashboard')}
              </NavLink>
              <NavLink to="/workouts" className={({ isActive }) => navClassName(isActive)}>
                <ClipboardList className="h-4 w-4" />
                {t('workouts')}
              </NavLink>
            </nav>
          </div>

          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
              aria-label={t('menu.openUserMenu')}
              onClick={() => setIsUserMenuOpen((current) => !current)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {user?.photoBase64 ? (
                <img
                  src={user.photoBase64}
                  alt={user.name ?? 'Foto de perfil'}
                  className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold tracking-wide text-emerald-800">
                  {initials}
                </span>
              )}
              <span className="hidden max-w-[160px] truncate sm:block">{user?.name ?? '-'}</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition ${isUserMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isUserMenuOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_20px_45px_-28px_rgba(15,23,42,0.38)]"
              >
                <div className="border-b border-slate-100 px-3 py-2.5">
                  <p className="text-sm font-semibold text-slate-900">{user?.name ?? '-'}</p>
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <User className="h-4 w-4" />
                  {t('profile')}
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  {t('logout')}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
