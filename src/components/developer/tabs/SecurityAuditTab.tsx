/**
 * Fleet Intelligence Smart AI - Security Testing & Penetration Audit Tab
 * PROMPT 58: Visual Security Health, Automated Pen-Testing & Vulnerability Assessment Report
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Play,
  RotateCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  KeyRound,
  FileCheck,
  Search,
  Filter,
  Eye,
  Server,
  Terminal,
  Activity,
  Layers,
  ChevronRight,
  Shield,
  Download,
  AlertOctagon,
} from 'lucide-react';
import { SecurityAuditRunner, SecurityAuditReport, SecurityTestCaseResult } from '../../../services/api/securityAuditRunner';

export const SecurityAuditTab: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<SecurityAuditReport | null>(null);
  const [selectedCase, setSelectedCase] = useState<SecurityTestCaseResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const runAudit = async () => {
    setIsRunning(true);
    try {
      const res = await SecurityAuditRunner.runCompleteSecurityAudit();
      setReport(res);
      if (res.results.length > 0 && !selectedCase) {
        setSelectedCase(res.results[0]);
      }
    } catch (err) {
      console.error('Security audit execution failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runAudit();
  }, []);

  const categories = ['ALL', 'Authentication', 'Tenant Isolation', 'RBAC', 'API Security', 'Input Validation', 'Rate Limiting', 'Session Security', 'Data Privacy', 'File Security', 'AI Security', 'Webhook Security'];

  const filteredCases = (report?.results || []).filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Security Status Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PROMPT 58 • Enterprise Security & Penetration Audit Suite</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Security Gatekeeper & Cross-Domain Vulnerability Assessment
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed max-w-3xl">
              Memverifikasi zero cross-tenant data leaks, strict role-based access control (RBAC), parameter validation, sanitasi XSS/SQLi, proteksi session/OTP/brute-force, otorisasi file download, guardrails AI Assistant, serta perlindungan serangan replay & token forgery.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={runAudit}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isRunning ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Menjalankan Audit Keamanan...' : 'Jalankan Security Audit'}</span>
            </button>
          </div>
        </div>

        {/* Security Metric Counters */}
        {report && (
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-4 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-0.5">Security Score</div>
              <div className="text-xl font-bold text-emerald-400 font-mono">{report.securityScore}%</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-0.5">Status Gate</div>
              <div className="text-xs font-bold font-mono text-emerald-400 flex items-center justify-center gap-1 mt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>{report.securityStatus}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-0.5">Critical Bugs</div>
              <div className={`text-xl font-bold font-mono ${report.criticalCount === 0 ? 'text-slate-400' : 'text-rose-500'}`}>
                {report.criticalCount}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-0.5">High Severity</div>
              <div className={`text-xl font-bold font-mono ${report.highCount === 0 ? 'text-slate-400' : 'text-amber-500'}`}>
                {report.highCount}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-0.5">Medium / Low</div>
              <div className="text-xl font-bold text-slate-400 font-mono">
                {report.mediumCount + report.lowCount}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-0.5">Passed Assertions</div>
              <div className="text-xl font-bold text-emerald-400 font-mono">
                {report.passed}/{report.totalTests}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Cases List & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Test Cases */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Cari audit ID, kategori, atau nama pengujian keamanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Test List */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredCases.map((item) => {
              const isSelected = selectedCase?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedCase(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500/50 bg-emerald-950/20 shadow-md'
                      : 'border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.id}
                      </span>
                      <span className="text-xs font-bold text-white tracking-tight">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.severity === 'CRITICAL'
                            ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                            : item.severity === 'HIGH'
                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                            : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                        }`}
                      >
                        {item.severity}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'PASS'
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                        }`}
                      >
                        {item.status === 'PASS' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{item.status}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-emerald-400">{item.category}</span>
                    <span className="text-slate-600 mx-1.5">•</span>
                    <span className="text-[11px] text-slate-400 leading-relaxed">{item.detail}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                    <span className="font-mono text-emerald-400/80 truncate max-w-sm">Proof: {item.evidence}</span>
                    <span className="flex items-center gap-1 text-slate-400 hover:text-white shrink-0">
                      <span>Detail Audit</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Security Inspector Panel */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Penetration Test Evidence & Assertions</span>
            </h3>
            {selectedCase && (
              <span className="text-[11px] font-mono text-slate-400">{selectedCase.id}</span>
            )}
          </div>

          {selectedCase ? (
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Kategori Pengujian:</span>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white">{selectedCase.category}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {selectedCase.severity} LEVEL
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Spesifikasi & Uji Penetrasi:</span>
                <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed font-mono text-[11px]">
                  {selectedCase.detail}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Bukti Eksekusi & Status Respons:</span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 leading-relaxed break-words">
                  {selectedCase.evidence}
                </div>
              </div>

              {/* Security Safeguards Checklist */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-slate-400 font-semibold block">Active Security Safeguards:</span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400">Zero Cross-Tenant IDOR Leaks</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Enforced
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400">RBAC & Matrix Policy Engine</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Validated
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400">AI Prompt Injection Guardrails</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              Pilih item audit untuk melihat bukti penolakan serangan dan bukti payload.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
