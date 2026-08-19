/**
 * Fleet Intelligence Smart AI - Service Management & Templates Tab
 * PROMPT 25 - Service Records & Standardized Service Templates
 */

import React, { useState } from 'react';
import {
  Wrench,
  BookOpen,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  FileText,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { MOCK_SERVICE_TEMPLATES, MOCK_VEHICLE_HEALTH } from '../../data/mockMaintenanceData';
import { ServiceTemplate } from '../../types';

interface ServiceTabProps {
  onSelectTemplate?: (template: ServiceTemplate) => void;
}

export const ServiceTab: React.FC<ServiceTabProps> = ({ onSelectTemplate }) => {
  const [activeSubTab, setActiveSubTab] = useState<'templates' | 'records'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<ServiceTemplate>(MOCK_SERVICE_TEMPLATES[0]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Wrench className="h-5 w-5 text-cyan-400" />
            Manajemen Servis & Template SOP Pemeliharaan
          </h2>
          <p className="text-xs text-slate-400">
            Katalog template SOP servis berkala lengkap dengan checklist item inspeksi, rekomendasi spare part, estimasi durasi, dan biaya standar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveSubTab('templates')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'templates' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Template SOP Servis
            </button>
            <button
              onClick={() => setActiveSubTab('records')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'records' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Riwayat Servis Selesai
            </button>
          </div>

          <button className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/30">
            <Plus className="h-4 w-4" />
            <span>Buat Template Baru</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Templates Master List */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Daftar Template SOP Servis
            </span>
            {MOCK_SERVICE_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedTemplate.id === tmpl.id
                    ? 'bg-cyan-950/30 border-cyan-500/50 shadow-lg shadow-cyan-950'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-bold text-white leading-tight">{tmpl.name}</h3>
                  <span className="text-[10px] bg-slate-950 text-cyan-400 px-2 py-0.5 rounded border border-slate-800 font-mono font-bold">
                    {tmpl.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Interval: <strong>{tmpl.intervalKm.toLocaleString()} KM</strong></span>
                  <span>Est. Biaya: <strong className="text-emerald-400">Rp {(tmpl.estimatedCost / 1000).toLocaleString()}k</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Template Details & Checklist */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase font-mono font-bold tracking-wider">
                  Detail Template SOP
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedTemplate.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/50 text-xs font-bold">
                  Rp {selectedTemplate.estimatedCost.toLocaleString('id-ID')}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-xs font-medium flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  {selectedTemplate.estimatedDurationHours} Jam
                </span>
              </div>
            </div>

            {/* Triggers & Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Interval Odometer</span>
                <span className="font-bold text-white text-sm">{selectedTemplate.intervalKm.toLocaleString()} KM</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Interval Waktu Operasi</span>
                <span className="font-bold text-white text-sm">{selectedTemplate.intervalMonths} Bulan</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Interval Jam Mesin</span>
                <span className="font-bold text-white text-sm">{selectedTemplate.intervalEngineHours} Jam Kerja</span>
              </div>
            </div>

            {/* Inspection Checklist Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Checklist Pekerjaan Teknisi Standar SOP
              </h4>
              <div className="space-y-2">
                {selectedTemplate.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center gap-3 text-xs text-slate-200 font-medium"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Spare Parts */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Rekomendasi Suku Cadang & Pelumas
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.recommendedParts.map((part, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 font-semibold"
                  >
                    {part}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'records' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white">Log Servis Selesai & Invoice</h3>
          <div className="divide-y divide-slate-800 text-xs text-slate-300">
            <div className="py-3 flex justify-between items-center">
              <div>
                <span className="font-bold text-white">B 9211 TJP - Servis Berkala 10.000 KM</span>
                <p className="text-[10px] text-slate-400">Bengkel Pusat Cakung | Teknisi: Agus Pratama | Tgl: 2026-07-28</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-400">Rp 1.850.000</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded block mt-0.5">INV-2026-078</span>
              </div>
            </div>
            <div className="py-3 flex justify-between items-center">
              <div>
                <span className="font-bold text-white">B 9488 UIK - Penggantian Aki 24V & Kelistrikan</span>
                <p className="text-[10px] text-slate-400">PT Mandiri Diesel Auto | Teknisi: Dedi Kurniawan | Tgl: 2026-08-05</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-400">Rp 3.400.000</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded block mt-0.5">INV-2026-082</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
