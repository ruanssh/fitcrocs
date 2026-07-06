import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

type KpiCardProps = {
  title: string;
  value: string;
  description: string;
};

export function KpiCard({ title, value, description }: KpiCardProps) {
  return (
    <Paper
      component="article"
      className="p-4 sm:p-5"
      sx={{
        transition: 'border-color .15s',
        '&:hover': { borderColor: 'primary.main' },
      }}
    >
      <Typography variant="overline" color="text.secondary" component="p">
        {title}
      </Typography>
      <Typography variant="h4" component="p" sx={{ mt: 1, color: 'var(--enamel)' }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {description}
      </Typography>
    </Paper>
  );
}
