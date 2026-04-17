import { Activity, Dumbbell, TrendingUp } from 'lucide-react';
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
          Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Evolucao de treino
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Controle mensal de frequencia e exercicios mais praticados.
        </p>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 text-sm text-slate-700 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.35)]">
          Dados exibidos para o ano atual ({filters.from.slice(0, 4)}), de janeiro a dezembro.
        </section>

        {hasError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Nao foi possivel carregar os dados do dashboard com o periodo atual.
          </div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Treinos no periodo"
            value={formatNumber(summaryQuery.data?.totalWorkouts ?? 0)}
            description="Quantidade total de dias com treino registrado."
          />
          <KpiCard
            title="Meses com atividade"
            value={formatNumber(summaryQuery.data?.activeMonths ?? 0)}
            description="Meses onde houve pelo menos um treino."
          />
          <KpiCard
            title="Exercicios registrados"
            value={formatNumber(summaryQuery.data?.totalExercisesLogged ?? 0)}
            description="Total de exercicios adicionados nos treinos."
          />
          <KpiCard
            title="Media por mes ativo"
            value={(summaryQuery.data?.avgWorkoutsPerActiveMonth ?? 0).toFixed(2)}
            description="Ritmo medio de treinos para os meses ativos."
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <HeatmapPanel
            days={heatmapQuery.data?.days ?? []}
            isLoading={heatmapQuery.isLoading}
          />
          <TopExercisesPanel
            items={topExercisesQuery.data?.items ?? []}
            isLoading={topExercisesQuery.isLoading}
          />
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.35)]">
            <div className="mb-2 inline-flex rounded-lg bg-emerald-100 p-2 text-emerald-700">
              <Dumbbell className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">Top 10 exercicios</h3>
            <p className="mt-1 text-sm text-slate-600">
              Ranking automatico para identificar padroes de treino.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.35)]">
            <div className="mb-2 inline-flex rounded-lg bg-cyan-100 p-2 text-cyan-700">
              <Activity className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">Heatmap diario</h3>
            <p className="mt-1 text-sm text-slate-600">
              Escala de intensidade por dia no estilo calendario de atividade.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.35)]">
            <div className="mb-2 inline-flex rounded-lg bg-slate-200 p-2 text-slate-700">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">Comparativo mensal</h3>
            <p className="mt-1 text-sm text-slate-600">
              Periodo customizavel para acompanhar consistencia de treino.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
