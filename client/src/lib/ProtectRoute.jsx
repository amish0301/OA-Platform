import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectRoute = ({ children, user, redirect = "/auth/login" }) => {
  if (!user) {
    return <Navigate to={redirect} replace />
  }
  return children ? children : <Outlet />;
}

export default ProtectRoute