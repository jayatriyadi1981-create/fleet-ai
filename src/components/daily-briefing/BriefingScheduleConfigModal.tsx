/**
 * Fleet Intelligence Smart AI - Daily Briefing Schedule & Channel Configuration Modal
 */

import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Mail, 
  MessageSquare, 
  Bell, 
  Shield, 
  Save, 
  CheckCircle2, 
  Globe,
  Smartphone
} from 'lucide-react';
import { DailyBriefingScheduleConfig } from '../../types/dailyBriefing';
import { DailyBriefingRepository } from '../../services/dailyBriefing/dailyBriefingRepository';

interface BriefingScheduleConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId?: string;
  onConfigSaved?: (newConfig: DailyBriefingScheduleConfig) => void;
}

export const BriefingScheduleConfigModal: React.FC<BriefingScheduleConfigModalProps> = ({
  isOpen,
  onClose,
  tenantId = 'tenant-1',
  onConfigSaved,
}) => {
  const [config, setConfig] = useState<DailyBriefingScheduleConfig>(() => 
    DailyBriefingRepository.getScheduleConfig(tenantId)
  );
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    DailyBriefingRepository.saveScheduleConfig(config);
    setIsSavedSuccess(true);
    if (onConfigSaved) onConfigSaved(config);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const addEmail = () => {
    if (emailInput.trim() && !config.emailRecipients.includes(emailInput.trim())) {
      setConfig({
        ...config,
        emailRecipients: [...config.emailRecipients, emailInput.trim()],
      });
      setEmailInput('');
    }
  };

  const removeEmail = (email: string) => {
    setConfig({
      ...config,
      emailRecipients: config.emailRecipients.filter(e => e !== email),
    });
  };

  const addPhone = () => {
    if (phoneInput.trim() && !config.whatsappRecipients.includes(phoneInput.trim())) {
      setConfig({
        ...config,
        whatsappRecipients: [...config.whatsappRecipients, phoneInput.trim()],
      });
      setPhoneInput('');
    }
  };

  const removePhone = (phone: string) => {
    setConfig({
      ...config,
      whatsappRecipients: config.whatsappRecipients.filter(p => p !== phone),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pengaturan Jadwal & Notifikasi Briefing Harian AI
              </h3>
              <p className="text-xs text-slate-500">
                Otomatisasi pengiriman laporan harian pukul 06:00 WIB ke tim manajemen
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Main Toggle & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Status Otomatisasi Harian</label>
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, isEnabled: !config.isEnabled })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    config.isEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      config.isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="font-semibold text-slate-700">
                  {config.isEnabled ? 'Aktif (Auto-Generate 06:00)' : 'Non-Aktif (Manual Saja)'}
                </span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Zona Waktu Operasional</label>
              <select
                value={config.timezone}
                onChange={e => setConfig({ ...config, timezone: e.target.value as any })}
                className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Asia/Jakarta">WIB (Asia/Jakarta - UTC+7)</option>
                <option value="Asia/Makassar">WITA (Asia/Makassar - UTC+8)</option>
                <option value="Asia/Jayapura">WIT (Asia/Jayapura - UTC+9)</option>
              </select>
            </div>
          </div>

          {/* Distribution Channels */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Kanal Distribusi Laporan
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                config.channels.inApp ? 'bg-indigo-50/60 border-indigo-300 text-indigo-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <input
                  type="checkbox"
                  checked={config.channels.inApp}
                  onChange={e => setConfig({ ...config, channels: { ...config.channels, inApp: e.target.checked } })}
                  className="sr-only"
                />
                <Bell className="w-5 h-5 text-indigo-600" />
                <span>In-App Feed</span>
              </label>

              <label className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                config.channels.email ? 'bg-indigo-50/60 border-indigo-300 text-indigo-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <input
                  type="checkbox"
                  checked={config.channels.email}
                  onChange={e => setConfig({ ...config, channels: { ...config.channels, email: e.target.checked } })}
                  className="sr-only"
                />
                <Mail className="w-5 h-5 text-blue-600" />
                <span>Email PDF</span>
              </label>

              <label className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                config.channels.whatsapp ? 'bg-indigo-50/60 border-indigo-300 text-indigo-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <input
                  type="checkbox"
                  checked={config.channels.whatsapp}
                  onChange={e => setConfig({ ...config, channels: { ...config.channels, whatsapp: e.target.checked } })}
                  className="sr-only"
                />
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>WhatsApp Bot</span>
              </label>

              <label className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                config.channels.push ? 'bg-indigo-50/60 border-indigo-300 text-indigo-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <input
                  type="checkbox"
                  checked={config.channels.push}
                  onChange={e => setConfig({ ...config, channels: { ...config.channels, push: e.target.checked } })}
                  className="sr-only"
                />
                <Smartphone className="w-5 h-5 text-purple-600" />
                <span>Mobile Push</span>
              </label>
            </div>
          </div>

          {/* Email Recipients */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 block">Daftar Email Penerima Laporan Eksekutif</label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="masukkan.email@perusahaan.co.id"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addEmail())}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              />
              <button
                type="button"
                onClick={addEmail}
                className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors"
              >
                Tambah
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {config.emailRecipients.map(e => (
                <span key={e} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium border border-slate-200">
                  {e}
                  <button type="button" onClick={() => removeEmail(e)} className="text-slate-400 hover:text-rose-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* WhatsApp Recipients */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 block">Nomor WhatsApp Manajemen / Grup Ops</label>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="+6281234567890"
                value={phoneInput}
                onChange={e => setPhoneInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addPhone())}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              />
              <button
                type="button"
                onClick={addPhone}
                className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors"
              >
                Tambah
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {config.whatsappRecipients.map(p => (
                <span key={p} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
                  {p}
                  <button type="button" onClick={() => removePhone(p)} className="text-emerald-500 hover:text-rose-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Auto Task Creation Toggle */}
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Auto-Create Task untuk Isu Kritis</div>
              <p className="text-slate-500 mt-0.5">
                Secara otomatis membuat Surat Perintah Kerja (SPK) darurat jika skor risiko komponen &gt; 80%
              </p>
            </div>
            <input
              type="checkbox"
              checked={config.autoCreateTasksForCritical}
              onChange={e => setConfig({ ...config, autoCreateTasksForCritical: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {isSavedSuccess && (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Pengaturan berhasil disimpan!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Save className="w-4 h-4" />
              Simpan Konfigurasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
