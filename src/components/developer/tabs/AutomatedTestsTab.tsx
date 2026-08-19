import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Play,
  RotateCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Layers,
  Search,
  Filter,
  Sparkles,
  Lock,
} from 'lucide-react';
import { APITestRunner, TestSuiteSummary, TestCaseResult } from '../../../services/api/apiTestRunner';

export const AutomatedTestsTab: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<TestSuiteSummary | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const res = await APITestRunner.runAllTests();
      setSummary(res);
    } catch (e) {
      console.error('Test runner failed:', e);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    // Auto run once on mount
    handleRunTests();
  }, []);

  const filteredResults = (summary?.results || []).filter(r => {
    const matchesCat = filterCategory === 'ALL' || r.category === filterCategory;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = [
    'ALL',
    'AUTH',
    'TENANT_ISOLATION',
    'SCOPES',
    'RATE_LIMIT',
    'IDEMPOTENCY',
    'RESOURCES',
    'AI_ENGINE',
    'WEBHOOKS',
    'SECURITY',
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PROMPT 44 • Comprehensive API Validation Suite</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Automated API Acceptance & Security Test Runner
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Memvalidasi integritas arsitektur: Authentication, Multi-tenant Isolation, Scope RBAC,
              Rate Limiting, Idempotency Header, Unified GPS Telematics, AI Probabilistic Phrasing,
              Webhook HMAC Signature, dan SQLi / XSS Neutralization.
            </p>
          </div>

          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {isRunning ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Menjalankan Test Suite...' : 'Jalankan Semua Test'}</span>
          </button>
        </div>

        {/* Summary Metric Counters */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-0.5">Total Test Cases</div>
              <div className="text-xl font-bold text-white font-mono">{summary.total}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-0.5">Passed Tests</div>
              <div className="text-xl font-bold text-emerald-400 font-mono flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{summary.passed}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-0.5">Failed Tests</div>
              <div className={`text-xl font-bold font-mono flex items-center justify-center gap-1 ${summary.failed === 0 ? 'text-slate-400' : 'text-rose-400'}`}>
                {summary.failed > 0 && <XCircle className="w-4 h-4" />}
                <span>{summary.failed}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-0.5">Execution Time</div>
              <div className="text-xl font-bold text-cyan-400 font-mono">{summary.durationMs}ms</div>
            </div>
          </div>
        )}
      </div>

      {/* Test Cases Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl space-y-4 p-4">
        {/* Filter and Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  filterCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter nama test..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-2.5">
          {filteredResults.map(test => (
            <div
              key={test.id}
              className={`p-4 rounded-xl border transition-all ${
                test.passed
                  ? 'bg-slate-950/60 border-slate-800/80 hover:border-emerald-500/30'
                  : 'bg-rose-950/20 border-rose-800/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  {test.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span className="font-bold text-white text-xs">{test.name}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-300">
                    {test.category}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-slate-400">{test.durationMs} ms</span>
              </div>

              <p className="text-xs text-slate-400 mb-2">{test.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/60">
                <div>
                  <span className="text-slate-500">Expected:</span>{' '}
                  <span className="text-slate-300">{test.expected}</span>
                </div>
                <div>
                  <span className="text-slate-500">Actual:</span>{' '}
                  <span className={test.passed ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                    {test.actual}
                  </span>
                </div>
              </div>

              {test.errorDetails && (
                <div className="mt-2 p-2 rounded bg-rose-950/40 border border-rose-800/60 text-rose-300 text-[10px] font-mono overflow-x-auto">
                  {test.errorDetails}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
