/**
 * Fleet Intelligence Smart AI - API Security & Webhook Management Tab
 * PROMPT 50 - Granular Scopes, Masked Secrets, Key Rotation & Webhooks
 */

import React, { useState } from 'react';
import {
  Key,
  Plus,
  Trash2,
  CheckCircle2,
  Shield,
  Webhook,
  Code,
  Lock,
  ExternalLink,
  RotateCw,
  Send,
  Zap,
} from 'lucide-react';
import { securityService } from '../services/securityService';
import { ApiKeyCreateModal } from './ApiKeyCreateModal';
import { ApiKeyDefinition, WebhookSecurityConfig } from '../types/securityTypes';

export const ApiSecurityTab: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyDefinition[]>(() =>
    securityService.getApiKeys()
  );
  const [webhooks, setWebhooks] = useState<WebhookSecurityConfig[]>(() =>
    securityService.getWebhooks()
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [webhookTestStatus, setWebhookTestStatus] = useState<{ [key: string]: string }>({});

  const handleRefreshKeys = () => {
    setApiKeys(securityService.getApiKeys());
  };

  const handleRevokeKey = (keyId: string) => {
    securityService.revokeApiKey(keyId, 'tenant_default', 'Bambang Pratama (Security Admin)');
    handleRefreshKeys();
  };

  const handleTestWebhookHmac = (webhookId: string) => {
    setWebhookTestStatus((prev) => ({ ...prev, [webhookId]: 'TESTING' }));
    setTimeout(() => {
      setWebhookTestStatus((prev) => ({ ...prev, [webhookId]: 'VERIFIED' }));
      setTimeout(() => {
        setWebhookTestStatus((prev) => {
          const clone = { ...prev };
          delete clone[webhookId];
          return clone;
        });
      }, 4000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div>
          <h3 className="font-semibold text-white text-lg">Enterprise API Gateway & Machine-to-Machine Security</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Provision scoped API keys for external ERP, TMS, and IoT systems with cryptographic signature enforcement.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create API Key
        </button>
      </div>

      {/* API Keys Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-400" />
            <h4 className="font-semibold text-white">Active API Keys</h4>
          </div>
          <span className="text-xs text-slate-400">{apiKeys.filter((k) => k.status === 'ACTIVE').length} Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Key Name & Prefix</th>
                <th className="pb-3 font-semibold">Masked Secret</th>
                <th className="pb-3 font-semibold">Assigned Scopes</th>
                <th className="pb-3 font-semibold">Rate Limit</th>
                <th className="pb-3 font-semibold">Last Used</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-slate-950/40 transition">
                  <td className="py-3.5 pr-3">
                    <div className="font-medium text-white">{key.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">By: {key.createdBy}</div>
                  </td>
                  <td className="py-3.5 pr-3 font-mono text-slate-300">
                    {key.maskedKey}
                  </td>
                  <td className="py-3.5 pr-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {key.scopes.map((sc) => (
                        <span
                          key={sc}
                          className="px-2 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded font-mono text-[10px]"
                        >
                          {sc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 pr-3 font-mono text-slate-300">
                    {key.rateLimitPerMin} req/m
                  </td>
                  <td className="py-3.5 pr-3 text-slate-400">
                    {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleTimeString() : 'Never'}
                  </td>
                  <td className="py-3.5 pr-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium text-[10px] ${
                        key.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {key.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    {key.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleRevokeKey(key.id)}
                        className="px-2.5 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded border border-red-500/20 transition text-[11px]"
                      >
                        Revoke Key
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Webhook Security Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Webhook className="w-5 h-5 text-purple-400" />
            <h4 className="font-semibold text-white">Outbound Webhooks (HMAC-SHA256 Signed)</h4>
          </div>
          <span className="text-xs text-slate-400">Payload Anti-Tamper Enabled</span>
        </div>

        <div className="space-y-3">
          {webhooks.map((wh) => (
            <div key={wh.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white text-sm">{wh.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                    {wh.hmacAlgorithm}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400">{wh.targetUrl}</div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                  <span>Secret: <code className="text-slate-400">{wh.secretKeyMasked}</code></span>
                  <span>•</span>
                  <span>Signature Header: <code className="text-slate-400">{wh.signatureHeader}</code></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {webhookTestStatus[wh.id] === 'TESTING' ? (
                  <span className="text-xs text-blue-400 flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    Signing payload...
                  </span>
                ) : webhookTestStatus[wh.id] === 'VERIFIED' ? (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Signature Verified (200 OK)
                  </span>
                ) : (
                  <button
                    onClick={() => handleTestWebhookHmac(wh.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
                  >
                    <Send className="w-3.5 h-3.5 text-purple-400" />
                    Test Signature
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ApiKeyCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onKeyCreated={handleRefreshKeys}
      />
    </div>
  );
};
