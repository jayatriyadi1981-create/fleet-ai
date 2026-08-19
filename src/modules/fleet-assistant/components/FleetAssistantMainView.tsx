/**
 * Fleet Intelligence Smart AI - Master Conversational Fleet Assistant View (Prompt 34)
 * Comprehensive desktop & mobile conversational workspace with Multi-Conversation CRUD,
 * Rich Telematics Message Rendering (Tables, Charts, Map pins, Metrics, Action Proposals),
 * Slash Commands, Voice Input, TTS Speech Output, Feedback, and Daily Briefing.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  Database, 
  ExternalLink, 
  Clock, 
  RefreshCw, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Download, 
  ChevronRight, 
  Menu, 
  Truck, 
  Fuel, 
  Wrench, 
  Shield, 
  Navigation, 
  FileText, 
  Zap, 
  Activity, 
  MapPin 
} from 'lucide-react';
import { useFleet, ActiveView } from '../../../context/FleetContext';
import { useAuthorization } from '../../../hooks/useAuthorization';
import { fleetAssistantService } from '../services/FleetAssistantService';
import { FleetAssistantConversation, FleetAssistantMessage, AssistantStructuredResponse, FleetDailyBriefingData } from '../types';
import { AIActionProposal, AISourceCitation } from '../../../types/ai';
import { AIFeedbackModal } from './modals/AIFeedbackModal';
import { DailyBriefingModal } from './modals/DailyBriefingModal';
import { AISourceInspectorModal } from './modals/AISourceInspectorModal';
import { AIActionConfirmModal } from './modals/AIActionConfirmModal';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const FleetAssistantMainView: React.FC = () => {
  const { 
    currentUser, 
    currentTenant, 
    selectedBranchId, 
    setActiveView, 
    vehicles, 
    drivers, 
    alerts, 
    maintenanceOrders, 
    trips, 
    gpsDevices 
  } = useFleet();
  
  const { can, userRole } = useAuthorization();

  // Conversation State
  const [conversations, setConversations] = useState<FleetAssistantConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [activeConversation, setActiveConversation] = useState<FleetAssistantConversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Input & Prompt State
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingMsgId, setIsSpeakingMsgId] = useState<string | null>(null);
  const [showSlashCommands, setShowSlashCommands] = useState(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Modals State
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackMsgTarget, setFeedbackMsgTarget] = useState<{ id: string; isHelpful: boolean } | null>(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [briefingData, setBriefingData] = useState<FleetDailyBriefingData | null>(null);
  const [inspectSources, setInspectSources] = useState<{ sources: AISourceCitation[]; freshness?: any } | null>(null);
  const [actionConfirmTarget, setActionConfirmTarget] = useState<AIActionProposal | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initial Load
  useEffect(() => {
    refreshConversations();
    const briefing = fleetAssistantService.getDailyBriefing();
    setBriefingData(briefing);
  }, []);

  // Sync Active Conversation
  useEffect(() => {
    if (activeConvId) {
      const conv = conversations.find((c) => c.id === activeConvId);
      setActiveConversation(conv || null);
    }
  }, [activeConvId, conversations]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isGenerating]);

  const refreshConversations = () => {
    const list = fleetAssistantService.getConversations();
    setConversations(list);
    const active = fleetAssistantService.getActiveConversation();
    if (active) {
      setActiveConvId(active.id);
      setActiveConversation(active);
    } else if (list.length > 0) {
      setActiveConvId(list[0].id);
      setActiveConversation(list[0]);
    }
  };

  const handleCreateNewConversation = () => {
    const newConv = fleetAssistantService.createNewConversation(
      currentTenant?.id || 'tenant-tln-01',
      currentUser?.id || 'usr-default',
      'Percakapan Baru'
    );
    refreshConversations();
    setActiveConvId(newConv.id);
    setIsSidebarOpenMobile(false);
  };

  const handleSelectConversation = (id: string) => {
    fleetAssistantService.setActiveConversation(id);
    setActiveConvId(id);
    setIsSidebarOpenMobile(false);
  };

  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      fleetAssistantService.renameConversation(id, editTitle.trim());
      refreshConversations();
    }
    setEditingConvId(null);
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Hapus percakapan ini dari riwayat?')) {
      fleetAssistantService.deleteConversation(id);
      refreshConversations();
    }
  };

  // Submit Prompt Handler
  const handleSendMessage = async (promptToSend?: string) => {
    const prompt = (promptToSend || inputPrompt).trim();
    if (!prompt || isGenerating) return;

    setInputPrompt('');
    setShowSlashCommands(false);
    setIsGenerating(true);

    const userSecurityContext = {
      userId: currentUser?.id || 'usr-default',
      userName: currentUser?.name || 'Fleet Supervisor',
      userRole: userRole || 'super_admin',
      tenantId: currentTenant?.id || 'tenant-tln-01',
      branchId: selectedBranchId,
      permissions: currentUser?.permissions || ['dashboard.view', 'vehicle.view', 'tracking.view', 'driver.view', 'fuel.view', 'maintenance.view', 'safety.view', 'trip.view', 'route.view', 'alert.view', 'ai.view'],
    };

    try {
      await fleetAssistantService.askAssistant({
        conversationId: activeConvId,
        prompt,
        user: userSecurityContext,
        liveState: {
          vehicles,
          drivers,
          alerts,
          maintenanceOrders,
          trips,
          gpsDevices,
        },
      });
      refreshConversations();
    } catch (err: any) {
      console.error('Error asking assistant:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Speech Recognition (Web Speech API)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser Anda belum mendukung Web Speech Recognition API. Silakan ketik pertanyaan Anda.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputPrompt(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  // Text to Speech
  const toggleSpeechOutput = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Fitur Text-to-Speech tidak didukung di browser ini.');
      return;
    }

    if (isSpeakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '').slice(0, 300);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;

    utterance.onend = () => setIsSpeakingMsgId(null);
    utterance.onerror = () => setIsSpeakingMsgId(null);

    setIsSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Feedback Trigger
  const handleOpenFeedback = (msgId: string, isHelpful: boolean) => {
    setFeedbackMsgTarget({ id: msgId, isHelpful });
    setIsFeedbackOpen(true);
  };

  const handleSubmitFeedback = (feedback: any) => {
    if (feedbackMsgTarget && activeConvId) {
      fleetAssistantService.submitFeedback(activeConvId, feedbackMsgTarget.id, feedback);
      refreshConversations();
      showToast('Terima kasih atas umpan balik Anda!');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Export Conversation
  const handleExportChat = () => {
    if (!activeConversation) return;
    const json = JSON.stringify(activeConversation, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Fleet_Assistant_${activeConversation.title.replace(/\s+/g, '_')}_${Date.now()}.json`;
    a.click();
    showToast('Riwayat percakapan berhasil diekspor.');
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickCategories = [
    {
      title: '🚗 Status & GPS',
      prompts: [
        'Berapa kendaraan yang offline saat ini?',
        'Dimana lokasi kendaraan B 9211 TJP?',
        'Ringkasan status armada hari ini',
      ],
    },
    {
      title: '⛽ BBM & Efisiensi',
      prompts: [
        'Kenapa konsumsi BBM meningkat?',
        'Deteksi anomali BBM & pencurian',
        'Tren konsumsi solar 7 hari terakhir',
      ],
    },
    {
      title: '🔧 Maintenance & Bengkel',
      prompts: [
        'Kendaraan mana yang harus segera service?',
        'Kendaraan dengan breakdown risk tertinggi',
        'Status work order perawatan aktif',
      ],
    },
    {
      title: '👨‍✈️ Driver & Keselamatan',
      prompts: [
        'Siapa driver paling berisiko tinggi?',
        'Apakah ada driver yang berisiko fatigue?',
        'Kenapa safety score armada turun?',
      ],
    },
    {
      title: '⏱️ Trip & Rute',
      prompts: [
        'Trip mana yang mengalami keterlambatan ETA?',
        'Rute pengiriman mana yang paling berisiko?',
      ],
    },
    {
      title: '🎯 Prioritas Hari Ini',
      prompts: [
        'Apa yang harus saya prioritaskan hari ini?',
      ],
    },
  ];

  const slashCommands = [
    { cmd: '/show offline vehicles', desc: 'Tampilkan seluruh kendaraan offline > 30 menit' },
    { cmd: '/show high risk drivers', desc: 'Tampilkan pengemudi dengan risiko keselamatan tertinggi' },
    { cmd: '/show overdue maintenance', desc: 'Tampilkan kendaraan yang melewati batas jadwal service' },
    { cmd: '/show active alerts', desc: 'Tampilkan peringatan kritis yang sedang aktif' },
    { cmd: '/show delayed trips', desc: 'Tampilkan perjalanan yang mengalami keterlambatan ETA' },
    { cmd: '/priority', desc: 'Tampilkan 5 prioritas operasional AI hari ini' },
  ];

  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-cyan-300 shadow-2xl animate-fade-in">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR - Desktop & Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-slate-800 bg-slate-900/95 backdrop-blur-lg transition-transform duration-200 md:static md:translate-x-0 ${
          isSidebarOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-100">AI Fleet Assistant</h2>
              <span className="text-[10px] text-slate-400">Telematics AI Core v2.4</span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpenMobile(false)}
            className="md:hidden text-slate-400 hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* New Chat & Briefing Action Buttons */}
        <div className="p-3 space-y-2">
          <button
            onClick={handleCreateNewConversation}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-2.5 px-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Percakapan Baru</span>
          </button>

          <button
            onClick={() => setIsBriefingOpen(true)}
            className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 py-2 px-3 text-xs font-semibold text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Daily Fleet Briefing</span>
            </span>
            <span className="rounded bg-cyan-500/10 px-1.5 py-0.2 text-[9px] font-bold text-cyan-400">
              Hari Ini
            </span>
          </button>
        </div>

        {/* Search Conversations */}
        <div className="px-3 pb-2">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari percakapan..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Conversations History List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
            Riwayat Percakapan ({filteredConversations.length})
          </div>

          {filteredConversations.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500 italic">
              Tidak ada percakapan ditemukan.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              const isEditing = editingConvId === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`group relative flex items-center justify-between rounded-xl p-2.5 text-xs cursor-pointer transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {isEditing ? (
                    <div
                      className="flex items-center gap-1.5 w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(conv.id)}
                        autoFocus
                        className="w-full rounded border border-cyan-500 bg-slate-950 px-2 py-1 text-xs text-slate-100 focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveRename(conv.id)}
                        className="text-emerald-400 hover:text-emerald-300"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingConvId(null)}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col truncate pr-2">
                        <span className="truncate">{conv.title}</span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          {new Date(conv.updatedAt).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          WIB
                        </span>
                      </div>

                      <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingConvId(conv.id);
                            setEditTitle(conv.title);
                          }}
                          className="rounded p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteConversation(e, conv.id)}
                          className="rounded p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer Live Status */}
        <div className="border-t border-slate-800 p-3 space-y-1.5 bg-slate-950/40">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Gateway Telemetri:</span>
            </span>
            <span className="font-semibold text-emerald-400">Tersambung (Real-time)</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Tools Aktif:</span>
            <span className="font-mono text-cyan-400">27 / 27 Modul Siap</span>
          </div>
        </div>
      </aside>

      {/* MAIN CHAT STREAM CONTAINER */}
      <main className="flex flex-1 flex-col overflow-hidden bg-slate-950">
        {/* Top Chat Bar Header */}
        <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900/60 px-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpenMobile(true)}
              className="md:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>{activeConversation?.title || 'AI Fleet Assistant'}</span>
              </h1>
              <span className="text-[10px] text-slate-400">
                Mode: Cross-Domain Telematics Reasoning Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBriefingOpen(true)}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Daily Briefing</span>
            </button>

            <button
              onClick={handleExportChat}
              title="Ekspor Percakapan (JSON)"
              className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {(!activeConversation || activeConversation.messages.length <= 1) && (
            <div className="mx-auto max-w-3xl space-y-6 py-4 animate-fade-in">
              {/* Welcome Card Banner */}
              <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-100">
                      Selamat Datang di AI Fleet Assistant
                    </h2>
                    <p className="text-xs text-slate-400">
                      Tanyakan apa saja seputar armada, status GPS, BBM, jadwal servis, keselamatan driver, dan rute pengiriman.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Data Telemetri Terverifikasi
                  </span>
                  <span>•</span>
                  <span>Bahasa Indonesia & English</span>
                  <span>•</span>
                  <span>Ketik "/" untuk daftar perintah cepat</span>
                </div>
              </div>

              {/* Quick Prompts Grid */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pilihan Topik Cepat
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickCategories.map((cat, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2.5"
                    >
                      <h4 className="text-xs font-bold text-slate-200">{cat.title}</h4>
                      <div className="space-y-1.5">
                        {cat.prompts.map((p, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSendMessage(p)}
                            className="flex w-full items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/60 p-2.5 text-left text-xs text-slate-300 hover:border-cyan-500/40 hover:bg-slate-900 hover:text-cyan-300 transition-all group"
                          >
                            <span>{p}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Render Active Messages */}
          {activeConversation?.messages.map((msg) => {
            const isUser = msg.role === 'user';
            const structured = msg.structuredResponse;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
              >
                {/* Assistant Avatar */}
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-sm mt-1">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}

                {/* Message Box */}
                <div
                  className={`relative rounded-2xl p-4 md:p-5 shadow-lg space-y-4 max-w-full ${
                    isUser
                      ? 'bg-cyan-600 text-slate-950 font-medium rounded-tr-none ml-12'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none mr-4 md:mr-12'
                  }`}
                >
                  {/* Markdown Content */}
                  <div className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>

                  {/* Structured Response Attachments */}
                  {!isUser && structured && (
                    <div className="space-y-4 pt-2 border-t border-slate-800">
                      {/* Metric Summary Cards */}
                      {structured.metrics && structured.metrics.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {structured.metrics.map((m, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 space-y-1"
                            >
                              <span className="text-[10px] text-slate-400 font-semibold truncate block">
                                {m.label}
                              </span>
                              <div className="flex items-baseline justify-between">
                                <span className="text-sm font-black text-slate-100">{m.value}</span>
                                {m.change && (
                                  <span
                                    className={`text-[10px] font-bold ${
                                      m.statusColor === 'rose'
                                        ? 'text-rose-400'
                                        : m.statusColor === 'emerald'
                                        ? 'text-emerald-400'
                                        : 'text-cyan-400'
                                    }`}
                                  >
                                    {m.change}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Structured Table */}
                      {structured.tableData && (
                        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden space-y-2 p-3">
                          <h4 className="text-xs font-bold text-slate-300">
                            {structured.tableData.title}
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="border-b border-slate-800 text-[10px] font-bold uppercase text-slate-400 bg-slate-900/50">
                                <tr>
                                  {structured.tableData.columns.map((col) => (
                                    <th key={col.key} className="p-2">
                                      {col.label}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                                {structured.tableData.rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                                    {structured.tableData!.columns.map((col) => (
                                      <td key={col.key} className="p-2 font-medium">
                                        {row[col.key]}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Structured Chart */}
                      {structured.chartData && (
                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                          <h4 className="text-xs font-bold text-slate-300">
                            {structured.chartData.title}
                          </h4>
                          <div className="h-44 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={structured.chartData.labels.map((lbl, idx) => ({
                                  label: lbl,
                                  ...structured.chartData!.datasets.reduce((acc: any, ds) => {
                                    acc[ds.name] = ds.data[idx];
                                    return acc;
                                  }, {}),
                                }))}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="label" stroke="#64748b" fontSize={10} />
                                <YAxis stroke="#64748b" fontSize={10} />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: '#0f172a',
                                    borderColor: '#334155',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                  }}
                                />
                                {structured.chartData.datasets.map((ds, dIdx) => (
                                  <Line
                                    key={dIdx}
                                    type="monotone"
                                    dataKey={ds.name}
                                    stroke={ds.color || '#06b6d4'}
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                  />
                                ))}
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {/* Mini Map View */}
                      {structured.mapData && (
                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                              {structured.mapData.title}
                            </h4>
                            <span className="text-[10px] text-slate-500">
                              {structured.mapData.markers.length} Unit Terpetakan
                            </span>
                          </div>
                          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3 space-y-1.5">
                            {structured.mapData.markers.slice(0, 3).map((mk) => (
                              <div
                                key={mk.id}
                                className="flex items-center justify-between text-xs border-b border-slate-800/40 pb-1"
                              >
                                <span className="font-bold text-cyan-300">{mk.plateNumber}</span>
                                <span className="text-slate-400">{mk.driverName || 'Driver'}</span>
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                    mk.status === 'OFFLINE'
                                      ? 'bg-rose-500/20 text-rose-400'
                                      : 'bg-emerald-500/20 text-emerald-400'
                                  }`}
                                >
                                  {mk.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Proposals (Human in the Loop) */}
                      {structured.actions && structured.actions.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Proposal Tindakan AI:
                          </span>
                          <div className="space-y-2">
                            {structured.actions.map((act) => (
                              <div
                                key={act.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3"
                              >
                                <div>
                                  <h5 className="text-xs font-bold text-slate-100">{act.label}</h5>
                                  <p className="text-xs text-slate-400 mt-0.5">{act.description}</p>
                                </div>
                                <button
                                  onClick={() => setActionConfirmTarget(act)}
                                  className="shrink-0 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
                                >
                                  Setujui & Eksekusi
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Inline Navigation Actions */}
                      {structured.inlineActions && structured.inlineActions.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {structured.inlineActions.map((ia) => (
                            <button
                              key={ia.id}
                              onClick={() => setActiveView(ia.viewTarget as ActiveView)}
                              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:border-cyan-500 hover:bg-slate-700 transition-colors"
                            >
                              <span>{ia.label}</span>
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Assistant Footer Actions (TTS, Citations, Feedback) */}
                  {!isUser && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                      {/* Telemetry & Sources Pill */}
                      <div className="flex items-center gap-2">
                        {structured?.sources && structured.sources.length > 0 && (
                          <button
                            onClick={() =>
                              setInspectSources({
                                sources: structured.sources,
                                freshness: structured.dataFreshness,
                              })
                            }
                            className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors"
                          >
                            <Database className="h-3 w-3 text-cyan-400" />
                            <span>Lihat Bukti & Sumber Data ({structured.sources.length})</span>
                          </button>
                        )}

                        {structured?.toolCalls?.[0] && (
                          <span className="hidden sm:inline font-mono text-[10px] text-slate-500">
                            ⚡ {structured.toolCalls[0].durationMs}ms
                          </span>
                        )}
                      </div>

                      {/* Action Tools */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSpeechOutput(msg.id, msg.content)}
                          title="Dengarkan Suara (TTS)"
                          className={`rounded-lg p-1 transition-colors ${
                            isSpeakingMsgId === msg.id
                              ? 'text-cyan-400 bg-cyan-500/10'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {isSpeakingMsgId === msg.id ? (
                            <VolumeX className="h-3.5 w-3.5" />
                          ) : (
                            <Volume2 className="h-3.5 w-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleOpenFeedback(msg.id, true)}
                          title="Jawaban Bermanfaat"
                          className="rounded-lg p-1 text-slate-500 hover:text-emerald-400 transition-colors"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenFeedback(msg.id, false)}
                          title="Laporkan Kendala"
                          className="rounded-lg p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-600 font-bold text-slate-950 shadow-sm mt-1">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            );
          })}

          {/* Thinking / Generating Pulse Indicator */}
          {isGenerating && (
            <div className="flex items-center gap-3 mr-auto">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Sparkles className="h-4 w-4 animate-spin" />
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs text-slate-300 font-medium">
                  AI sedang menganalisis telemetri & menyusun jawaban terstruktur...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* BOTTOM INPUT & COMMAND BAR */}
        <div className="border-t border-slate-800 bg-slate-900/90 p-3 md:p-4 backdrop-blur-md space-y-2">
          {/* Slash Commands Dropdown Popup */}
          {showSlashCommands && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl space-y-1 mb-2 max-h-48 overflow-y-auto">
              <div className="text-[10px] font-bold uppercase text-slate-500 px-2 py-1">
                Perintah Cepat Telemetri (Slash Commands)
              </div>
              {slashCommands.map((sc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputPrompt(sc.cmd);
                    setShowSlashCommands(false);
                    inputRef.current?.focus();
                  }}
                  className="flex w-full items-center justify-between rounded-lg p-2 text-left text-xs hover:bg-slate-900 transition-colors"
                >
                  <span className="font-bold text-cyan-400 font-mono">{sc.cmd}</span>
                  <span className="text-slate-400">{sc.desc}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="relative flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 p-1.5 focus-within:border-cyan-500 transition-colors">
            {/* Slash Command Trigger Button */}
            <button
              onClick={() => setShowSlashCommands(!showSlashCommands)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-slate-400 hover:text-cyan-300 transition-colors"
              title="Daftar Perintah Slash (/)"
            >
              <Zap className="h-4 w-4" />
            </button>

            {/* Main Textarea */}
            <textarea
              ref={inputRef}
              value={inputPrompt}
              onChange={(e) => {
                setInputPrompt(e.target.value);
                if (e.target.value === '/') setShowSlashCommands(true);
                else if (!e.target.value.startsWith('/')) setShowSlashCommands(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Tanyakan status kendaraan, BBM, driver, rute, atau ketik '/' untuk perintah cepat..."
              rows={1}
              className="flex-1 resize-none bg-transparent py-2 px-1 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none max-h-32"
            />

            {/* Voice Input Button */}
            <button
              onClick={toggleSpeechRecognition}
              title={isListening ? 'Berhenti Mendengar' : 'Gunakan Suara (Voice Input)'}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                isListening
                  ? 'bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputPrompt.trim() || isGenerating}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                inputPrompt.trim() && !isGenerating
                  ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>

      {/* MODALS */}
      {/* Feedback Modal */}
      {feedbackMsgTarget && (
        <AIFeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => {
            setIsFeedbackOpen(false);
            setFeedbackMsgTarget(null);
          }}
          isHelpful={feedbackMsgTarget.isHelpful}
          onSubmit={handleSubmitFeedback}
        />
      )}

      {/* Daily Briefing Modal */}
      {briefingData && (
        <DailyBriefingModal
          isOpen={isBriefingOpen}
          onClose={() => setIsBriefingOpen(false)}
          briefing={briefingData}
        />
      )}

      {/* Source Citations Inspector Modal */}
      {inspectSources && (
        <AISourceInspectorModal
          isOpen={!!inspectSources}
          onClose={() => setInspectSources(null)}
          sources={inspectSources.sources}
          dataFreshness={inspectSources.freshness}
        />
      )}

      {/* Human in the loop Action Confirmation Modal */}
      {actionConfirmTarget && (
        <AIActionConfirmModal
          isOpen={!!actionConfirmTarget}
          onClose={() => setActionConfirmTarget(null)}
          action={actionConfirmTarget}
          onConfirmSuccess={(msg) => showToast(msg)}
        />
      )}
    </div>
  );
};
