/**
 * Fleet Intelligence Smart AI - Permission Guard Component
 */

import React from 'react';
import { useAuthorization } from '../../hooks/useAuthorization';
import { PermissionAction, ResourceModule } from '../../types/rbac';
import { ShieldAlert } from 'lucide-react';

interface PermissionGuardProps {
  permission?: string;
  resource?: ResourceModule;
  action?: PermissionAction;
  mode?: 'hide' | 'disable';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  resource,
  action,
  mode = 'hide',
  fallback = null,
  children,
}) => {
  const { can, hasPermission } = useAuthorization();

  const isAllowed = resource && action ? can(resource, action) : permission ? hasPermission(permission) : true;

  if (isAllowed) {
    return <>{children}</>;
  }

  if (mode === 'hide') {
    return <>{fallback}</>;
  }

  // mode === 'disable': Render children with pointer-events disabled and warning tooltip
  return (
    <div
      className="relative group inline-block opacity-50 cursor-not-allowed select-none"
      title="Akses Dibatasi: Peran akun Anda tidak memiliki izin untuk tindakan ini."
    >
      <div className="pointer-events-none">{children}</div>
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-[10px] text-amber-300 shadow-xl whitespace-nowrap z-50">
        <ShieldAlert className="h-3 w-3 shrink-0 text-amber-400" />
        Akses dibatasi untuk peran Anda
      </div>
    </div>
  );
};
