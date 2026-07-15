import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import { format } from 'date-fns';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { Field } from '../components/ui/form-field';
import {
  useAddWorkoutExercise,
  useDeleteWorkoutExercise,
  useUpdateWorkout,
  useWorkoutDetails,
} from '../hooks/use-workouts';
import type { WorkoutExercise } from '../types/workouts';

const columnHelper = createColumnHelper<WorkoutExercise>();

function toDateInputValue(value: string) {
  return format(new Date(value), 'yyyy-MM-dd');
}

export function WorkoutDetailsPage() {
  const { t } = useTranslation('workouts');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const workoutId = id ?? '';

  const workoutQuery = useWorkoutDetails(id);
  const updateWorkoutMutation = useUpdateWorkout(workoutId);
  const addExerciseMutation = useAddWorkoutExercise(workoutId);
  const deleteExerciseMutation = useDeleteWorkoutExercise(workoutId);

  const [workoutDate, setWorkoutDate] = useState('');
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [exerciseError, setExerciseError] = useState<string | null>(null);

  const columns = useMemo(
    () => [
      columnHelper.accessor('orderIndex', {
        header: t('details.columns.order'),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('exerciseName', {
        header: t('details.columns.exercise'),
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: 'actions',
        header: t('details.columns.actions'),
        cell: (info) => {
          const exercise = info.row.original;

          return (
            <div className="flex justify-end">
              <Button
                size="small"
                color="error"
                startIcon={<Trash2 className="h-3.5 w-3.5" />}
                onClick={async () => {
                  const confirmed = window.confirm(t('details.removeExerciseConfirm'));
                  if (!confirmed) return;
                  await deleteExerciseMutation.mutateAsync(String(exercise.id));
                }}
              >
                {t('details.removeExercise')}
              </Button>
            </div>
          );
        },
      }),
    ],
    [deleteExerciseMutation, t],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: workoutQuery.data?.workoutExercises ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (!workoutQuery.data) return;

    setWorkoutDate(toDateInputValue(workoutQuery.data.workoutDate));
    setWorkoutNotes(workoutQuery.data.notes ?? '');
  }, [workoutQuery.data]);

  async function handleUpdateWorkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUpdateError(null);

    try {
      await updateWorkoutMutation.mutateAsync({
        workoutDate,
        notes: workoutNotes || undefined,
      });
      navigate('/workouts', {
        state: { toast: t('details.edit.success') },
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        setUpdateError(
          typeof message === 'string' ? message : t('details.errors.updateWorkout'),
        );
      } else {
        setUpdateError(t('details.errors.updateWorkout'));
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setExerciseError(null);

    try {
      await addExerciseMutation.mutateAsync({
        exerciseName,
      });

      setExerciseName('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        if (typeof message === 'string') {
          setExerciseError(message);
        } else {
          setExerciseError(t('details.errors.addExercise'));
        }
      } else {
        setExerciseError(t('details.errors.addExercise'));
      }
    }
  }

  const workout = workoutQuery.data;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <Typography variant="overline" color="primary" component="p">
            {t('details.badge')}
          </Typography>
          <Typography variant="h4" component="h1" sx={{ mt: 1, color: 'var(--enamel)' }}>
            {t('details.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('details.subtitle')}
          </Typography>
        </div>

        <Button
          component={RouterLink}
          to="/workouts"
          startIcon={<ArrowLeft className="h-4 w-4" />}
          className="w-full sm:w-auto"
        >
          {t('details.backToList')}
        </Button>
      </div>

      {workoutQuery.isLoading ? (
        <Paper className="p-6">
          <Typography variant="body2" color="text.secondary">
            {t('details.loading')}
          </Typography>
        </Paper>
      ) : workout ? (
        <>
          <Paper className="mb-6 p-5">
            <Typography variant="h6" component="h2" sx={{ color: 'var(--enamel)' }}>
              {t('details.edit.title')}
            </Typography>

            <form className="mt-4 space-y-4" onSubmit={handleUpdateWorkout}>
              <Field
                label={t('create.workoutDate')}
                type="date"
                value={workoutDate}
                onChange={(event) => {
                  setWorkoutDate(event.target.value);
                }}
                required
              />

              <Field
                label={t('create.notes')}
                value={workoutNotes}
                onChange={(event) => {
                  setWorkoutNotes(event.target.value);
                }}
                multiline
                rows={4}
              />

              {updateError ? <Alert severity="error">{updateError}</Alert> : null}

              <Button
                type="submit"
                variant="contained"
                disabled={updateWorkoutMutation.isPending}
              >
                {updateWorkoutMutation.isPending
                  ? t('details.edit.saving')
                  : t('details.edit.save')}
              </Button>
            </form>
          </Paper>

          <Paper className="mb-6 p-5">
            <Typography variant="h6" component="h2" sx={{ color: 'var(--enamel)' }}>
              {t('details.addExerciseTitle')}
            </Typography>
            <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
              <div className="max-w-xl">
                <Field
                  label={t('details.fields.exercise')}
                  value={exerciseName}
                  onChange={(event) => setExerciseName(event.target.value)}
                  required
                  slotProps={{ input: { minLength: 2 } }}
                />
              </div>

              <div>
                {exerciseError ? (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {exerciseError}
                  </Alert>
                ) : null}

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Plus className="h-4 w-4" />}
                  disabled={addExerciseMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {addExerciseMutation.isPending
                    ? t('details.addingExercise')
                    : t('details.addExercise')}
                </Button>
              </div>
            </form>
          </Paper>

          <Paper className="overflow-hidden">
            {workout.workoutExercises.length ? (
              <>
                <div className="space-y-3 p-3 sm:hidden">
                  {workout.workoutExercises.map((exercise) => (
                    <article key={exercise.id} className="border border-soot p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Typography variant="overline" color="primary" component="p">
                            {t('details.columns.order')} {exercise.orderIndex}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ mt: 1, fontWeight: 600, color: 'var(--enamel)' }}
                          >
                            {exercise.exerciseName}
                          </Typography>
                        </div>
                        <Button
                          color="error"
                          onClick={async () => {
                            const confirmed = window.confirm(t('details.removeExerciseConfirm'));
                            if (!confirmed) return;
                            await deleteExerciseMutation.mutateAsync(String(exercise.id));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                    </article>
                  ))}
                </div>

                <TableContainer className="hidden sm:block">
                  <Table>
                    <TableHead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableCell key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableHead>

                    <TableBody>
                      {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} hover>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" className="px-4 py-8 text-center">
                {t('details.noExercises')}
              </Typography>
            )}
          </Paper>
        </>
      ) : (
        <Alert severity="error">{t('details.loadError')}</Alert>
      )}
    </main>
  );
}
