/**
 * Fleet Intelligence Smart AI - Role Based Access Control (RBAC) Types
 * Enterprise Authorization, Permissions & Scope Architecture
 */

export type SystemRole =
  | 'super_admin'
  | 'company_admin'
  | 'owner'
  | 'director'
  | 'executive'
  | 'fleet_manager'
  | 'operations'
  | 'dispatcher'
  | 'safety'
  | 'driver'
  | 'maintenance'
  | 'finance'
  | 'viewer';

export type UserRole = SystemRole | string; // Supports custom roles

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'export' | 'approve' | 'execute' | 'admin';

export type AccessScope = 'GLOBAL' | 'COMPANY' | 'BRANCH' | 'FLEET' | 'SELF' | 'ASSIGNED';

export type ResourceModule =
  | 'command_center'
  | 'dashboard'
  | 'executive'
  | 'fleet'
  | 'vehicle'
  | 'driver'
  | 'gps_device'
  | 'tracking'
  | 'trip'
  | 'route'
  | 'dispatch'
  | 'geofence'
  | 'alert'
  | 'safety'
  | 'inspection'
  | 'fuel'
  | 'maintenance'
  | 'work_order'
  | 'finance'
  | 'report'
  | 'analytics'
  | 'ai'
  | 'user'
  | 'role'
  | 'permission'
  | 'company'
  | 'integration'
  | 'notification'
  | 'audit_log'
  | 'settings'
  | 'subscription'
  | 'super_admin'
  | 'automation'
  | 'document'
  | 'audit'
  | 'security';

export interface PermissionDefinition {
  key: string; // e.g. 'vehicle.view'
  module: ResourceModule;
  action: PermissionAction;
  label: string; // Indonesian display label
  description: string;
  moduleGroup: string; // Group title for UI matrix
}

export interface RoleDefinition {
  id: UserRole;
  name: string; // Display name e.g. "Fleet Manager"
  description: string;
  scope: AccessScope;
  isSystem: boolean; // true for standard system roles
  isActive: boolean;
  usersCount: number;
  permissions: string[]; // List of permission keys e.g. ['vehicle.view', 'vehicle.edit']
  createdAt: string;
  updatedAt: string;
}

export interface UserRoleScope {
  userId: string;
  roleId: UserRole;
  tenantId: string;
  scopeType: AccessScope;
  branchIds?: string[];
  fleetIds?: string[];
}

export interface RbacAuditLog {
  id: string;
  timestamp: string;
  action:
    | 'ROLE_CREATED'
    | 'ROLE_UPDATED'
    | 'ROLE_DELETED'
    | 'ROLE_ASSIGNED'
    | 'ROLE_REMOVED'
    | 'PERMISSION_GRANTED'
    | 'PERMISSION_REVOKED'
    | 'ACCESS_DENIED';
  performedBy: {
    userId: string;
    userName: string;
    role: string;
  };
  targetUser?: {
    userId: string;
    userName: string;
  };
  targetRole?: string;
  details: string;
  ipAddress: string;
}
