import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HEATMAP_SCALE } from '../../theme/chart-colors';
import type { HeatmapDay } from '../../types/dashboard';

type HeatmapPanelProps = {
  days: HeatmapDay[];
  isLoading: boolean;
};

const weekdayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

const levelStyles = [
  { background: 'transparent', borderColor: 'var(--soot)', color: 'var(--ash)' },
  { background: HEATMAP_SCALE[1], borderColor: HEATMAP_SCALE[1], color: 'var(--enamel)' },
  { background: HEATMAP_SCALE[2], borderColor: HEATMAP_SCALE[2], color: 'var(--ink)' },
  { background: HEATMAP_SCALE[3], borderColor: HEATMAP_SCALE[3], color: 'var(--ink)' },
  { background: HEATMAP_SCALE[4], borderColor: HEATMAP_SCALE[4], color: 'var(--ink)' },
];

type MonthSummary = {
  monthLabel: string;
  monthKey: string;
  totalWorkouts: number;
  activeDays: number;
  leadingEmptyDays: number;
  days: HeatmapDay[];
};

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
  const months = new Map<string, MonthSummary>();

  days.forEach((day) => {
    const monthKey = day.date.slice(0, 7);

    if (!months.has(monthKey)) {
      const parsedDate = parseDate(day.date);
      const weekday = parsedDate.getUTCDay();
      const leadingEmptyDays = weekday === 0 ? 6 : weekday - 1;

      months.set(monthKey, {
        monthLabel: formatMonthLabel(day.date),
        monthKey,
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
  const [visibleMonthKey, setVisibleMonthKey] = useState(() => new Date().toISOString().slice(0, 7));
  const dayByDate = useMemo(() => new Map(days.map((day) => [day.date, day])), [days]);
  const monthSummaries = useMemo(() => getMonthSummaries(days), [days]);
  const matchedMonthIndex = monthSummaries.findIndex((month) => month.monthKey === visibleMonthKey);
  const visibleMonthIndex = matchedMonthIndex >= 0 ? matchedMonthIndex : 0;
  const desktopStartIndex = Math.max(0, visibleMonthIndex - 1);
  const desktopEndIndex = Math.min(monthSummaries.length, desktopStartIndex + 2);
  const visibleMonths = isCompact
    ? monthSummaries.slice(visibleMonthIndex, visibleMonthIndex + 1)
    : monthSummaries.slice(desktopStartIndex, desktopEndIndex);
  const canGoToPreviousMonth = isCompact ? visibleMonthIndex > 0 : desktopStartIndex > 0;
  const canGoToNextMonth = isCompact
    ? visibleMonthIndex < monthSummaries.length - 1
    : desktopEndIndex < monthSummaries.length;

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

  function goToPreviousMonths() {
    const nextIndex = Math.max(0, visibleMonthIndex - (isCompact ? 1 : 2));

    setVisibleMonthKey(monthSummaries[nextIndex].monthKey);
  }

  function goToNextMonths() {
    const nextIndex = Math.min(monthSummaries.length - 1, visibleMonthIndex + (isCompact ? 1 : 2));

    setVisibleMonthKey(monthSummaries[nextIndex].monthKey);
  }

  function renderMonth(month: MonthSummary) {
    return (
      <article key={month.monthKey} className="border border-soot bg-carbon p-3 sm:p-4">
        <div className="mb-3">
          <h3 className="text-center text-sm font-semibold capitalize text-enamel">
            {month.monthLabel}
          </h3>
          <p className="mt-1 text-center text-xs text-ash">
            {t('heatmap.monthSummary', {
              count: month.totalWorkouts,
              days: month.activeDays,
            })}
          </p>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekdayLabels.map((label) => (
            <span
              key={label}
              className="pb-1 text-center text-[10px] font-semibold uppercase tracking-wide text-smoke"
            >
              {label}
            </span>
          ))}

          {Array.from({ length: month.leadingEmptyDays }).map((_, index) => (
            <span key={`${month.monthKey}-empty-${index}`} className="h-10 sm:h-11" />
          ))}

          {month.days.map((day) => {
            const isSelected = selectedDate === day.date;
            const levelStyle = levelStyles[day.level] ?? levelStyles[0];

            return (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelectedDate(day.date)}
                style={levelStyle}
                className={`flex h-10 flex-col items-center justify-center border text-xs font-semibold transition sm:h-11 ${isSelected ? 'outline outline-1 outline-offset-2 outline-amber' : ''}`}
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
    );
  }

  return (
    <Paper component="section" className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <IconButton
          size="small"
          onClick={goToPreviousMonths}
          disabled={!canGoToPreviousMonth || isLoading || monthSummaries.length === 0}
          aria-label={t('heatmap.previousMonth')}
        >
          <ChevronLeft className="h-4 w-4" />
        </IconButton>

        <div className="grid flex-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {visibleMonths.map((month) => renderMonth(month))}
        </div>

        <IconButton
          size="small"
          onClick={goToNextMonths}
          disabled={!canGoToNextMonth || isLoading || monthSummaries.length === 0}
          aria-label={t('heatmap.nextMonth')}
        >
          <ChevronRight className="h-4 w-4" />
        </IconButton>
      </div>

      <header className="mt-4 border-t border-soot pt-4">
        <Typography variant="h6" component="h2" sx={{ color: 'var(--enamel)' }}>
          {t('heatmap.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {t('heatmap.subtitle')}
        </Typography>
      </header>

      {selectedDay ? (
        <div className="mt-4 border border-soot bg-carbon p-3 sm:p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ash">
                {t('heatmap.detailsTitle')}
              </p>
              <h3 className="text-sm font-semibold leading-6 text-enamel">
                {t('heatmap.detailsHeading', {
                  date: formatDateLabel(selectedDay.date),
                  count: selectedDay.count,
                })}
              </h3>
            </div>

            <IconButton size="small" onClick={() => setSelectedDate(null)}>
              <X className="h-4 w-4" />
            </IconButton>
          </div>

          {selectedDay.workouts.length === 0 ? (
            <p className="text-sm text-ash">{t('heatmap.noWorkouts')}</p>
          ) : (
            <ul className="space-y-2">
              {selectedDay.workouts.map((workout) => (
                <li
                  key={workout.id}
                  className="border border-soot bg-surface px-3 py-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-ash">
                    {t('heatmap.workoutTime', {
                      start: formatTimeLabel(workout.startAt),
                      end: formatTimeLabel(workout.endAt),
                    })}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-cement">
                    {workout.notes?.trim() || t('heatmap.noNotes')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </Paper>
  );
}
