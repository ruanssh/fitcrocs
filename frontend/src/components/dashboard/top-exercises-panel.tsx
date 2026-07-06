import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BAR_COLOR } from '../../theme/chart-colors';
import type { TopExercisesItem } from '../../types/dashboard';

type TopExercisesPanelProps = {
  items: TopExercisesItem[];
  isLoading: boolean;
};

const mono = "'IBM Plex Mono', ui-monospace, monospace";

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
    <Paper component="section" className="p-4 sm:p-5">
      <header className="mb-4">
        <Typography variant="h6" component="h2" sx={{ color: 'var(--enamel)' }}>
          {t('topExercises.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {t('topExercises.subtitle')}
        </Typography>
      </header>

      {isLoading ? (
        <Skeleton variant="rectangular" height={288} />
      ) : items.length === 0 ? (
        <div className="border border-dashed border-soot px-4 py-8 text-center text-sm text-ash">
          {t('topExercises.empty')}
        </div>
      ) : (
        <>
          <div className="hidden h-72 sm:block">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visibleItems} layout="vertical" margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis
                  type="number"
                  tick={{ fill: '#8e8e8e', fontSize: 12, fontFamily: mono }}
                  stroke="#333333"
                />
                <YAxis
                  type="category"
                  dataKey="exerciseName"
                  tick={{ fill: '#c0c0c0', fontSize: 12, fontFamily: mono }}
                  stroke="#333333"
                  width={120}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 161, 51, 0.06)' }}
                  contentStyle={{
                    background: '#1a1a1a',
                    border: '1px solid #333333',
                    borderRadius: 0,
                    fontFamily: mono,
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#eeeeee' }}
                  itemStyle={{ color: BAR_COLOR }}
                />
                <Bar dataKey="count" fill={BAR_COLOR} radius={[0, 0, 0, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <ul className="space-y-2 sm:mt-4">
            {visibleItems.map((item) => (
              <li
                key={item.exerciseName}
                className="border border-soot bg-carbon px-3 py-3"
              >
                <p className="text-sm font-medium text-cement">{item.exerciseName}</p>
                <p className="mt-1 text-sm text-ash">
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
    </Paper>
  );
}
