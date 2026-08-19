/**
 * Fleet Intelligence Smart AI - Executive Modals & Interactive Overlays
 * PROMPT 38 - Morning Daily Briefing, Ask AI Executive Chat, Score Weight Tuner, Audit Explainer & Decision Delegator
 */

import React, { useState } from 'react';
import { useExecutive } from '../context/ExecutiveContext';
import { useFleet } from '../../../context/FleetContext';
import { useAuth } from '../../../context/AuthContext';
import {
  X,
  Sparkles,
  Sun,
  ShieldCheck,
  DollarSign,
  Send,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  Building2,
  UserCheck,
  Clock,
  ArrowRight,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { ExecutiveAIIntelligenceEngine } from '../engines/ExecutiveAIIntelligenceEngine';
import { ExecutiveScoreWeights } from '../types';

export const ExecutiveModals: React.FC = () => {
  const {
    isBriefingModalOpen,
    setIsBriefingModalOpen,
    isAskAiModalOpen,
    setIsAskAiModalOpen,
    isScoreConfigModalOpen,
    setIsScoreConfigModalOpen,
    selectedInsightForExplanation,
    setSelectedInsightForExplanation,
    selectedDecisionForAction,
    setSelectedDecisionForAction,
    dailyBriefing,
    scoreResult,
    weights,
    setWeights,
    resetWeights,
    efficiency,
    cost,
    safety,
    fuel,
    maintenance,
    handleCreateDecisionTask,
  } = useExecutive();

  // Ask AI State
  const [askQuery, setAskQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Selamat datang di Executive AI Copilot. Anda dapat menanyakan kondisi fleet hari ini, rincian biaya tak terduga, 5 kendaraan termahal, atau rekomendasi efisiensi rute.',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Score weights local state
  const [localWeights, setLocalWeights] = useState<ExecutiveScoreWeights>({ ...weights });

  // Task note local state
  const [taskNote, setTaskNote] = useState('');
  const [assignedPic, setAssignedPic] = useState('');

  const quickQuestions = [
    'Bagaimana kondisi fleet saya hari ini?',
    'Kenapa biaya operasional naik bulan ini?',
    'Tampilkan 5 kendaraan dengan biaya operasional tertinggi',
    'Berapa potensi penghematan BBM yang bisa dicapai?',
    'Siapa saja pengemudi yang butuh coaching safety?',
    'Bagaimana performa Cabang Jakarta dibanding cabang lain?',
  ];

  const handleSendQuestion = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: queryText,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setAskQuery('');
    setIsAiTyping(true);

    setTimeout(() => {
      const aiResponseText = ExecutiveAIIntelligenceEngine.answerExecutiveQuestion(queryText, {
        score: scoreResult,
        efficiency,
        cost,
        safety,
        fuel,
        maintenance,
      });

      const aiMsg = {
        sender: 'ai' as const,
        text: aiResponseText,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory((prev) => [...prev, aiMsg]);
      setIsAiTyping(false);
    }, 600);
  };

  const handleSaveWeights = () => {
    setWeights(localWeights);
    setIsScoreConfigModalOpen(false);
  };

  const formatIdr = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID');

  return (
    <>
      {/* 1. Daily Morning Briefing Modal */}
      {isBriefingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl">
                  <Sun className="w-6 h-6 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    Executive Morning Briefing
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {dailyBriefing.date}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">{dailyBriefing.greeting}</p>
                </div>
              </div>
              <button
                onClick={() => setIsBriefingModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Snapshot Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-xs text-slate-400 block">Ketersediaan Armada</span>
                  <span className="text-xl font-black text-emerald-400">{dailyBriefing.availabilityPct}%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-xs text-slate-400 block">TOC Berjalan</span>
                  <span className="text-sm font-black text-white">{formatIdr(dailyBriefing.totalOperatingCostIdr)}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-xs text-slate-400 block">Ritase Aktif</span>
                  <span className="text-xl font-black text-blue-400">{dailyBriefing.keyMetricsSummary.ongoingTrips} Trips</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-xs text-slate-400 block">Overdue Service</span>
                  <span className="text-xl font-black text-rose-400">{dailyBriefing.maintenanceDueCount} Unit</span>
                </div>
              </div>

              {/* Priority Attention Block */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 to-slate-800 border border-red-500/30">
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <AlertOctagon className="w-4 h-4" />
                  <span>Fokus Perhatian Pagi Ini</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100 mb-1">{dailyBriefing.topPriorityTitle}</h4>
                <p className="text-xs text-slate-300 mb-2">{dailyBriefing.topPriorityAction}</p>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-red-500/20 text-xs text-amber-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Rekomendasi AI: </strong>
                    {dailyBriefing.aiRecommendation}
                  </span>
                </div>
              </div>

              {/* Quick Status Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Status Ringkas Multi-Pilar
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                  <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                    <span>Keselamatan & Safety Score:</span>
                    <span className="font-bold text-emerald-400">93.8/100 (Zero Accident)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                    <span>Efisiensi BBM Armada:</span>
                    <span className="font-bold text-blue-400">4.12 KM/L (Terkendali)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex justify-end gap-2 bg-slate-900/80">
              <button
                onClick={() => setIsBriefingModalOpen(false)}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md"
              >
                Tutup & Lanjutkan ke Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Ask AI Executive Assistant Modal */}
      {isAskAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-3xl h-[85vh] shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Executive AI Copilot
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Grounded in Live Telematics & ERP
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Tanyakan apapun seputar performa bisnis dan operasional armada</p>
                </div>
              </div>
              <button
                onClick={() => setIsAskAiModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Questions Chips */}
            <div className="p-3 bg-slate-950/50 border-b border-slate-800 overflow-x-auto flex items-center gap-2 scrollbar-none">
              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Pertanyaan Populer:</span>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuestion(q)}
                  className="px-2.5 py-1 text-xs rounded-full bg-slate-800 hover:bg-blue-600/30 hover:border-blue-400/50 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                        : 'bg-slate-800/90 text-slate-100 rounded-tl-none border border-slate-700/60 shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <div
                      className={`text-[10px] mt-1.5 text-right ${
                        msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 flex-shrink-0 font-bold text-xs">
                      EX
                    </div>
                  )}
                </div>
              ))}

              {isAiTyping && (
                <div className="flex items-center gap-2 text-xs text-blue-400 p-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>AI sedang menyusun ringkasan eksekutif...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuestion(askQuery);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={askQuery}
                  onChange={(e) => setAskQuery(e.target.value)}
                  placeholder="Ketik pertanyaan untuk AI Executive Copilot (misal: analisis biaya BBM)..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!askQuery.trim() || isAiTyping}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. Executive Score Weights Configuration Modal */}
      {isScoreConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Konfigurasi Bobot Skor Eksekutif</h3>
                  <p className="text-xs text-slate-500">Sesuaikan prioritas bisnis pilar operasional & finansial</p>
                </div>
              </div>
              <button
                onClick={() => setIsScoreConfigModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sliders */}
            <div className="py-5 space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>1. Ketersediaan & Utilisasi Armada</span>
                  <span className="text-blue-600">{Math.round(localWeights.efficiency * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.40"
                  step="0.05"
                  value={localWeights.efficiency}
                  onChange={(e) =>
                    setLocalWeights({ ...localWeights, efficiency: parseFloat(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>2. Efisiensi Biaya Operasional (TOC)</span>
                  <span className="text-emerald-600">{Math.round(localWeights.cost * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.40"
                  step="0.05"
                  value={localWeights.cost}
                  onChange={(e) =>
                    setLocalWeights({ ...localWeights, cost: parseFloat(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>3. Produktivitas Ritase & Muatan</span>
                  <span className="text-purple-600">{Math.round(localWeights.productivity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.40"
                  step="0.05"
                  value={localWeights.productivity}
                  onChange={(e) =>
                    setLocalWeights({ ...localWeights, productivity: parseFloat(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>4. Keselamatan & Kepatuhan Pengemudi</span>
                  <span className="text-indigo-600">{Math.round(localWeights.safety * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.40"
                  step="0.05"
                  value={localWeights.safety}
                  onChange={(e) =>
                    setLocalWeights({ ...localWeights, safety: parseFloat(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>5. Efisiensi & Keamanan BBM</span>
                  <span className="text-amber-600">{Math.round(localWeights.fuel * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.40"
                  step="0.05"
                  value={localWeights.fuel}
                  onChange={(e) =>
                    setLocalWeights({ ...localWeights, fuel: parseFloat(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>6. Kepatuhan Pemeliharaan (Preventive)</span>
                  <span className="text-rose-600">{Math.round(localWeights.maintenance * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.40"
                  step="0.05"
                  value={localWeights.maintenance}
                  onChange={(e) =>
                    setLocalWeights({ ...localWeights, maintenance: parseFloat(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  resetWeights();
                  setIsScoreConfigModalOpen(false);
                }}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsScoreConfigModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveWeights}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                  Terapkan Bobot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. AI Insight Audit & Explanation Modal */}
      {selectedInsightForExplanation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Bukti & Dasar Analisis AI</h3>
                  <p className="text-xs text-slate-500">Transparansi audit data dan formula perhitungan keputusan</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInsightForExplanation(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 text-sm block mb-1">
                  {selectedInsightForExplanation.title}
                </span>
                <p className="text-slate-600 leading-relaxed">{selectedInsightForExplanation.description}</p>
              </div>

              <div>
                <span className="font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Bukti Data Telematika (Audit Evidence):
                </span>
                <div className="space-y-1.5">
                  {selectedInsightForExplanation.evidence.map((ev, i) => (
                    <div key={i} className="flex items-start gap-2 bg-blue-50/60 p-2 rounded-lg text-slate-700 border border-blue-100">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-500 block mb-1">Metode Perhitungan:</span>
                  <p className="text-slate-800">{selectedInsightForExplanation.calculationMethod}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-500 block mb-1">Sumber Data:</span>
                  <p className="text-slate-800">{selectedInsightForExplanation.dataSources.join(' • ')}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedInsightForExplanation(null)}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Decision Task Delegator Modal */}
      {selectedDecisionForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Delegasikan Tindakan Eksekutif</h3>
                  <p className="text-xs text-slate-500">Kirim instruksi langsung ke Manajer / Kepala Cabang</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDecisionForAction(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">{selectedDecisionForAction.title}</span>
                <p className="text-slate-600">{selectedDecisionForAction.recommendation}</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Penerima Tugas (PIC):</label>
                <input
                  type="text"
                  defaultValue={selectedDecisionForAction.assignedOwner}
                  onChange={(e) => setAssignedPic(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Catatan Tambahan Direksi:</label>
                <textarea
                  rows={3}
                  value={taskNote}
                  onChange={(e) => setTaskNote(e.target.value)}
                  placeholder="Instruksikan target penyelesaian maksimal 24 jam..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedDecisionForAction(null)}
                className="px-3 py-2 text-xs font-semibold text-slate-600"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  handleCreateDecisionTask(selectedDecisionForAction.id, taskNote);
                  setSelectedDecisionForAction(null);
                  alert(`Instruksi tindakan resmi berhasil didelegasikan.`);
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-md"
              >
                Kirim Instruksi Resmi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
