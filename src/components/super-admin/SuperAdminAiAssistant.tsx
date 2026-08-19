/**
 * Fleet Intelligence Smart AI - Super Admin AI Platform Assistant Copilot (Prompt 42)
 * Executive AI querying interface for platform metrics, anomaly investigations,
 * tenant analytics, and strategic SaaS forecasting.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  Building2,
  DollarSign,
  Radio,
  ShieldAlert,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { superAdminService } from '../../services/superAdminService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const SuperAdminAiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'ai',
      text: `Halo Super Administrator! 🚀
Saya adalah **Fleet Platform AI Copilot**. Anda dapat menanyakan ringkasan status operasional seluruh tenant, tren MRR finansial, analisis konsumsi token AI, kesehatan microservice cluster, atau investigasi anomali GPS telematika.

Pilih salah satu pertanyaan kilat di bawah atau ketik kueri Anda.`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    'Perusahaan mana yang kuota armadanya hampir habis (>75%)?',
    'Ringkas laporan finansial SaaS dan MRR bulan ini',
    'Bagaimana performa hardware GPS & tingkat packet drop?',
    'Cek status kepatuhan keamanan & penegakan 2FA',
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      const response = await superAdminService.queryPlatformCopilot(textToSend);
      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: response,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg: ChatMessage = {
        id: 'ai-err-' + Date.now(),
        sender: 'ai',
        text: 'Maaf, terjadi kendala saat memproses kueri platform. Silakan coba kembali.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'msg-0',
        sender: 'ai',
        text: 'Riwayat percakapan telah direset. Silakan tanyakan informasi ekosistem platform yang Anda butuhkan.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Super Admin AI Platform Copilot</h2>
          </div>
          <p className="text-xs text-slate-400">
            Asisten analitik cerdas lintas tenant berbasis model Gemini 1.5 Pro multimodal.
          </p>
        </div>

        <button
          onClick={handleClearHistory}
          className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs text-slate-300 transition-colors border border-slate-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Sesi</span>
        </button>
      </div>

      {/* Quick Prompt Pills */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/20 px-3 py-1.5 text-xs font-medium text-purple-200 hover:bg-purple-900/40 hover:border-purple-400 transition-all text-left"
          >
            <Lightbulb className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 shadow-xl flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs leading-relaxed ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold shrink-0 shadow-md ${
                    isUser
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-purple-600 text-white'
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-md ${
                    isUser
                      ? 'bg-cyan-600/20 border border-cyan-500/40 text-cyan-50 rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                  <span className="text-[10px] text-slate-500 block text-right mt-2 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-purple-300 animate-pulse">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-slate-400">
                <span>Sedang menganalisis basis data ekosistem SaaS...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Tanyakan analisis platform atau investigasi metrik..."
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || isLoading}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-all shadow-lg shadow-purple-950 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
