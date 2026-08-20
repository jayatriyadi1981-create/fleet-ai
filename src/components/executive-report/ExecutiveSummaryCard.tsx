/**
 * Fleet Intelligence Smart AI - Executive Summary Card
 * PROMPT 52 — C-Level Executive Summary with 3-7 Key Strategic Points
 */

import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, CheckCircle2, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import { ExecutiveReport } from '../../types/executiveReport';

interface ExecutiveSummaryCardProps {
  report: ExecutiveReport;
  onAskAI?: () => void;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({ report, onAskAI }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(report.executiveSummary.narrative);
        utterance.lang = 'id-ID';
        utterance.rate = 1.0;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Executive Summary (Direksi & C-Level)</span>
              <span className="text-xs font-normal text-slate-400">
                — {report.periodLabel}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Sintesis kecerdasan bisnis, evaluasi cost drivers, dan implikasi strategis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              isPlayingAudio
                ? 'bg-amber-950/80 border-amber-600 text-amber-300 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Dengarkan pembacaan Executive Briefing"
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            <span>{isPlayingAudio ? 'Hentikan Audio' : 'Dengarkan Briefing'}</span>
          </button>

          {onAskAI && (
            <button
              onClick={onAskAI}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 hover:bg-cyan-900 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tanya AI Director</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Narrative Paragraph */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 text-sm leading-relaxed space-y-2">
        <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          {report.executiveSummary.headline}
        </div>
        <p className="text-slate-300">{report.executiveSummary.narrative}</p>
      </div>

      {/* Key Strategic Points (3 - 7 Bullet Points) */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Poin Kunci Manajemen & Sorotan Utama ({report.executiveSummary.bulletCount} Poin):
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {report.executiveSummary.keyPoints.map((point, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 text-xs text-slate-300 leading-relaxed transition-all"
            >
              <span className="w-5 h-5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
