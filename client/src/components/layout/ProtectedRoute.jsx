import { Navigate, Outlet } from 'react-router-dom';
import { Loader, Center } from '@mantine/core';
import useAuth from '../../hooks/useAuth';

export default function ProtectedRoute({ adminOnly = false }) {
  const { user, isLoggedIn, isInitialized } = useAuth();
  
  if (!isInitialized) return <Center mt={100}><Loader /></Center>;
  
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}
