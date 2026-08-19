/**
 * Fleet Intelligence Smart AI - Automation Workflow Builder & NLP AI Studio
 * PROMPT 35 - Section 76, 77, 78 Visual DAG Builder + NLP
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Play,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Fuel,
  Wrench,
  Send,
  MessageSquare,
  AlertTriangle,
  FileText,
  Clock,
  Radio,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useAutomation } from '../context/AutomationContext';
import {
  AutomationWorkflow,
  AutomationNode,
  AutomationEdge,
  AutomationNodeType,
  AutomationEventType,
  WorkflowCategory,
  WorkflowPriority,
  ASTCondition,
  ASTConditionGroup,
} from '../types';
import { NaturalLanguageAutomationParser } from '../engines/NaturalLanguageAutomationParser';
import { AutomationDryRunModal } from './AutomationDryRunModal';

const PROMPT_SUGGESTIONS = [
  'Jika truk Fuso melebihi 90 km/jam di tol cipali, lakukan analisis AI risiko driver, kirim peringatan WhatsApp dan buat tiket keselamatan.',
  'Jika suhu mesin Isuzu Giga > 105°C dan rem aus > 85%, jadwalkan work order darurat ke bengkel terdekat dan beritahu manajer armada.',
  'Jika level bahan bakar Hino Ranger drop lebih dari 15% saat mesin mati, picu alarm pencurian dan kirim notifikasi Telegram ke tim keamanan.',
  'Jika sensor DMS mendeteksi pengemudi mengantuk (mata terpejam > 2 detik) setelah menyetir 4 jam, kirim pesan suara ke kabin dan buat insiden fatigue.',
  'Jika truk tangki keluar dari geofence koridor rute Pantura lebih dari 5 km tanpa izin, kunci mesin secara bertahap dan catat log pelanggaran rute.',
];

export const AutomationBuilderView: React.FC = () => {
  const {
    selectedWorkflow,
    createWorkflow,
    updateWorkflow,
    publishWorkflow,
    setActiveTab,
  } = useAutomation();

  const [activeMode, setActiveMode] = useState<'nlp' | 'visual'>('nlp');
  const [nlpPrompt, setNlpPrompt] = useState('');
  const [nlpResult, setNlpResult] = useState<any | null>(null);
  const [isParsingNlp, setIsParsingNlp] = useState(false);
  const [showSimModal, setShowSimModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Workflow Form State
  const [workflowId, setWorkflowId] = useState<string>('');
  const [workflowName, setWorkflowName] = useState<string>('Workflow Baru Tanpa Judul');
  const [workflowDescription, setWorkflowDescription] = useState<string>('Deskripsi otomasi cerdas...');
  const [category, setCategory] = useState<WorkflowCategory>('SAFETY');
  const [priority, setPriority] = useState<WorkflowPriority>('HIGH');
  const [branchScope, setBranchScope] = useState<'ALL' | string[]>('ALL');
  const [nodes, setNodes] = useState<AutomationNode[]>([]);
  const [edges, setEdges] = useState<AutomationEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Load existing selected workflow if provided
  useEffect(() => {
    if (selectedWorkflow) {
      setWorkflowId(selectedWorkflow.id);
      setWorkflowName(selectedWorkflow.name);
      setWorkflowDescription(selectedWorkflow.description);
      setCategory(selectedWorkflow.category);
      setPriority(selectedWorkflow.priority);
      setBranchScope(selectedWorkflow.branchScope);
      setNodes(selectedWorkflow.nodes || []);
      setEdges(selectedWorkflow.edges || []);
      if (selectedWorkflow.nodes && selectedWorkflow.nodes.length > 0) {
        setSelectedNodeId(selectedWorkflow.nodes[0].id);
      }
      setActiveMode('visual');
    } else {
      // Default new template
      initDefaultTemplate();
    }
  }, [selectedWorkflow]);

  const initDefaultTemplate = () => {
    const defaultNodes: AutomationNode[] = [
      {
        id: 'node_event_1',
        type: 'EVENT',
        label: 'Deteksi Overspeed GPS',
        description: 'Menerima telemetri kecepatan kendaraan',
        position: { x: 100, y: 50 },
        config: {
          eventType: 'OVERSPEED',
          eventSource: 'GPS',
          deduplicationWindowSec: 300,
        },
      },
      {
        id: 'node_cond_1',
        type: 'CONDITION',
        label: 'Validasi Batas Kecepatan (Speed > 85)',
        description: 'Evaluasi AST kondisi kecepatan',
        position: { x: 100, y: 150 },
        config: {
          conditionGroup: {
            id: 'cg_1',
            combinator: 'AND',
            conditions: [
              {
                id: 'c1',
                field: 'speed',
                fieldLabel: 'Kecepatan Aktual (km/h)',
                operator: '>',
                value: 85,
              },
            ],
          },
        },
      },
      {
        id: 'node_ai_1',
        type: 'AI_ANALYSIS',
        label: 'AI Driver Risk Intelligence',
        description: 'Analisis skor keselamatan & profil risiko',
        position: { x: 100, y: 260 },
        config: {
          aiConfig: {
            aiCapability: 'driver_risk',
            model: 'gemini-2.5-flash',
            contextFields: ['driver_history', 'speed_telemetry', 'road_type'],
            confidenceThreshold: 0.8,
          },
        },
      },
      {
        id: 'node_action_1',
        type: 'ACTION',
        label: 'Kirim Peringatan WhatsApp Driver',
        description: 'Mengirim notifikasi instan ke nomor WhatsApp driver',
        position: { x: 100, y: 380 },
        config: {
          actionConfig: {
            actionType: 'WHATSAPP_DRIVER',
            parameters: {
              message: 'Peringatan! Kecepatan Anda terdeteksi {{speed}} km/h. Harap kurangi kecepatan demi keselamatan.',
            },
            requiresApproval: false,
          },
        },
      },
    ];

    const defaultEdges: AutomationEdge[] = [
      { id: 'e1', sourceNodeId: 'node_event_1', targetNodeId: 'node_cond_1' },
      { id: 'e2', sourceNodeId: 'node_cond_1', targetNodeId: 'node_ai_1' },
      { id: 'e3', sourceNodeId: 'node_ai_1', targetNodeId: 'node_action_1' },
    ];

    setWorkflowId('');
    setWorkflowName('Alur Deteksi Kecepatan & Peringatan Driver');
    setWorkflowDescription('Secara otomatis mendeteksi overspeed dan mengirimkan peringatan WhatsApp.');
    setCategory('SAFETY');
    setPriority('HIGH');
    setNodes(defaultNodes);
    setEdges(defaultEdges);
    setSelectedNodeId('node_event_1');
  };

  const handleParseNlp = () => {
    if (!nlpPrompt.trim()) return;
    setIsParsingNlp(true);

    try {
      const parser = NaturalLanguageAutomationParser.getInstance();
      const result = parser.parsePrompt(nlpPrompt);
      setNlpResult(result);
    } catch (err) {
      console.error('NLP parse error:', err);
    } finally {
      setIsParsingNlp(false);
    }
  };

  const handleApplyNlpResult = () => {
    if (!nlpResult) return;
    const draft = nlpResult.workflowDraft;

    setWorkflowName(nlpResult.suggestedName || 'Workflow dari AI NLP');
    setWorkflowDescription(nlpResult.parsedSummary || '');
    setCategory(nlpResult.suggestedCategory || 'SAFETY');
    setNodes(draft.nodes || []);
    setEdges(draft.edges || []);
    if (draft.nodes && draft.nodes.length > 0) {
      setSelectedNodeId(draft.nodes[0].id);
    }
    setActiveMode('visual');
  };

  const handleSaveDraft = () => {
    if (workflowId) {
      updateWorkflow(workflowId, {
        name: workflowName,
        description: workflowDescription,
        category,
        priority,
        branchScope,
        nodes,
        edges,
      });
    } else {
      const created = createWorkflow({
        name: workflowName,
        description: workflowDescription,
        category,
        priority,
        branchScope,
        nodes,
        edges,
        status: 'DRAFT',
      });
      setWorkflowId(created.id);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePublish = () => {
    handleSaveDraft();
    if (workflowId) {
      publishWorkflow(workflowId);
    }
  };

  const handleAddNode = (type: AutomationNodeType) => {
    const newId = `node_${type.toLowerCase()}_${Date.now().toString(36)}`;
    let defaultLabel = 'Langkah Baru';
    let defaultConfig: any = {};

    switch (type) {
      case 'EVENT':
        defaultLabel = 'Event Telemetri Baru';
        defaultConfig = { eventType: 'OVERSPEED', eventSource: 'GPS' };
        break;
      case 'CONDITION':
        defaultLabel = 'Aturan Evaluasi Kondisi';
        defaultConfig = {
          conditionGroup: {
            id: `cg_${Date.now()}`,
            combinator: 'AND',
            conditions: [
              {
                id: `c_${Date.now()}`,
                field: 'speed',
                fieldLabel: 'Kecepatan (km/h)',
                operator: '>',
                value: 80,
              },
            ],
          },
        };
        break;
      case 'AI_ANALYSIS':
        defaultLabel = 'AI Anomaly & Risk Evaluation';
        defaultConfig = {
          aiConfig: {
            aiCapability: 'anomaly_detection',
            model: 'gemini-2.5-flash',
            contextFields: ['telemetry_stream', 'historical_avg'],
            confidenceThreshold: 0.85,
          },
        };
        break;
      case 'DECISION':
        defaultLabel = 'Cabang Keputusan (Decision)';
        defaultConfig = {
          decisionRules: [
            { branchId: 'branch_high', conditionLabel: 'Risiko Tinggi (> 0.85)', targetNodeId: '' },
            { branchId: 'branch_low', conditionLabel: 'Risiko Rendah / Normal', targetNodeId: '' },
          ],
        };
        break;
      case 'ACTION':
        defaultLabel = 'Eksekusi Tindakan Otomatis';
        defaultConfig = {
          actionConfig: {
            actionType: 'WHATSAPP_DRIVER',
            payloadTemplate: { message: 'Notifikasi sistem armada otomatis...' },
          },
        };
        break;
      case 'NOTIFICATION':
        defaultLabel = 'Kirim Notifikasi Alert';
        defaultConfig = {
          notificationConfig: {
            channel: 'TELEGRAM',
            targetRole: 'Fleet Supervisor',
            title: 'Alert Armada',
            message: 'Terjadi event telemetri penting.',
          },
        };
        break;
      default:
        defaultLabel = 'Langkah Alur';
    }

    const newNode: AutomationNode = {
      id: newId,
      type,
      label: defaultLabel,
      description: 'Konfigurasi node baru',
      position: { x: 100, y: (nodes.length + 1) * 100 },
      config: defaultConfig,
    };

    setNodes((prev) => [...prev, newNode]);

    // Connect automatically from last node if available
    if (nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      const newEdge: AutomationEdge = {
        id: `e_${lastNode.id}_${newId}`,
        sourceNodeId: lastNode.id,
        targetNodeId: newId,
      };
      setEdges((prev) => [...prev, newEdge]);
    }

    setSelectedNodeId(newId);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setEdges((prev) => prev.filter((e) => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div id="automation-builder-view" className="p-4 sm:p-6 space-y-6">
      {/* Top Builder Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="text-base font-bold text-slate-900 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 focus:outline-none focus:border-indigo-500 transition px-1"
                />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {category}
                </span>
              </div>
              <input
                type="text"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                placeholder="Tulis deskripsi alur kerja..."
                className="text-xs text-slate-500 dark:text-slate-400 bg-transparent w-full border-b border-transparent hover:border-slate-300 focus:outline-none focus:border-indigo-500 transition px-1 mt-0.5"
              />
            </div>
          </div>
        </div>

        {/* Builder Mode & Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setActiveMode('nlp')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeMode === 'nlp'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Prompt Studio
            </button>
            <button
              onClick={() => setActiveMode('visual')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeMode === 'visual'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Visual DAG Builder
            </button>
          </div>

          {/* Test Dry-Run Button */}
          <button
            onClick={() => setShowSimModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 text-xs font-semibold border border-amber-500/30 transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 text-amber-500 fill-amber-500/30" />
            Uji Simulasi
          </button>

          {/* Save Draft */}
          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Simpan Draft
          </button>

          {/* Publish */}
          <button
            onClick={handlePublish}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            Publikasikan ke Produksi
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Alur automasi berhasil disimpan dan diperbarui di sistem!
        </div>
      )}

      {/* MODE 1: AI Prompt Studio (NLP Parser) */}
      {activeMode === 'nlp' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Natural Language AI Workflow Studio
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ketikkan instruksi otomasi armada dalam bahasa Indonesia atau Inggris sehari-hari. AI kami akan secara otomatis menghasilkan seluruh struktur DAG node, aturan kondisi AST, integrasi model AI, dan aksi yang relevan.
            </p>
          </div>

          {/* Prompt Input Box */}
          <div className="space-y-3">
            <div className="relative">
              <textarea
                rows={4}
                value={nlpPrompt}
                onChange={(e) => setNlpPrompt(e.target.value)}
                placeholder="Contoh: Jika kendaraan melaju lebih dari 95 km/jam di jalan tol basah saat malam hari, lakukan analisis AI terhadap risiko kelelahan pengemudi, kirim peringatan WhatsApp ke pengemudi dan buat tiket keselamatan otomatis..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition shadow-inner leading-relaxed"
              />
              <button
                id="btn-generate-nlp-workflow"
                onClick={handleParseNlp}
                disabled={isParsingNlp || !nlpPrompt.trim()}
                className="absolute right-3 bottom-4 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-indigo-600/30 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isParsingNlp ? 'Menghasilkan Pipeline...' : 'Generate Workflow'}
              </button>
            </div>

            {/* Prompt Suggestion Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Inspirasi Instruksi Siap Uji (Klik untuk mencoba):
              </span>
              <div className="flex flex-wrap gap-2">
                {PROMPT_SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNlpPrompt(suggestion)}
                    className="text-left text-xs bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Result Preview */}
          {nlpResult && (
            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-900/60 space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      AI Berhasil Memahami Alur: {nlpResult.suggestedName}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Tingkat Akurasi Pemahaman: <b>{Math.round(nlpResult.confidence * 100)}%</b> • Kategori: <b>{nlpResult.suggestedCategory}</b>
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleApplyNlpResult}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                >
                  Terapkan ke Visual Builder <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Explanation Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-indigo-500 block mb-1">
                    Event Pemicu (Trigger)
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {nlpResult.explanation.whenItRuns}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-indigo-500 block mb-1">
                    Analisis Kecerdasan AI
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {nlpResult.explanation.whatAIAnalyzes}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-indigo-500 block mb-1">
                    Aksi & Notifikasi
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {nlpResult.explanation.whatActionsItPerforms}
                  </p>
                </div>
              </div>

              {/* Nodes Sequence Generated */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Pipeline DAG Node yang Dihasilkan ({nlpResult.workflowDraft.nodes?.length || 0} Langkah):
                </span>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {nlpResult.workflowDraft.nodes?.map((node: any, idx: number) => (
                    <React.Fragment key={node.id}>
                      <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-xs">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block truncate max-w-[140px]">
                            {node.label}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 uppercase">
                            {node.type}
                          </span>
                        </div>
                      </div>
                      {idx < (nlpResult.workflowDraft.nodes?.length || 0) - 1 && (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: Visual DAG Node Pipeline & AST Rule Builder */}
      {activeMode === 'visual' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 cols): Interactive Node Pipeline Canvas */}
          <div className="lg:col-span-8 space-y-4">
            {/* Palette Bar */}
            <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap pl-2">
                Tambah Node:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddNode('EVENT')}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-300 dark:border-emerald-800 transition flex items-center gap-1 whitespace-nowrap"
                >
                  <Zap className="w-3.5 h-3.5" /> + Trigger Event
                </button>
                <button
                  type="button"
                  onClick={() => handleAddNode('CONDITION')}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-300 dark:border-amber-800 transition flex items-center gap-1 whitespace-nowrap"
                >
                  <Sliders className="w-3.5 h-3.5" /> + Condition AST
                </button>
                <button
                  type="button"
                  onClick={() => handleAddNode('AI_ANALYSIS')}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-300 dark:border-indigo-800 transition flex items-center gap-1 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" /> + AI Intelligence
                </button>
                <button
                  type="button"
                  onClick={() => handleAddNode('DECISION')}
                  className="px-2.5 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-300 dark:border-purple-800 transition flex items-center gap-1 whitespace-nowrap"
                >
                  <Layers className="w-3.5 h-3.5" /> + Decision Branch
                </button>
                <button
                  type="button"
                  onClick={() => handleAddNode('ACTION')}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-300 dark:border-rose-800 transition flex items-center gap-1 whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" /> + Action Bus
                </button>
                <button
                  type="button"
                  onClick={() => handleAddNode('NOTIFICATION')}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-300 dark:border-blue-800 transition flex items-center gap-1 whitespace-nowrap"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> + Notif Alert
                </button>
              </div>
            </div>

            {/* Pipeline Canvas Cards */}
            <div className="space-y-3">
              {nodes.map((node, index) => {
                const isSelected = selectedNodeId === node.id;

                return (
                  <div key={node.id} className="relative">
                    <div
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border transition cursor-pointer shadow-sm space-y-3 ${
                        isSelected
                          ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                            {index + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {node.label}
                              </h4>
                              <span
                                className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                                  node.type === 'EVENT'
                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                    : node.type === 'CONDITION'
                                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                    : node.type === 'AI_ANALYSIS'
                                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                    : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                                }`}
                              >
                                {node.type}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {node.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNode(node.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                            title="Hapus node"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Preview summary badges per node type */}
                      {node.type === 'EVENT' && (
                        <div className="text-xs bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                          Trigger Event: <b>{node.config.eventType}</b> • Sumber: <b>{node.config.eventSource || 'GPS'}</b>
                        </div>
                      )}

                      {node.type === 'CONDITION' && node.config.conditionGroup && (
                        <div className="text-xs bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1 text-[11px]">
                          <span className="font-semibold text-slate-500 dark:text-slate-400">
                            Aturan AST ({node.config.conditionGroup.combinator}):
                          </span>
                          {node.config.conditionGroup.conditions.map((c: any, cIdx: number) => (
                            <div key={cIdx} className="font-mono text-indigo-600 dark:text-indigo-400">
                              • {c.field} <b>{c.operator}</b> {String(c.value)}
                            </div>
                          ))}
                        </div>
                      )}

                      {node.type === 'AI_ANALYSIS' && (
                        <div className="text-xs bg-indigo-50/60 dark:bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-200/60 dark:border-indigo-900/60 text-slate-700 dark:text-slate-300 text-[11px]">
                          <span className="font-bold text-indigo-700 dark:text-indigo-300">
                            Model: {node.config.aiConfig?.model || 'gemini-2.5-flash'}
                          </span>{' '}
                          • Kapabilitas: <b>{node.config.aiConfig?.aiCapability}</b>
                        </div>
                      )}

                      {node.type === 'ACTION' && (
                        <div className="text-xs bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-[11px]">
                          Aksi: <b className="text-rose-600 dark:text-rose-400">{node.config.actionConfig?.actionType}</b>
                        </div>
                      )}
                    </div>

                    {/* Connecting Connector Arrow between nodes */}
                    {index < nodes.length - 1 && (
                      <div className="flex justify-center my-1.5">
                        <div className="w-0.5 h-5 bg-indigo-400 dark:bg-indigo-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (4 cols): Selected Node Property Editor */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Konfigurasi Node
                  </h4>
                </div>
                {selectedNode && (
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: {selectedNode.id}
                  </span>
                )}
              </div>

              {selectedNode ? (
                <div className="space-y-4 text-xs">
                  {/* Label */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Judul / Label Node
                    </label>
                    <input
                      type="text"
                      value={selectedNode.label}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNodes((prev) =>
                          prev.map((n) => (n.id === selectedNode.id ? { ...n, label: val } : n))
                        );
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Deskripsi Langkah
                    </label>
                    <input
                      type="text"
                      value={selectedNode.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNodes((prev) =>
                          prev.map((n) => (n.id === selectedNode.id ? { ...n, description: val } : n))
                        );
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* EVENT SPECIFIC CONFIG */}
                  {selectedNode.type === 'EVENT' && (
                    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <label className="font-bold text-slate-900 dark:text-white block">
                        Tipe Event Telemetri
                      </label>
                      <select
                        value={selectedNode.config.eventType || 'OVERSPEED'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNodes((prev) =>
                            prev.map((n) =>
                              n.id === selectedNode.id
                                ? { ...n, config: { ...n.config, eventType: val as any } }
                                : n
                            )
                          );
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      >
                        <option value="OVERSPEED">OVERSPEED (Batas Kecepatan Terlampaui)</option>
                        <option value="MAINTENANCE_RISK_HIGH">MAINTENANCE_RISK_HIGH (Prediksi Kerusakan)</option>
                        <option value="FUEL_ANOMALY">FUEL_ANOMALY (Pencurian / Drop Bahan Bakar)</option>
                        <option value="FATIGUE_CRITICAL">FATIGUE_CRITICAL (Kelelahan Pengemudi)</option>
                        <option value="GEOFENCE_DEVIATION">GEOFENCE_DEVIATION (Penyimpangan Rute)</option>
                        <option value="TEMPERATURE_ALERT">TEMPERATURE_ALERT (Cold Chain Kargo)</option>
                        <option value="HARSH_BRAKING">HARSH_BRAKING (Pengereman Mendadak)</option>
                      </select>
                    </div>
                  )}

                  {/* CONDITION AST SPECIFIC CONFIG */}
                  {selectedNode.type === 'CONDITION' && selectedNode.config.conditionGroup && (
                    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-900 dark:text-white">
                          Aturan Evaluasi AST
                        </label>
                        <select
                          value={selectedNode.config.conditionGroup.combinator}
                          onChange={(e) => {
                            const comb = e.target.value as 'AND' | 'OR';
                            setNodes((prev) =>
                              prev.map((n) =>
                                n.id === selectedNode.id
                                  ? {
                                      ...n,
                                      config: {
                                        ...n.config,
                                        conditionGroup: {
                                          ...n.config.conditionGroup,
                                          combinator: comb,
                                        },
                                      },
                                    }
                                  : n
                              )
                            );
                          }}
                          className="bg-slate-100 dark:bg-slate-800 rounded px-2 py-0.5 font-mono text-[10px]"
                        >
                          <option value="AND">AND (Semua Harus Benar)</option>
                          <option value="OR">OR (Salah Satu Benar)</option>
                        </select>
                      </div>

                      {selectedNode.config.conditionGroup.conditions.map((cond: any, cIdx: number) => (
                        <div
                          key={cIdx}
                          className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2"
                        >
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={cond.field}
                              placeholder="Field (e.g. speed)"
                              onChange={(e) => {
                                const newField = e.target.value;
                                const updatedConds = [...selectedNode.config.conditionGroup.conditions];
                                updatedConds[cIdx].field = newField;
                                setNodes((prev) =>
                                  prev.map((n) =>
                                    n.id === selectedNode.id
                                      ? {
                                          ...n,
                                          config: {
                                            ...n.config,
                                            conditionGroup: {
                                              ...n.config.conditionGroup,
                                              conditions: updatedConds,
                                            },
                                          },
                                        }
                                      : n
                                  )
                                );
                              }}
                              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-[11px]"
                            />

                            <select
                              value={cond.operator}
                              onChange={(e) => {
                                const newOp = e.target.value as any;
                                const updatedConds = [...selectedNode.config.conditionGroup.conditions];
                                updatedConds[cIdx].operator = newOp;
                                setNodes((prev) =>
                                  prev.map((n) =>
                                    n.id === selectedNode.id
                                      ? {
                                          ...n,
                                          config: {
                                            ...n.config,
                                            conditionGroup: {
                                              ...n.config.conditionGroup,
                                              conditions: updatedConds,
                                            },
                                          },
                                        }
                                      : n
                                  )
                                );
                              }}
                              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1 py-1 text-[11px]"
                            >
                              <option value=">">&gt; (Lebih dari)</option>
                              <option value=">=">&gt;= (Lebih atau sama)</option>
                              <option value="<">&lt; (Kurang dari)</option>
                              <option value="<=">&lt;= (Kurang atau sama)</option>
                              <option value="==">== (Sama dengan)</option>
                              <option value="!=">!= (Tidak sama)</option>
                            </select>

                            <input
                              type="text"
                              value={String(cond.value)}
                              placeholder="Nilai Target"
                              onChange={(e) => {
                                const newVal = isNaN(Number(e.target.value))
                                  ? e.target.value
                                  : Number(e.target.value);
                                const updatedConds = [...selectedNode.config.conditionGroup.conditions];
                                updatedConds[cIdx].value = newVal;
                                setNodes((prev) =>
                                  prev.map((n) =>
                                    n.id === selectedNode.id
                                      ? {
                                          ...n,
                                          config: {
                                            ...n.config,
                                            conditionGroup: {
                                              ...n.config.conditionGroup,
                                              conditions: updatedConds,
                                            },
                                          },
                                        }
                                      : n
                                  )
                                );
                              }}
                              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-[11px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* AI ANALYSIS SPECIFIC CONFIG */}
                  {selectedNode.type === 'AI_ANALYSIS' && (
                    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <label className="font-bold text-slate-900 dark:text-white block">
                        Model AI Gemini & Kapabilitas
                      </label>
                      <select
                        value={selectedNode.config.aiConfig?.model || 'gemini-2.5-flash'}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      >
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra Cepat ~120ms)</option>
                        <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Reasoning Analitis)</option>
                      </select>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-500">Confidence Threshold</label>
                        <input
                          type="range"
                          min="0.5"
                          max="0.95"
                          step="0.05"
                          value={selectedNode.config.aiConfig?.confidenceThreshold || 0.8}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setNodes((prev) =>
                              prev.map((n) =>
                                n.id === selectedNode.id
                                  ? {
                                      ...n,
                                      config: {
                                        ...n.config,
                                        aiConfig: {
                                          ...n.config.aiConfig,
                                          confidenceThreshold: val,
                                        },
                                      },
                                    }
                                  : n
                              )
                            );
                          }}
                          className="w-full"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>0.50</span>
                          <span>
                            Current: <b>{selectedNode.config.aiConfig?.confidenceThreshold || 0.8}</b>
                          </span>
                          <span>0.95</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ACTION BUS SPECIFIC CONFIG */}
                  {selectedNode.type === 'ACTION' && (
                    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <label className="font-bold text-slate-900 dark:text-white block">
                        Tipe Aksi Eksekusi
                      </label>
                      <select
                        value={selectedNode.config.actionConfig?.actionType || 'WHATSAPP_DRIVER'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNodes((prev) =>
                            prev.map((n) =>
                              n.id === selectedNode.id
                                ? {
                                    ...n,
                                    config: {
                                      ...n.config,
                                      actionConfig: {
                                        ...n.config.actionConfig,
                                        actionType: val as any,
                                      },
                                    },
                                  }
                                : n
                            )
                          );
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      >
                        <option value="WHATSAPP_DRIVER">WhatsApp Pesan ke Driver</option>
                        <option value="TELEGRAM_SUPERVISOR">Telegram ke Tim Supervisor</option>
                        <option value="CREATE_FLEET_TICKET">Buat Tiket Insiden Fleet</option>
                        <option value="CREATE_WORK_ORDER">Buat Work Order Bengkel</option>
                        <option value="IMMOBILIZE_VEHICLE">Kunci / Immobilize Mesin Kendaraan</option>
                        <option value="WEBHOOK_DISPATCH">Webhook REST API Eksternal</option>
                      </select>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-8">
                  Pilih salah satu node pada pipeline canvas untuk melihat dan mengubah konfigurasinya.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Simulator Modal */}
      {showSimModal && (
        <AutomationDryRunModal
          defaultWorkflowId={workflowId}
          onClose={() => setShowSimModal(false)}
        />
      )}
    </div>
  );
};
