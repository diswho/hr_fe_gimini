import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { RootState } from '../../store/store';

interface ProtectedRouteProps {
  children?: React.ReactElement; // Allow children for alternative usage if needed
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // If still loading authentication state, don't render anything yet or show a loader
  if (loading) {
    // Optional: return a loading spinner here
    return null;
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to so we can send them along after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />; // Render children or Outlet for nested routes
};

export default ProtectedRoute;
