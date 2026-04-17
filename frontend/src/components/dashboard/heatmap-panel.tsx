import { ActivityCalendar, type Activity } from 'react-activity-calendar';
import type { HeatmapDay } from '../../types/dashboard';

type HeatmapPanelProps = {
  days: HeatmapDay[];
  isLoading: boolean;
};

const theme = {
  light: ['#edf2f7', '#bde9dc', '#78d7be', '#35bd9e', '#1f8f78'],
};

function toActivities(days: HeatmapDay[]): Activity[] {
  return days.map((day) => ({
    date: day.date,
    count: day.count,
    level: day.level,
  }));
}

export function HeatmapPanel({ days, isLoading }: HeatmapPanelProps) {
  const activities = toActivities(days);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <header className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Frequencia diaria
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Visualizacao de treinos por dia, com intensidade em escala progressiva.
        </p>
      </header>

      <div className="overflow-x-auto pb-1">
        <ActivityCalendar
          data={activities}
          loading={isLoading}
          theme={theme}
          maxLevel={4}
          blockSize={14}
          blockMargin={4}
          fontSize={13}
          labels={{
            totalCount: '{{count}} treino(s) no ano',
          }}
          tooltips={{
            activity: {
              text: (activity) =>
                `${activity.count} treino(s) em ${new Date(activity.date).toLocaleDateString('pt-BR')}`,
            },
          }}
          showWeekdayLabels
          weekStart={1}
        />
      </div>
    </section>
  );
}
