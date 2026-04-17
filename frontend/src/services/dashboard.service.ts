import { http } from '../api/http';
import type {
  DashboardPeriodQuery,
  DashboardSummary,
  HeatmapResponse,
  TopExercisesResponse,
} from '../types/dashboard';

type TopExercisesQuery = DashboardPeriodQuery & {
  limit?: number;
};

export async function getDashboardSummary(params: DashboardPeriodQuery) {
  const { data } = await http.get<DashboardSummary>('/dashboard/summary', { params });
  return data;
}

export async function getTopExercises(params: TopExercisesQuery) {
  const { data } = await http.get<TopExercisesResponse>('/dashboard/top-exercises', {
    params,
  });

  return data;
}

export async function getHeatmap(params: DashboardPeriodQuery) {
  const { data } = await http.get<HeatmapResponse>('/dashboard/heatmap', { params });
  return data;
}
