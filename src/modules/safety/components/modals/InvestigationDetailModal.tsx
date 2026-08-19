/**
 * Investigation Detail & Workflow Modal
 * Supports 8-step pipeline, 5 Why, Fishbone Analysis, and AI Root Cause Assistant
 * PROMPT 22 Architecture
 */

import React, { useState } from 'react';
import { Investigation, RootCauseAnalysis, InvestigationStatus } from '../../types';
import { mockRootCauses } from '../../data/mockSafetyData';
import {
  X,
  ShieldCheck,
  Search,
  Users,
  FileText,
  Sparkles,
  GitCommit,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface InvestigationDetailModalProps {
  investigation: Investigation;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: InvestigationStatus) => void;
  onCreateCAPA: (investigation: Investigation) => void;
}

export const InvestigationDetailModal: React.FC<InvestigationDetailModalProps> = ({
  investigation,
  onClose,
  onUpdateStatus,
  onCreateCAPA
}) => {
  const [activeTab, setActiveTab] = useState<'workflow' | '5why' | 'fishbone' | 'team'>('workflow');
  const [rca, setRca] = useState<RootCauseAnalysis>(
    mockRootCauses[investigation.id] || {
      id: `rca-${Math.random()}`,
      investigationId: investigation.id,
      why1: 'Mengapa armada melakukan pengereman keras? Karena antrean tol melambat mendadak.',
      why2: 'Mengapa jarak henti terlalu dekat? Kecepatan armada 68 km/jam saat kondisi hujan lebat.',
      why3: 'Mengapa driver tidak memperlambat sejak awal? Pandangan terhalang cipratan air hujan & jarak iring terlalu rapat.',
      why4: 'Mengapa memacu kecepatan saat hujan? Terburu-buru mengejar target estimasi tiba (ETA).',
      why5: 'Mengapa jadwal sangat ketat? Penjadwalan sistem belum menyertakan buffer faktor cuaca hujan.',
      fishbone: {
        people: ['Driver terburu-buru mengejar ETA', 'Kurang kewaspadaan di hujan lebat'],
        vehicle: ['Ban aus 60%', 'Sensor pengereman ABS butuh kalibrasi'],
        equipment: ['Wiper kaca depan kendor'],
        environment: ['Hujan deras (60mm/jam)', 'Jalanan licin'],
        process: ['SOP jarak iring di hujan deras belum optimal'],
        management: ['Jadwal pengiriman sangat ketat'],
        road: ['Aspal tol licin'],
        weather: ['Hujan deras & pandangan terbatas'],
      },
      contributingFactors: ['High Speed in Wet Condition', 'Small Following Distance', 'Strict ETA Schedule'],
      investigatorConfirmed: true,
    }
  );

  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

  const steps: { status: InvestigationStatus; label: string }[] = [
    { status: 'REPORTED', label: '1. Laporkan' },
    { status: 'INVESTIGATION', label: '2. Tim Penyelidik' },
    { status: 'EVIDENCE', label: '3. Bukti Telemetri' },
    { status: 'ANALYSIS', label: '4. Analisis Data' },
    { status: 'ROOT_CAUSE', label: '5. Root Cause (5-Why)' },
    { status: 'CORRECTIVE_ACTION', label: '6. Tindakan CAPA' },
    { status: 'VERIFICATION', label: '7. Verifikasi' },
    { status: 'CLOSED', label: '8. Selesai (Closed)' },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === investigation.status);

  const handleTriggerAiAnalysis = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setAiGenerating(false);
      setAiAnalysisResult(
        'AI Finding: Kombinasi telemetri pengereman (2.1s decelerate) dan cuaca hujan deras mengindikasikan faktor kontribusi terbesar adalah jarak iring rapat (<20m) pada kecepatan 68 km/jam. Direkomendasikan evaluasi aturan jarak aman & pelatihan defensive driving.'
      );
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 shadow-2xl space-y-5 my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">{investigation.investigationNumber}</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-bold">
                  {investigation.caseNumber}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">{investigation.summary}</h2>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Visual Workflow Pipeline Steps */}
        <div className="overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
          <div className="flex items-center justify-between min-w-[650px] px-2">
            {steps.map((step, idx) => {
              const isPassed = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={step.status}
                  onClick={() => onUpdateStatus(investigation.id, step.status)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isPassed
                        ? 'bg-emerald-500 text-slate-950'
                        : isCurrent
                        ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] font-semibold mt-1 whitespace-nowrap ${
                      isCurrent ? 'text-cyan-300' : isPassed ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'workflow' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Ringkasan & Temuan
          </button>
          <button
            onClick={() => setActiveTab('5why')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === '5why' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Analisis 5-Why
          </button>
          <button
            onClick={() => setActiveTab('fishbone')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'fishbone' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Diagram Fishbone
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'team' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Tim Penyelidik ({investigation.teamMembers.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-4 text-xs">
          {activeTab === 'workflow' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                  <p className="text-slate-400 font-semibold text-[11px] uppercase">Ketua Penyelidik (Lead Investigator)</p>
                  <p className="text-sm font-bold text-white">{investigation.leadInvestigatorName}</p>
                  <p className="text-[11px] text-slate-400">Target Penyelesaian: {new Date(investigation.targetDate).toLocaleDateString('id-ID')}</p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                  <p className="text-slate-400 font-semibold text-[11px] uppercase">Status Investigasi Saat Ini</p>
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {investigation.status}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">Dibuat: {new Date(investigation.createdAt).toLocaleString('id-ID')}</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                <p className="text-slate-400 font-semibold text-[11px] uppercase">Temuan Investigasi (Findings)</p>
                <p className="text-white leading-relaxed">{investigation.findings}</p>
              </div>

              {/* Fatigue Context Panel (PROMPT 23 Integration) */}
              <div className="rounded-xl bg-indigo-950/20 border border-indigo-500/30 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                      FATIGUE CONTEXT (PROMPT 23)
                    </span>
                    <span className="text-xs font-bold text-white">Profil Kelelahan Pengemudi Sebelum Insiden</span>
                  </div>
                  <span className="text-xs font-bold text-rose-400">Fatigue Score: 52/100 (HIGH RISK)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">Continuous Driving</span>
                    <span className="font-bold text-rose-400">5.8 Jam Non-stop</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">Terakhir Istirahat</span>
                    <span className="font-bold text-amber-400">5.5 Jam (Kurang Req)</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">Shift & Window</span>
                    <span className="font-bold text-indigo-300">Night Shift (22:00-06:00)</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">Night Exposure</span>
                    <span className="font-bold text-indigo-400">3.8 Jam Malam</span>
                  </div>
                </div>
              </div>

              {/* AI Assistant Generator Panel */}
              <div className="rounded-xl bg-cyan-950/30 border border-cyan-500/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    <span className="font-bold text-cyan-300">AI Safety Investigator Assistant</span>
                  </div>
                  <button
                    onClick={handleTriggerAiAnalysis}
                    disabled={aiGenerating}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 disabled:opacity-50 text-[11px]"
                  >
                    {aiGenerating ? 'Menganalisis Telemetri...' : 'Analisis AI Root Cause'}
                  </button>
                </div>
                {aiAnalysisResult && (
                  <div className="p-3 bg-slate-950 rounded-lg border border-cyan-500/20 text-cyan-200 text-xs">
                    {aiAnalysisResult}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === '5why' && (
            <div className="space-y-3">
              <p className="text-slate-400 text-[11px]">
                Metode 5-Why digunakan untuk menggali akar masalah utama dengan menanyakan penyebab hingga 5 tingkatan beruntun:
              </p>
              {[
                { label: 'Why 1 (Gejala Awal)', value: rca.why1 },
                { label: 'Why 2 (Sebab Langsung)', value: rca.why2 },
                { label: 'Why 3 (Faktor Kontribusi)', value: rca.why3 },
                { label: 'Why 4 (Penyebab Operasional)', value: rca.why4 },
                { label: 'Why 5 (Akar Masalah Utama)', value: rca.why5 },
              ].map((w, idx) => (
                <div key={idx} className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex gap-3 items-start">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[11px]">
                    {idx + 1}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{w.label}</p>
                    <p className="text-white font-medium">{w.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'fishbone' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(rca.fishbone).map(([catKey, items]) => (
                <div key={catKey} className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1.5">
                  <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{catKey}</p>
                  <ul className="space-y-1">
                    {(items as string[]).map((it, i) => (
                      <li key={i} className="text-slate-300 text-[11px] list-disc list-inside">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-3">
              <p className="text-slate-400 text-[11px]">Daftar anggota tim investigasi keselamatan yang ditunjuk:</p>
              <div className="space-y-2">
                {investigation.teamMembers.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-cyan-400 font-bold text-xs">
                        {m.userName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white">{m.userName}</p>
                        <p className="text-[10px] text-slate-400">ID User: {m.userId}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={() => onCreateCAPA(investigation)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-950"
          >
            <GitCommit className="h-4 w-4" />
            <span>+ Buat Tindakan CAPA</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
