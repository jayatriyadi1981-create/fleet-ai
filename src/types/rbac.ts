/**
 * Fleet Intelligence Smart AI - Role Based Access Control (RBAC) Types
 * Enterprise Authorization, Permissions & Scope Architecture
 */

export type SystemRole =
  | 'super_admin'
  | 'company_owner'
  | 'owner'
  | 'company_admin'
  | 'fleet_manager'
  | 'operations_manager'
  | 'operations'
  | 'dispatcher'
  | 'supervisor'
  | 'driver'
  | 'maintenance'
  | 'finance'
  | 'hr'
  | 'viewer';

export type UserRole = SystemRole | string; // Supports custom roles

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'export' | 'approve' | 'execute' | 'admin';

export type AccessScope = 'GLOBAL' | 'COMPANY' | 'REGION' | 'BRANCH' | 'DEPARTMENT' | 'FLEET' | 'VEHICLE' | 'SELF' | 'ASSIGNED';

export type RegionId = 'REGION_ALL' | 'REGION_WEST_JAVA' | 'REGION_CENTRAL_JAVA' | 'REGION_EAST_JAVA' | 'REGION_SUMATRA' | 'REGION_KALIMANTAN' | 'REGION_SULAWESI' | 'REGION_BALI_NUSA';

export type DepartmentId = 
  | 'DEPT_EXECUTIVE'
  | 'DEPT_OPERATIONS'
  | 'DEPT_FLEET_MANAGEMENT'
  | 'DEPT_DISPATCH'
  | 'DEPT_MAINTENANCE_WORKSHOP'
  | 'DEPT_SAFETY_HSE'
  | 'DEPT_FINANCE_ACCOUNTING'
  | 'DEPT_HR_PEOPLE'
  | 'DEPT_IT_SECURITY';

export type MenuPermissionKey =
  | 'menu_command_center'
  | 'menu_executive_dashboard'
  | 'menu_live_tracking'
  | 'menu_fleet_vehicles'
  | 'menu_drivers'
  | 'menu_trips_dispatch'
  | 'menu_routes'
  | 'menu_geofence'
  | 'menu_fuel'
  | 'menu_maintenance'
  | 'menu_safety_fatigue'
  | 'menu_inspection'
  | 'menu_rent_car'
  | 'menu_cost_analytics'
  | 'menu_reports'
  | 'menu_analytics'
  | 'menu_ai_copilot'
  | 'menu_automation'
  | 'menu_documents'
  | 'menu_users_roles'
  | 'menu_security_center'
  | 'menu_subscription'
  | 'menu_settings'
  | 'menu_gps_integration'
  | 'menu_super_admin';

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
  | 'rent_car'
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
  | 'security'
  | 'hr';

export interface PermissionDefinition {
  key: string; // e.g. 'vehicle.view'
  module: ResourceModule;
  action: PermissionAction;
  label: string; // Display label
  description: string;
  moduleGroup: string; // Group title for UI matrix
}

export interface GranularPermissionScope {
  // Granular dimensions as requested: Module, Menu, Action, Vehicle, Branch, Department, Region
  modules: ResourceModule[];
  allowedMenus: MenuPermissionKey[];
  allowedActions: PermissionAction[];
  vehicleScope: 'ALL' | 'BRANCH_ONLY' | 'ASSIGNED_ONLY' | 'CUSTOM' | string;
  specificVehicleIds?: string[];
  branchScope: 'ALL' | 'ASSIGNED_BRANCHES' | 'CUSTOM' | string;
  specificBranchIds?: string[];
  departmentScope: 'ALL' | 'ASSIGNED_DEPT' | 'CUSTOM' | DepartmentId | string;
  specificDepartmentIds?: DepartmentId[];
  regionScope: 'ALL' | 'ASSIGNED_REGIONS' | 'CUSTOM' | RegionId | string;
  specificRegionIds?: RegionId[];
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
  granularScope?: GranularPermissionScope;
  createdAt: string;
  updatedAt: string;
}

export interface UserRoleScope {
  userId: string;
  roleId: UserRole;
  tenantId: string;
  scopeType: AccessScope;
  regionIds?: RegionId[];
  branchIds?: string[];
  departmentIds?: DepartmentId[];
  vehicleIds?: string[];
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
