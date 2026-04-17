import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const fromDate = searchParams.get('fromDate') ?? '';
  const toDate = searchParams.get('toDate') ?? '';

  const filters = useMemo(
    () => ({
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    }),
    [fromDate, toDate],
  );

  const workoutsQuery = useWorkoutsList(filters);
  const deleteWorkoutMutation = useDeleteWorkout();

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
              <Link
                to={`/workouts/${workout.id}`}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {t('workouts:list.open')}
              </Link>

              <button
                type="button"
                onClick={async () => {
                  const confirmed = window.confirm(t('workouts:list.deleteConfirm'));
                  if (!confirmed) return;
                  await deleteWorkoutMutation.mutateAsync(String(workout.id));
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t('workouts:list.delete')}
              </button>
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            {t('workouts:list.badge')}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {t('workouts:list.title')}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {t('workouts:list.subtitle')}
          </p>
        </div>

        <Link
          to="/workouts/new"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto sm:justify-start sm:py-2.5"
        >
          <Plus className="h-4 w-4" />
          {t('workouts:list.addWorkout')}
        </Link>
      </div>

      <section className="mb-5 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.35)]">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t('workouts:list.from')}
            </span>
            <input
              type="date"
              value={fromDate}
              onChange={(event) => updateFilter('fromDate', event.target.value)}
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none ring-emerald-500 transition focus:bg-white focus:ring-2"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t('workouts:list.to')}
            </span>
            <input
              type="date"
              value={toDate}
              onChange={(event) => updateFilter('toDate', event.target.value)}
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none ring-emerald-500 transition focus:bg-white focus:ring-2"
            />
          </label>

          <div className="flex items-end">
            <div className="inline-flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
              <Search className="h-4 w-4" />
              <span>{t('workouts:list.listedCount', { count: workoutsQuery.data?.length ?? 0 })}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.35)]">
        {workoutsQuery.isLoading ? (
          <div className="px-4 py-8 text-center text-sm text-slate-600">
            {t('workouts:list.loading')}
          </div>
        ) : workoutsQuery.data?.length ? (
          <>
            <div className="space-y-3 p-3 sm:hidden">
              {table.getRowModel().rows.map((row) => {
                const workout = row.original;

                return (
                  <article
                    key={row.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          {formatDate(workout.workoutDate)}
                        </p>
                        <h2 className="mt-2 text-base font-semibold text-slate-900">
                          {t('workouts:list.columns.exercises')}: {workout.workoutExercises.length}
                        </h2>
                      </div>
                      <Link
                        to={`/workouts/${workout.id}`}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                      >
                        {t('workouts:list.open')}
                      </Link>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-white px-3 py-2.5">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {t('workouts:list.columns.start')}
                        </dt>
                        <dd className="mt-1 font-medium text-slate-900">{formatTime(workout.startAt)}</dd>
                      </div>
                      <div className="rounded-xl bg-white px-3 py-2.5">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {t('workouts:list.columns.end')}
                        </dt>
                        <dd className="mt-1 font-medium text-slate-900">{formatTime(workout.endAt)}</dd>
                      </div>
                    </dl>

                    <div className="mt-3 rounded-xl bg-white px-3 py-3 text-sm text-slate-700">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {t('workouts:list.columns.notes')}
                      </p>
                      <p className="mt-1 leading-6">{workout.notes || '-'}</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/workouts/${workout.id}`}
                        className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-700"
                      >
                        {t('workouts:list.open')}
                      </Link>
                      <button
                        type="button"
                        onClick={async () => {
                          const confirmed = window.confirm(t('workouts:list.deleteConfirm'));
                          if (!confirmed) return;
                          await deleteWorkoutMutation.mutateAsync(String(workout.id));
                        }}
                        className="inline-flex items-center justify-center rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto sm:block">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="transition hover:bg-slate-50/80">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-3 align-middle text-sm text-slate-700"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="px-4 py-8 text-center text-sm text-slate-600">{t('workouts:list.empty')}</div>
        )}
      </section>
    </main>
  );
}
