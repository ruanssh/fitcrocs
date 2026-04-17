export type WorkoutExercise = {
  id: string;
  workoutId: string;
  exerciseName: string;
  bodyPartMock: string | null;
  orderIndex: number;
  notes: string | null;
  createdAt: string;
};

export type Workout = {
  id: string;
  userId: string;
  workoutDate: string;
  startAt: string | null;
  endAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  workoutExercises: WorkoutExercise[];
};

export type ListWorkoutsQuery = {
  fromDate?: string;
  toDate?: string;
};

export type CreateWorkoutPayload = {
  workoutDate: string;
  startAt?: string;
  endAt?: string;
  notes?: string;
};

export type UpdateWorkoutPayload = Partial<CreateWorkoutPayload>;

export type AddWorkoutExercisePayload = {
  exerciseName: string;
  bodyPartMock?: string;
  orderIndex?: number;
  notes?: string;
};
