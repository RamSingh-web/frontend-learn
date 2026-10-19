
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function ProtectedRoute() {
  const { user } = useAuth();

  // If the user is not logged in, redirect to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is logged in, show the protected page
  return <Outlet />;
}
