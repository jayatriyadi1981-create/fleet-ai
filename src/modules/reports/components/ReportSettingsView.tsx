/**
 * Fleet Intelligence Smart AI - Report Engine Settings & Enterprise Branding
 * PROMPT 39 - Header/Footer Branding, Watermarks, Retention Policies & Notification Channels
 */

import React, { useState } from 'react';
import { useReports } from '../context/ReportContext';
import {
  Settings,
  Building2,
  Image,
  ShieldCheck,
  Save,
  CheckCircle2,
  Globe,
  Bell,
  Clock,
} from 'lucide-react';

export const ReportSettingsView: React.FC = () => {
  const { branding, updateBranding } = useReports();

  const [companyName, setCompanyName] = useState(branding.companyName);
  const [companyAddress, setCompanyAddress] = useState(branding.companyAddress);
  const [companyPhone, setCompanyPhone] = useState(branding.companyPhone);
  const [companyEmail, setCompanyEmail] = useState(branding.companyEmail);
  const [reportFooterText, setReportFooterText] = useState(branding.reportFooterText);
  const [watermark, setWatermark] = useState(branding.watermark);
  const [defaultRetentionDays, setDefaultRetentionDays] = useState(branding.defaultRetentionDays);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding({
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      reportFooterText,
      watermark,
      defaultRetentionDays,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">Pengaturan Format &amp; Branding Laporan Enterprise</h2>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Sesuaikan identitas korporat, teks catatan kaki resmi, watermark keamanan, dan kebijakan retensi berkas
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company Identity */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
            <Building2 className="h-4 w-4 text-cyan-400" />
            <span>Identitas Perusahaan &amp; Kop Surat Laporan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nama Perusahaan Resmi</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Resmi Laporan</label>
              <input
                type="email"
                value={companyEmail}
                onChange={e => setCompanyEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Alamat Kantor Pusat</label>
              <input
                type="text"
                value={companyAddress}
                onChange={e => setCompanyAddress(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nomor Telepon Kontak</label>
              <input
                type="text"
                value={companyPhone}
                onChange={e => setCompanyPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Security & Watermark */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            <span>Watermark Keamanan &amp; Catatan Legalitas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Teks Watermark Latar Belakang</label>
              <select
                value={watermark}
                onChange={e => setWatermark(e.target.value as 'NONE' | 'CONFIDENTIAL' | 'INTERNAL_USE_ONLY' | 'STRICTLY_CONFIDENTIAL')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="NONE">NONE (Tanpa Watermark)</option>
                <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                <option value="INTERNAL_USE_ONLY">INTERNAL USE ONLY</option>
                <option value="STRICTLY_CONFIDENTIAL">STRICTLY CONFIDENTIAL</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Masa Retensi Berkas Tergenerate (Hari)</label>
              <input
                type="number"
                value={defaultRetentionDays}
                onChange={e => setDefaultRetentionDays(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Teks Catatan Kaki (Footer Legal Notice)</label>
              <textarea
                rows={2}
                value={reportFooterText}
                onChange={e => setReportFooterText(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Pengaturan</span>
          </button>

          {savedNotice && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4" />
              <span>Pengaturan berhasil disimpan!</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
