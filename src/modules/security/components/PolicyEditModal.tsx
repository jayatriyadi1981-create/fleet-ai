/**
 * Fleet Intelligence Smart AI - Security Policy Editor Modal
 * PROMPT 50 - Mandatory Justification & Versioned Audit Diff
 */

import React, { useState } from 'react';
import { ShieldCheck, X, AlertTriangle, Save } from 'lucide-react';
import { securityPolicyService } from '../services/securityPolicyService';
import { SecurityPolicyConfig } from '../types/securityTypes';

interface PolicyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const PolicyEditModal: React.FC<PolicyEditModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const currentPolicy = securityPolicyService.getPolicy();

  const [minPasswordLength, setMinPasswordLength] = useState(
    currentPolicy.passwordPolicy.minLength
  );
  const [maxFailedAttempts, setMaxFailedAttempts] = useState(
    currentPolicy.passwordPolicy.maxFailedAttempts
  );
  const [idleTimeout, setIdleTimeout] = useState(
    currentPolicy.sessionPolicy.idleTimeoutMinutes
  );
  const [rateLimit, setRateLimit] = useState(
    currentPolicy.apiPolicy.rateLimitPerMinute
  );
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    securityPolicyService.updatePolicy(
      'tenant_default',
      {
        passwordPolicy: {
          ...currentPolicy.passwordPolicy,
          minLength: minPasswordLength,
          maxFailedAttempts,
        },
        sessionPolicy: {
          ...currentPolicy.sessionPolicy,
          idleTimeoutMinutes: idleTimeout,
        },
        apiPolicy: {
          ...currentPolicy.apiPolicy,
          rateLimitPerMinute: rateLimit,
        },
      },
      'bambang.pratama@fleetintelligence.id',
      reason.trim()
    );

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white">Edit Security Policy (v{currentPolicy.version + 1})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Min Password Length</label>
              <input
                type="number"
                min={8}
                max={32}
                value={minPasswordLength}
                onChange={(e) => setMinPasswordLength(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Max Failed Attempts (Lockout)</label>
              <input
                type="number"
                min={3}
                max={10}
                value={maxFailedAttempts}
                onChange={(e) => setMaxFailedAttempts(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Session Idle Timeout (Minutes)</label>
              <input
                type="number"
                min={5}
                max={120}
                value={idleTimeout}
                onChange={(e) => setIdleTimeout(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">API Rate Limit (Req/Min)</label>
              <input
                type="number"
                min={30}
                max={1000}
                value={rateLimit}
                onChange={(e) => setRateLimit(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Change Justification / Reason <span className="text-red-400">* (Mandatory for ISO Audit)</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Periodic quarterly security baseline hardening..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              Commit Policy v{currentPolicy.version + 1}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
