/**
 * Fleet Intelligence Smart AI - Command Center Tactical AI Copilot
 * Floating/Docked real-time AI Assistant with telematics context and quick operational prompts
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ShieldAlert, 
  Activity, 
  Fuel, 
  Truck,
  ArrowRight
} from 'lucide-react';
import { commandCenterAIService, AIChatMessage } from '../../services/commandCenterAIService';
import { commandCenterService } from '../../services/commandCenterService';

interface CommandCenterAICopilotProps {
  onClose: () => void;
  onOpenEmergencyModal?: (emergencyId: string) => void;
  onOpenDispatch?: () => void;
}

export const CommandCenterAICopilot: React.FC<CommandCenterAICopilotProps> = ({
  onClose,
  onOpenEmergencyModal,
  onOpenDispatch,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>(commandCenterAIService.getChatHistory());
  const [inputValue, setInputValue] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isThinking) return;

    setInputValue('');
    setIsThinking(true);

    try {
      await commandCenterAIService.askAI(text);
      setMessages(commandCenterAIService.getChatHistory());
    } catch {
      // Handled in service
    } finally {
      setIsThinking(false);
    }
  };

  const quickPrompts = [
    'Cek status panggilan darurat SOS',
    'Siapa 3 pengemudi dengan risiko tertinggi?',
    'Analisis anomali konsumsi BBM armada',
    'Cari armada terdekat di Tol Cikampek',
  ];

  return (
    <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-slate-900/95 backdrop-blur-md border border-blue-500/50 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 to-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center shadow">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Command Center AI Copilot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h2>
            <p className="text-[10px] text-slate-400">Telematics & Tactical Reasoning AI</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-6 h-6 rounded-md bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[82%] p-2.5 rounded-xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Action Recommendation Button */}
              {msg.actionRecommendation && (
                <div className="mt-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      if (msg.actionRecommendation?.type === 'OPEN_EMERGENCY' && onOpenEmergencyModal && msg.actionRecommendation.targetId) {
                        onOpenEmergencyModal(msg.actionRecommendation.targetId);
                      } else if (msg.actionRecommendation?.type === 'OPEN_DISPATCH' && onOpenDispatch) {
                        onOpenDispatch();
                      }
                    }}
                    className="w-full flex items-center justify-between gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/40 hover:bg-amber-950/60 border border-amber-500/40 px-2 py-1 rounded transition-colors"
                  >
                    <span>{msg.actionRecommendation.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div
                className={`text-[9px] mt-1 font-mono ${
                  msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-500'
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-2.5 items-center text-xs text-slate-400 italic">
            <div className="w-6 h-6 rounded-md bg-blue-600/30 text-blue-400 flex items-center justify-center animate-spin">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>Menganalisis telemetri armada...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-2 bg-slate-950 border-t border-slate-800 flex gap-1.5 overflow-x-auto scrollbar-none">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="text-[10px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Tanya status armada, rute, atau BBM..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isThinking}
          className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition-colors shadow"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
