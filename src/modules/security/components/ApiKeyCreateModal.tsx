/**
 * Fleet Intelligence Smart AI - Create API Key Modal
 * PROMPT 50 - Granular Scopes, Rate Limits & One-Time Secret Display
 */

import React, { useState } from 'react';
import { Key, X, Copy, Check, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { securityService } from '../services/securityService';

interface ApiKeyCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyCreated: () => void;
}

const AVAILABLE_SCOPES = [
  { id: 'vehicle.read', label: 'vehicle.read (List & View Vehicles)' },
  { id: 'vehicle.write', label: 'vehicle.write (Create/Edit Vehicles)' },
  { id: 'trip.read', label: 'trip.read (View Trips & Route History)' },
  { id: 'trip.write', label: 'trip.write (Dispatch & Update Trips)' },
  { id: 'gps.read', label: 'gps.read (Live GPS Coordinates)' },
  { id: 'gps.write', label: 'gps.write (Telemetry Ingestion)' },
  { id: 'delivery.read', label: 'delivery.read (Waybills & Orders)' },
  { id: 'delivery.write', label: 'delivery.write (Update Delivery Status)' },
  { id: 'report.read', label: 'report.read (Export Analytical Reports)' },
];

export const ApiKeyCreateModal: React.FC<ApiKeyCreateModalProps> = ({
  isOpen,
  onClose,
  onKeyCreated,
}) => {
  const [name, setName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['vehicle.read', 'trip.read']);
  const [allowedIps, setAllowedIps] = useState('');
  const [rateLimit, setRateLimit] = useState(120);

  const [generatedRawKey, setGeneratedRawKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleToggleScope = (scopeId: string) => {
    if (selectedScopes.includes(scopeId)) {
      setSelectedScopes(selectedScopes.filter((s) => s !== scopeId));
    } else {
      setSelectedScopes([...selectedScopes, scopeId]);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedScopes.length === 0) return;

    const ips = allowedIps
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const { rawKey } = securityService.createApiKey({
      tenantId: 'tenant_default',
      name: name.trim(),
      scopes: selectedScopes,
      allowedIps: ips.length > 0 ? ips : undefined,
      rateLimitPerMin: rateLimit,
      createdBy: 'Bambang Pratama',
    });

    setGeneratedRawKey(rawKey);
    onKeyCreated();
  };

  const handleCopy = () => {
    if (generatedRawKey) {
      navigator.clipboard.writeText(generatedRawKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDone = () => {
    setGeneratedRawKey(null);
    setName('');
    setSelectedScopes(['vehicle.read', 'trip.read']);
    setAllowedIps('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white">Create Enterprise API Key</h3>
          </div>
          <button
            onClick={generatedRawKey ? handleDone : onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {generatedRawKey ? (
            /* One-Time Secret Display Screen */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  API Key Generated Successfully
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Please copy this API key now. For your security, <strong className="text-white">you will never be able to see it again</strong>.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Secret Token</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedRawKey}
                    className="w-full bg-slate-950 border border-slate-800 text-emerald-400 text-xs font-mono rounded-lg p-2.5 selection:bg-emerald-500/30"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleDone}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition"
                >
                  I Have Saved My Secret Key
                </button>
              </div>
            </div>
          ) : (
            /* Creation Form */
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Key Name / Integration Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SAP Logistics Connector"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Granular Permissions & Scopes ({selectedScopes.length} selected)
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  {AVAILABLE_SCOPES.map((scope) => (
                    <label
                      key={scope.id}
                      className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer p-1.5 rounded hover:bg-slate-900"
                    >
                      <input
                        type="checkbox"
                        checked={selectedScopes.includes(scope.id)}
                        onChange={() => handleToggleScope(scope.id)}
                        className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0"
                      />
                      <span className="font-mono text-[11px]">{scope.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">IP Allowlist (Optional)</label>
                  <input
                    type="text"
                    placeholder="103.28.12.0/24"
                    value={allowedIps}
                    onChange={(e) => setAllowedIps(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Rate Limit (req/min)</label>
                  <input
                    type="number"
                    value={rateLimit}
                    onChange={(e) => setRateLimit(Number(e.target.value))}
                    min={10}
                    max={5000}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5"
                  />
                </div>
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
                  disabled={selectedScopes.length === 0}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition shadow-sm"
                >
                  Generate Token
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
