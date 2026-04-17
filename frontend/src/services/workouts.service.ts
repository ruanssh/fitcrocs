import { http } from '../api/http';
import type {
  AddWorkoutExercisePayload,
  CreateWorkoutPayload,
  ListWorkoutsQuery,
  Workout,
  WorkoutExercise,
} from '../types/workouts';

export async function listWorkouts(params: ListWorkoutsQuery) {
  const { data } = await http.get<Workout[]>('/workouts', { params });
  return data;
}

export async function getWorkout(id: string) {
  const { data } = await http.get<Workout>(`/workouts/${id}`);
  return data;
}

export async function createWorkout(payload: CreateWorkoutPayload) {
  const { data } = await http.post<Workout>('/workouts', payload);
  return data;
}

export async function deleteWorkout(id: string) {
  const { data } = await http.delete<{ success: true }>(`/workouts/${id}`);
  return data;
}

export async function addWorkoutExercise(
  workoutId: string,
  payload: AddWorkoutExercisePayload,
) {
  const { data } = await http.post<WorkoutExercise>(
    `/workouts/${workoutId}/exercises`,
    payload,
  );

  return data;
}

export async function deleteWorkoutExercise(workoutId: string, exerciseId: string) {
  const { data } = await http.delete<{ success: true }>(
    `/workouts/${workoutId}/exercises/${exerciseId}`,
  );

  return data;
}
