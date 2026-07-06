import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Field } from '../components/ui/form-field';
import { useCreateWorkout } from '../hooks/use-workouts';
import { addWorkoutExercise } from '../services/workouts.service';

function toDateTimeValue(date: string, time: string) {
  if (!date || !time) return undefined;
  return `${date}T${time}:00`;
}

export function NewWorkoutPage() {
  const { t } = useTranslation('workouts');
  const navigate = useNavigate();
  const createWorkoutMutation = useCreateWorkout();

  const [workoutDate, setWorkoutDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [exerciseInput, setExerciseInput] = useState('');
  const [exercises, setExercises] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addExerciseToList() {
    const value = exerciseInput.trim();

    if (value.length < 2) {
      setError(t('create.errors.exerciseMinLength'));
      return;
    }

    setExercises((current) => [...current, value]);
    setExerciseInput('');
    setError(null);
  }

  function removeExercise(index: number) {
    setExercises((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function moveExercise(index: number, direction: 'up' | 'down') {
    setExercises((current) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) return current;

      const updated = [...current];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;

      return updated;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const startAt = toDateTimeValue(workoutDate, startTime);
    const endAt = toDateTimeValue(workoutDate, endTime);

    if (startAt && endAt && new Date(endAt).getTime() < new Date(startAt).getTime()) {
      setError(t('create.errors.endBeforeStart'));
      return;
    }

    if (exercises.length === 0) {
      setError(t('create.errors.requiredExercise'));
      return;
    }

    setIsSubmitting(true);

    try {
      const workout = await createWorkoutMutation.mutateAsync({
        workoutDate,
        startAt,
        endAt,
        notes: notes || undefined,
      });

      await Promise.all(
        exercises.map((exerciseName, index) =>
          addWorkoutExercise(String(workout.id), {
            exerciseName,
            orderIndex: index + 1,
          }),
        ),
      );

      navigate(`/workouts/${workout.id}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        if (typeof message === 'string') {
          setError(message);
        } else {
          setError(t('create.errors.generic'));
        }
      } else {
        setError(t('create.errors.generic'));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

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
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field
            label={t('create.workoutDate')}
            type="date"
            value={workoutDate}
            onChange={(event) => setWorkoutDate(event.target.value)}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={t('create.startOptional')}
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
            />

            <Field
              label={t('create.endOptional')}
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
            />
          </div>

          <Field
            label={t('create.notes')}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            multiline
            rows={4}
          />

          <Paper className="p-4" sx={{ background: 'var(--carbon)' }}>
            <div className="mb-3">
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--enamel)' }}>
                {t('create.exercisesTitle')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('create.exercisesSubtitle')}
              </Typography>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Field
                label={t('create.exercisePlaceholder')}
                value={exerciseInput}
                onChange={(event) => setExerciseInput(event.target.value)}
              />
              <Button
                onClick={addExerciseToList}
                startIcon={<Plus className="h-4 w-4" />}
                className="shrink-0 self-end"
              >
                {t('create.addExercise')}
              </Button>
            </div>

            <ul className="mt-3 space-y-2">
              {exercises.length === 0 ? (
                <li className="border border-dashed border-soot px-3 py-3 text-sm text-ash">
                  {t('create.noExercises')}
                </li>
              ) : (
                exercises.map((exercise, index) => (
                  <li
                    key={`${exercise}-${index}`}
                    className="flex flex-col gap-3 border border-soot px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <Typography variant="overline" color="text.secondary" component="p">
                        #{index + 1}
                      </Typography>
                      <p className="text-sm font-medium text-cement">{exercise}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        size="small"
                        onClick={() => moveExercise(index, 'up')}
                        disabled={index === 0}
                      >
                        {t('create.moveUp')}
                      </Button>
                      <Button
                        size="small"
                        onClick={() => moveExercise(index, 'down')}
                        disabled={index === exercises.length - 1}
                      >
                        {t('create.moveDown')}
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Trash2 className="h-3.5 w-3.5" />}
                        onClick={() => removeExercise(index)}
                      >
                        {t('create.remove')}
                      </Button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </Paper>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? t('create.submitting') : t('create.submit')}
            </Button>

            <Button component={RouterLink} to="/workouts">
              {t('create.back')}
            </Button>
          </div>
        </form>
      </Paper>
    </main>
  );
}
