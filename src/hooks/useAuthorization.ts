/**
 * Fleet Intelligence Smart AI - Enterprise Authorization Hook
 */

import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { authorizationService } from '../services/rbac/authorizationService';
import { roleService } from '../services/rbac/roleService';
import { PermissionAction, ResourceModule, UserRole, AccessScope, RoleDefinition } from '../types/rbac';
import { UserProfile, UserProfile as User } from '../types';

export interface UseAuthorizationResult {
  user: User | null;
  userRole: UserRole;
  roleDefinition: RoleDefinition | undefined;
  scope: AccessScope;
  effectivePermissions: string[];
  can: (resourceOrKey: ResourceModule | string, action?: PermissionAction) => boolean;
  hasPermission: (permissionKey: string) => boolean;
  hasAnyPermission: (permissionKeys: string[]) => boolean;
  hasAllPermissions: (permissionKeys: string[]) => boolean;
  hasRole: (roleId: UserRole) => boolean;
  hasAnyRole: (roleIds: UserRole[]) => boolean;
  canAccessData: <T extends { tenantId?: string; branchId?: string; driverId?: string; vehicleId?: string }>(
    record: T
  ) => boolean;
}

export const useAuthorization = (): UseAuthorizationResult => {
  const { user } = useAuth();

  const userRole = user?.role || 'viewer';

  const roleDefinition = useMemo(() => {
    return roleService.getRoleById(userRole);
  }, [userRole]);

  const scope = useMemo(() => {
    return authorizationService.getAccessScope(user);
  }, [user]);

  const effectivePermissions = useMemo(() => {
    return authorizationService.getEffectivePermissions(user);
  }, [user]);

  const can = (resourceOrKey: ResourceModule | string, action?: PermissionAction): boolean => {
    if (action) {
      return authorizationService.can(user, resourceOrKey as ResourceModule, action);
    }
    return authorizationService.hasPermission(user, resourceOrKey);
  };

  const hasPermission = (permissionKey: string): boolean => {
    return authorizationService.hasPermission(user, permissionKey);
  };

  const hasAnyPermission = (permissionKeys: string[]): boolean => {
    return authorizationService.hasAnyPermission(user, permissionKeys);
  };

  const hasAllPermissions = (permissionKeys: string[]): boolean => {
    return authorizationService.hasAllPermissions(user, permissionKeys);
  };

  const hasRole = (roleId: UserRole): boolean => {
    return authorizationService.hasRole(user, roleId);
  };

  const hasAnyRole = (roleIds: UserRole[]): boolean => {
    return authorizationService.hasAnyRole(user, roleIds);
  };

  const canAccessData = <T extends { tenantId?: string; branchId?: string; driverId?: string; vehicleId?: string }>(
    record: T
  ): boolean => {
    return authorizationService.canAccessData(user, record);
  };

  return {
    user,
    userRole,
    roleDefinition,
    scope,
    effectivePermissions,
    can,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    canAccessData,
  };
};
