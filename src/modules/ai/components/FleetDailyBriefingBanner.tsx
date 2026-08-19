/**
 * Fleet Intelligence Smart AI - Daily Briefing Banner (Sections 72 & 73)
 * Morning operational overview, priority queue, and speech audio playback simulation.
 */

import React, { useState } from 'react';
import { DailyBriefing } from '../../../types/ai';
import {
  Sparkles,
  Volume2,
  VolumeX,
  TrendingUp,
  AlertOctagon,
  Wrench,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface FleetDailyBriefingBannerProps {
  briefing: DailyBriefing;
  onActionClick?: (priority: any) => void;
}

export const FleetDailyBriefingBanner: React.FC<FleetDailyBriefingBannerProps> = ({
  briefing,
  onActionClick,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeechText, setAudioSpeechText] = useState<string | null>(null);

  const toggleSpeech = () => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      setAudioSpeechText(null);
    } else {
      const summaryText = `${briefing.greeting}. Ringkasan armada hari ini tanggal ${briefing.date}: ${briefing.fleetStatus.activeMoving} kendaraan bergerak aktif, ${briefing.fleetStatus.idleExcess} idle, dan ${briefing.fleetStatus.offline} offline. Perhatian prioritas: ${briefing.criticalPriorities[0]?.title || 'Semua aman'}.`;
      setAudioSpeechText(summaryText);
      setIsPlayingAudio(true);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(summaryText);
        utterance.lang = 'id-ID';
        utterance.rate = 1.0;
        utterance.onend = () => {
          setIsPlayingAudio(false);
          setAudioSpeechText(null);
        };
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => {
          setIsPlayingAudio(false);
          setAudioSpeechText(null);
        }, 5000);
      }
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-5 shadow-xl space-y-4">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Header & Speech Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-slate-950 font-bold shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                {briefing.greeting}
              </h2>
              <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
                AI Daily Briefing
              </span>
            </div>
            <p className="text-xs text-slate-400">{briefing.date}</p>
          </div>
        </div>

        <button
          onClick={toggleSpeech}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all border ${
            isPlayingAudio
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <VolumeX className="h-4 w-4" />
              <span>Hentikan Audio</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 text-cyan-400" />
              <span>Dengarkan Ringkasan Suara (TTS)</span>
            </>
          )}
        </button>
      </div>

      {audioSpeechText && (
        <div className="rounded-xl bg-indigo-950/60 border border-indigo-500/30 p-2.5 text-xs text-indigo-200 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <span className="italic">{audioSpeechText}</span>
        </div>
      )}

      {/* Fleet Telematics Status Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 relative z-10">
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-2.5 space-y-0.5">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Armada</p>
          <p className="text-lg font-black text-white">{briefing.fleetStatus.totalVehicles}</p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-2.5 space-y-0.5">
          <p className="text-[10px] text-emerald-400 uppercase font-semibold">Bergerak Aktif</p>
          <p className="text-lg font-black text-emerald-300">{briefing.fleetStatus.activeMoving}</p>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-2.5 space-y-0.5">
          <p className="text-[10px] text-amber-400 uppercase font-semibold">Idle Waktu Kerja</p>
          <p className="text-lg font-black text-amber-300">{briefing.fleetStatus.idleExcess}</p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-2.5 space-y-0.5">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Offline Telemetri</p>
          <p className="text-lg font-black text-slate-300">{briefing.fleetStatus.offline}</p>
        </div>

        <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-2.5 space-y-0.5">
          <p className="text-[10px] text-cyan-400 uppercase font-semibold">Servis Bengkel</p>
          <p className="text-lg font-black text-cyan-300">{briefing.fleetStatus.underMaintenance}</p>
        </div>

        <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-2.5 space-y-0.5">
          <p className="text-[10px] text-rose-400 uppercase font-semibold">Grounded Defek</p>
          <p className="text-lg font-black text-rose-300">{briefing.fleetStatus.grounded}</p>
        </div>
      </div>

      {/* Critical Priority Queue */}
      <div className="space-y-2 relative z-10 pt-1">
        <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
          <span>Antrean Prioritas Kritis Operasional Pagi Ini:</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {briefing.criticalPriorities.map((prio) => (
            <div
              key={prio.id}
              className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {prio.title}
                  </span>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 uppercase">
                    {prio.module}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                  {prio.description}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onActionClick && onActionClick(prio)}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>{prio.actionLabel}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost & Operational Highlights Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3 text-[11px] text-slate-400 relative z-10">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          <span>{briefing.costEfficiencySummary}</span>
        </div>
        <div className="text-slate-500 text-[10px]">
          Data diperbarui otomatis • Gemini 2.5 Flash Telematics Orchestrator
        </div>
      </div>
    </div>
  );
};
