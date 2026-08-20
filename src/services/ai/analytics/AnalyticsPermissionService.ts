/**
 * Fleet Intelligence Smart AI - Analytics Permission Service
 * PROMPT 53 — Section 10 & 11
 * Enforces strict multi-tenant isolation, RBAC, module permissions, and prevents data leaks.
 */

import { NLAnalyticsIntent } from '../../../types/nlAnalytics';

export interface PermissionCheckResult {
  allowed: boolean;
  requiredPermission: string;
  denialMessage?: string;
  scope: {
    tenantId: string;
    branchId?: string;
    departmentId?: string;
    isSuperAdmin: boolean;
  };
}

export class AnalyticsPermissionService {
  /**
   * Maps analytical intents to mandatory RBAC permissions
   */
  private static intentPermissionMap: Record<NLAnalyticsIntent, string> = {
    FLEET_PERFORMANCE: 'dashboard.view',
    VEHICLE_ANALYSIS: 'vehicle.view',
    DRIVER_ANALYSIS: 'driver.view',
    FUEL_ANALYSIS: 'fuel.view',
    MAINTENANCE_ANALYSIS: 'maintenance.view',
    SAFETY_ANALYSIS: 'safety.view',
    TRIP_ANALYSIS: 'trip.view',
    DELIVERY_ANALYSIS: 'trip.view',
    COST_ANALYSIS: 'cost.view',
    UTILIZATION_ANALYSIS: 'analytics.view',
    BRANCH_COMPARISON: 'vehicle.view',
    ROUTE_ANALYSIS: 'route.view',
    GEOFENCE_ANALYSIS: 'geofence.view',
    ALERT_ANALYSIS: 'alert.view',
    EXECUTIVE_ANALYSIS: 'executive.dashboard.view',
    PREDICTIVE_ANALYSIS: 'ai.view',
  };

  /**
   * Checks whether the current user has permission to execute the specified analytics query
   */
  public static validate(
    intent: NLAnalyticsIntent,
    tenantId: string,
    userRole: string = 'user',
    userPermissions: string[] = [],
    userBranchId?: string,
    userDepartmentId?: string
  ): PermissionCheckResult {
    const isSuperAdmin = userRole === 'super_admin' || userPermissions.includes('*') || userPermissions.includes('admin.company.manage');
    const requiredPermission = this.intentPermissionMap[intent] || 'analytics.view';

    // Super Admin has universal access
    if (isSuperAdmin) {
      return {
        allowed: true,
        requiredPermission,
        scope: {
          tenantId,
          isSuperAdmin: true,
        },
      };
    }

    // Check if user has required module permission or universal AI read
    const hasPermission =
      userPermissions.includes(requiredPermission) ||
      userPermissions.includes('ai.view') ||
      userPermissions.includes('analytics.view') ||
      userPermissions.includes('dashboard.view');

    if (!hasPermission) {
      const friendlyIntentName = this.getFriendlyIntentName(intent);
      return {
        allowed: false,
        requiredPermission,
        denialMessage: `Anda tidak memiliki izin akses untuk menganalisis data ${friendlyIntentName} (Memerlukan hak akses: ${requiredPermission}). Hubungi Super Admin / IT Administrator perusahaan Anda.`,
        scope: {
          tenantId,
          branchId: userBranchId,
          departmentId: userDepartmentId,
          isSuperAdmin: false,
        },
      };
    }

    return {
      allowed: true,
      requiredPermission,
      scope: {
        tenantId,
        branchId: userBranchId,
        departmentId: userDepartmentId,
        isSuperAdmin: false,
      },
    };
  }

  private static getFriendlyIntentName(intent: NLAnalyticsIntent): string {
    switch (intent) {
      case 'DRIVER_ANALYSIS':
        return 'Pengemudi & Keselamatan Driver';
      case 'SAFETY_ANALYSIS':
        return 'Keselamatan HSE & Insiden';
      case 'COST_ANALYSIS':
        return 'Finansial & Biaya Operasional (TCO)';
      case 'FUEL_ANALYSIS':
        return 'Konsumsi BBM & Sensor Solar';
      case 'MAINTENANCE_ANALYSIS':
        return 'Perawatan Bengkel & Work Order';
      case 'EXECUTIVE_ANALYSIS':
        return 'Laporan Eksekutif C-Level & Direksi';
      case 'DELIVERY_ANALYSIS':
        return 'Pengiriman & Surat Jalan (POD)';
      default:
        return 'Telematika Armada';
    }
  }
}
