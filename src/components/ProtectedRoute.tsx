import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Role } from '../types';

export default function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="grid min-h-dvh place-items-center bg-cream font-moon text-xl text-coal-deep">Memuat...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/403" replace />;
  return <Outlet />;
}
