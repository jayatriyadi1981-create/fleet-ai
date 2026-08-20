/**
 * Fleet Intelligence Smart AI - Enterprise Data Isolation & Multi-Tenant Security Engine
 * PROMPT 50 - Tenant Boundary Enforcement, Branch Scoping & Cross-Tenant Defense
 */

import { UserProfile } from '../../../types';
import { UserRole, ResourceModule, PermissionAction, AccessScope } from '../../../types/rbac';
import { AuthorizationCheckRequest, AuthorizationCheckResult } from '../types/securityTypes';
import { authorizationService } from '../../../services/rbac/authorizationService';
import { auditService } from '../../audit/services/auditService';

export class DataIsolationService {
  private static instance: DataIsolationService;

  public static getInstance(): DataIsolationService {
    if (!DataIsolationService.instance) {
      DataIsolationService.instance = new DataIsolationService();
    }
    return DataIsolationService.instance;
  }

  /**
   * Verify server-side resource-level authorization with strict Multi-Tenant & Branch checks
   */
  public authorizeResourceAccess(request: AuthorizationCheckRequest): AuthorizationCheckResult {
    const { userRole, userTenantId, userBranchId, targetModule, targetAction, targetTenantId, targetBranchId } = request;

    // 1. Super Admin is GLOBAL
    if (userRole === 'super_admin') {
      return {
        allowed: true,
        reason: 'Super Admin has global operational clearance across all tenants and branches.',
        ruleMatched: 'GLOBAL_SUPER_ADMIN_OVERRIDE',
        effectiveScope: 'GLOBAL',
        isCrossTenantBreach: false,
        isBranchScopeBreach: false,
      };
    }

    // 2. Strict Tenant Boundary Isolation
    if (userTenantId !== targetTenantId) {
      // Cross-Tenant Access Attempt -> DENIED immediately
      auditService.logSecurityEvent({
        tenantId: userTenantId,
        action: 'UNAUTHORIZED_ACCESS',
        severity: 'CRITICAL',
        actor: {
          actorId: 'usr_sec_check',
          actorType: 'USER',
          actorEmail: `${userRole.toLowerCase()}@system.sec`,
          tenantId: userTenantId,
        },
        description: `CROSS-TENANT VIOLATION DETECTED: User in tenant [${userTenantId}] attempted [${targetAction}] on [${targetModule}] in foreign tenant [${targetTenantId}]`,
        securityMetadata: {
          isSuspicious: true,
          riskScore: 95,
        },
      });

      return {
        allowed: false,
        reason: 'Cross-Tenant Access Violation: Access to foreign tenant data is strictly forbidden by isolation policy.',
        ruleMatched: 'STRICT_TENANT_ISOLATION_BOUNDARY',
        effectiveScope: 'COMPANY',
        isCrossTenantBreach: true,
        isBranchScopeBreach: false,
      };
    }

    // 3. Permission matrix check
    const mockUser: UserProfile = {
      id: 'usr_ctx',
      email: 'user@tenant.id',
      name: 'Tenant User',
      role: userRole as any,
      tenantId: userTenantId,
      branchId: userBranchId,
      phone: '+628123456789',
      department: 'Operations',
      permissions: [],
    };

    const hasRbacPermission = authorizationService.can(mockUser, targetModule, targetAction);
    if (!hasRbacPermission) {
      return {
        allowed: false,
        reason: `RBAC Violation: Role [${userRole}] lacks permission [${targetModule}.${targetAction}].`,
        ruleMatched: 'RBAC_PERMISSION_MATRIX_DENY',
        effectiveScope: 'COMPANY',
        isCrossTenantBreach: false,
        isBranchScopeBreach: false,
      };
    }

    // 4. Branch Scope Isolation (e.g. branch dispatcher or operations restricted to their branch)
    const scope = authorizationService.getAccessScope(mockUser);
    if (scope === 'BRANCH') {
      if (userBranchId && targetBranchId && userBranchId !== targetBranchId) {
        return {
          allowed: false,
          reason: `Branch Boundary Violation: User is scoped to branch [${userBranchId}], cannot access branch [${targetBranchId}].`,
          ruleMatched: 'BRANCH_SCOPE_ISOLATION',
          effectiveScope: 'BRANCH',
          isCrossTenantBreach: false,
          isBranchScopeBreach: true,
        };
      }
    }

    return {
      allowed: true,
      reason: 'Access granted: Valid tenant context, active RBAC clearance, and branch compliance.',
      ruleMatched: 'AUTHORIZED_TENANT_MATCH',
      effectiveScope: scope,
      isCrossTenantBreach: false,
      isBranchScopeBreach: false,
    };
  }

  /**
   * Filter an array of records to enforce tenant & branch isolation
   */
  public filterByTenantScope<T extends { tenantId?: string; branchId?: string }>(
    user: UserProfile | null,
    records: T[]
  ): T[] {
    if (!user) return [];
    if (user.role === 'super_admin') return records;

    return records.filter((r) => {
      // Must match tenant
      if (r.tenantId && r.tenantId !== user.tenantId) {
        return false;
      }
      // If branch scoped, filter by branch if record has branchId
      const scope = authorizationService.getAccessScope(user);
      if (scope === 'BRANCH' && user.branchId && r.branchId) {
        return r.branchId === user.branchId;
      }
      return true;
    });
  }
}

export const dataIsolationService = DataIsolationService.getInstance();
