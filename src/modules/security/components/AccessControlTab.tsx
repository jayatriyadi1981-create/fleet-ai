/**
 * Fleet Intelligence Smart AI - Access Control & Tenant Isolation Simulator Tab
 * PROMPT 50 - Zero Trust Server-Side Authorization & Multi-Tenant Boundary Tester
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Layers,
  Building,
  GitFork,
  CheckCircle2,
  XCircle,
  Play,
  Info,
} from 'lucide-react';
import { dataIsolationService } from '../services/dataIsolationService';
import { UserRole, ResourceModule, PermissionAction } from '../../../types/rbac';
import { AuthorizationCheckResult } from '../types/securityTypes';

export const AccessControlTab: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>('fleet_manager');
  const [userTenantId, setUserTenantId] = useState<string>('tenant_alpha_logistics');
  const [userBranchId, setUserBranchId] = useState<string>('branch_jakarta_depo');

  const [targetModule, setTargetModule] = useState<ResourceModule>('vehicle');
  const [targetAction, setTargetAction] = useState<PermissionAction>('edit');
  const [targetTenantId, setTargetTenantId] = useState<string>('tenant_alpha_logistics');
  const [targetBranchId, setTargetBranchId] = useState<string>('branch_jakarta_depo');

  const [simulationResult, setSimulationResult] = useState<AuthorizationCheckResult | null>(() =>
    dataIsolationService.authorizeResourceAccess({
      userRole: 'fleet_manager',
      userTenantId: 'tenant_alpha_logistics',
      userBranchId: 'branch_jakarta_depo',
      targetModule: 'vehicle',
      targetAction: 'edit',
      targetTenantId: 'tenant_alpha_logistics',
      targetBranchId: 'branch_jakarta_depo',
    })
  );

  const handleRunSimulation = () => {
    const verdict = dataIsolationService.authorizeResourceAccess({
      userRole,
      userTenantId,
      userBranchId,
      targetModule,
      targetAction,
      targetTenantId,
      targetBranchId,
    });
    setSimulationResult(verdict);
  };

  const handleQuickPreset = (preset: 'VALID_OPS' | 'CROSS_TENANT' | 'BRANCH_BREACH' | 'VIEWER_DELETE') => {
    if (preset === 'VALID_OPS') {
      setUserRole('fleet_manager');
      setUserTenantId('tenant_alpha_logistics');
      setUserBranchId('branch_jakarta_depo');
      setTargetModule('vehicle');
      setTargetAction('edit');
      setTargetTenantId('tenant_alpha_logistics');
      setTargetBranchId('branch_jakarta_depo');
    } else if (preset === 'CROSS_TENANT') {
      setUserRole('fleet_manager');
      setUserTenantId('tenant_alpha_logistics');
      setUserBranchId('branch_jakarta_depo');
      setTargetModule('vehicle');
      setTargetAction('edit');
      setTargetTenantId('tenant_beta_express'); // CROSS TENANT!
      setTargetBranchId('branch_surabaya_depo');
    } else if (preset === 'BRANCH_BREACH') {
      setUserRole('dispatcher');
      setUserTenantId('tenant_alpha_logistics');
      setUserBranchId('branch_jakarta_depo');
      setTargetModule('trip');
      setTargetAction('edit');
      setTargetTenantId('tenant_alpha_logistics');
      setTargetBranchId('branch_surabaya_depo'); // FOREIGN BRANCH!
    } else if (preset === 'VIEWER_DELETE') {
      setUserRole('viewer');
      setUserTenantId('tenant_alpha_logistics');
      setUserBranchId('branch_jakarta_depo');
      setTargetModule('vehicle');
      setTargetAction('delete'); // VIEWER TRYING TO DELETE!
      setTargetTenantId('tenant_alpha_logistics');
      setTargetBranchId('branch_jakarta_depo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold text-white text-lg">Server-Side Authorization & Isolation Engine</h3>
        <p className="text-sm text-slate-400 mt-1">
          Every request is evaluated on the backend against cryptographic tenant identifiers, branch scopes, and RBAC matrix.
          Test scenarios below to verify boundary enforcement in real-time.
        </p>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400 self-center mr-1">Quick Scenarios:</span>
          <button
            onClick={() => handleQuickPreset('VALID_OPS')}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition"
          >
            1. Valid Fleet Manager Edit
          </button>
          <button
            onClick={() => handleQuickPreset('CROSS_TENANT')}
            className="px-3 py-1 bg-red-950/40 hover:bg-red-900/40 text-red-300 text-xs rounded-lg border border-red-500/30 transition"
          >
            2. Cross-Tenant Breach Attack
          </button>
          <button
            onClick={() => handleQuickPreset('BRANCH_BREACH')}
            className="px-3 py-1 bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 text-xs rounded-lg border border-amber-500/30 transition"
          >
            3. Branch Boundary Breach
          </button>
          <button
            onClick={() => handleQuickPreset('VIEWER_DELETE')}
            className="px-3 py-1 bg-blue-950/40 hover:bg-blue-900/40 text-blue-300 text-xs rounded-lg border border-blue-500/30 transition"
          >
            4. Viewer Unauthorized Delete
          </button>
        </div>
      </div>

      {/* Simulator Inputs & Live Verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Parameters */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-400" />
              1. Actor Context (Authenticated Identity)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">User Role</label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5"
              >
                <option value="super_admin">super_admin</option>
                <option value="company_admin">company_admin</option>
                <option value="owner">owner</option>
                <option value="fleet_manager">fleet_manager</option>
                <option value="operations">operations</option>
                <option value="dispatcher">dispatcher</option>
                <option value="driver">driver</option>
                <option value="viewer">viewer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Actor Tenant ID</label>
              <input
                type="text"
                value={userTenantId}
                onChange={(e) => setUserTenantId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Actor Branch ID</label>
              <input
                type="text"
                value={userBranchId}
                onChange={(e) => setUserBranchId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <h4 className="font-semibold text-white flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-purple-400" />
              2. Target Resource & Action
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Module</label>
                <select
                  value={targetModule}
                  onChange={(e) => setTargetModule(e.target.value as ResourceModule)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5"
                >
                  <option value="vehicle">vehicle</option>
                  <option value="driver">driver</option>
                  <option value="trip">trip</option>
                  <option value="gps">gps</option>
                  <option value="ai">ai</option>
                  <option value="audit">audit</option>
                  <option value="maintenance">maintenance</option>
                  <option value="finance">finance</option>
                  <option value="settings">settings</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Action</label>
                <select
                  value={targetAction}
                  onChange={(e) => setTargetAction(e.target.value as PermissionAction)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5"
                >
                  <option value="view">view</option>
                  <option value="create">create</option>
                  <option value="edit">edit</option>
                  <option value="delete">delete</option>
                  <option value="export">export</option>
                  <option value="manage">manage</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Target Tenant ID</label>
                <input
                  type="text"
                  value={targetTenantId}
                  onChange={(e) => setTargetTenantId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Target Branch ID</label>
                <input
                  type="text"
                  value={targetBranchId}
                  onChange={(e) => setTargetBranchId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 font-mono"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 mt-2 shadow-sm"
          >
            <Play className="w-4 h-4 fill-white" />
            Evaluate Access Authorization
          </button>
        </div>

        {/* Right: Real-Time Engine Verdict */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="font-semibold text-white flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-emerald-400" />
              Security Engine Verdict
            </h4>

            {simulationResult && (
              <div className="space-y-4">
                {/* Result Banner */}
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                    simulationResult.allowed
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-950/40 border-red-500/40 text-red-300'
                  }`}
                >
                  {simulationResult.allowed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold text-base block">
                      {simulationResult.allowed ? 'ACCESS GRANTED (200 OK)' : 'ACCESS DENIED (403 FORBIDDEN)'}
                    </span>
                    <p className="text-xs mt-1 leading-relaxed opacity-90">{simulationResult.reason}</p>
                  </div>
                </div>

                {/* Technical Diagnostic Details */}
                <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Rule Matched:</span>
                    <span className="text-slate-200 font-mono font-medium">{simulationResult.ruleMatched}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Effective Scope:</span>
                    <span className="text-blue-400 font-mono font-medium">{simulationResult.effectiveScope}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Cross-Tenant Violation:</span>
                    <span
                      className={`font-mono font-medium ${
                        simulationResult.isCrossTenantBreach ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {simulationResult.isCrossTenantBreach ? 'YES (FLAGGED)' : 'NO'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Branch Boundary Violation:</span>
                    <span
                      className={`font-mono font-medium ${
                        simulationResult.isBranchScopeBreach ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {simulationResult.isBranchScopeBreach ? 'YES (RESTRICTED)' : 'NO'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 shrink-0 text-slate-400" />
            <span>Audit log automatically dispatched to tamper-evident cryptographic chain.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
