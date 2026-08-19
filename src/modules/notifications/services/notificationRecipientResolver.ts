/**
 * Fleet Intelligence Smart AI - Notification Recipient Resolver Service
 * Determines targeted users/roles for notifications based on RBAC, Scope, Branch, & Tenant
 */

import { NotificationPriority } from '../types';

export interface RecipientUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  branchId?: string;
  tenantId: string;
}

export class NotificationRecipientResolver {
  private mockUsers: RecipientUser[] = [
    {
      id: 'usr-001',
      name: 'Jayatri Yadi',
      email: 'jayatriyadi1981@gmail.com',
      phone: '+6281234567890',
      role: 'COMPANY_ADMIN',
      branchId: 'all',
      tenantId: 'tenant-indonesia-logistics',
    },
    {
      id: 'usr-002',
      name: 'Budi Santoso',
      email: 'budi.ops@fleet-intel.id',
      phone: '+6281298765432',
      role: 'OPERATIONS_MANAGER',
      branchId: 'branch-jkt-01',
      tenantId: 'tenant-indonesia-logistics',
    },
    {
      id: 'usr-003',
      name: 'Siti Rahma',
      email: 'siti.dispatcher@fleet-intel.id',
      phone: '+6281311223344',
      role: 'DISPATCHER',
      branchId: 'branch-jkt-01',
      tenantId: 'tenant-indonesia-logistics',
    },
    {
      id: 'usr-004',
      name: 'Eko Prasetyo',
      email: 'eko.safety@fleet-intel.id',
      phone: '+6281555667788',
      role: 'SAFETY_OFFICER',
      branchId: 'branch-sby-02',
      tenantId: 'tenant-indonesia-logistics',
    },
  ];

  /**
   * Resolves target recipients strictly scoped to tenant and relevant branch/role
   */
  resolveRecipients(
    tenantId: string,
    priority: NotificationPriority,
    options?: {
      branchId?: string;
      roleFilter?: string[];
      specificUserId?: string;
    }
  ): RecipientUser[] {
    // 1. Strict Tenant Isolation
    let candidates = this.mockUsers.filter((u) => u.tenantId === tenantId);

    // 2. Specific user target if requested
    if (options?.specificUserId) {
      return candidates.filter((u) => u.id === options.specificUserId);
    }

    // 3. Branch Scoped filter
    if (options?.branchId && options.branchId !== 'all') {
      candidates = candidates.filter((u) => u.branchId === 'all' || u.branchId === options.branchId);
    }

    // 4. Role filter
    if (options?.roleFilter && options.roleFilter.length > 0) {
      candidates = candidates.filter((u) => options.roleFilter?.includes(u.role));
    }

    // 5. Critical Priority Auto-Escalation to Admins & Ops Managers
    if (priority === 'CRITICAL') {
      const execs = this.mockUsers.filter(
        (u) => u.tenantId === tenantId && ['COMPANY_ADMIN', 'OPERATIONS_MANAGER'].includes(u.role)
      );
      // Merge unique
      const candidateIds = new Set(candidates.map((c) => c.id));
      execs.forEach((e) => {
        if (!candidateIds.has(e.id)) {
          candidates.push(e);
        }
      });
    }

    return candidates;
  }
}

export const notificationRecipientResolver = new NotificationRecipientResolver();
