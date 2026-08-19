/**
 * Fleet Intelligence Smart AI - Enterprise Security Policies & Governance Tab
 * PROMPT 50 - Configurable Policies, 2FA Enforcement & Versioned Change History
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Edit,
  History,
  Lock,
  Clock,
  Key,
  Smartphone,
  Cpu,
  Bot,
  CheckCircle2,
  GitCommit,
} from 'lucide-react';
import { securityPolicyService } from '../services/securityPolicyService';
import { PolicyEditModal } from './PolicyEditModal';
import { SecurityPolicyConfig, PolicyVersionRecord } from '../types/securityTypes';

export const SecurityPoliciesTab: React.FC = () => {
  const [policy, setPolicy] = useState<SecurityPolicyConfig>(() =>
    securityPolicyService.getPolicy()
  );
  const [history, setHistory] = useState<PolicyVersionRecord[]>(() =>
    securityPolicyService.getVersionHistory()
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleRefresh = () => {
    setPolicy(securityPolicyService.getPolicy());
    setHistory(securityPolicyService.getVersionHistory());
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white text-lg">Enterprise Security Governance & Policies</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-medium">
              v{policy.version} Active
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Strict Zero Trust policies enforced across Password Complexity, 2FA/MFA, Session Timeouts, API Rate Limits, and GPS Protocols.
          </p>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition shadow-sm"
        >
          <Edit className="w-4 h-4" />
          Edit Policy Configuration
        </button>
      </div>

      {/* 4 Policy Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Password & Authentication Policy */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Lock className="w-5 h-5 text-blue-400" />
            Password & Credential Policy
          </div>
          <div className="space-y-2 text-xs divide-y divide-slate-800/80">
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Minimum Password Length:</span>
              <span className="text-white font-mono font-medium">{policy.passwordPolicy.minLength} Characters</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Complexity Requirements:</span>
              <span className="text-emerald-400 font-medium">Upper, Lower, Number, Special</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Max Failed Attempts (Lockout):</span>
              <span className="text-amber-400 font-mono font-medium">{policy.passwordPolicy.maxFailedAttempts} attempts ({policy.passwordPolicy.lockoutDurationMinutes}m lock)</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Password Rotation / Max Age:</span>
              <span className="text-slate-300 font-mono font-medium">{policy.passwordPolicy.maxAgeDays} Days</span>
            </div>
          </div>
        </div>

        {/* Card 2: Session & 2FA Policy */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Smartphone className="w-5 h-5 text-purple-400" />
            Session & Multi-Factor Auth (MFA)
          </div>
          <div className="space-y-2 text-xs divide-y divide-slate-800/80">
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Idle Session Timeout:</span>
              <span className="text-white font-mono font-medium">{policy.sessionPolicy.idleTimeoutMinutes} Minutes</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Absolute Session Ceiling:</span>
              <span className="text-white font-mono font-medium">{policy.sessionPolicy.absoluteTimeoutHours} Hours</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Max Concurrent Sessions:</span>
              <span className="text-slate-300 font-mono font-medium">{policy.sessionPolicy.maxConcurrentSessionsPerUser} devices/user</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Mandatory 2FA Enforced Roles:</span>
              <div className="flex flex-wrap gap-1 justify-end max-w-xs">
                {policy.sessionPolicy.enforceMfaForRoles.map((r) => (
                  <span key={r} className="px-1.5 py-0.5 bg-purple-500/10 text-purple-300 rounded font-mono text-[10px]">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version History & Diff Log */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h4 className="font-semibold text-white">Policy Version Audit Trail & Change Diffs</h4>
          </div>
          <span className="text-xs text-slate-400">Immutable Ledger</span>
        </div>

        <div className="space-y-4">
          {history.map((ver) => (
            <div key={ver.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-white text-sm">Policy Version {ver.version}</span>
                  <span className="text-xs text-slate-400">• by {ver.changedByEmail}</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">{new Date(ver.timestamp).toLocaleString()}</span>
              </div>

              <p className="text-xs text-slate-300 italic bg-slate-900/60 p-2 rounded border border-slate-800/80">
                "{ver.reason}"
              </p>

              {ver.changes.length > 0 && (
                <div className="pt-2 border-t border-slate-800/60 space-y-1 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Modifications Diff:
                  </span>
                  {ver.changes.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-blue-400">{c.section}.{c.field}:</span>
                      <span className="text-red-400 line-through">{JSON.stringify(c.oldValue)}</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-emerald-400 font-bold">{JSON.stringify(c.newValue)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <PolicyEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSaved={handleRefresh}
      />
    </div>
  );
};
