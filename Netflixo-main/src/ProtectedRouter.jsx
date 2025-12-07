import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from './utils/authUtils';

// ProtectedRouter Component
function ProtectedRouter({ role }) {
  const user = getCurrentUser();

  // 1. If not logged in -> Redirect to Login page
  if (!user) {
    console.warn("ProtectedRouter: User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // 2. If route requires Admin role but user is not Admin -> Redirect to 403 Forbidden
  if (role && user.role !== role) {
    console.warn(`ProtectedRouter: User role '${user.role}' does not match required role '${role}'`);
    return <Navigate to="/forbidden" replace />;
  }

  // 3. If authenticated and authorized -> Render child component (Outlet)
  return <Outlet />;
}

export default ProtectedRouter;

