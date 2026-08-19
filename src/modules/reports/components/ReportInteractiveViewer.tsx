/**
 * Fleet Intelligence Smart AI - Interactive Report Viewer Component
 * PROMPT 39 - High-Fidelity Data Tables, Dynamic Charting, AI Executive Synthesis & Grounded Q&A
 */

import React, { useState, useMemo } from 'react';
import { useReports } from '../context/ReportContext';
import {
  FileText,
  Sparkles,
  Download,
  Printer,
  Share2,
  GitCompare,
  Sliders,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Send,
  MessageSquare,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Table as TableIcon,
  ShieldAlert,
  DollarSign,
  Truck,
  Users,
  Lightbulb,
  ArrowRight,
  Check,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { ReportVisualizationType } from '../types';

export const ReportInteractiveViewer: React.FC = () => {
  const {
    activeDataset,
    generateReport,
    visualization,
    setVisualization,
    exportActiveReport,
    isExporting,
    exportProgress,
    setIsShareModalOpen,
    setIsCompareModalOpen,
    setActiveTab,
    qaHistory,
    askAIQuestion,
    isAiThinking,
    branding,
  } = useReports();

  const [tableSearch, setTableSearch] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [customQuestion, setCustomQuestion] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const { columns, rows, summaryRows, kpis, aiSummary, chartData, periodLabel, filterSummary, name, type } = activeDataset;

  // Filtered & Sorted Rows
  const visibleColumns = useMemo(() => columns.filter(c => c.visible), [columns]);

  const processedRows = useMemo(() => {
    let result = [...rows];

    // Search filter
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      result = result.filter(r =>
        Object.values(r).some(val =>
          val !== null && val !== undefined && String(val).toLowerCase().includes(q)
        )
      );
    }

    // Sorting
    if (sortField) {
      result.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'ASC' ? valA - valB : valB - valA;
        }
        return sortDirection === 'ASC'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return result;
  }, [rows, tableSearch, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(processedRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedRows.slice(start, start + pageSize);
  }, [processedRows, currentPage, pageSize]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortField(field);
      setSortDirection('ASC');
    }
  };

  const handleQuickQuestion = (q: string) => {
    askAIQuestion(q);
  };

  const handleCustomQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || isAiThinking) return;
    askAIQuestion(customQuestion);
    setCustomQuestion('');
  };

  // Grouped rows handling if groupBy is present
  const groupedData = useMemo(() => {
    if (activeDataset.groupBy === 'NONE') return null;
    const groups: Record<string, typeof rows> = {};
    const groupKey = activeDataset.groupBy === 'BRANCH' ? 'branchName' :
                     activeDataset.groupBy === 'VEHICLE' ? 'vehiclePlate' :
                     activeDataset.groupBy === 'DRIVER' ? 'driverName' :
                     activeDataset.groupBy === 'DATE' ? 'date' : 'status';

    rows.forEach(r => {
      const gVal = String(r[groupKey] || 'Lainnya');
      if (!groups[gVal]) groups[gVal] = [];
      groups[gVal].push(r);
    });

    return groups;
  }, [activeDataset.groupBy, rows]);

  const toggleGroup = (grpName: string) => {
    setExpandedGroups(prev => ({ ...prev, [grpName]: !prev[grpName] }));
  };

  const chartColors = ['#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#3b82f6'];

  return (
    <div className="space-y-6">
      {/* Top Report Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                type === 'EXECUTIVE' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                type === 'COST' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                type === 'FUEL' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                type === 'SAFETY' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {type}
              </span>
              <span className="text-xs text-slate-400 font-mono">•</span>
              <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                {periodLabel}
              </span>
              <span className="text-xs text-slate-400 font-mono">•</span>
              <span className="text-xs text-slate-400">{activeDataset.totalRecords} Entitas Data</span>
            </div>

            <h1 className="text-xl font-bold text-white tracking-tight">{name}</h1>
            <p className="text-xs text-slate-400">
              Filter: <strong className="text-slate-200">{filterSummary}</strong> | Dibuat: {activeDataset.generatedAt}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => generateReport()}
              title="Refresh / Re-query data"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            <button
              onClick={() => setActiveTab('builder')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition"
            >
              <Sliders className="h-3.5 w-3.5 text-cyan-400" />
              <span>Edit Filters &amp; Kolom</span>
            </button>

            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition"
            >
              <GitCompare className="h-3.5 w-3.5 text-amber-400" />
              <span>Bandingkan Periode</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition"
            >
              <Share2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>Share Link</span>
            </button>

            <button
              onClick={() => exportActiveReport('PDF')}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20 transition disabled:opacity-50"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={() => exportActiveReport('EXCEL')}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Excel (.XLSX)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{kpi.label}</div>
            <div className="mt-2 text-2xl font-bold text-white tracking-tight">{kpi.value}</div>
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 truncate">{kpi.subtext}</span>
              {kpi.variance !== undefined && (
                <span className={`flex items-center gap-0.5 font-bold ${
                  kpi.isPositiveGood
                    ? (kpi.variance >= 0 ? 'text-emerald-400' : 'text-rose-400')
                    : (kpi.variance <= 0 ? 'text-emerald-400' : 'text-rose-400')
                }`}>
                  {kpi.variance >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{Math.abs(kpi.variance)}%</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Visualization Chart Section */}
      {chartData && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">{chartData.title}</h3>
              <p className="text-xs text-slate-400">{chartData.description || 'Visualisasi agregasi data laporan'}</p>
            </div>

            {/* Visual Type Switcher */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              {[
                { id: 'TABLE', label: 'Tabel', icon: TableIcon },
                { id: 'BAR_CHART', label: 'Bar', icon: BarChart3 },
                { id: 'LINE_CHART', label: 'Line', icon: LineChartIcon },
                { id: 'AREA_CHART', label: 'Area', icon: BarChart3 },
                { id: 'DONUT_CHART', label: 'Donut', icon: PieChartIcon },
              ].map(item => {
                const Icon = item.icon;
                const isActive = visualization === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setVisualization(item.id as ReportVisualizationType)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      isActive ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Render Active Chart */}
          {visualization !== 'TABLE' && (
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {visualization === 'BAR_CHART' ? (
                  <BarChart data={chartData.data} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} angle={-15} textAnchor="end" />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                    <Bar dataKey="value" fill="#06b6d4" radius={[6, 6, 0, 0]} name={chartData.title} />
                  </BarChart>
                ) : visualization === 'LINE_CHART' ? (
                  <LineChart data={chartData.data} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} angle={-15} textAnchor="end" />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name={chartData.title} />
                  </LineChart>
                ) : visualization === 'AREA_CHART' ? (
                  <AreaChart data={chartData.data} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} angle={-15} textAnchor="end" />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorArea)" />
                  </AreaChart>
                ) : (
                  <PieChart>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                    <Pie data={chartData.data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4}>
                      {chartData.data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Main Data Table Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Table Top Controls */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">Rincian Data Laporan</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {processedRows.length} dari {rows.length} Baris
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input inside table */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={tableSearch}
                onChange={e => {
                  setTableSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari dalam tabel..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Page Size Select */}
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value={10}>10 Baris</option>
              <option value={25}>25 Baris</option>
              <option value={50}>50 Baris</option>
              <option value={100}>100 Baris</option>
            </select>
          </div>
        </div>

        {/* Standard / Grouped Table View */}
        {groupedData ? (
          /* Grouped Accordion View */
          <div className="divide-y divide-slate-800 p-3 space-y-3">
            {Object.entries(groupedData).map(([groupName, groupRows]) => {
              const isExpanded = expandedGroups[groupName] ?? true;
              return (
                <div key={groupName} className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/40">
                  <div
                    onClick={() => toggleGroup(groupName)}
                    className="p-3 bg-slate-800/60 hover:bg-slate-800 cursor-pointer flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? <ChevronDown className="h-4 w-4 text-cyan-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                      <span className="text-xs font-bold text-white">{groupName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({groupRows.length} entitas)</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
                          <tr>
                            {visibleColumns.map(col => (
                              <th key={col.id} className="py-2.5 px-3.5 font-semibold">{col.label}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {groupRows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-800/30">
                              {visibleColumns.map(col => (
                                <td key={col.id} className="py-2.5 px-3.5">
                                  {renderTableCell(row[col.id], col.dataType, col.id)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Standard Flat Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  {visibleColumns.map(col => (
                    <th
                      key={col.id}
                      onClick={() => handleSort(col.id)}
                      className="py-3 px-4 font-bold cursor-pointer hover:text-white transition select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.label}</span>
                        {sortField === col.id ? (
                          sortDirection === 'ASC' ? <ChevronUp className="h-3.5 w-3.5 text-cyan-400" /> : <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
                        ) : null}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/40 font-sans">
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumns.length} className="py-8 text-center text-slate-500">
                      Tidak ada data yang cocok dengan kriteria pencarian
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/50 transition">
                      {visibleColumns.map(col => (
                        <td key={col.id} className="py-3 px-4">
                          {renderTableCell(row[col.id], col.dataType, col.id)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>

              {/* Summary Total Row */}
              {summaryRows && summaryRows.length > 0 && (
                <tfoot className="bg-slate-800/90 border-t-2 border-slate-700 text-white font-bold text-xs">
                  <tr>
                    {visibleColumns.map((col, idx) => {
                      if (idx === 0) {
                        return <td key={col.id} className="py-3 px-4 uppercase text-cyan-400">TOTAL / RATA-RATA</td>;
                      }
                      const sumObj = summaryRows.find(s => s.columnId === col.id);
                      return (
                        <td key={col.id} className="py-3 px-4 font-mono text-cyan-300">
                          {sumObj ? sumObj.formatted : '-'}
                        </td>
                      );
                    })}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}

        {/* Pagination Bottom Bar */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-900/60">
          <div>
            Menampilkan halaman <strong className="text-white">{currentPage}</strong> dari <strong className="text-white">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition font-semibold"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition font-semibold"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* AI Executive Synthesis & Recommendations Section */}
      {aiSummary && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AI Executive Synthesis &amp; Action Plan</h3>
                <p className="text-xs text-slate-400">Analisis otomatis berbasis data telematika riil tanpa asumsi</p>
              </div>
            </div>

            {aiSummary.costSavingEstimateIdr && (
              <div className="text-right">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Potensi Penghematan</span>
                <div className="text-base font-bold text-emerald-400">
                  Rp {aiSummary.costSavingEstimateIdr.toLocaleString('id-ID')}
                </div>
              </div>
            )}
          </div>

          {/* Executive Narrative */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-200 leading-relaxed">
            <strong className="text-amber-400 block mb-1 uppercase font-semibold tracking-wider text-[10px]">Executive Summary:</strong>
            {aiSummary.executiveSummary}
          </div>

          {/* Key Findings & Trends Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Findings */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>Temuan Kunci Operasional</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {aiSummary.keyFindings.map((kf, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                    <span>{kf}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Critical Issues / Red Flags */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-400" />
                <span>Isu Kritis &amp; Red Flags</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {aiSummary.criticalIssues.map((ci, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                    <span>{ci}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <span>Rekomendasi Tindakan Prioritas</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiSummary.recommendations.map((rec, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                        rec.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        Prioritas {rec.priority}
                      </span>
                      {rec.targetEntity && (
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">{rec.targetEntity}</span>
                      )}
                    </div>
                    <h5 className="mt-1 text-xs font-bold text-white">{rec.title}</h5>
                    <p className="mt-1 text-xs text-slate-300">{rec.action}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
                    <div className="text-emerald-400 font-semibold">Hasil: {rec.expectedOutcome}</div>
                    {rec.metricEvidence && (
                      <div className="text-[10px] text-slate-400 mt-0.5">Bukti: {rec.metricEvidence}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ask AI Analyst Interactive Q&A Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Tanya AI Analyst Seputar Laporan Ini</h3>
            <p className="text-xs text-slate-400">Ajukan pertanyaan berbasis dataset riil {name}</p>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            'Kenapa biaya operasional meningkat?',
            'Unit mana yang paling boros bahan bakar?',
            'Bagaimana tren performa keseluruhan?',
            'Apa rekomendasi penghematan biaya?',
          ].map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickQuestion(q)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-cyan-500/40 transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleCustomQuestionSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={e => setCustomQuestion(e.target.value)}
            placeholder="Ketik pertanyaan analisis... (Contoh: Berapa estimasi kebocoran BBM?)"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!customQuestion.trim() || isAiThinking}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition disabled:opacity-50"
          >
            {isAiThinking ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Tanya AI</span>
              </>
            )}
          </button>
        </form>

        {/* Q&A History Responses */}
        {qaHistory.length > 0 && (
          <div className="space-y-3 pt-2">
            {qaHistory.map(qa => (
              <div key={qa.id} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-400">Q: {qa.question}</span>
                  <span className="text-[10px] text-slate-500">{qa.timestamp}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{qa.answer}</p>
                {qa.metricEvidence && qa.metricEvidence.length > 0 && (
                  <div className="pt-2 border-t border-slate-700/60 flex flex-wrap gap-2 text-[10px] text-slate-400">
                    {qa.metricEvidence.map((ev, eIdx) => (
                      <span key={eIdx} className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono">
                        {ev}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to render styled table cells
function renderTableCell(value: any, dataType: string, colId: string) {
  if (value === undefined || value === null) return '-';

  if (dataType === 'currency' && typeof value === 'number') {
    return <span className="font-mono text-slate-200">Rp {Math.round(value).toLocaleString('id-ID')}</span>;
  }

  if (dataType === 'percentage' && typeof value === 'number') {
    return <span className="font-mono text-slate-200">{value}%</span>;
  }

  if (colId === 'status' || colId === 'threatLevel' || colId === 'trendStatus') {
    const valStr = String(value).toUpperCase();
    const isGood = valStr === 'NORMAL' || valStr === 'SELESAI' || valStr === 'BAIK' || valStr === 'LOW' || valStr === 'ON_TRACK';
    const isBad = valStr === 'HIGH' || valStr === 'KRITIS' || valStr === 'BURUK' || valStr === 'DEFICIT';
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
        isGood ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
        isBad ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
      }`}>
        {String(value)}
      </span>
    );
  }

  if (colId === 'vehiclePlate') {
    return <span className="font-mono font-bold text-cyan-300">{String(value)}</span>;
  }

  return <span>{String(value)}</span>;
}
