/**
 * Behavior Rules & Threshold Configuration Modal
 * Configures detection parameters, persistence durations, severity levels, and safety score weights
 * PROMPT 21 Architecture
 */

import React, { useState } from 'react';
import { DriverBehaviorRule, DriverSafetyScoreConfig } from '../../types';
import { behaviorStore } from '../../services/behaviorStore';
import { driverSafetyScoreService } from '../../services/driverSafetyScoreService';
import { X, Settings, Sliders, CheckCircle2, RotateCcw } from 'lucide-react';

interface BehaviorRulesModalProps {
  onClose: () => void;
  onSaved?: () => void;
}

export const BehaviorRulesModal: React.FC<BehaviorRulesModalProps> = ({ onClose, onSaved }) => {
  const [rules, setRules] = useState<DriverBehaviorRule[]>(behaviorStore.getRules());
  const [config, setConfig] = useState<DriverSafetyScoreConfig>(driverSafetyScoreService.getConfig());
  const [activeTab, setActiveTab] = useState<'rules' | 'weights'>('rules');

  const handleRuleToggle = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleRuleChange = (id: string, field: keyof DriverBehaviorRule, val: any) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const handleWeightChange = (key: keyof DriverSafetyScoreConfig['weights'], val: number) => {
    setConfig((prev) => ({
      ...prev,
      weights: {
        ...prev.weights,
        [key]: val,
      },
    }));
  };

  const handleSaveAll = () => {
    rules.forEach((r) => {
      behaviorStore.updateRule(r.id, r);
    });
    driverSafetyScoreService.setConfig(config);
    if (onSaved) onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pengaturan Rule & Ambang Batas Behavior Engine</h3>
              <p className="text-xs text-slate-400">Konfigurasi threshold insiden, durasi minimum, dan bobot skor keselamatan</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/30 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'rules' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="h-4 w-4" /> Detection Threshold Rules ({rules.length})
          </button>
          <button
            onClick={() => setActiveTab('weights')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'weights' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="h-4 w-4" /> Bobot Safety Score (Weights)
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'rules' && (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{rule.eventType.replace('_', ' ')}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {rule.severity}
                      </span>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() => handleRuleToggle(rule.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>

                  <p className="text-xs text-slate-400">{rule.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">Threshold Ambang Batas:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={rule.threshold}
                        onChange={(e) => handleRuleChange(rule.id, 'threshold', parseFloat(e.target.value) || 0)}
                        className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">Min Duration (detik):</label>
                      <input
                        type="number"
                        value={rule.duration}
                        onChange={(e) => handleRuleChange(rule.id, 'duration', parseInt(e.target.value) || 0)}
                        className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">Tingkat Severity:</label>
                      <select
                        value={rule.severity}
                        onChange={(e) => handleRuleChange(rule.id, 'severity', e.target.value as any)}
                        className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-cyan-500"
                      >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="CRITICAL">CRITICAL</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'weights' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Distribusi Bobot Penilaian Safety Score (Total: 100%)
                </h4>

                {Object.entries(config.weights).map(([k, val]) => (
                  <div key={k} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-mono text-cyan-400 font-bold">{Math.round(val * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.5"
                      step="0.05"
                      value={val}
                      onChange={(e) => handleWeightChange(k as any, parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 bg-slate-950/60">
          <span className="text-xs text-slate-400">* Perubahan rule berlaku otomatis pada telemetri selanjutnya</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              onClick={handleSaveAll}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 shadow-md shadow-cyan-950 flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" /> Simpan Konfigurasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
