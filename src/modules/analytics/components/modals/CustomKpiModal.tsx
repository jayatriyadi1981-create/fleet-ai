/**
 * Fleet Intelligence Smart AI - Safe Custom KPI Formula Builder Modal
 * PROMPT 36 - Sections 54, 55, 56 & Safe AST Expression Parser
 */

import React, { useState } from 'react';
import { X, Plus, Play, CheckCircle2, AlertTriangle, Code2, HelpCircle } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { SafeKpiExpressionEngine } from '../../engines/SafeKpiExpressionEngine';
import { CustomKpiDefinition } from '../../types';

export const CustomKpiModal: React.FC = () => {
  const { isCustomKpiModalOpen, setIsCustomKpiModalOpen, customKpis, addCustomKpi, currentScopeContext } = useAnalytics();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [expression, setExpression] = useState('totalMileageKm / completedTrips');
  const [unit, setUnit] = useState('km/trip');
  const [targetValue, setTargetValue] = useState('45');
  const [testResult, setTestResult] = useState<{ success: boolean; value?: number; error?: string } | null>(null);

  if (!isCustomKpiModalOpen) return null;

  const handleTestFormula = () => {
    try {
      const vars = SafeKpiExpressionEngine.extractVariables(expression);
      const val = SafeKpiExpressionEngine.evaluateFormula(expression, currentScopeContext);
      setTestResult({ success: true, value: val });
    } catch (err: any) {
      setTestResult({ success: false, error: err.message });
    }
  };

  const handleSaveKpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !expression.trim()) return;

    try {
      const sampleValue = SafeKpiExpressionEngine.evaluateFormula(expression, currentScopeContext);
      const newKpi: CustomKpiDefinition = {
        id: `kpi_${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        formulaExpression: expression.trim(),
        unit: unit.trim() || undefined,
        targetValue: targetValue ? Number(targetValue) : undefined,
        currentValue: sampleValue,
        status: 'ACTIVE',
        createdBy: 'Fleet Admin',
        createdAt: new Date().toISOString(),
      };

      addCustomKpi(newKpi);
      setIsCustomKpiModalOpen(false);
    } catch (err: any) {
      setTestResult({ success: false, error: `Gagal menyimpan: ${err.message}` });
    }
  };

  const insertVariable = (varName: string) => {
    setExpression((prev) => `${prev} ${varName}`.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-400 border border-indigo-500/20">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Custom KPI Formula Builder</h3>
              <p className="text-xs text-slate-400">
                Buat indikator kinerja kustom dengan parser formula matematika aman (No eval)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCustomKpiModalOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSaveKpi} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Nama KPI Kustom *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="misal: Rasio Jarak per Trip Selesai"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Satuan (Unit)</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="km/trip, %, jam, dll"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Deskripsi Singkat</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan tujuan metrik ini..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Formula Expression */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold">Ekspresi Rumus Matematika *</label>
              <span className="text-[11px] text-slate-500">Operator: + - * / ( )</span>
            </div>
            <textarea
              required
              rows={2}
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-sm text-cyan-300 focus:border-indigo-500 focus:outline-none"
            />

            {/* Variable Pills */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] text-slate-400 block">Klik variabel untuk disisipkan ke rumus:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'totalMileageKm',
                  'completedTrips',
                  'operatingHours',
                  'idleHours',
                  'downtimeHours',
                  'activeVehicles',
                  'fleetSize',
                  'utilizationRate',
                ].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => insertVariable(v)}
                    className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-indigo-300 hover:bg-indigo-950/60 border border-slate-700"
                  >
                    +{v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Test Formula Section */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleTestFormula}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Uji Validasi Rumus (Live Test)</span>
            </button>

            {testResult && (
              <div className="flex items-center gap-1.5">
                {testResult.success ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Hasil Valid: {testResult.value} {unit}</span>
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>{testResult.error}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-800 pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsCustomKpiModalOpen(false)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-500 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-400 transition-all shadow-md shadow-indigo-500/20"
            >
              Simpan & Aktifkan KPI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
