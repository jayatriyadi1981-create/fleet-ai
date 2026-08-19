/**
 * Fleet Intelligence Smart AI - Automation Templates Catalog View
 * PROMPT 35 - Section 31
 */

import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Fuel,
  Wrench,
  Activity,
  Zap,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Search,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { useAutomation } from '../context/AutomationContext';
import { AutomationTemplate } from '../types';

export const AutomationTemplatesView: React.FC = () => {
  const { templates, createFromTemplate, setSelectedWorkflow, setActiveTab } = useAutomation();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<AutomationTemplate | null>(null);

  const categories = [
    { id: 'ALL', label: 'Semua Template' },
    { id: 'SAFETY', label: 'Safety & Driver' },
    { id: 'MAINTENANCE', label: 'Predictive Maintenance' },
    { id: 'FUEL', label: 'Fuel & Theft Detection' },
    { id: 'COLD_CHAIN', label: 'Cold Chain & Cargo' },
    { id: 'COMPLIANCE', label: 'Route & Compliance' },
    { id: 'FATIGUE', label: 'Driver Fatigue & Wellness' },
  ];

  const filteredTemplates = templates.filter((tpl) => {
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      selectedCategory === 'ALL' ||
      tpl.category === selectedCategory ||
      (selectedCategory === 'FATIGUE' && tpl.tags.includes('Fatigue')) ||
      (selectedCategory === 'COLD_CHAIN' && tpl.tags.includes('Cold Chain'));

    return matchesSearch && matchesCat;
  });

  const handleUseTemplate = (tpl: AutomationTemplate) => {
    const created = createFromTemplate(tpl.id);
    setSelectedWorkflow(created);
    setActiveTab('builder');
  };

  return (
    <div id="automation-templates-view" className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Katalog Template Alur Otomasi Siap Pakai ({templates.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gunakan best-practice alur kerja telematika industri logistik siap pakai yang telah terintegrasi dengan kecerdasan AI dan aturan AST teruji.
          </p>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari template..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            id={`tpl-card-${tpl.id}`}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                  {tpl.category}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  ~{tpl.estimatedAITokens} tokens
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {tpl.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mt-1 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {tpl.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Node Pipeline Preview */}
              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Pipeline Alur ({tpl.workflowDraft.nodes?.length || 0} Langkah):
                </span>
                <div className="flex items-center gap-1 overflow-x-auto text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  {tpl.workflowDraft.nodes?.slice(0, 4).map((node, nIdx) => (
                    <React.Fragment key={node.id}>
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
                        {node.label}
                      </span>
                      {nIdx < Math.min((tpl.workflowDraft.nodes?.length || 0) - 1, 3) && (
                        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                  {(tpl.workflowDraft.nodes?.length || 0) > 4 && (
                    <span className="text-[10px] text-slate-400 shrink-0 font-bold">
                      +{(tpl.workflowDraft.nodes?.length || 0) - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <button
                onClick={() => setSelectedTemplate(tpl)}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
              >
                Detail Struktur <ExternalLink className="w-3 h-3" />
              </button>

              <button
                onClick={() => handleUseTemplate(tpl)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
              >
                Gunakan Template <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {selectedTemplate.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedTemplate.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedTemplate.description}
            </p>

            {/* Explanation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-indigo-600 uppercase block mb-1">
                  Apa yang Dilakukan:
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  {selectedTemplate.explanation.whatItDoes}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-indigo-600 uppercase block mb-1">
                  Kapan Alur Dijalankan:
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  {selectedTemplate.explanation.whenItRuns}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-indigo-600 uppercase block mb-1">
                  Analisis AI:
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  {selectedTemplate.explanation.whatAIAnalyzes}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-indigo-600 uppercase block mb-1">
                  Tindakan & Notifikasi:
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  {selectedTemplate.explanation.whatActionsItPerforms}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handleUseTemplate(selectedTemplate);
                  setSelectedTemplate(null);
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
              >
                Gunakan Template Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
