/**
 * Fleet Intelligence Smart AI - Authorization Engine & Scope Enforcement Service
 */

import { UserProfile } from '../../types';
import { PermissionAction, ResourceModule, SystemRole, UserRole, AccessScope } from '../../types/rbac';
import { roleService } from './roleService';

export class AuthorizationService {
  /**
   * Check if user has specific permission key e.g. "vehicle.edit" or "command_center:view"
   */
  public hasPermission(user: UserProfile | null, permissionKey: string): boolean {
    if (!user) return false;

    // Super Admin & Company Admin always have full administrative permissions
    if (user.role === 'super_admin' || user.role === 'company_admin') {
      return true;
    }

    const dotKey = permissionKey.replace(':', '.');
    const colonKey = permissionKey.replace('.', ':');

    // Check explicitly assigned permissions array
    if (user.permissions && (user.permissions.includes(permissionKey) || user.permissions.includes(dotKey) || user.permissions.includes(colonKey))) {
      return true;
    }

    // Check permissions defined in the active role
    const roleDef = roleService.getRoleById(user.role);
    if (roleDef && (roleDef.permissions.includes(permissionKey) || roleDef.permissions.includes(dotKey) || roleDef.permissions.includes(colonKey))) {
      return true;
    }

    return false;
  }

  /**
   * Convenience helper for resource and action e.g. can(user, 'vehicle', 'edit')
   */
  public can(user: UserProfile | null, resource: ResourceModule, action: PermissionAction): boolean {
    const permKey = `${resource}.${action}`;
    return this.hasPermission(user, permKey);
  }

  /**
   * Check if user has AT LEAST ONE of the requested permissions
   */
  public hasAnyPermission(user: UserProfile | null, permissionKeys: string[]): boolean {
    if (!user) return false;
    if (permissionKeys.length === 0) return true;
    return permissionKeys.some((key) => this.hasPermission(user, key));
  }

  /**
   * Check if user has ALL of the requested permissions
   */
  public hasAllPermissions(user: UserProfile | null, permissionKeys: string[]): boolean {
    if (!user) return false;
    if (permissionKeys.length === 0) return true;
    return permissionKeys.every((key) => this.hasPermission(user, key));
  }

  /**
   * Check if user has specific role
   */
  public hasRole(user: UserProfile | null, roleId: UserRole): boolean {
    if (!user) return false;
    if (user.role === 'super_admin') return true; // Super admin matches any role requirement
    return user.role === roleId;
  }

  /**
   * Check if user has any role from list
   */
  public hasAnyRole(user: UserProfile | null, roleIds: UserRole[]): boolean {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return roleIds.includes(user.role);
  }

  /**
   * Resolve all active effective permission keys for user
   */
  public getEffectivePermissions(user: UserProfile | null): string[] {
    if (!user) return [];

    const roleDef = roleService.getRoleById(user.role);
    const rolePerms = roleDef ? roleDef.permissions : [];
    const directPerms = user.permissions || [];

    // Union of both arrays
    const combined = Array.from(new Set([...rolePerms, ...directPerms]));
    return combined;
  }

  /**
   * Get user's active scope boundary
   */
  public getAccessScope(user: UserProfile | null): AccessScope {
    if (!user) return 'SELF';
    const roleDef = roleService.getRoleById(user.role);
    return roleDef ? roleDef.scope : 'COMPANY';
  }

  /**
   * Data-level Access Control Policy
   * Verifies if a user has access to a specific domain record based on tenant, branch, fleet & driver self-assignment
   */
  public canAccessData<T extends { tenantId?: string; branchId?: string; driverId?: string; vehicleId?: string }>(
    user: UserProfile | null,
    record: T
  ): boolean {
    if (!user) return false;

    // Super Admin sees all tenant data
    if (user.role === 'super_admin') return true;

    // 1. Tenant Isolation Check
    if (record.tenantId && record.tenantId !== user.tenantId) {
      return false;
    }

    // Company Admin sees all data in tenant
    if (user.role === 'company_admin') return true;

    // 2. Driver Scope Enforcement (Driver MUST ONLY see self or assigned records)
    if (user.role === 'driver') {
      if (record.driverId) {
        return record.driverId === user.id;
      }
      // If record has no driverId, driver cannot access
      return false;
    }

    // 3. Branch Scope Enforcement
    if (user.branchId && record.branchId) {
      const scope = this.getAccessScope(user);
      if (scope === 'BRANCH' && record.branchId !== user.branchId) {
        return false;
      }
    }

    return true;
  }
}

export const authorizationService = new AuthorizationService();
