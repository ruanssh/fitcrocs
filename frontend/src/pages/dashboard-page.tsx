import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
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
    <div className="min-h-screen pb-10">
      <header className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <Typography variant="overline" color="primary" component="p">
          {t('header.title')}
        </Typography>
        <Typography variant="h4" component="h1" sx={{ mt: 1, color: 'var(--enamel)' }}>
          {t('header.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: '42rem' }}>
          {t('header.subtitle')}
        </Typography>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-4 px-4 sm:space-y-6 sm:px-6 lg:px-8">
        <Paper className="p-4">
          <Typography variant="body2" color="text.secondary">
            {t('header.currentYearInfo', { year: filters.from.slice(0, 4) })}
          </Typography>
        </Paper>

        {hasError ? <Alert severity="error">{t('header.loadError')}</Alert> : null}

        <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
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
