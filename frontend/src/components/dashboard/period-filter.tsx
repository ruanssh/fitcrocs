import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { CalendarRange } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Field } from '../ui/form-field';

type PeriodFilterProps = {
  from: string;
  to: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
};

export function PeriodFilter({
  from,
  to,
  onChangeFrom,
  onChangeTo,
}: PeriodFilterProps) {
  const { t } = useTranslation('dashboard');

  return (
    <Paper className="p-4">
      <div className="mb-3 flex items-center gap-2">
        <CalendarRange className="h-4 w-4 text-amber" />
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--enamel)' }}>
          {t('periodFilter.title')}
        </Typography>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field
          label={t('periodFilter.from')}
          type="month"
          value={from}
          onChange={(event) => onChangeFrom(event.target.value)}
        />

        <Field
          label={t('periodFilter.to')}
          type="month"
          value={to}
          onChange={(event) => onChangeTo(event.target.value)}
        />
      </div>
    </Paper>
  );
}
