/**
 * Evidence Management & Telemetry Replay Tab
 * PROMPT 22 Section 31 - 37 & 96
 */

import React, { useState } from 'react';
import { Evidence } from '../../types';
import { FileText, Camera, ShieldCheck, Download, Play, Pause, RotateCcw, Activity } from 'lucide-react';

interface EvidenceTabProps {
  evidenceList: Evidence[];
  onOpenUploadModal: () => void;
}

export const EvidenceTab: React.FC<EvidenceTabProps> = ({ evidenceList, onOpenUploadModal }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState<number>(1);
  const [timelineIndex, setTimelineIndex] = useState<number>(50); // 0 to 100 timeline slider

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="space-y-6">
      {/* Top Telemetry & GPS Replay Player Panel */}
      <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-5 backdrop-blur-md space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Playback Telemetri & GPS Replay (30 Menit Sebelum - Sesudah)</h3>
              <p className="text-xs text-slate-400">Rekonstruksi kecepatan, pengereman, g-force, dan sudut kemudi sebelum insiden</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 4, 10].map((s) => (
              <button
                key={s}
                onClick={() => setReplaySpeed(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                  replaySpeed === s
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Telemetry Timeline Chart Simulation */}
        <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>-30 Menit (13:50)</span>
            <span className="text-rose-400 font-extrabold flex items-center gap-1">● TITIK INSIDEN (14:20)</span>
            <span>+30 Menit (14:50)</span>
          </div>

          {/* Slider */}
          <input
            type="range"
            min="0"
            max="100"
            value={timelineIndex}
            onChange={(e) => setTimelineIndex(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          <div className="flex items-center justify-between text-xs">
            <button
              onClick={togglePlay}
              className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 flex items-center gap-1.5"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isPlaying ? 'Pause Replay' : 'Play Replay'}</span>
            </button>

            <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px]">
              <span>Speed: <strong className="text-cyan-400">{timelineIndex === 50 ? '0 km/h (Impact)' : `${Math.round(timelineIndex * 0.7)} km/h`}</strong></span>
              <span>G-Force: <strong className="text-amber-400">{timelineIndex === 50 ? '-1.8G (Hard Brake)' : '0.1G'}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Gallery & Upload */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Camera className="h-4 w-4 text-cyan-400" /> Galeri Bukti & Dokumen Terverifikasi (SHA-256)
          </h3>

          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-950"
          >
            <Camera className="h-4 w-4" />
            <span>+ Unggah Bukti Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {evidenceList.map((ev) => (
            <div
              key={ev.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {ev.type}
                </span>
                <span className="text-[10px] text-slate-400">{ev.fileSize}</span>
              </div>

              {ev.type === 'PHOTO' && (
                <div className="rounded-xl overflow-hidden h-36 bg-slate-950 relative border border-slate-800">
                  <img src={ev.fileUrl} alt={ev.fileName} className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <p className="font-bold text-white text-xs truncate">{ev.fileName}</p>
                <p className="text-[11px] text-slate-300 mt-1">{ev.description}</p>
              </div>

              {/* SHA-256 Hash Integrity Badge */}
              <div className="rounded-xl bg-slate-950 p-2 border border-slate-800 font-mono text-[10px] space-y-0.5">
                <p className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Integrity Verification
                </p>
                <p className="text-slate-500 truncate">{ev.hash}</p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                <span>By: {ev.capturedBy}</span>
                <span>{new Date(ev.capturedAt).toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
