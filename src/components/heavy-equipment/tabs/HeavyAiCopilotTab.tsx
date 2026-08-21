import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Brain, 
  Bot, 
  User, 
  HardHat, 
  Truck, 
  Fuel, 
  Activity, 
  AlertTriangle,
  Lightbulb,
  FileText,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { heavyEquipmentService } from '../../../modules/heavy-equipment/services/heavyEquipmentService';
import { AIDailyProjectBriefing } from '../../../modules/heavy-equipment/types';

export const HeavyAiCopilotTab: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Halo! Saya adalah **AI Heavy Equipment & Mining Fleet Copilot**.
Saya memonitor telematika sensor, Physical Availability (PA/UA), jam kerja Hour Meter (HM), efisiensi konsumsi solar (L/HM), serta kepatuhan P2H K3 tambang.

Anda bisa menanyakan pertanyaan operasional seperti:
• *"Berapa alat yang sedang bekerja?"*
• *"Alat mana paling banyak idle?"*
• *"Excavator mana paling boros?"*
• *"Alat mana yang harus service?"*
• *"Project mana paling banyak menggunakan BBM?"*
• *"Equipment mana paling mahal?"*
• *"Kenapa downtime meningkat?"*
• *"Operator mana paling berisiko?"*
• *"Berapa utilization fleet alat berat?"*`,
      time: '08:00'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [briefing, setBriefing] = useState<AIDailyProjectBriefing | null>(null);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    const aiAnswer = heavyEquipmentService.askHeavyEquipmentAi(q);
    const aiMsg = {
      sender: 'ai' as const,
      text: aiAnswer,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    if (!textToSend) setInputQuery('');
  };

  const handleGenerateBriefing = () => {
    const data = heavyEquipmentService.getDailyProjectBriefing();
    setBriefing(data);
  };

  const quickPrompts = [
    'Berapa alat yang sedang bekerja?',
    'Alat mana paling banyak idle?',
    'Excavator mana paling boros?',
    'Alat mana yang harus service?',
    'Project mana paling banyak menggunakan BBM?',
    'Equipment mana paling mahal?',
    'Kenapa downtime meningkat?',
    'Operator mana paling berisiko?',
    'Berapa utilization fleet alat berat?'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            AI Heavy Equipment Fleet Copilot & Predictive Analytics
          </h3>
          <p className="text-xs text-slate-500">
            Asisten cerdas analisis telematika mesin, optimasi fleet matching excavator-dump truck, dan deteksi anomali hidrolik/solar.
          </p>
        </div>

        <button
          onClick={handleGenerateBriefing}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <FileText className="w-4 h-4" />
          Generate Daily Executive Briefing
        </button>
      </div>

      {/* Daily Project Briefing Output Card if Generated */}
      {briefing && (
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-xl space-y-4 animate-fade-in text-white">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-sm text-amber-300">
                AI Daily Executive Briefing — {briefing.projectName}
              </h4>
            </div>
            <span className="text-xs text-slate-400 font-mono">{briefing.date}</span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60">
            {briefing.executiveSummary}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block">Unit Bekerja Aktif</span>
              <span className="text-base font-black text-emerald-400">{briefing.workingCount} Unit</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block">Unit Idle / Standby</span>
              <span className="text-base font-black text-amber-400">{briefing.idleCount} Unit</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block">Konsumsi Solar Total</span>
              <span className="text-base font-black text-blue-400">{(briefing.totalFuelConsumedLiters / 1000).toFixed(1)}k Liter</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block">Volume Galian BCM</span>
              <span className="text-base font-black text-purple-400">{(briefing.totalVolumeAchievedBcm / 1000000).toFixed(2)}M BCM</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="font-bold text-amber-400 block flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Identifikasi Risiko Operasional
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {briefing.risksIdentified.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700">
              <span className="font-bold text-emerald-400 block flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Rekomendasi Tindakan Mandor & PM
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {briefing.recommendations.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-bold whitespace-nowrap">💡 Prompt Cepat:</span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-300 font-medium hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all text-xs"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Message stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div 
              key={idx}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === 'ai'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-white'
              }`}>
                {m.sender === 'ai' ? <Brain className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-1 shadow-sm leading-relaxed ${
                m.sender === 'ai'
                  ? 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200'
                  : 'bg-amber-500 text-slate-950 font-medium'
              }`}>
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div className={`text-[10px] text-right ${m.sender === 'ai' ? 'text-slate-400' : 'text-slate-900'}`}>
                  {m.time} WIB
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input 
            type="text"
            placeholder="Tanyakan analisis fleet alat berat, efisiensi solar, atau jadwal servis..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
          <button
            onClick={() => handleSend()}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};
