/**
 * Fleet Intelligence Smart AI - Alert Rule Builder Modal & Rule Tester
 */

import React, { useState } from 'react';
import {
  AlertRule,
  AlertType,
  AlertSeverity,
  ActionChannel,
  ConditionClause,
  ConditionGroup,
  Operator,
} from '../types';
import {
  X,
  Plus,
  Trash2,
  Sliders,
  CheckCircle2,
  Play,
  FlaskConical,
  AlertTriangle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface RuleBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRule: (rule: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  initialRule?: AlertRule | null;
}

export const RuleBuilderModal: React.FC<RuleBuilderModalProps> = ({
  isOpen,
  onClose,
  onSaveRule,
  initialRule,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(initialRule?.name || '');
  const [description, setDescription] = useState(initialRule?.description || '');
  const [type, setType] = useState<AlertType>(initialRule?.type || 'OVERSPEED');
  const [severity, setSeverity] = useState<AlertSeverity>(initialRule?.severity || 'CRITICAL');
  const [priority, setPriority] = useState<number>(initialRule?.priority || 1);
  const [durationSeconds, setDurationSeconds] = useState(initialRule?.durationSeconds || 30);
  const [cooldownSeconds, setCooldownSeconds] = useState(initialRule?.cooldownSeconds || 300);

  // Condition Clauses
  const [logicalOperator, setLogicalOperator] = useState<'AND' | 'OR'>('AND');
  const [clauses, setClauses] = useState<ConditionClause[]>(
    initialRule?.conditionGroup?.clauses || [
      { id: 'cl-1', field: 'speed', operator: '>', value: 100 },
    ]
  );

  // Actions
  const [actions, setActions] = useState<ActionChannel[]>(
    initialRule?.actions || ['CREATE_ALERT', 'PUSH', 'IN_APP', 'WHATSAPP']
  );

  // Schedule & Scope
  const [scheduleType, setScheduleType] = useState<'ALWAYS' | 'OPERATING_HOURS' | 'OUTSIDE_OPERATING_HOURS' | 'CUSTOM'>(
    initialRule?.schedule?.type || 'ALWAYS'
  );
  const [scopeType, setScopeType] = useState<'ALL' | 'SPECIFIC_VEHICLE' | 'VEHICLE_GROUP' | 'BRANCH'>(
    initialRule?.scope?.vehicleType || 'ALL'
  );

  // --- Rule Tester State ---
  const [testSpeed, setTestSpeed] = useState<number>(105);
  const [testIgnition, setTestIgnition] = useState<boolean>(true);
  const [testTemp, setTestTemp] = useState<number>(9.5);
  const [testDeviation, setTestDeviation] = useState<number>(600);
  const [testResult, setTestResult] = useState<{ triggered: boolean; message: string } | null>(null);

  const handleAddClause = () => {
    setClauses([
      ...clauses,
      { id: `cl-${Date.now()}`, field: 'speed', operator: '>', value: 80 },
    ]);
  };

  const handleRemoveClause = (id: string) => {
    setClauses(clauses.filter((c) => c.id !== id));
  };

  const handleUpdateClause = (id: string, field: string, val: any) => {
    setClauses(
      clauses.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
  };

  const toggleAction = (channel: ActionChannel) => {
    if (actions.includes(channel)) {
      setActions(actions.filter((a) => a !== channel));
    } else {
      setActions([...actions, channel]);
    }
  };

  const handleRunTester = () => {
    // Run mock evaluation on test inputs
    let match = true;
    const mockTelemetry: Record<string, any> = {
      speed: testSpeed,
      ignition: testIgnition,
      temperature: testTemp,
      routeDeviationDistMeters: testDeviation,
    };

    clauses.forEach((cl) => {
      const val = mockTelemetry[cl.field];
      if (val !== undefined) {
        if (cl.operator === '>') match = match && val > Number(cl.value);
        if (cl.operator === '<') match = match && val < Number(cl.value);
        if (cl.operator === '=') match = match && val === cl.value;
      }
    });

    if (match) {
      setTestResult({
        triggered: true,
        message: `VALIDASI SUKSES: Telemetry uji MEMICU alert "${name || 'Aturan Baru'}"!`,
      });
    } else {
      setTestResult({
        triggered: false,
        message: 'TIDAK MEMICU: Telemetry uji berada dalam batas aman toleransi.',
      });
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const conditionGroup: ConditionGroup = {
      id: `cg-${Date.now()}`,
      logicalOperator,
      clauses,
    };

    onSaveRule({
      tenantId: 'tenant-tln-01',
      name,
      description,
      type,
      enabled: true,
      severity,
      priority: priority as any,
      conditionGroup,
      durationSeconds,
      cooldownSeconds,
      actions,
      schedule: { type: scheduleType },
      scope: { vehicleType: scopeType },
      createdBy: 'Operations Admin',
      updatedBy: 'Operations Admin',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full my-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Visual Rule Builder & Condition Logic</h2>
              <p className="text-xs text-slate-400">Konfigurasi aturan pemicu dan ambang toleransi telematika armada.</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-5 text-xs text-slate-300 max-h-[60vh] overflow-y-auto pr-2">
          {/* General info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Nama Rule / Aturan</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="mis. Overspeed Kritis Jalur Tol (>100 km/h)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Jenis Telematika (Alert Type)</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AlertType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="OVERSPEED">OVERSPEED (Batas Kecepatan)</option>
                <option value="IDLE">IDLE (Mesin Menyala Tanpa Gerak)</option>
                <option value="DEVICE_OFFLINE">DEVICE_OFFLINE (GPS Terputus)</option>
                <option value="GEOFENCE">GEOFENCE (Pelanggaran Zona)</option>
                <option value="ROUTE_DEVIATION">ROUTE_DEVIATION (Deviasi Rute)</option>
                <option value="IGNITION">IGNITION (Kontak Mesin)</option>
                <option value="BATTERY">BATTERY (Aki / Baterai GPS)</option>
                <option value="TEMPERATURE">TEMPERATURE (Suhu Cold-Chain)</option>
                <option value="PANIC">PANIC (Tombol SOS Darurat)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="CRITICAL">CRITICAL (Bahaya Tinggi)</option>
                <option value="HIGH">HIGH (Prioritas Utama)</option>
                <option value="MEDIUM">MEDIUM (Pengawasan Normal)</option>
                <option value="LOW">LOW (Informasional)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Durasi Pelanggaran (Detik)</label>
              <input
                type="number"
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Cooldown Window (Detik)</label>
              <input
                type="number"
                value={cooldownSeconds}
                onChange={(e) => setCooldownSeconds(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Condition Logic Builder */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">Pohon Kondisi Aturan</span>
                <select
                  value={logicalOperator}
                  onChange={(e) => setLogicalOperator(e.target.value as any)}
                  className="bg-indigo-950 border border-indigo-500/30 text-indigo-300 font-bold px-2 py-0.5 rounded text-[10px]"
                >
                  <option value="AND">SEMUA HARUS COCOK (AND)</option>
                  <option value="OR">SALAH SATU COCOK (OR)</option>
                </select>
              </div>

              <button
                onClick={handleAddClause}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Syarat
              </button>
            </div>

            <div className="space-y-2">
              {clauses.map((c) => (
                <div key={c.id} className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <select
                    value={c.field}
                    onChange={(e) => handleUpdateClause(c.id, 'field', e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs flex-1"
                  >
                    <option value="speed">Kecepatan (speed)</option>
                    <option value="ignition">Kontak Mesin (ignition)</option>
                    <option value="temperature">Suhu Kargo (°C)</option>
                    <option value="routeDeviationDistMeters">Deviasi Rute (Meter)</option>
                    <option value="lastPingSec">Waktu Offline (Detik)</option>
                  </select>

                  <select
                    value={c.operator}
                    onChange={(e) => handleUpdateClause(c.id, 'operator', e.target.value as Operator)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-indigo-300 font-bold text-xs"
                  >
                    <option value=">">&gt; Lebih Dari</option>
                    <option value="<">&lt; Kurang Dari</option>
                    <option value="=">= Sama Dengan</option>
                    <option value="!=">!= Tidak Sama</option>
                  </select>

                  <input
                    type="text"
                    value={c.value}
                    onChange={(e) => handleUpdateClause(c.id, 'value', e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs w-24"
                  />

                  {clauses.length > 1 && (
                    <button
                      onClick={() => handleRemoveClause(c.id)}
                      className="p-2 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Channels Checklist */}
          <div className="space-y-2">
            <label className="text-slate-400 block font-semibold">Saluran Notifikasi & Aksi Otomatis</label>
            <div className="flex flex-wrap gap-2">
              {[
                { channel: 'CREATE_ALERT', label: 'Create Alert Record' },
                { channel: 'PUSH', label: 'Push App Dispatcher' },
                { channel: 'IN_APP', label: 'In-App Web Feed' },
                { channel: 'WHATSAPP', label: 'WhatsApp Dispatcher' },
                { channel: 'EMAIL', label: 'Email Report' },
                { channel: 'SMS', label: 'SMS Gateway' },
                { channel: 'WEBHOOK', label: 'Webhook API' },
              ].map((item) => (
                <button
                  key={item.channel}
                  type="button"
                  onClick={() => toggleAction(item.channel as ActionChannel)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                    actions.includes(item.channel as ActionChannel)
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500'
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* RULE TESTER SIMULATION PANEL */}
          <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
              <span className="font-bold text-indigo-300 text-xs flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-indigo-400" />
                Rule Tester Simulation (Pengujian Langsung)
              </span>

              <button
                onClick={handleRunTester}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow transition-all flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-current" />
                Uji Aturan
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">Speed (km/h)</span>
                <input
                  type="number"
                  value={testSpeed}
                  onChange={(e) => setTestSpeed(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 font-mono text-white"
                />
              </div>

              <div>
                <span className="text-slate-400 block">Suhu (°C)</span>
                <input
                  type="number"
                  value={testTemp}
                  onChange={(e) => setTestTemp(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 font-mono text-white"
                />
              </div>

              <div>
                <span className="text-slate-400 block">Deviasi Rute (m)</span>
                <input
                  type="number"
                  value={testDeviation}
                  onChange={(e) => setTestDeviation(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 font-mono text-white"
                />
              </div>

              <div>
                <span className="text-slate-400 block">Kontak Mesin</span>
                <button
                  type="button"
                  onClick={() => setTestIgnition(!testIgnition)}
                  className={`w-full p-1.5 rounded-lg font-bold border transition-all ${
                    testIgnition
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {testIgnition ? 'ON (Menyala)' : 'OFF (Mati)'}
                </button>
              </div>
            </div>

            {testResult && (
              <div
                className={`p-2.5 rounded-xl border text-xs font-semibold ${
                  testResult.triggered
                    ? 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {testResult.message}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20"
          >
            Simpan & Aktifkan Rule
          </button>
        </div>
      </div>
    </div>
  );
};
