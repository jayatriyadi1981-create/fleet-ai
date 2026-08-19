/**
 * Fleet Intelligence Smart AI - Automation Workflows List & Management View
 * PROMPT 35 - Section 80
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Play,
  Copy,
  Trash2,
  Edit,
  ExternalLink,
  ShieldCheck,
  Fuel,
  Wrench,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Tag,
  Download,
  ArrowUpDown,
  Zap,
  MoreVertical,
  Layers,
} from 'lucide-react';
import { useAutomation } from '../context/AutomationContext';
import { AutomationWorkflow, WorkflowCategory, AutomationStatus } from '../types';
import { AutomationDryRunModal } from './AutomationDryRunModal';

export const AutomationWorkflowsListView: React.FC = () => {
  const {
    workflows,
    setActiveTab,
    setSelectedWorkflow,
    toggleWorkflowStatus,
    duplicateWorkflow,
    deleteWorkflow,
  } = useAutomation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'name' | 'executions' | 'successRate'>('updatedAt');
  const [simWorkflowId, setSimWorkflowId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const categories: Array<{ id: string; label: string; count: number }> = [
    { id: 'ALL', label: 'Semua Kategori', count: workflows.length },
    { id: 'SAFETY', label: 'Safety & Driver', count: workflows.filter((w) => w.category === 'SAFETY').length },
    { id: 'MAINTENANCE', label: 'Maintenance', count: workflows.filter((w) => w.category === 'MAINTENANCE').length },
    { id: 'FUEL', label: 'Fuel & Efisiensi', count: workflows.filter((w) => w.category === 'FUEL').length },
    { id: 'COMPLIANCE', label: 'Compliance & Geofence', count: workflows.filter((w) => w.category === 'COMPLIANCE').length },
    { id: 'DISPATCH', label: 'Routing & Dispatch', count: workflows.filter((w) => w.category === 'DISPATCH').length },
    { id: 'OPERATIONS', label: 'Operations & Yard', count: workflows.filter((w) => w.category === 'OPERATIONS').length },
  ];

  const filteredWorkflows = useMemo(() => {
    return workflows
      .filter((wf) => {
        const matchesSearch =
          wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          wf.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          wf.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCat = selectedCategory === 'ALL' || wf.category === selectedCategory;
        const matchesStatus = selectedStatus === 'ALL' || wf.status === selectedStatus;
        const matchesPriority = selectedPriority === 'ALL' || wf.priority === selectedPriority;

        return matchesSearch && matchesCat && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'executions') return b.metrics.totalExecutions - a.metrics.totalExecutions;
        if (sortBy === 'successRate') {
          const rateA = a.metrics.totalExecutions > 0 ? a.metrics.successCount / a.metrics.totalExecutions : 1;
          const rateB = b.metrics.totalExecutions > 0 ? b.metrics.successCount / b.metrics.totalExecutions : 1;
          return rateB - rateA;
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [workflows, searchQuery, selectedCategory, selectedStatus, selectedPriority, sortBy]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SAFETY':
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'MAINTENANCE':
        return <Wrench className="w-4 h-4 text-amber-500" />;
      case 'FUEL':
        return <Fuel className="w-4 h-4 text-orange-500" />;
      case 'TELEMATICS':
        return <Radio className="w-4 h-4 text-blue-500" />;
      default:
        return <Sliders className="w-4 h-4 text-indigo-500" />;
    }
  };

  const handleEdit = (wf: AutomationWorkflow) => {
    setSelectedWorkflow(wf);
    setActiveTab('builder');
  };

  const handleDuplicate = (id: string) => {
    const copy = duplicateWorkflow(id);
    setSelectedWorkflow(copy);
    setActiveTab('builder');
  };

  return (
    <div id="automation-workflows-view" className="p-4 sm:p-6 space-y-6">
      {/* Top Filter & Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Katalog Alur Automasi Cerdas ({workflows.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola, atur status, jalankan pengujian dry-run, dan konfigurasi alur kerja multi-langkah telematika.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('templates')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 shadow-sm"
          >
            <Layers className="w-4 h-4 text-indigo-500" />
            Pilih Template Siap Pakai
          </button>

          <button
            onClick={() => {
              setSelectedWorkflow(null);
              setActiveTab('builder');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            Buat Alur Baru
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar (Categories) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat.label}
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                selectedCategory === cat.id ? 'bg-indigo-800 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Secondary Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari alur automasi berdasarkan nama, deskripsi, trigger, atau tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="PAUSED">PAUSED</option>
            <option value="DRAFT">DRAFT</option>
            <option value="DISABLED">DISABLED</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">Semua Prioritas</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="NORMAL">NORMAL</option>
            <option value="LOW">LOW</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="updatedAt">Urut: Terakhir Diperbarui</option>
            <option value="name">Urut: Nama Workflow (A-Z)</option>
            <option value="executions">Urut: Eksekusi Terbanyak</option>
            <option value="successRate">Urut: Success Rate</option>
          </select>
        </div>
      </div>

      {/* Grid of Workflow Cards */}
      {filteredWorkflows.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tidak ada alur automasi yang cocok</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba ubah kriteria pencarian atau buat workflow baru menggunakan NLP prompt studio.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedStatus('ALL');
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkflows.map((wf) => {
            const successRate =
              wf.metrics.totalExecutions > 0
                ? Math.round((wf.metrics.successCount / wf.metrics.totalExecutions) * 100)
                : 100;

            return (
              <div
                key={wf.id}
                id={`workflow-card-${wf.id}`}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                        {getCategoryIcon(wf.category)}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                          {wf.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {wf.name}
                        </h4>
                      </div>
                    </div>

                    {/* Status Toggle */}
                    <button
                      onClick={() =>
                        toggleWorkflowStatus(wf.id, wf.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')
                      }
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        wf.status === 'ACTIVE' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      title={wf.status === 'ACTIVE' ? 'Jeda workflow' : 'Aktifkan workflow'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          wf.status === 'ACTIVE' ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {wf.description}
                  </p>

                  {/* Badges & Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span
                      className={`font-bold px-2 py-0.5 rounded uppercase ${
                        wf.priority === 'CRITICAL'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : wf.priority === 'HIGH'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {wf.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                      {wf.nodes.length} nodes
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                      v{wf.version}.0
                    </span>
                    {wf.tags.slice(0, 2).map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Performance Metric Bar */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Total: <b>{wf.metrics.totalExecutions}</b> run</span>
                      <span>Success: <b>{successRate}%</b></span>
                      <span>Latency: <b>{wf.metrics.avgDurationMs}ms</b></span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${successRate}%` }}
                      />
                      <div
                        className="bg-rose-500 h-full"
                        style={{ width: `${100 - successRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSimWorkflowId(wf.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 font-semibold border border-amber-500/30 transition flex items-center gap-1"
                      title="Uji simulasi dry-run"
                    >
                      <Play className="w-3.5 h-3.5 text-amber-500 fill-amber-500/30" />
                      Test
                    </button>

                    <button
                      onClick={() => handleDuplicate(wf.id)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                      title="Duplikasi workflow"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(wf.id)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 text-slate-600 dark:text-slate-300 hover:text-rose-500 transition"
                      title="Hapus workflow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleEdit(wf)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900 transition flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit Alur
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Hapus Alur Automasi?
                </h4>
                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Alur automasi ini tidak akan lagi mendengarkan event telematika atau mengeksekusi aksi otomatis.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteWorkflow(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
              >
                Ya, Hapus Workflow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dry Run Simulation Modal */}
      {simWorkflowId && (
        <AutomationDryRunModal
          defaultWorkflowId={simWorkflowId}
          onClose={() => setSimWorkflowId(null)}
        />
      )}
    </div>
  );
};
