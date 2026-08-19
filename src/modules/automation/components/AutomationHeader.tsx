/**
 * Fleet Intelligence Smart AI - Automation Module Header & Navigation Bar
 * PROMPT 35 - Top Bar & Tabs
 */

import React, { useState } from 'react';
import {
  Zap,
  Workflow,
  Layers,
  ListChecks,
  AlertTriangle,
  Sliders,
  Play,
  Plus,
  Download,
  Upload,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAutomation } from '../context/AutomationContext';
import { AutomationDryRunModal } from './AutomationDryRunModal';

export const AutomationHeader: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    workflows,
    executions,
    exportWorkflowsJson,
    importWorkflowsJson,
    setSelectedWorkflow,
  } = useAutomation();

  const [showSimModal, setShowSimModal] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const activeCount = workflows.filter((w) => w.status === 'ACTIVE').length;
  const failedCount = executions.filter((e) => e.status === 'FAILED').length;

  const handleCreateNew = () => {
    setSelectedWorkflow(null);
    setActiveTab('builder');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importWorkflowsJson(content)) {
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 3000);
      }
    };
    reader.readAsText(file);
  };

  const tabs: Array<{
    id: 'dashboard' | 'workflows' | 'builder' | 'templates' | 'logs' | 'failed' | 'settings';
    label: string;
    icon: any;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: Zap },
    { id: 'workflows', label: 'Workflows', icon: Workflow, badge: workflows.length },
    { id: 'builder', label: 'Workflow Builder & AI', icon: Sparkles },
    { id: 'templates', label: 'Templates', icon: Layers, badge: 10 },
    { id: 'logs', label: 'Execution Logs', icon: ListChecks, badge: executions.length },
    {
      id: 'failed',
      label: 'Failed Automations',
      icon: AlertTriangle,
      badge: failedCount > 0 ? failedCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <>
      <div id="automation-header" className="bg-slate-900 border-b border-slate-800 text-white pb-0 pt-4 px-4 sm:px-6">
        {/* Top Branding & Main Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">AI Automation Engine</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  Enterprise v2.4
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {activeCount} Active Rules
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Event-Driven Multi-Step Orchestration, Rule Evaluation AST, AI Intelligence, & Real-time Action Bus
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Import / Export */}
            <button
              id="btn-export-workflows"
              onClick={exportWorkflowsJson}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5 shadow-sm"
              title="Ekspor seluruh definisi workflow dalam format JSON"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>

            <label
              htmlFor="upload-workflow-json"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Impor konfigurasi workflow JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              Import
              <input
                id="upload-workflow-json"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {importSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Diimpor!
              </span>
            )}

            {/* Dry Run Simulation Button */}
            <button
              id="btn-trigger-simulation"
              onClick={() => setShowSimModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition flex items-center gap-1.5 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
              Dry-Run Simulator
            </button>

            {/* Create New Workflow Button */}
            <button
              id="btn-create-new-workflow"
              onClick={handleCreateNew}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              Create Workflow
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center overflow-x-auto gap-1 border-t border-slate-800 pt-1 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-automation-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium rounded-t-lg transition border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-500 text-indigo-400 bg-slate-800/60 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                {tab.label}
                {tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      tab.badgeColor || (isActive ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300')
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulation Modal */}
      {showSimModal && <AutomationDryRunModal onClose={() => setShowSimModal(false)} />}
    </>
  );
};
