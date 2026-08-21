/**
 * Fleet Intelligence Smart AI - Role & Permission Management Service
 */

import { RoleDefinition, UserRole, AccessScope, RbacAuditLog } from '../../types/rbac';
import { DEFAULT_SYSTEM_ROLES, PERMISSION_CATALOG } from './permissionCatalog';

const LOCAL_STORAGE_ROLES_KEY = 'fleet_intel_rbac_roles_v1';
const LOCAL_STORAGE_RBAC_AUDIT_KEY = 'fleet_intel_rbac_audit_v1';

class RoleService {
  private roles: RoleDefinition[] = [];
  private auditLogs: RbacAuditLog[] = [];

  constructor() {
    this.initRoles();
    this.initAuditLogs();
  }

  private initRoles() {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ROLES_KEY);
      if (saved) {
        const storedRoles: RoleDefinition[] = JSON.parse(saved);
        // Merge system roles to ensure new system roles (developer, rental, logistics, bus, mining, etc.) are always present
        const customRoles = storedRoles.filter((r) => !r.isSystem);
        const mergedSystemRoles = DEFAULT_SYSTEM_ROLES.map((defaultRole) => {
          const existing = storedRoles.find((r) => r.id === defaultRole.id);
          if (existing && existing.isSystem) {
            // Keep customized permissions if altered, but keep latest metadata
            return {
              ...defaultRole,
              permissions: existing.permissions || defaultRole.permissions,
              scope: existing.scope || defaultRole.scope,
            };
          }
          return defaultRole;
        });
        this.roles = [...mergedSystemRoles, ...customRoles];
      } else {
        this.roles = [...DEFAULT_SYSTEM_ROLES];
      }
      this.persistRoles();
    } catch {
      this.roles = [...DEFAULT_SYSTEM_ROLES];
    }
  }

  private initAuditLogs() {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_RBAC_AUDIT_KEY);
      if (saved) {
        this.auditLogs = JSON.parse(saved);
      } else {
        this.auditLogs = [
          {
            id: 'rbac-log-001',
            timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
            action: 'ROLE_CREATED',
            performedBy: { userId: 'usr-admin-01', userName: 'Budi Santoso', role: 'company_admin' },
            targetRole: 'Fleet Supervisor',
            details: 'Role kustom "Fleet Supervisor" berhasil dibuat dengan 24 izin.',
            ipAddress: '180.252.12.98',
          },
          {
            id: 'rbac-log-002',
            timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
            action: 'ROLE_ASSIGNED',
            performedBy: { userId: 'usr-admin-01', userName: 'Budi Santoso', role: 'company_admin' },
            targetUser: { userId: 'usr-op-04', userName: 'Rizky Febrian' },
            targetRole: 'dispatcher',
            details: 'Menugaskan role Dispatcher ke pengguna Rizky Febrian untuk Cabang Surabaya.',
            ipAddress: '180.252.12.98',
          },
        ];
        this.persistAuditLogs();
      }
    } catch {
      this.auditLogs = [];
    }
  }

  private persistRoles() {
    try {
      localStorage.setItem(LOCAL_STORAGE_ROLES_KEY, JSON.stringify(this.roles));
    } catch {
      // localStorage quota
    }
  }

  private persistAuditLogs() {
    try {
      localStorage.setItem(LOCAL_STORAGE_RBAC_AUDIT_KEY, JSON.stringify(this.auditLogs));
    } catch {
      // localStorage quota
    }
  }

  public getRoles(): RoleDefinition[] {
    return [...this.roles];
  }

  public getRoleById(roleId: UserRole): RoleDefinition | undefined {
    return this.roles.find((r) => r.id === roleId);
  }

  public createRole(data: {
    name: string;
    description: string;
    scope: AccessScope;
    permissions: string[];
    performedBy: { userId: string; userName: string; role: string };
  }): RoleDefinition {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const id = `custom_${slug}_${Date.now().toString(36)}`;

    const newRole: RoleDefinition = {
      id,
      name: data.name,
      description: data.description,
      scope: data.scope,
      isSystem: false,
      isActive: true,
      usersCount: 0,
      permissions: data.permissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.roles.push(newRole);
    this.persistRoles();

    this.logAudit({
      action: 'ROLE_CREATED',
      performedBy: data.performedBy,
      targetRole: newRole.name,
      details: `Role kustom "${newRole.name}" dibuat dengan ${newRole.permissions.length} izin pada cakupan ${newRole.scope}.`,
    });

    return newRole;
  }

  public duplicateRole(
    sourceRoleId: UserRole,
    newName: string,
    performedBy: { userId: string; userName: string; role: string }
  ): RoleDefinition {
    const source = this.getRoleById(sourceRoleId);
    if (!source) {
      throw new Error(`Role sumber "${sourceRoleId}" tidak ditemukan.`);
    }

    return this.createRole({
      name: newName,
      description: `Salinan dari role ${source.name}. ${source.description}`,
      scope: source.scope,
      permissions: [...source.permissions],
      performedBy,
    });
  }

  public updateRolePermissions(
    roleId: UserRole,
    newPermissions: string[],
    performedBy: { userId: string; userName: string; role: string }
  ): RoleDefinition {
    const roleIndex = this.roles.findIndex((r) => r.id === roleId);
    if (roleIndex === -1) {
      throw new Error(`Role "${roleId}" tidak ditemukan.`);
    }

    const currentRole = this.roles[roleIndex];
    const prevPermCount = currentRole.permissions.length;

    const updatedRole: RoleDefinition = {
      ...currentRole,
      permissions: newPermissions,
      updatedAt: new Date().toISOString(),
    };

    this.roles[roleIndex] = updatedRole;
    this.persistRoles();

    this.logAudit({
      action: 'ROLE_UPDATED',
      performedBy,
      targetRole: updatedRole.name,
      details: `Matriks izin role "${updatedRole.name}" diperbarui dari ${prevPermCount} menjadi ${newPermissions.length} izin.`,
    });

    return updatedRole;
  }

  public canDeleteRole(roleId: UserRole): { canDelete: boolean; message?: string; usersCount: number } {
    const role = this.getRoleById(roleId);
    if (!role) {
      return { canDelete: false, message: 'Role tidak ditemukan.', usersCount: 0 };
    }

    if (role.isSystem) {
      return {
        canDelete: false,
        message: `Role sistem standar "${role.name}" tidak dapat dihapus. Anda hanya dapat mengubah matriks izinnya.`,
        usersCount: role.usersCount,
      };
    }

    if (role.usersCount > 0) {
      return {
        canDelete: false,
        message: `Role "${role.name}" tidak dapat dihapus karena masih digunakan oleh ${role.usersCount} pengguna aktif. Silakan reassign pengguna terlebih dahulu.`,
        usersCount: role.usersCount,
      };
    }

    return { canDelete: true, usersCount: 0 };
  }

  public deleteRole(
    roleId: UserRole,
    performedBy: { userId: string; userName: string; role: string }
  ): boolean {
    const check = this.canDeleteRole(roleId);
    if (!check.canDelete) {
      throw new Error(check.message);
    }

    const role = this.getRoleById(roleId);
    if (!role) return false;

    this.roles = this.roles.filter((r) => r.id !== roleId);
    this.persistRoles();

    this.logAudit({
      action: 'ROLE_DELETED',
      performedBy,
      targetRole: role.name,
      details: `Role kustom "${role.name}" (${role.id}) berhasil dihapus dari sistem.`,
    });

    return true;
  }

  public assignUserRole(
    userId: string,
    userName: string,
    targetRoleId: UserRole,
    scope: { branchId?: string; fleetId?: string },
    performedBy: { userId: string; userName: string; role: string }
  ) {
    const role = this.getRoleById(targetRoleId);
    if (!role) {
      throw new Error(`Role "${targetRoleId}" tidak ditemukan.`);
    }

    // Increment user count for target role
    const roleIndex = this.roles.findIndex((r) => r.id === targetRoleId);
    if (roleIndex !== -1) {
      this.roles[roleIndex].usersCount += 1;
      this.persistRoles();
    }

    this.logAudit({
      action: 'ROLE_ASSIGNED',
      performedBy,
      targetUser: { userId, userName },
      targetRole: role.name,
      details: `Penugasan role "${role.name}" ke pengguna ${userName}.${
        scope.branchId ? ` Cabang: ${scope.branchId}.` : ''
      }`,
    });
  }

  public getAuditLogs(): RbacAuditLog[] {
    return [...this.auditLogs];
  }

  public logAudit(event: {
    action: RbacAuditLog['action'];
    performedBy: { userId: string; userName: string; role: string };
    targetUser?: { userId: string; userName: string };
    targetRole?: string;
    details: string;
  }) {
    const log: RbacAuditLog = {
      id: `rbac-log-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      action: event.action,
      performedBy: event.performedBy,
      targetUser: event.targetUser,
      targetRole: event.targetRole,
      details: event.details,
      ipAddress: '180.252.12.98',
    };

    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 200) {
      this.auditLogs = this.auditLogs.slice(0, 200);
    }
    this.persistAuditLogs();
  }
}

export const roleService = new RoleService();
