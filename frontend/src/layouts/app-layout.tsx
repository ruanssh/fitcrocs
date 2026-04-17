import { BarChart3, ClipboardList, LogOut } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';

function navClassName(isActive: boolean) {
  if (isActive) {
    return 'inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-800';
  }

  return 'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900';
}

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="relative min-h-screen bg-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.14),transparent_44%),linear-gradient(180deg,#f6faf9_0%,#edf4f2_100%)]" />

      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Fitcrocs
              </p>
            </div>

            <nav className="flex items-center gap-1">
              <NavLink to="/dashboard" className={({ isActive }) => navClassName(isActive)}>
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </NavLink>
              <NavLink to="/workouts" className={({ isActive }) => navClassName(isActive)}>
                <ClipboardList className="h-4 w-4" />
                Treinos
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-right shadow-sm sm:block">
              <p className="text-xs uppercase tracking-wide text-slate-500">Usuario</p>
              <p className="text-sm font-medium text-slate-800">{user?.name ?? '-'}</p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
