/**
 * Fleet Intelligence Smart AI - Assistant Chat Drawer (Sections 49, 50, 74, 75)
 * Connected to AIService orchestrator, multi-provider execution, source evidence inspector,
 * and two-step action confirmation modal.
 */

import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import { aiService } from '../../services/ai/AIService';
import { AIResponse, AIActionProposal, AISourceCitation } from '../../types/ai';
import { AIActionConfirmModal } from '../../modules/ai/components/AIActionConfirmModal';
import { AISourceInspectorModal } from '../../modules/ai/components/AISourceInspectorModal';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Zap,
  Volume2,
  VolumeX,
  Database,
  ShieldAlert,
  Clock,
  ArrowRight,
  Cpu
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  responseMeta?: AIResponse;
}

export const AIDrawer: React.FC = () => {
  const { isAiDrawerOpen, setIsAiDrawerOpen, currentTenant, currentUser, vehicles, alerts, setActiveView } = useFleet();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

  // Modals state
  const [selectedAction, setSelectedAction] = useState<AIActionProposal | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const [selectedSources, setSelectedSources] = useState<AISourceCitation[] | null>(null);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: `Halo! Saya Fleet Intelligence AI Assistant untuk ${currentTenant.name}.\n\nSaya memantau telemetri armada real-time, mendeteksi anomali BBM, memprediksi kebutuhan maintenance, dan mengawasi keselamatan operasional. Ada yang bisa saya bantu hari ini?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  if (!isAiDrawerOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || prompt;
    if (!text.trim() || loading) return;

    const userMsgId = `msg-usr-${Date.now()}`;
    const userMsgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { id: userMsgId, sender: 'user', text, time: userMsgTime }]);
    if (!textToSend) setPrompt('');
    setLoading(true);

    try {
      const aiRes: AIResponse = await aiService.generate({
        tenantId: currentTenant.id,
        userId: currentUser?.id || 'usr-default',
        input: text,
        fleetData: {
          vehicles,
          alerts,
        },
      });

      const aiMsgId = `msg-ai-${Date.now()}`;
      const aiMsgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: 'assistant',
          text: aiRes.content,
          time: aiMsgTime,
          responseMeta: aiRes,
        },
      ]);
    } catch (err: any) {
      const errTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Maaf, terjadi kendala saat memproses telemetri armada. Silakan coba kembali.',
          time: errTime,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTTS = (msgId: string, text: string) => {
    if (activeAudioId === msgId) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setActiveAudioId(null);
    } else {
      setActiveAudioId(msgId);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 1.05;
        utterance.onend = () => setActiveAudioId(null);
        utterance.onerror = () => setActiveAudioId(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setActiveAudioId(null), 4000);
      }
    }
  };

  const samplePrompts = [
    'Mengapa konsumsi BBM armada Cikarang meningkat?',
    'Tampilkan kendaraan yang overspeed hari ini',
    'Rekomendasi jadwal pemeliharaan rem minggu ini',
    'Kandangkan kendaraan B 9821 UTX karena defek rem',
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
        <div className="flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-950 p-4 shadow-2xl sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-slate-950 shadow-md shadow-cyan-500/20 font-black">
                <Sparkles className="h-5 w-5 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white">Fleet Intelligence AI Assistant</h2>
                  <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[9px] font-bold text-indigo-300 border border-indigo-500/30">
                    Enterprise
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Gemini 2.5 Flash & Deterministic Telematics Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setActiveView('fleet_assistant');
                  setIsAiDrawerOpen(false);
                }}
                className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-cyan-400 hover:border-cyan-500 hover:bg-slate-800 transition-colors"
                title="Buka AI Fleet Assistant Layar Penuh"
              >
                <ArrowRight className="h-3 w-3" />
                <span className="hidden sm:inline">Layar Penuh</span>
              </button>
              <button
                onClick={() => setIsAiDrawerOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 text-xs leading-relaxed ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'assistant' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-md whitespace-pre-wrap space-y-2.5 ${
                    m.sender === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Assistant Extra Metadata & Actions */}
                  {m.sender === 'assistant' && m.responseMeta && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px]">
                      {/* Proposed Actions (2-Step Verification) */}
                      {m.responseMeta.actions && m.responseMeta.actions.length > 0 && (
                        <div className="rounded-xl bg-amber-950/30 border border-amber-500/30 p-2.5 space-y-2">
                          <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            <span>Tindakan Operasional yang Disarankan:</span>
                          </p>
                          {m.responseMeta.actions.map((act) => (
                            <div
                              key={act.id}
                              className="flex items-center justify-between gap-2 rounded-lg bg-slate-950/80 p-2 border border-slate-800"
                            >
                              <div>
                                <p className="font-bold text-white text-[11px]">{act.label || act.type}</p>
                                <p className="text-slate-400 text-[10px]">{act.description}</p>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedAction(act);
                                  setIsActionModalOpen(true);
                                }}
                                className="flex items-center gap-1 rounded bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-slate-950 hover:bg-amber-400 shrink-0 shadow transition-colors"
                              >
                                <span>Verifikasi & Eksekusi</span>
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Provider & Source Evidence Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <Cpu className="h-3 w-3 text-cyan-400" />
                          <span>{m.responseMeta.usage?.provider || 'Fleet AI Orchestrator'}</span>
                          <span className="text-slate-600">•</span>
                          <span>{m.responseMeta.usage?.latencyMs || 120}ms</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Sources button */}
                          {m.responseMeta.sources && m.responseMeta.sources.length > 0 && (
                            <button
                              onClick={() => {
                                setSelectedSources(m.responseMeta?.sources || []);
                                setIsSourceModalOpen(true);
                              }}
                              className="flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 hover:bg-slate-700 border border-slate-700 transition-colors"
                            >
                              <Database className="h-3 w-3" />
                              <span>Sumber ({m.responseMeta.sources.length})</span>
                            </button>
                          )}

                          {/* TTS button */}
                          <button
                            onClick={() => toggleTTS(m.id, m.text)}
                            className={`p-1 rounded transition-colors ${
                              activeAudioId === m.id
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'text-slate-400 hover:text-white'
                            }`}
                            title="Dengarkan Suara (TTS)"
                          >
                            {activeAudioId === m.id ? (
                              <VolumeX className="h-3.5 w-3.5 animate-pulse" />
                            ) : (
                              <Volume2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <span
                    className={`block text-[9px] font-semibold ${
                      m.sender === 'user' ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>

                {m.sender === 'user' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 mt-1">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse pl-2 py-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Fleet AI sedang memproses telemetri & konteks armada...</span>
              </div>
            )}
          </div>

          {/* Quick Sample Suggestions */}
          <div className="border-t border-slate-800/80 pt-3 mb-3">
            <p className="text-[10px] font-bold uppercase text-slate-500 mb-1.5">Saran Pertanyaan Cepat:</p>
            <div className="grid grid-cols-1 gap-1.5">
              {samplePrompts.map((sPrompt, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => handleSend(sPrompt)}
                  className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-900/60 p-2 text-left text-[11px] text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-all"
                >
                  <span className="line-clamp-1">{sPrompt}</span>
                  <ChevronRight className="h-3 w-3 text-slate-500 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 p-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanyakan analisis armada, BBM, pemeliharaan, atau driver..."
              className="flex-1 bg-transparent px-2 text-xs text-white placeholder-slate-500 outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !prompt.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 disabled:opacity-50 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {selectedAction && (
        <AIActionConfirmModal
          action={selectedAction}
          isOpen={isActionModalOpen}
          onClose={() => {
            setIsActionModalOpen(false);
            setSelectedAction(null);
          }}
          onSuccess={(res) => {
            const successMsgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages((prev) => [
              ...prev,
              {
                id: `msg-exec-${Date.now()}`,
                sender: 'assistant',
                text: `✅ ${res.message}`,
                time: successMsgTime,
              },
            ]);
          }}
        />
      )}

      {/* Source Citation Inspector Modal */}
      {selectedSources && (
        <AISourceInspectorModal
          sources={selectedSources}
          isOpen={isSourceModalOpen}
          onClose={() => {
            setIsSourceModalOpen(false);
            setSelectedSources(null);
          }}
          onNavigateModule={(routeLink) => {
            if (routeLink.includes('fuel')) setActiveView('fuel');
            else if (routeLink.includes('safety') || routeLink.includes('drivers')) setActiveView('safety');
            else if (routeLink.includes('maintenance')) setActiveView('maintenance');
            else if (routeLink.includes('live_tracking')) setActiveView('live_tracking');
            setIsAiDrawerOpen(false);
          }}
        />
      )}
    </>
  );
};
