/**
 * Fleet Intelligence Smart AI - Automated Security Test Suite Runner Tab
 * PROMPT 50 - Live Automated Verification of All 10 Security Pillars
 */

import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  XCircle,
  RotateCw,
  Play,
  Filter,
  ShieldCheck,
  Code,
  Clock,
  Layers,
} from 'lucide-react';
import { securityTestingSuite } from '../services/securityTestingSuite';
import { SecurityTestResult } from '../types/securityTypes';

export const SecurityTestSuiteTab: React.FC = () => {
  const [tests, setTests] = useState<SecurityTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [lastExecutedAt, setLastExecutedAt] = useState<string | null>(null);

  const handleRunAllTests = async () => {
    setIsRunning(true);
    const results = await securityTestingSuite.runAllTests();
    setTests(results);
    setIsRunning(false);
    setLastExecutedAt(new Date().toISOString());
  };

  // Initial load
  React.useEffect(() => {
    if (tests.length === 0) {
      handleRunAllTests();
    }
  }, []);

  const categories = ['ALL', 'AUTHENTICATION', 'TENANT_ISOLATION', 'BRANCH_ISOLATION', 'AUTHORIZATION', 'RATE_LIMITING', 'SECRET_REDACTION', 'GPS_SECURITY', 'FILE_PROTECTION', 'BACKUP_ENCRYPTION', 'AI_SECURITY'];

  const filteredTests = activeCategory === 'ALL'
    ? tests
    : tests.filter((t) => t.category === activeCategory);

  const passedCount = tests.filter((t) => t.status === 'PASSED').length;
  const failedCount = tests.filter((t) => t.status === 'FAILED').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div>
          <h3 className="font-semibold text-white text-lg">Automated Enterprise Security Test Suite</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Automated regression testing validating all 10 security pillars against ISO 27001 and Zero Trust compliance.
          </p>
        </div>
        <button
          disabled={isRunning}
          onClick={handleRunAllTests}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition shadow-sm"
        >
          {isRunning ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              Running Test Suite...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              Run All Security Tests
            </>
          )}
        </button>
      </div>

      {/* Summary Score Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Test Suite Status</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">{tests.length} Total</span>
              <span className="text-xs text-emerald-400 font-medium font-mono">
                {tests.length > 0 ? `${((passedCount / tests.length) * 100).toFixed(0)}% PASSED` : 'Pending'}
              </span>
            </div>
          </div>
          <Zap className="w-6 h-6 text-amber-400" />
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Passed Scenarios</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-400 tracking-tight">{passedCount} Passed</span>
            </div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Failed / Regressions</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className={`text-2xl font-bold tracking-tight ${failedCount > 0 ? 'text-red-400' : 'text-slate-300'}`}>
                {failedCount} Regressions
              </span>
            </div>
          </div>
          <ShieldCheck className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Test Cases List */}
      <div className="space-y-3">
        {filteredTests.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-xl border transition ${
              t.status === 'PASSED'
                ? 'bg-slate-900/70 border-slate-800'
                : 'bg-slate-900 border-red-500/40'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {t.status === 'PASSED' ? (
                    <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      PASSED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                      <XCircle className="w-3 h-3" />
                      FAILED
                    </span>
                  )}
                  <span className="text-xs font-mono font-bold text-white">{t.id}: {t.name}</span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {t.category}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{t.description}</p>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] uppercase">Expected:</span>
                    <span className="text-slate-300 text-[11px]">{t.expectedResult}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] uppercase">Actual:</span>
                    <span className="text-emerald-400 text-[11px]">{t.actualResult}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {t.durationMs}ms
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
