/**
 * Role-Based Access Control (RBAC) & Permission Helpers
 */

import { UserProfile, UserRole } from '../types';

export const ALL_PERMISSIONS = {
  VIEW_DASHBOARD: 'view:dashboard',
  VIEW_LIVE_TRACKING: 'view:live_tracking',
  MANAGE_VEHICLES: 'manage:vehicles',
  MANAGE_DRIVERS: 'manage:drivers',
  MANAGE_TRIPS: 'manage:trips',
  VIEW_FUEL: 'view:fuel',
  MANAGE_MAINTENANCE: 'manage:maintenance',
  VIEW_SAFETY: 'view:safety',
  MANAGE_ALERTS: 'manage:alerts',
  USE_AI_ASSISTANT: 'use:ai_assistant',
  VIEW_ANALYTICS: 'view:analytics',
  GENERATE_REPORTS: 'generate:reports',
  MANAGE_SETTINGS: 'manage:settings',
  MANAGE_TENANT: 'manage:tenant',
} as const;

export const hasPermission = (user: UserProfile | null, permission: string): boolean => {
  if (!user) return false;
  if (user.role === 'super_admin' || user.role === 'company_admin' || user.role === 'company_owner') {
    return true; // Full access for admins
  }
  return user.permissions?.includes(permission) || false;
};

export const hasRole = (user: UserProfile | null, allowedRoles: UserRole[]): boolean => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

export const canAccessRoute = (user: UserProfile | null, routePath: string): boolean => {
  if (!user) return false;
  if (routePath.startsWith('/app/settings') || routePath.startsWith('/app/users')) {
    return hasRole(user, ['super_admin', 'company_owner', 'company_admin', 'fleet_manager']);
  }
  return true;
};
