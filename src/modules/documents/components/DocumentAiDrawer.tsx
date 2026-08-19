/**
 * Fleet Intelligence Smart AI - Document AI Intelligence Assistant Drawer
 * PROMPT 48 - Natural Language Compliance Q&A, Anomaly Detection & One-Click Remediation
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Zap,
  MessageSquare,
  FileCheck,
} from 'lucide-react';
import { documentOcrAiService } from '../services/documentOcrAiService';
import { documentService } from '../services/documentService';
import { DocumentAiPromptResponse, DocumentItem } from '../types/documentTypes';

interface DocumentAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onApplyFilter: (filterType: string, value?: any) => void;
}

interface MessageItem {
  sender: 'AI' | 'USER';
  text: string;
  suggestedActions?: DocumentAiPromptResponse['suggestedActions'];
  relatedDocuments?: DocumentItem[];
  timestamp: string;
}

export const DocumentAiDrawer: React.FC<DocumentAiDrawerProps> = ({
  isOpen,
  onClose,
  onSelectDocument,
  onApplyFilter,
}) => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      sender: 'AI',
      text:
        'Halo! Saya **Fleet Document AI Assistant**. Saya dapat membantu memantau tanggal kedaluwarsa STNK, uji KIR Dishub, polis asuransi, legalitas SIM driver, dan kepatuhan audit armada secara real-time.\n\nPilih pertanyaan cepat di bawah atau ketik pertanyaan spesifik Anda:',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    'Dokumen apa yang expired bulan ini?',
    'Berapa kendaraan yang KIR-nya expired?',
    'Driver mana yang SIM-nya mendekati kedaluwarsa?',
    'Dokumen wajib apa yang masih kurang?',
  ];

  const handleSend = async (questionText?: string) => {
    const query = questionText || inputText;
    if (!query.trim()) return;

    const userMsg: MessageItem = {
      sender: 'USER',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInputText('');
    setIsLoading(true);

    try {
      const allDocs = documentService.getDocuments();
      const missing = documentService.getMissingDocuments();
      const summary = documentService.getComplianceSummary();

      const aiResponse = await documentOcrAiService.askDocumentAi(query, {
        documents: allDocs,
        missingDocs: missing,
        summary,
      });

      const aiMsg: MessageItem = {
        sender: 'AI',
        text: aiResponse.answer,
        suggestedActions: aiResponse.suggestedActions,
        relatedDocuments: aiResponse.relatedDocuments,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'AI',
          text: 'Maaf, terjadi kesalahan saat memproses data kepatuhan. Silakan coba lagi.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: { label: string; actionType: string; payload?: any }) => {
    if (action.actionType === 'FILTER') {
      if (action.payload?.status) {
        onApplyFilter('status', action.payload.status);
      } else if (action.payload?.documentType) {
        onApplyFilter('documentType', action.payload.documentType);
      } else if (action.payload?.entityType) {
        onApplyFilter('entityType', action.payload.entityType);
      } else if (action.payload?.filter === 'expiring_30') {
        onApplyFilter('expiringWithinDays', 30);
      }
      onClose();
    } else if (action.actionType === 'NAVIGATE') {
      if (action.payload?.tab) {
        onApplyFilter('tab', action.payload.tab);
      }
      onClose();
    } else if (action.actionType === 'SEND_REMINDER') {
      alert('Pengingat otomatis via WhatsApp & Notifikasi Push telah dikirimkan ke driver/PIC terkait.');
    } else if (action.actionType === 'CREATE_TASK') {
      alert('Tiket Work Order Servis & Uji KIR Dishub otomatis dibuat di modul Maintenance.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Document AI Intelligence</span>
                <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                  Smart AI
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Analisis Kepatuhan & Prediksi Kedaluwarsa</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'AI' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mt-1">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-md ${
                  msg.sender === 'USER'
                    ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none space-y-3'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                {/* Related Documents Chips */}
                {msg.relatedDocuments && msg.relatedDocuments.length > 0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-2.5 space-y-2 pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Dokumen Terkait ({msg.relatedDocuments.length})
                    </p>
                    <div className="space-y-1.5">
                      {msg.relatedDocuments.slice(0, 4).map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => onSelectDocument(doc)}
                          className="flex items-center justify-between rounded-lg bg-slate-950 p-2 hover:bg-slate-800 cursor-pointer transition-colors border border-slate-800/80"
                        >
                          <div className="flex items-center gap-2">
                            <FileCheck className="h-3.5 w-3.5 text-cyan-400" />
                            <div>
                              <p className="text-[11px] font-bold text-white max-w-[170px] truncate">{doc.title}</p>
                              <p className="text-[9px] text-slate-400">Jatuh tempo: {doc.expiryDate}</p>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                              doc.status === 'EXPIRED'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {doc.status === 'EXPIRED' ? 'Expired' : `${doc.daysRemaining}d`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Action Buttons */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedActions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleActionClick(act)}
                        className="flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                      >
                        <Zap className="h-3 w-3" />
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className={`text-[9px] ${msg.sender === 'USER' ? 'text-slate-900/70' : 'text-slate-500'} text-right mt-1`}>
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'USER' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 mt-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-cyan-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>AI sedang menganalisis database kepatuhan armada...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="border-t border-slate-800/80 bg-slate-950/40 p-3">
          <p className="text-[10px] font-semibold text-slate-400 mb-2">Pertanyaan Kepatuhan Cepat:</p>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <div className="border-t border-slate-800 p-4 bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tanyakan status kepatuhan dokumen armada..."
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
