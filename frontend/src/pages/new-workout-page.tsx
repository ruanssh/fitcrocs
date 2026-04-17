import axios from 'axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            {t('create.badge')}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {t('create.title')}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {t('create.subtitle')}
          </p>
        </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.35)]">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              {t('create.workoutDate')}
            </span>
            <input
              type="date"
              value={workoutDate}
              onChange={(event) => setWorkoutDate(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-emerald-500 transition focus:bg-white focus:ring-2"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {t('create.startOptional')}
              </span>
              <input
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-emerald-500 transition focus:bg-white focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {t('create.endOptional')}
              </span>
              <input
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-emerald-500 transition focus:bg-white focus:ring-2"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              {t('create.notes')}
            </span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-emerald-500 transition focus:bg-white focus:ring-2"
            />
          </label>

          <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-slate-800">
                {t('create.exercisesTitle')}
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                {t('create.exercisesSubtitle')}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={exerciseInput}
                onChange={(event) => setExerciseInput(event.target.value)}
                placeholder={t('create.exercisePlaceholder')}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-emerald-500 transition focus:ring-2"
              />
              <button
                type="button"
                onClick={addExerciseToList}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <Plus className="h-4 w-4" />
                {t('create.addExercise')}
              </button>
            </div>

            <ul className="mt-3 space-y-2">
              {exercises.length === 0 ? (
                <li className="rounded-xl border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-600">
                  {t('create.noExercises')}
                </li>
              ) : (
                exercises.map((exercise, index) => (
                  <li
                    key={`${exercise}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        #{index + 1}
                      </p>
                      <p className="text-sm font-medium text-slate-800">{exercise}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveExercise(index, 'up')}
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                        disabled={index === 0}
                      >
                        {t('create.moveUp')}
                      </button>
                      <button
                        type="button"
                        onClick={() => moveExercise(index, 'down')}
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                        disabled={index === exercises.length - 1}
                      >
                        {t('create.moveDown')}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="inline-flex items-center gap-1 rounded-md border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t('create.remove')}
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>

          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? t('create.submitting') : t('create.submit')}
            </button>

            <Link
              to="/workouts"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {t('create.back')}
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
