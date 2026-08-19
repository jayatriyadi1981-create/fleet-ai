/**
 * Fleet Intelligence Smart AI - Automation Dry-Run Simulator Modal
 * PROMPT 35 - Section 79 & Simulation Test Environment
 */

import React, { useState } from 'react';
import {
  Play,
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Zap,
  ShieldCheck,
  Fuel,
  Wrench,
  Layers,
  ChevronRight,
  Terminal,
  Activity,
  Sliders,
  Send,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useAutomation } from '../context/AutomationContext';
import { AutomationEventType, AutomationExecution, AutomationWorkflow } from '../types';

interface AutomationDryRunModalProps {
  onClose: () => void;
  defaultWorkflowId?: string;
}

interface EventPreset {
  id: string;
  name: string;
  category: string;
  icon: any;
  eventType: AutomationEventType;
  entityName: string;
  entityId: string;
  entityType: 'vehicle' | 'driver' | 'trip' | 'device';
  branchId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  payload: Record<string, any>;
  description: string;
}

const PRESET_EVENTS: EventPreset[] = [
  {
    id: 'preset_overspeed_critical',
    name: 'Overspeed Kritis (98 km/h di Tol Cipali)',
    category: 'SAFETY',
    icon: Zap,
    eventType: 'OVERSPEED',
    entityName: 'Truk Hino 500 (B-9872-TKU)',
    entityId: 'B-9872-TKU',
    entityType: 'vehicle',
    branchId: 'Depo Cakung Barat',
    severity: 'critical',
    payload: {
      speed: 98,
      speedLimit: 80,
      driverSafetyScore: 62,
      roadType: 'Tol Cipali KM 102',
      durationSeconds: 45,
      weather: 'Rainy',
    },
    description: 'Kendaraan melaju 18 km/h di atas batas kecepatan di jalan basah dengan riwayat pengemudi berisiko.',
  },
  {
    id: 'preset_maintenance_high',
    name: 'Risiko Komponen Kritis & Rem Aus',
    category: 'MAINTENANCE',
    icon: Wrench,
    eventType: 'MAINTENANCE_RISK_HIGH',
    entityName: 'Isuzu Giga FVR (D-8821-XZ)',
    entityId: 'D-8821-XZ',
    entityType: 'vehicle',
    branchId: 'Depo Bandung Timur',
    severity: 'high',
    payload: {
      healthScore: 54,
      daysOverdue: 14,
      engineTemp: 106,
      brakeWearPercent: 88,
      oilQualityScore: 42,
      lastServiceKm: 42500,
    },
    description: 'Kesehatan armada 54/100, rem aus 88%, dan temperatur mesin melewati ambang aman 105°C.',
  },
  {
    id: 'preset_fuel_drop',
    name: 'Penurunan Bahan Bakar Drastis (19% Mesin Mati)',
    category: 'FUEL',
    icon: Fuel,
    eventType: 'FUEL_ANOMALY',
    entityName: 'Hino Ranger 260 (L-9022-US)',
    entityId: 'L-9022-US',
    entityType: 'vehicle',
    branchId: 'Depo Surabaya Rungkut',
    severity: 'critical',
    payload: {
      dropPercent: 19.5,
      dropLiters: 48,
      isEngineOff: true,
      locationType: 'Bahu Jalan Tol Trans-Jawa',
      sensorConfidence: 0.96,
    },
    description: 'Level tangki turun 48 Liter dalam 5 menit saat kendaraan berhenti di bahu jalan dengan mesin mati.',
  },
  {
    id: 'preset_fatigue_alert',
    name: 'Driver Fatigue & Eye Closure 2.8s',
    category: 'SAFETY',
    icon: ShieldCheck,
    eventType: 'FATIGUE_CRITICAL',
    entityName: 'Driver: Slamet Mulyadi (SIM B2 Umum)',
    entityId: 'DRV-084',
    entityType: 'driver',
    branchId: 'Depo Semarang',
    severity: 'high',
    payload: {
      continuousDrivingHours: 4.9,
      eyeClosureSeconds: 2.8,
      yawnCountLast10Min: 7,
      laneDepartureCount: 3,
      perclosScore: 84,
    },
    description: 'Kamera AI mendeteksi micro-sleep mata terpejam 2.8 detik setelah mengemudi tanpa henti 4.9 jam.',
  },
  {
    id: 'preset_geofence_deviation',
    name: 'Deviasi Koridor Rute > 7.5 KM',
    category: 'COMPLIANCE',
    icon: Sliders,
    eventType: 'GEOFENCE_DEVIATION',
    entityName: 'Mitsubishi Fuso Fighter (B-9190-VGA)',
    entityId: 'B-9190-VGA',
    entityType: 'vehicle',
    branchId: 'Depo Jakarta Port Tanjung Priok',
    severity: 'medium',
    payload: {
      deviationKm: 7.8,
      plannedRoute: 'Jakarta - Cirebon Pantura',
      currentLocation: 'Kawasan Industri Dawuan',
      unauthorizedStopMinutes: 24,
    },
    description: 'Armada menyimpang 7.8 KM dari koridor rute yang ditentukan dan terhenti di luar zona geofence.',
  },
];

export const AutomationDryRunModal: React.FC<AutomationDryRunModalProps> = ({
  onClose,
  defaultWorkflowId,
}) => {
  const { workflows, runDryRunSimulation, triggerManualEvent } = useAutomation();

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(
    defaultWorkflowId || (workflows.length > 0 ? workflows[0].id : '')
  );

  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset_overspeed_critical');
  const [simulationMode, setSimulationMode] = useState<'DRY_RUN' | 'REAL_TRIGGER'>('DRY_RUN');
  const [isRunning, setIsRunning] = useState(false);
  const [customPayloadJson, setCustomPayloadJson] = useState<string>(
    JSON.stringify(PRESET_EVENTS[0].payload, null, 2)
  );
  const [payloadMode, setPayloadMode] = useState<'preset' | 'custom'>('preset');
  const [executionResult, setExecutionResult] = useState<AutomationExecution | null>(null);
  const [activeStepTab, setActiveStepTab] = useState<string>('all');
  const [rawJsonView, setRawJsonView] = useState(false);

  const currentWorkflow = workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];
  const currentPreset = PRESET_EVENTS.find((p) => p.id === selectedPresetId) || PRESET_EVENTS[0];

  const handleSelectPreset = (preset: EventPreset) => {
    setSelectedPresetId(preset.id);
    setCustomPayloadJson(JSON.stringify(preset.payload, null, 2));

    // Try to auto-match workflow if one exists for this event
    const matching = workflows.find((w) =>
      w.nodes.some((n) => n.type === 'EVENT' && n.config.eventType === preset.eventType)
    );
    if (matching) {
      setSelectedWorkflowId(matching.id);
    }
  };

  const handleExecute = async () => {
    if (!currentWorkflow) return;
    setIsRunning(true);
    setExecutionResult(null);

    try {
      let parsedPayload = currentPreset.payload;
      if (payloadMode === 'custom') {
        try {
          parsedPayload = JSON.parse(customPayloadJson);
        } catch {
          alert('Format JSON payload tidak valid. Periksa kembali kurung kurawal & tanda kutip.');
          setIsRunning(false);
          return;
        }
      }

      if (simulationMode === 'DRY_RUN') {
        const result = await runDryRunSimulation(currentWorkflow.id, {
          eventType: currentPreset.eventType,
          entityName: currentPreset.entityName,
          entityId: currentPreset.entityId,
          entityType: currentPreset.entityType,
          branchId: currentPreset.branchId,
          severity: currentPreset.severity,
          payload: parsedPayload,
        });
        setExecutionResult(result);
      } else {
        const result = await triggerManualEvent({
          eventType: currentPreset.eventType,
          entityName: currentPreset.entityName,
          entityId: currentPreset.entityId,
          entityType: currentPreset.entityType,
          branchId: currentPreset.branchId,
          severity: currentPreset.severity,
          payload: parsedPayload,
        });
        if (result) {
          setExecutionResult(result);
        }
      }
    } catch (err: any) {
      console.error('Simulation error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div
      id="automation-dry-run-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl text-white shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-md shadow-amber-500/20">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Automation Simulator & Dry-Run Engine
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  SANDBOX MODE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Uji evaluasi AST kondisi, inferensi AI reasoning, kalkulasi branch, dan simulasi pengiriman aksi tanpa dampak ke produksi.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Col (5 cols): Workflow & Mode Selector */}
            <div className="lg:col-span-5 space-y-4">
              {/* Select Target Workflow */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Pilih Alur Automasi (Target Workflow)
                </label>
                <select
                  value={selectedWorkflowId}
                  onChange={(e) => setSelectedWorkflowId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  {workflows.map((wf) => (
                    <option key={wf.id} value={wf.id}>
                      [{wf.category}] {wf.name} ({wf.nodes.length} langkah) - {wf.status}
                    </option>
                  ))}
                </select>
                {currentWorkflow && (
                  <p className="text-[11px] text-slate-400 line-clamp-1 italic px-1">
                    {currentWorkflow.description}
                  </p>
                )}
              </div>

              {/* Execution Mode Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  Mode Eksekusi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSimulationMode('DRY_RUN')}
                    className={`p-2.5 rounded-xl border text-left transition text-xs flex flex-col justify-between ${
                      simulationMode === 'DRY_RUN'
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      Dry-Run Simulation
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Aksi di-mock / disimulasikan secara aman tanpa kirim WA/notif nyata.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSimulationMode('REAL_TRIGGER')}
                    className={`p-2.5 rounded-xl border text-left transition text-xs flex flex-col justify-between ${
                      simulationMode === 'REAL_TRIGGER'
                        ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold flex items-center gap-1">
                      <Send className="w-3.5 h-3.5 text-indigo-400" />
                      Live Trigger Test
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Kirim event langsung ke Event Bus & dispatch aksi riil.
                    </span>
                  </button>
                </div>
              </div>

              {/* Preset Event Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    Preset Skenario Uji Event IoT
                  </label>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      onClick={() => setPayloadMode('preset')}
                      className={`px-2 py-0.5 rounded ${
                        payloadMode === 'preset'
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Presets
                    </button>
                    <button
                      onClick={() => setPayloadMode('custom')}
                      className={`px-2 py-0.5 rounded ${
                        payloadMode === 'custom'
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Custom JSON
                    </button>
                  </div>
                </div>

                {payloadMode === 'preset' ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {PRESET_EVENTS.map((preset) => {
                      const Icon = preset.icon;
                      const isSelected = selectedPresetId === preset.id;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => handleSelectPreset(preset)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                            isSelected
                              ? 'bg-indigo-950/60 border-indigo-500/60 text-white'
                              : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-900 shrink-0 mt-0.5">
                            <Icon className="w-3.5 h-3.5 text-indigo-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold truncate">{preset.name}</span>
                              <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                                {preset.eventType}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {preset.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <textarea
                      rows={6}
                      value={customPayloadJson}
                      onChange={(e) => setCustomPayloadJson(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
                      placeholder='{ "speed": 95, "roadType": "Tol Cipali" }'
                    />
                    <p className="text-[10px] text-slate-400">
                      Edit nilai sensor payload telemetry untuk menguji AST boundary conditions.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col (7 cols): Selected Event Specs & Trigger Action */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Parameter Event Telemetri Terpilih
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">
                    ID: {currentPreset.entityId}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Entitas / Unit</span>
                    <span className="font-semibold text-slate-200 truncate block">
                      {currentPreset.entityName}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Depo / Cabang</span>
                    <span className="font-semibold text-slate-200 truncate block">
                      {currentPreset.branchId}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Tingkat Severity</span>
                    <span className="font-bold uppercase text-rose-400">
                      {currentPreset.severity}
                    </span>
                  </div>
                </div>

                {/* Event Payload Key-Value Badges */}
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold mb-1.5 block">
                    Payload Key-Values:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(
                      payloadMode === 'preset'
                        ? currentPreset.payload
                        : (() => {
                            try {
                              return JSON.parse(customPayloadJson);
                            } catch {
                              return {};
                            }
                          })()
                    ).map(([k, v]) => (
                      <span
                        key={k}
                        className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-indigo-300"
                      >
                        <span className="text-slate-400">{k}:</span> <b>{String(v)}</b>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button: Run Simulation */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    Simulasi mengeksekusi DAG {currentWorkflow?.nodes.length || 0} node secara paralel & sekuensial.
                  </span>
                </div>

                <button
                  id="btn-run-dry-run-execute"
                  onClick={handleExecute}
                  disabled={isRunning || !currentWorkflow}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Mengevaluasi Node DAG...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      Jalankan Simulasi Sekarang
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Execution Result Area */}
          {executionResult && (
            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-4 animate-fade-in">
              {/* Header status bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      executionResult.status === 'SUCCESS'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : executionResult.status === 'FAILED'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {executionResult.status === 'SUCCESS' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : executionResult.status === 'FAILED' ? (
                      <XCircle className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">
                        Hasil Simulasi: {executionResult.status}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {executionResult.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Total Durasi: <b>{executionResult.durationMs} ms</b> • AI Tokens:{' '}
                      <b>{executionResult.aiTokensUsed}</b> • Estimasi Biaya:{' '}
                      <b>Rp {executionResult.estimatedCostIdr.toLocaleString('id-ID')}</b>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRawJsonView(!rawJsonView)}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
                  >
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    {rawJsonView ? 'Visual DAG View' : 'Raw JSON Trace'}
                  </button>
                </div>
              </div>

              {rawJsonView ? (
                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 max-h-80 overflow-y-auto">
                  <pre className="text-[11px] font-mono text-emerald-400 whitespace-pre-wrap">
                    {JSON.stringify(executionResult, null, 2)}
                  </pre>
                </div>
              ) : (
                /* Step-by-Step DAG Pipeline Visual Cards */
                <div className="space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Jalur Eksekusi DAG Node Pipeline ({executionResult.steps.length} Langkah):
                  </h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {executionResult.steps.map((step, idx) => {
                      const isSuccess = step.status === 'SUCCESS';
                      const isSkipped = step.status === 'SKIPPED';
                      const isFailed = step.status === 'FAILED';

                      return (
                        <div
                          key={step.nodeId || idx}
                          className={`p-3.5 rounded-xl border transition space-y-2 ${
                            isSuccess
                              ? 'bg-slate-900/90 border-emerald-500/30'
                              : isSkipped
                              ? 'bg-slate-900/50 border-slate-800 opacity-75'
                              : isFailed
                              ? 'bg-rose-950/30 border-rose-500/40'
                              : 'bg-slate-900 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                                {idx + 1}
                              </span>
                              <span className="text-xs font-bold text-white truncate">
                                {step.nodeLabel}
                              </span>
                              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                                {step.nodeType}
                              </span>
                            </div>

                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                                isSuccess
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : isSkipped
                                  ? 'bg-slate-800 text-slate-400'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {step.status} ({step.durationMs}ms)
                            </span>
                          </div>

                          {/* Detail per node type */}
                          {step.nodeType === 'CONDITION' && step.conditionResult && (
                            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                              <div className="flex items-center justify-between font-mono text-[10px]">
                                <span>Evaluasi AST Aturan:</span>
                                <span
                                  className={
                                    step.conditionResult.passed
                                      ? 'text-emerald-400 font-bold'
                                      : 'text-rose-400 font-bold'
                                  }
                                >
                                  {step.conditionResult.passed ? 'PASSED (TRUE)' : 'FAILED (FALSE)'}
                                </span>
                              </div>
                              <div className="text-slate-400">
                                {step.conditionResult.evaluationDetails?.map((d: any, dIdx: number) => (
                                  <div key={dIdx} className="truncate">
                                    • {d.field} {d.operator} {String(d.targetValue)} (Aktual:{' '}
                                    <b className="text-indigo-300">{String(d.actualValue)}</b>) →{' '}
                                    <span className={d.passed ? 'text-emerald-400' : 'text-rose-400'}>
                                      {d.passed ? '✓ Valid' : '✗ Invalid'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {step.nodeType === 'AI_ANALYSIS' && step.aiResult && (
                            <div className="bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-800/50 text-[11px] space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-indigo-300 flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                  Hasil Analisis AI Intelligence:
                                </span>
                                <span className="text-[10px] font-bold uppercase px-2 py-0.2 rounded bg-indigo-900 text-indigo-200">
                                  Risk: {step.aiResult.risk} ({Math.round(step.aiResult.confidence * 100)}%)
                                </span>
                              </div>
                              <p className="text-slate-300 text-xs italic">
                                "{step.aiResult.reason}"
                              </p>
                              {step.aiResult.recommendedAction && (
                                <div className="text-[10px] text-amber-300 font-medium">
                                  Rekomendasi AI: {step.aiResult.recommendedAction}
                                </div>
                              )}
                            </div>
                          )}

                          {step.nodeType === 'ACTION' && step.actionResult && (
                            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-slate-400">Tindakan Dieksekusi:</span>
                                <span className="text-emerald-400 font-semibold font-mono">
                                  {step.actionResult.actionType}
                                </span>
                              </div>
                              <div className="text-slate-300">
                                {step.actionResult.summary || 'Aksi berhasil dieksekusi'}
                              </div>
                            </div>
                          )}

                          {step.error && (
                            <div className="text-[11px] text-rose-400 bg-rose-950/50 p-2 rounded border border-rose-900">
                              <b>Error:</b> {step.error}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-900/90">
          <span className="text-xs text-slate-400">
            Simulasi ini tidak menyimpan perubahan status permanen pada kendaraan riil.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Tutup Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
