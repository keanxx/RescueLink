import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
}
