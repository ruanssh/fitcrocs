import { useQuery } from '@tanstack/react-query';
import {
  getDashboardSummary,
  getHeatmap,
  getTopExercises,
} from '../services/dashboard.service';
import type { DashboardPeriodQuery } from '../types/dashboard';

type TopExerciseFilters = DashboardPeriodQuery & {
  limit?: number;
};

export function useDashboardSummary(filters: DashboardPeriodQuery) {
  return useQuery({
    queryKey: ['dashboard', 'summary', filters],
    queryFn: () => getDashboardSummary(filters),
  });
}

export function useDashboardHeatmap(filters: DashboardPeriodQuery) {
  return useQuery({
    queryKey: ['dashboard', 'heatmap', filters],
    queryFn: () => getHeatmap(filters),
  });
}

export function useTopExercises(filters: TopExerciseFilters) {
  return useQuery({
    queryKey: ['dashboard', 'top-exercises', filters],
    queryFn: () => getTopExercises(filters),
  });
}
