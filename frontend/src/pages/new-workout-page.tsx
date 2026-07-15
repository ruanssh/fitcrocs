import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { CreateWorkoutForm } from '../components/workouts/create-workout-form';

export function NewWorkoutPage() {
  const { t } = useTranslation('workouts');
  const navigate = useNavigate();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Typography variant="overline" color="primary" component="p">
          {t('create.badge')}
        </Typography>
        <Typography variant="h4" component="h1" sx={{ mt: 1, color: 'var(--enamel)' }}>
          {t('create.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('create.subtitle')}
        </Typography>
      </div>

      <Paper className="p-6">
        <CreateWorkoutForm
          onCreated={(workout) => navigate(`/workouts/${workout.id}`)}
          secondaryAction={
            <Button component={RouterLink} to="/workouts">
              {t('create.back')}
            </Button>
          }
        />
      </Paper>
    </main>
  );
}
