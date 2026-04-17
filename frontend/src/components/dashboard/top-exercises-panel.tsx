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
import { useTranslation } from 'react-i18next';
import type { TopExercisesItem } from '../../types/dashboard';

type TopExercisesPanelProps = {
  items: TopExercisesItem[];
  isLoading: boolean;
};

const BAR_COLORS = ['#1f8f78', '#34a68f', '#4fbea7', '#78d7be', '#9de8d5'];

export function TopExercisesPanel({ items, isLoading }: TopExercisesPanelProps) {
  const { t } = useTranslation('dashboard');

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.35)] backdrop-blur-sm">
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
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={items} layout="vertical" margin={{ left: 0, right: 10 }}>
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
                  {items.map((item, index) => (
                    <Cell
                      key={`${item.exerciseName}-${index}`}
                      fill={BAR_COLORS[index % BAR_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <ul className="mt-4 space-y-2">
            {items.slice(0, 5).map((item) => (
              <li
                key={item.exerciseName}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
              >
                <span className="text-sm font-medium text-slate-700">{item.exerciseName}</span>
                <span className="text-sm text-slate-600">
                  {t('topExercises.listItem', {
                    count: item.count,
                    percentage: item.percentage.toFixed(2),
                  })}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
