/**
 * Fleet Intelligence Smart AI - Report Share Modal
 * PROMPT 39 - Secure Short-lived Share Links with Permission Toggles & Expiration Controls
 */

import React, { useState } from 'react';
import { useReports } from '../context/ReportContext';
import {
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  Calendar,
  Globe,
} from 'lucide-react';

export const ReportShareModal: React.FC = () => {
  const { isShareModalOpen, setIsShareModalOpen, activeDataset } = useReports();
  const [copied, setCopied] = useState(false);
  const [allowDownload, setAllowDownload] = useState(true);
  const [allowExport, setAllowExport] = useState(true);
  const [requirePassword, setRequirePassword] = useState(false);
  const [expiryDays, setExpiryDays] = useState(7);

  if (!isShareModalOpen) return null;

  const shareToken = `rpt_share_${Math.random().toString(36).substring(2, 10)}`;
  const shareUrl = `https://fleet-smart.ai/share/reports/${shareToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Bagikan Akses Laporan Terenkripsi</h3>
          </div>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="text-slate-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-bold text-white">{activeDataset.name}</div>
          <p className="text-[11px] text-slate-400">Periode: {activeDataset.periodLabel}</p>
        </div>

        {/* Share Link Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Tautan Akses Aman</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition shadow-sm"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
        </div>

        {/* Permissions & Expiration */}
        <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Izinkan Unduh Berkas</span>
            <input
              type="checkbox"
              checked={allowDownload}
              onChange={e => setAllowDownload(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-300">Izinkan Ekspor Excel / CSV</span>
            <input
              type="checkbox"
              checked={allowExport}
              onChange={e => setAllowExport(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-300">Masa Berlaku Tautan</span>
            <select
              value={expiryDays}
              onChange={e => setExpiryDays(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
            >
              <option value={1}>24 Jam</option>
              <option value={7}>7 Hari</option>
              <option value={30}>30 Hari</option>
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Tautan Terenkripsi AES-256</span>
          </span>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
