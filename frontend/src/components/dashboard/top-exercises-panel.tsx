import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TopExercisesItem } from '../../types/dashboard';

type TopExercisesPanelProps = {
  items: TopExercisesItem[];
  isLoading: boolean;
};

const BAR_COLORS = ['#1f8f78', '#34a68f', '#4fbea7', '#78d7be', '#9de8d5'];

export function TopExercisesPanel({ items, isLoading }: TopExercisesPanelProps) {
  const { t } = useTranslation('dashboard');
  const [isCompact, setIsCompact] = useState(false);

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

  const visibleItems = isCompact ? items.slice(0, 5) : items;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-5">
      <header className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          {t('topExercises.title')}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {t('topExercises.subtitle')}
        </p>
      </header>

      {isLoading ? (
        <div className="h-72 animate-pulse rounded-xl bg-slate-100" />
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
          {t('topExercises.empty')}
        </div>
      ) : (
        <>
          <div className="hidden h-72 sm:block">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visibleItems} layout="vertical" margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="exerciseName"
                  tick={{ fill: '#334155', fontSize: 12 }}
                  width={120}
                />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{
                    borderRadius: '12px',
                    borderColor: '#cbd5e1',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {visibleItems.map((item, index) => (
                    <Cell
                      key={`${item.exerciseName}-${index}`}
                      fill={BAR_COLORS[index % BAR_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <ul className="space-y-2 sm:mt-4">
            {visibleItems.map((item) => (
              <li
                key={item.exerciseName}
                className="rounded-lg bg-slate-50 px-3 py-3"
              >
                <p className="text-sm font-medium text-slate-700">{item.exerciseName}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {t('topExercises.listItem', {
                    count: item.count,
                    percentage: item.percentage.toFixed(2),
                  })}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
