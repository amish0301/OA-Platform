import { Navigate, Outlet } from "react-router-dom";

export const ProtectAdminRoute = ({ children, isAdmin = false }) => {
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return children ? children : <Outlet />;
};
