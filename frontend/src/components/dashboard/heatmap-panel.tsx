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

const mobileWeekdayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
const mobileLevelClasses = [
  'border-slate-200 bg-white text-slate-500',
  'border-emerald-200 bg-emerald-50 text-emerald-700',
  'border-emerald-300 bg-emerald-100 text-emerald-800',
  'border-emerald-400 bg-emerald-200 text-emerald-900',
  'border-emerald-500 bg-emerald-500 text-white',
];

function toActivities(days: HeatmapDay[]): Activity[] {
  return days.map((day) => ({
    date: day.date,
    count: day.count,
    level: day.level,
  }));
}

function parseDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

function formatMonthLabel(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parseDate(date));
}

function getMonthSummaries(days: HeatmapDay[]) {
  const months = new Map<
    string,
    {
      monthLabel: string;
      totalWorkouts: number;
      activeDays: number;
      leadingEmptyDays: number;
      days: HeatmapDay[];
    }
  >();

  days.forEach((day) => {
    const monthKey = day.date.slice(0, 7);

    if (!months.has(monthKey)) {
      const parsedDate = parseDate(day.date);
      const weekday = parsedDate.getUTCDay();
      const leadingEmptyDays = weekday === 0 ? 6 : weekday - 1;

      months.set(monthKey, {
        monthLabel: formatMonthLabel(day.date),
        totalWorkouts: 0,
        activeDays: 0,
        leadingEmptyDays,
        days: [],
      });
    }

    const month = months.get(monthKey);

    if (!month) return;

    month.days.push(day);
    month.totalWorkouts += day.count;

    if (day.count > 0) {
      month.activeDays += 1;
    }
  });

  return Array.from(months.values());
}

export function HeatmapPanel({ days, isLoading }: HeatmapPanelProps) {
  const { t } = useTranslation('dashboard');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const activities = toActivities(days);
  const dayByDate = useMemo(() => new Map(days.map((day) => [day.date, day])), [days]);
  const monthSummaries = useMemo(() => getMonthSummaries(days), [days]);

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

      {isCompact ? (
        <div className="space-y-4 sm:hidden">
          {monthSummaries.map((month) => (
            <article key={month.monthLabel} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold capitalize text-slate-900">{month.monthLabel}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {month.totalWorkouts} treino(s) em {month.activeDays} dia(s)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {mobileWeekdayLabels.map((label) => (
                  <span
                    key={label}
                    className="pb-1 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                  >
                    {label}
                  </span>
                ))}

                {Array.from({ length: month.leadingEmptyDays }).map((_, index) => (
                  <span key={`${month.monthLabel}-empty-${index}`} className="h-10 rounded-lg" />
                ))}

                {month.days.map((day) => {
                  const isSelected = selectedDate === day.date;
                  const levelClass = mobileLevelClasses[day.level] ?? mobileLevelClasses[0];

                  return (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => setSelectedDate(day.date)}
                      className={`flex h-10 flex-col items-center justify-center rounded-lg border text-xs font-semibold transition ${levelClass} ${isSelected ? 'ring-2 ring-slate-900 ring-offset-1 ring-offset-slate-50' : ''}`}
                      aria-label={t('heatmap.tooltip', {
                        count: day.count,
                        date: new Date(day.date).toLocaleDateString('pt-BR'),
                      })}
                    >
                      <span>{parseDate(day.date).getUTCDate()}</span>
                      {day.count > 0 ? <span className="text-[10px] leading-none">{day.count}</span> : null}
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <ActivityCalendar
          data={activities}
          loading={isLoading}
          theme={theme}
          colorScheme="light"
          maxLevel={4}
          blockSize={15}
          blockMargin={4}
          fontSize={13}
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
          showWeekdayLabels
          weekStart={1}
        />
      )}

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
