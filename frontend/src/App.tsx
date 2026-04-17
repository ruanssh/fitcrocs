import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { AppLayout } from './layouts/app-layout';
import { DashboardPage } from './pages/dashboard-page';
import { LoginPage } from './pages/login-page';
import { NewWorkoutPage } from './pages/new-workout-page';
import { RegisterPage } from './pages/register-page';
import { WorkoutDetailsPage } from './pages/workout-details-page';
import { WorkoutsPage } from './pages/workouts-page';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/workouts/new" element={<NewWorkoutPage />} />
        <Route path="/workouts/:id" element={<WorkoutDetailsPage />} />
      </Route>
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
