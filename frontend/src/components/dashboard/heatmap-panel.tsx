import { X } from 'lucide-react';
import { cloneElement, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityCalendar, type Activity } from 'react-activity-calendar';
import type { HeatmapDay } from '../../types/dashboard';

type HeatmapPanelProps = {
  days: HeatmapDay[];
  isLoading: boolean;
};

const theme = {
  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
};

function toActivities(days: HeatmapDay[]): Activity[] {
  return days.map((day) => ({
    date: day.date,
    count: day.count,
    level: day.level,
  }));
}

export function HeatmapPanel({ days, isLoading }: HeatmapPanelProps) {
  const { t } = useTranslation('dashboard');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const activities = toActivities(days);
  const dayByDate = useMemo(() => new Map(days.map((day) => [day.date, day])), [days]);

  const selectedDay = selectedDate ? dayByDate.get(selectedDate) : null;

  function formatDateLabel(date: string) {
    return new Date(`${date}T00:00:00.000Z`).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    });
  }

  function formatTimeLabel(value: string | null) {
    if (!value) return '-';

    return new Date(value).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  useEffect(() => {
    function syncViewport() {
      setIsCompact(window.innerWidth < 640);
    }

    syncViewport();
    window.addEventListener('resize', syncViewport);

    return () => {
      window.removeEventListener('resize', syncViewport);
    };
  }, []);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-5">
      <header className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          {t('heatmap.title')}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {t('heatmap.subtitle')}
        </p>
      </header>

      <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 sm:hidden">
        Arraste para o lado para ver todos os meses e toque em um dia para abrir os detalhes.
      </div>

      <div className="overflow-x-auto pb-1">
        <ActivityCalendar
          data={activities}
          loading={isLoading}
          theme={theme}
          colorScheme="light"
          maxLevel={4}
          blockSize={isCompact ? 11 : 15}
          blockMargin={isCompact ? 3 : 4}
          fontSize={isCompact ? 10 : 13}
          labels={{
            totalCount: t('heatmap.totalCount'),
          }}
          tooltips={{
            activity: {
              text: (activity) =>
                t('heatmap.tooltip', {
                  count: activity.count,
                  date: new Date(activity.date).toLocaleDateString('pt-BR'),
                }),
            },
          }}
          renderBlock={(block, activity) =>
            cloneElement(block, {
              onClick: () => setSelectedDate(activity.date),
              className: 'cursor-pointer',
            })
          }
          showWeekdayLabels={!isCompact}
          weekStart={1}
        />
      </div>

      {selectedDay ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t('heatmap.detailsTitle')}
              </p>
              <h3 className="text-sm font-semibold leading-6 text-slate-900">
                {t('heatmap.detailsHeading', {
                  date: formatDateLabel(selectedDay.date),
                  count: selectedDay.count,
                })}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDate(null)}
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white p-1.5 text-slate-600 transition hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {selectedDay.workouts.length === 0 ? (
            <p className="text-sm text-slate-600">{t('heatmap.noWorkouts')}</p>
          ) : (
            <ul className="space-y-2">
              {selectedDay.workouts.map((workout) => (
                <li
                  key={workout.id}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t('heatmap.workoutTime', {
                      start: formatTimeLabel(workout.startAt),
                      end: formatTimeLabel(workout.endAt),
                    })}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {workout.notes?.trim() || t('heatmap.noNotes')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </section>
  );
}
