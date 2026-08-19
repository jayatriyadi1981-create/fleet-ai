/**
 * Fleet Intelligence Smart AI - Executive Dashboard Main View
 * PROMPT 38 - C-Level Business & Operational Intelligence Architecture (Owner, Director, CEO, GM)
 * Principle: See → Understand → Decide → Act
 */

import React, { useState } from 'react';
import { ExecutiveProvider, useExecutive } from '../context/ExecutiveContext';
import { ExecutiveHeader } from './ExecutiveHeader';
import { ExecutiveScorecard } from './ExecutiveScorecard';
import { ExecutiveKpiGrid } from './ExecutiveKpiGrid';
import { ExecutiveAISynthesisSection } from './ExecutiveAISynthesisSection';
import { ExecutiveEfficiencySection } from './ExecutiveEfficiencySection';
import { ExecutiveCostSection } from './ExecutiveCostSection';
import { ExecutiveProductivitySection } from './ExecutiveProductivitySection';
import { ExecutiveSafetySection } from './ExecutiveSafetySection';
import { ExecutiveFuelSection } from './ExecutiveFuelSection';
import { ExecutiveMaintenanceSection } from './ExecutiveMaintenanceSection';
import { ExecutiveBranchPerformanceSection } from './ExecutiveBranchPerformanceSection';
import { ExecutiveRankingsSection } from './ExecutiveRankingsSection';
import { ExecutiveModals } from './ExecutiveModals';
import {
  Activity,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Fuel,
  Wrench,
  Building2,
  AlertOctagon,
  Layers,
} from 'lucide-react';

const ExecutiveDashboardContent: React.FC = () => {
  const [activeDomainTab, setActiveDomainTab] = useState<
    'all' | 'efficiency' | 'cost' | 'productivity' | 'safety' | 'fuel' | 'maintenance'
  >('all');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* 1. Top Executive Control Bar */}
      <ExecutiveHeader />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 2. Executive Scorecard (Composite Index) */}
        <section id="executive-scorecard-section">
          <ExecutiveScorecard />
        </section>

        {/* 3. 6 Core C-Level KPI Cards */}
        <section id="executive-kpi-grid-section">
          <ExecutiveKpiGrid />
        </section>

        {/* 4. AI Executive Synthesis, Insights & Savings Opportunities */}
        <section id="executive-ai-synthesis-section">
          <ExecutiveAISynthesisSection />
        </section>

        {/* 5. Domain Breakdown Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
          <button
            onClick={() => setActiveDomainTab('all')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeDomainTab === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Semua Domain (Full Overview)</span>
          </button>
          <button
            onClick={() => setActiveDomainTab('efficiency')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeDomainTab === 'efficiency'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4 text-blue-400" />
            <span>Ketersediaan & Utilisasi</span>
          </button>
          <button
            onClick={() => setActiveDomainTab('cost')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeDomainTab === 'cost'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Total Cost of Ownership (TOC)</span>
          </button>
          <button
            onClick={() => setActiveDomainTab('productivity')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeDomainTab === 'productivity'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span>Produktivitas & Ritase</span>
          </button>
          <button
            onClick={() => setActiveDomainTab('safety')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeDomainTab === 'safety'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Keselamatan & Safety Index</span>
          </button>
          <button
            onClick={() => setActiveDomainTab('fuel')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeDomainTab === 'fuel'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Fuel className="w-4 h-4 text-amber-400" />
            <span>BBM & Drain Detection</span>
          </button>
          <button
            onClick={() => setActiveDomainTab('maintenance')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeDomainTab === 'maintenance'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4 text-rose-400" />
            <span>Maintenance & Overdue</span>
          </button>
        </div>

        {/* Domain Sections Conditional View */}
        {(activeDomainTab === 'all' || activeDomainTab === 'efficiency') && (
          <section id="executive-efficiency-section">
            <ExecutiveEfficiencySection />
          </section>
        )}

        {(activeDomainTab === 'all' || activeDomainTab === 'cost') && (
          <section id="executive-cost-section">
            <ExecutiveCostSection />
          </section>
        )}

        {(activeDomainTab === 'all' || activeDomainTab === 'productivity') && (
          <section id="executive-productivity-section">
            <ExecutiveProductivitySection />
          </section>
        )}

        {(activeDomainTab === 'all' || activeDomainTab === 'safety') && (
          <section id="executive-safety-section">
            <ExecutiveSafetySection />
          </section>
        )}

        {(activeDomainTab === 'all' || activeDomainTab === 'fuel') && (
          <section id="executive-fuel-section">
            <ExecutiveFuelSection />
          </section>
        )}

        {(activeDomainTab === 'all' || activeDomainTab === 'maintenance') && (
          <section id="executive-maintenance-section">
            <ExecutiveMaintenanceSection />
          </section>
        )}

        {/* 6. Multi-Branch Benchmarking */}
        {(activeDomainTab === 'all') && (
          <section id="executive-branch-performance-section">
            <ExecutiveBranchPerformanceSection />
          </section>
        )}

        {/* 7. Problem Centers & Leaderboards */}
        {(activeDomainTab === 'all') && (
          <section id="executive-rankings-section">
            <ExecutiveRankingsSection />
          </section>
        )}
      </main>

      {/* Global Executive Modals */}
      <ExecutiveModals />
    </div>
  );
};

export const ExecutiveDashboardView: React.FC = () => {
  return (
    <ExecutiveProvider>
      <ExecutiveDashboardContent />
    </ExecutiveProvider>
  );
};
