import React, { useState } from 'react';
import { RentalAiInsight } from '../../modules/rent-car/types';
import { rentCarService } from '../../modules/rent-car/services/rentCarService';
import { 
  Sparkles, 
  Brain, 
  Send, 
  TrendingUp, 
  ShieldAlert, 
  DollarSign, 
  HelpCircle, 
  CheckCircle2, 
  Bot,
  User,
  Zap,
  ArrowRight
} from 'lucide-react';

interface RentalAiIntelligenceTabProps {
  insights: RentalAiInsight[];
}

export const RentalAiIntelligenceTab: React.FC<RentalAiIntelligenceTabProps> = ({ insights }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; confidence?: number; timestamp: string }>>([
    {
      sender: 'ai',
      text: 'Halo! Saya AI Rental Fleet Intelligence Copilot. Anda dapat menanyakan ketersediaan armada, analisis keuntungan (profitability), anomali geofence/starter-kill, prediksi demand, atau rekomendasi harga sewa dinamis.',
      confidence: 99,
      timestamp: new Date().toLocaleTimeString('id-ID')
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const sampleQuestions = [
    'Berapa kendaraan yang tersedia hari ini?',
    'Berapa booking dan omset hari ini?',
    'Kendaraan mana yang paling profitable?',
    'Berapa kendaraan yang sedang overdue?',
    'Berapa total pendapatan rental bulan ini?'
  ];

  const handleSend = (textToSend?: string) => {
    const question = textToSend || inputQuestion;
    if (!question.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: question,
      timestamp: new Date().toLocaleTimeString('id-ID')
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsThinking(true);

    setTimeout(() => {
      const response = rentCarService.queryAiAssistant(question);
      const aiMsg = {
        sender: 'ai' as const,
        text: response.answer,
        confidence: response.confidence,
        timestamp: new Date().toLocaleTimeString('id-ID')
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* AI Chat Copilot Assistant */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col h-[650px] shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  AI Rental Assistant Copilot
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    GEMINI LIVE AGENT
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Analisis real-time operasional armada, KYC, & finansial rental.</p>
              </div>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 border-b border-slate-800/60">
            {sampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto space-y-3.5 p-2 my-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-medium'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-slate-800/40 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {msg.confidence && (
                      <span className="font-mono text-cyan-400">Akurasi: {msg.confidence}%</span>
                    )}
                  </div>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono animate-pulse p-2">
                <Sparkles className="w-4 h-4" />
                <span>AI sedang menganalisis data telematika & reservasi rental...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 pt-2 border-t border-slate-800 shrink-0"
          >
            <input
              type="text"
              placeholder="Tanyakan analisis armada, prediksi booking, atau audit keuangan..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isThinking || !inputQuestion.trim()}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-950"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="text-xs">Kirim</span>
            </button>
          </form>
        </div>
      </div>

      {/* AI Proactive Strategic Recommendations */}
      <div className="lg:col-span-5 space-y-3.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Strategic Insights & Radar
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Rekomendasi optimasi margin dan mitigasi risiko sewa yang dideteksi secara proaktif oleh engine AI.
          </p>
        </div>

        <div className="space-y-3">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 hover:border-slate-700 transition-all shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    ins.type === 'demand_forecast'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : ins.type === 'pricing_recommendation'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {ins.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Confidence: {ins.confidenceScore}%
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white">{ins.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{ins.summary}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Proyeksi Dampak:</span>
                  <strong className="text-cyan-400 font-mono">{ins.impactMetric}</strong>
                </div>
                <div className="text-[11px] text-emerald-300">
                  <strong>Aksi Disarankan:</strong> {ins.actionRecommendation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
