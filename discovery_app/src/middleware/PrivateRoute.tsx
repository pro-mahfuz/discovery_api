// utils/PrivateRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { Permission } from '../modules/permission/features/permissionTypes';

interface PrivateRouteProps {
  permissions?: string[]; // expected permission actions
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, permissions = [] }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const accessToken = localStorage.getItem('accessToken');

  console.log("permissions: ", permissions);
  console.log("user: ", user);

  const userPermissions: string[] = user?.Role?.Permission?.map((p: Permission) => p.action) || [];
  console.log("userPermissions: ", userPermissions);

  // Not logged in
  // if (!accessToken || !user) {
  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  // No required permission match
  if (permissions.length > 0 && !permissions.some((perm) => userPermissions.includes(perm))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
