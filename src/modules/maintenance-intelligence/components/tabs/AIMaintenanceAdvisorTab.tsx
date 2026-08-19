/**
 * Fleet Intelligence Smart AI - AI Maintenance Advisor Tab
 * Interactive conversational AI Copilot specialized in telematics diagnosis,
 * component failure reasoning, service interval planning, and workshop cost optimization.
 */

import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Wrench, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react';
import { VehicleMaintenanceProfile } from '../../types';

interface AIMaintenanceAdvisorTabProps {
  profiles: VehicleMaintenanceProfile[];
  onSelectVehicle: (profile: VehicleMaintenanceProfile) => void;
}

interface ChatMessage {
  id: string;
  sender: 'AI' | 'USER';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    vehicleId: string;
  };
}

export const AIMaintenanceAdvisorTab: React.FC<AIMaintenanceAdvisorTabProps> = ({
  profiles,
  onSelectVehicle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'AI',
      text: 'Halo! Saya AI Maintenance Advisor armada Anda. Saya memantau data telemetri 24V, kode DTC, checklist inspeksi, dan jadwal servis berkala secara real-time. Ada yang bisa saya bantu analisis hari ini?',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'USER',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = 'Saya telah menganalisis parameter telemetri armada Anda. Semua metrik berada dalam batas toleransi normal.';
      let suggestedAction: { label: string; vehicleId: string } | undefined;

      const lower = textToSend.toLowerCase();
      if (lower.includes('kritis') || lower.includes('rusak') || lower.includes('risiko') || lower.includes('high risk')) {
        aiResponse = 'Berdasarkan model AI Predictive Maintenance, terdapat 2 kendaraan dengan skor risiko kritis: **B 9778 ZXC** (Risiko 88/100, overheating coolant 104°C & kampas rem aus) dan **B 9301 KLP** (Risiko 78/100, voltase aki 23.4V & servis oli terlewat 1.400 KM). Direkomendasikan segera masuk antrean bengkel P1.';
        suggestedAction = { label: 'Periksa Unit B 9778 ZXC', vehicleId: 'v-04' };
      } else if (lower.includes('baterai') || lower.includes('aki') || lower.includes('voltage')) {
        aiResponse = 'Unit **B 9301 KLP** dan **B 9778 ZXC** mengalami penurunan voltase alternator & aki hingga 23.2V-23.4V (Ambang normal 24V). Terdeteksi anomali perbaikan berulang dalam 90 hari terakhir. Dugaan kuat terdapat arus bocor atau alternator lemah.';
        suggestedAction = { label: 'Lihat Detail B 9301 KLP', vehicleId: 'v-01' };
      } else if (lower.includes('oli') || lower.includes('servis berkala') || lower.includes('overdue')) {
        aiResponse = 'Terdapat 2 kendaraan yang telah melewati batas kilometer servis oli mesin: **B 9778 ZXC** (terlewat +2.800 KM) dan **B 9301 KLP** (terlewat +1.400 KM). Keterlambatan ini berisiko menaikkan friksi mesin dan konsumsi BBM hingga ~12%.';
      } else if (lower.includes('biaya') || lower.includes('cost') || lower.includes('anggaran')) {
        aiResponse = 'Rata-rata biaya pemeliharaan armada saat ini adalah **Rp 145/km** (Total YTD Rp 134.150.000). Pengeluaran terbesar didominasi oleh perbaikan Mesin & Pelumasan (32%) dan Penggantian Ban (24%). Biaya downtime bengkel mencapai Rp 28.500.000.';
      }

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'AI',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        suggestedAction,
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const quickPrompts = [
    'Tampilkan kendaraan dengan risiko kerusakan kritis hari ini',
    'Mengapa aki unit B 9301 KLP cepat drop?',
    'Daftar unit yang jadwal servis berkala olinya terlewat',
    'Analisis efisiensi biaya pemeliharaan armada bulan ini',
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">AI Maintenance Diagnostics Advisor</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Active Copilot
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Asisten percakapan cerdas yang mengkorelasikan telemetri sensor, DTC, inspeksi, dan work order
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 h-[520px] flex flex-col overflow-hidden">
        {/* Messages list */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'USER' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                msg.sender === 'AI'
                  ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                  : 'bg-slate-800 text-slate-200'
              }`}>
                {msg.sender === 'AI' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              <div className={`space-y-1.5 max-w-xl text-xs leading-relaxed ${
                msg.sender === 'USER'
                  ? 'bg-cyan-600 text-white p-3.5 rounded-2xl rounded-tr-none'
                  : 'bg-slate-950 text-slate-200 p-4 rounded-2xl rounded-tl-none border border-slate-800'
              }`}>
                <p>{msg.text}</p>
                {msg.suggestedAction && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => {
                        const p = profiles.find(pr => pr.vehicleId === msg.suggestedAction!.vehicleId);
                        if (p) onSelectVehicle(p);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition-colors"
                    >
                      {msg.suggestedAction.label} →
                    </button>
                  </div>
                )}
                <span className="text-[10px] text-slate-400 block text-right pt-0.5 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" />
              AI Maintenance Copilot sedang menganalisis data telemetri...
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="px-3 py-1 text-[11px] rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 whitespace-nowrap transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
          <input
            type="text"
            placeholder="Tanyakan analisis kesehatan armada atau diagnosis kerusakan..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => handleSend()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
