import { useTranslation } from 'react-i18next';
import { HeatmapPanel } from '../components/dashboard/heatmap-panel';
import { KpiCard } from '../components/dashboard/kpi-card';
import { TopExercisesPanel } from '../components/dashboard/top-exercises-panel';
import {
  useDashboardHeatmap,
  useDashboardSummary,
  useTopExercises,
} from '../hooks/use-dashboard';
import { getCurrentYearRange } from '../lib/date-range';

function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function DashboardPage() {
  const { t } = useTranslation('dashboard');
  const filters = getCurrentYearRange();

  const summaryQuery = useDashboardSummary(filters);
  const heatmapQuery = useDashboardHeatmap(filters);
  const topExercisesQuery = useTopExercises({ ...filters, limit: 10 });

  const hasError = Boolean(
    summaryQuery.error || heatmapQuery.error || topExercisesQuery.error,
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 pb-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.16),transparent_45%),linear-gradient(180deg,#f6faf9_0%,#edf4f2_100%)]" />

      <header className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
          {t('header.title')}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {t('header.title')}
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          {t('header.subtitle')}
        </p>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 text-sm text-slate-700 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.35)]">
          {t('header.currentYearInfo', { year: filters.from.slice(0, 4) })}
        </section>

        {hasError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {t('header.loadError')}
          </div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title={t('kpis.workoutsTitle')}
            value={formatNumber(summaryQuery.data?.totalWorkouts ?? 0)}
            description={t('kpis.workoutsDescription')}
          />
          <KpiCard
            title={t('kpis.activeMonthsTitle')}
            value={formatNumber(summaryQuery.data?.activeMonths ?? 0)}
            description={t('kpis.activeMonthsDescription')}
          />
          <KpiCard
            title={t('kpis.exercisesTitle')}
            value={formatNumber(summaryQuery.data?.totalExercisesLogged ?? 0)}
            description={t('kpis.exercisesDescription')}
          />
          <KpiCard
            title={t('kpis.averageTitle')}
            value={(summaryQuery.data?.avgWorkoutsPerActiveMonth ?? 0).toFixed(2)}
            description={t('kpis.averageDescription')}
          />
        </section>

        <section className="grid gap-6">
          <HeatmapPanel
            days={heatmapQuery.data?.days ?? []}
            isLoading={heatmapQuery.isLoading}
          />
          <TopExercisesPanel
            items={topExercisesQuery.data?.items ?? []}
            isLoading={topExercisesQuery.isLoading}
          />
        </section>
      </main>
    </div>
  );
}
