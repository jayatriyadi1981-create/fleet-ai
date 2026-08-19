/**
 * Fleet Intelligence Smart AI - Role Guard Component
 */

import React from 'react';
import { useAuthorization } from '../../hooks/useAuthorization';
import { UserRole } from '../../types/rbac';

interface RoleGuardProps {
  roles: UserRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ roles, fallback = null, children }) => {
  const { hasAnyRole } = useAuthorization();

  if (hasAnyRole(roles)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
