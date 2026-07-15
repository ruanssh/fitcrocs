import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { Field } from '../components/ui/form-field';
import { useDeleteWorkout, useWorkoutsList } from '../hooks/use-workouts';
import type { Workout } from '../types/workouts';

const columnHelper = createColumnHelper<Workout>();

function formatDate(value: string) {
  return format(new Date(value), 'dd/MM/yyyy', { locale: ptBR });
}

function formatTime(value: string | null) {
  if (!value) return '-';
  return format(new Date(value), 'HH:mm');
}

export function WorkoutsPage() {
  const { t } = useTranslation(['workouts', 'common']);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const fromDate = searchParams.get('fromDate') ?? '';
  const toDate = searchParams.get('toDate') ?? '';
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    }),
    [fromDate, toDate],
  );

  const workoutsQuery = useWorkoutsList(filters);
  const deleteWorkoutMutation = useDeleteWorkout();

  useEffect(() => {
    const state = location.state as { toast?: string } | null;

    if (!state?.toast) return;

    setToastMessage(state.toast);
    navigate(location.pathname + location.search, { replace: true, state: null });
  }, [location.pathname, location.search, location.state, navigate]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('workoutDate', {
        header: t('workouts:list.columns.date'),
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.display({
        id: 'startAt',
        header: t('workouts:list.columns.start'),
        cell: (info) => formatTime(info.row.original.startAt),
      }),
      columnHelper.display({
        id: 'endAt',
        header: t('workouts:list.columns.end'),
        cell: (info) => formatTime(info.row.original.endAt),
      }),
      columnHelper.display({
        id: 'exerciseCount',
        header: t('workouts:list.columns.exercises'),
        cell: (info) => info.row.original.workoutExercises.length,
      }),
      columnHelper.accessor('notes', {
        header: t('workouts:list.columns.notes'),
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.display({
        id: 'actions',
        header: t('workouts:list.columns.actions'),
        cell: (info) => {
          const workout = info.row.original;

          return (
            <div className="flex items-center justify-end gap-2">
              <Button
                component={RouterLink}
                to={`/workouts/${workout.id}`}
                size="small"
              >
                {t('workouts:list.open')}
              </Button>

              <Button
                size="small"
                color="error"
                startIcon={<Trash2 className="h-3.5 w-3.5" />}
                onClick={async () => {
                  const confirmed = window.confirm(t('workouts:list.deleteConfirm'));
                  if (!confirmed) return;
                  await deleteWorkoutMutation.mutateAsync(String(workout.id));
                }}
              >
                {t('workouts:list.delete')}
              </Button>
            </div>
          );
        },
      }),
    ],
    [deleteWorkoutMutation, t],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: workoutsQuery.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  function updateFilter(param: 'fromDate' | 'toDate', value: string) {
    setSearchParams((current) => {
      const params = new URLSearchParams(current);

      if (!value) {
        params.delete(param);
      } else {
        params.set(param, value);
      }

      return params;
    });
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <Typography variant="overline" color="primary" component="p">
            {t('workouts:list.badge')}
          </Typography>
          <Typography variant="h4" component="h1" sx={{ mt: 1, color: 'var(--enamel)' }}>
            {t('workouts:list.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('workouts:list.subtitle')}
          </Typography>
        </div>

        <Button
          component={RouterLink}
          to="/workouts/new"
          variant="contained"
          startIcon={<Plus className="h-4 w-4" />}
          className="w-full sm:w-auto"
        >
          {t('workouts:list.addWorkout')}
        </Button>
      </div>

      <Paper className="mb-5 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Field
            label={t('workouts:list.from')}
            type="date"
            value={fromDate}
            onChange={(event) => updateFilter('fromDate', event.target.value)}
          />

          <Field
            label={t('workouts:list.to')}
            type="date"
            value={toDate}
            onChange={(event) => updateFilter('toDate', event.target.value)}
          />

          <div className="flex items-end">
            <div className="flex w-full items-center gap-2 border border-soot px-3 py-2 text-sm text-ash">
              <Search className="h-4 w-4" />
              <span>{t('workouts:list.listedCount', { count: workoutsQuery.data?.length ?? 0 })}</span>
            </div>
          </div>
        </div>
      </Paper>

      <Paper>
        {workoutsQuery.isLoading ? (
          <Typography variant="body2" color="text.secondary" className="px-4 py-8 text-center">
            {t('workouts:list.loading')}
          </Typography>
        ) : workoutsQuery.data?.length ? (
          <>
            <div className="space-y-3 p-3 sm:hidden">
              {table.getRowModel().rows.map((row) => {
                const workout = row.original;

                return (
                  <article key={row.id} className="border border-soot p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Typography variant="overline" color="primary" component="p">
                          {formatDate(workout.workoutDate)}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, fontWeight: 600, color: 'var(--enamel)' }}>
                          {t('workouts:list.columns.exercises')}: {workout.workoutExercises.length}
                        </Typography>
                      </div>
                      <Button
                        component={RouterLink}
                        to={`/workouts/${workout.id}`}
                        size="small"
                      >
                        {t('workouts:list.open')}
                      </Button>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="border border-soot px-3 py-2.5">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-ash">
                          {t('workouts:list.columns.start')}
                        </dt>
                        <dd className="mt-1 font-medium text-cement">{formatTime(workout.startAt)}</dd>
                      </div>
                      <div className="border border-soot px-3 py-2.5">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-ash">
                          {t('workouts:list.columns.end')}
                        </dt>
                        <dd className="mt-1 font-medium text-cement">{formatTime(workout.endAt)}</dd>
                      </div>
                    </dl>

                    <div className="mt-3 border border-soot px-3 py-3 text-sm text-cement">
                      <p className="text-xs font-semibold uppercase tracking-wide text-ash">
                        {t('workouts:list.columns.notes')}
                      </p>
                      <p className="mt-1 leading-6">{workout.notes || '-'}</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        component={RouterLink}
                        to={`/workouts/${workout.id}`}
                        className="flex-1"
                      >
                        {t('workouts:list.open')}
                      </Button>
                      <Button
                        color="error"
                        onClick={async () => {
                          const confirmed = window.confirm(t('workouts:list.deleteConfirm'));
                          if (!confirmed) return;
                          await deleteWorkoutMutation.mutateAsync(String(workout.id));
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </article>
                );
              })}
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
            {t('workouts:list.empty')}
          </Typography>
        )}
      </Paper>

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={3000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToastMessage(null)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </main>
  );
}
