import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addWorkoutExercise,
  createWorkout,
  deleteWorkout,
  deleteWorkoutExercise,
  getWorkout,
  listWorkouts,
} from '../services/workouts.service';
import type {
  AddWorkoutExercisePayload,
  CreateWorkoutPayload,
  ListWorkoutsQuery,
} from '../types/workouts';

export function useWorkoutsList(filters: ListWorkoutsQuery) {
  return useQuery({
    queryKey: ['workouts', 'list', filters],
    queryFn: () => listWorkouts(filters),
  });
}

export function useWorkoutDetails(workoutId: string | undefined) {
  return useQuery({
    queryKey: ['workouts', 'detail', workoutId],
    queryFn: () => getWorkout(workoutId ?? ''),
    enabled: Boolean(workoutId),
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWorkoutPayload) => createWorkout(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['workouts', 'list'] });
    },
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workoutId: string) => deleteWorkout(workoutId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['workouts', 'list'] });
    },
  });
}

export function useAddWorkoutExercise(workoutId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddWorkoutExercisePayload) =>
      addWorkoutExercise(workoutId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['workouts', 'detail', workoutId] });
      void queryClient.invalidateQueries({ queryKey: ['workouts', 'list'] });
    },
  });
}

export function useDeleteWorkoutExercise(workoutId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exerciseId: string) => deleteWorkoutExercise(workoutId, exerciseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['workouts', 'detail', workoutId] });
      void queryClient.invalidateQueries({ queryKey: ['workouts', 'list'] });
    },
  });
}
