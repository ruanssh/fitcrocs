export type DashboardSummary = {
  period: {
    from: string;
    to: string;
  };
  totalWorkouts: number;
  activeMonths: number;
  totalExercisesLogged: number;
  avgWorkoutsPerActiveMonth: number;
};

export type TopExercisesItem = {
  exerciseName: string;
  count: number;
  percentage: number;
};

export type TopExercisesResponse = {
  period: {
    from: string;
    to: string;
  };
  limit: number;
  totalTrackedExercises: number;
  items: TopExercisesItem[];
};

export type HeatmapDay = {
  date: string;
  count: number;
  level: number;
};

export type HeatmapResponse = {
  period: {
    from: string;
    to: string;
    startDate: string;
    endDate: string;
  };
  timezone: string;
  legend: Array<{
    level: number;
    min: number;
    max: number | null;
  }>;
  days: HeatmapDay[];
};

export type DashboardPeriodQuery = {
  from?: string;
  to?: string;
};
