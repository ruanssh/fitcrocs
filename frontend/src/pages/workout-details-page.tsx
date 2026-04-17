import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  useAddWorkoutExercise,
  useDeleteWorkoutExercise,
  useWorkoutDetails,
} from '../hooks/use-workouts';
import type { WorkoutExercise } from '../types/workouts';

const columnHelper = createColumnHelper<WorkoutExercise>();

function formatDate(value: string) {
  return format(new Date(value), 'dd/MM/yyyy', { locale: ptBR });
}

function formatDateTime(value: string | null) {
  if (!value) return '-';
  return format(new Date(value), 'dd/MM/yyyy HH:mm', { locale: ptBR });
}

export function WorkoutDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const workoutId = id ?? '';

  const workoutQuery = useWorkoutDetails(id);
  const addExerciseMutation = useAddWorkoutExercise(workoutId);
  const deleteExerciseMutation = useDeleteWorkoutExercise(workoutId);

  const [exerciseName, setExerciseName] = useState('');
  const [bodyPartMock, setBodyPartMock] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const columns = useMemo(
    () => [
      columnHelper.accessor('orderIndex', {
        header: 'Ordem',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('exerciseName', {
        header: 'Exercicio',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('bodyPartMock', {
        header: 'Parte do corpo',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('notes', {
        header: 'Observacoes',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Acoes',
        cell: (info) => {
          const exercise = info.row.original;

          return (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={async () => {
                  const confirmed = window.confirm('Deseja remover este exercicio?');
                  if (!confirmed) return;
                  await deleteExerciseMutation.mutateAsync(String(exercise.id));
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remover
              </button>
            </div>
          );
        },
      }),
    ],
    [deleteExerciseMutation],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: workoutQuery.data?.workoutExercises ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await addExerciseMutation.mutateAsync({
        exerciseName,
        bodyPartMock: bodyPartMock || undefined,
        notes: notes || undefined,
      });

      setExerciseName('');
      setBodyPartMock('');
      setNotes('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        if (typeof message === 'string') {
          setError(message);
        } else {
          setError('Nao foi possivel adicionar o exercicio.');
        }
      } else {
        setError('Nao foi possivel adicionar o exercicio.');
      }
    }
  }

  const workout = workoutQuery.data;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Treinos
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Detalhes do treino
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Adicione e gerencie os exercicios feitos neste dia.
          </p>
        </div>

        <Link
          to="/workouts"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para treinos
        </Link>
      </div>

      {workoutQuery.isLoading ? (
        <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 text-sm text-slate-600 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.35)]">
          Carregando treino...
        </section>
      ) : workout ? (
        <>
          <section className="mb-6 grid gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.35)] sm:grid-cols-2 lg:grid-cols-4">
            <article>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Data</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {formatDate(workout.workoutDate)}
              </p>
            </article>
            <article>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Inicio
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {formatDateTime(workout.startAt)}
              </p>
            </article>
            <article>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fim</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {formatDateTime(workout.endAt)}
              </p>
            </article>
            <article>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Observacoes
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">{workout.notes || '-'}</p>
            </article>
          </section>

          <section className="mb-6 rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.35)]">
            <h2 className="text-lg font-semibold text-slate-900">Adicionar exercicio</h2>
            <form className="mt-4 grid gap-3 md:grid-cols-4" onSubmit={handleSubmit}>
              <label className="md:col-span-2">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Exercicio
                </span>
                <input
                  type="text"
                  value={exerciseName}
                  onChange={(event) => setExerciseName(event.target.value)}
                  minLength={2}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-500 transition focus:bg-white focus:ring-2"
                />
              </label>

              <label>
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Parte do corpo
                </span>
                <input
                  type="text"
                  value={bodyPartMock}
                  onChange={(event) => setBodyPartMock(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-500 transition focus:bg-white focus:ring-2"
                />
              </label>

              <label>
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Observacoes
                </span>
                <input
                  type="text"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-500 transition focus:bg-white focus:ring-2"
                />
              </label>

              <div className="md:col-span-4">
                {error ? (
                  <p className="mb-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={addExerciseMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Plus className="h-4 w-4" />
                  {addExerciseMutation.isPending
                    ? 'Adicionando...'
                    : 'Adicionar exercicio'}
                </button>
              </div>
            </form>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.35)]">
            <div className="overflow-x-auto">
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
                  {workout.workoutExercises.length ? (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="transition hover:bg-slate-50/80">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-3 text-sm text-slate-700">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-600">
                        Nenhum exercicio adicionado para este treino.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Nao foi possivel carregar este treino.
        </section>
      )}
    </main>
  );
}
