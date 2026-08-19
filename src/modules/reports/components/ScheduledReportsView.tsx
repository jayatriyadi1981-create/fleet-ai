/**
 * Fleet Intelligence Smart AI - Scheduled Reports View
 * PROMPT 39 - Automated Recurring Report Deliveries, Multi-Channel Notifications & Cron Triggers
 */

import React, { useState } from 'react';
import { useReports } from '../context/ReportContext';
import {
  Clock,
  Mail,
  Smartphone,
  MessageCircle,
  Play,
  Trash2,
  CheckCircle2,
  Plus,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Send,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { ReportSchedule, ReportExportFormat, ReportDeliveryChannel, ReportScheduleFrequency } from '../types';

export const ScheduledReportsView: React.FC = () => {
  const { schedules, toggleSchedule, runScheduleNow, deleteSchedule, createSchedule, templates } = useReports();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<ReportScheduleFrequency>('WEEKLY');
  const [timeOfDay, setTimeOfDay] = useState('08:00');
  const [recipientsStr, setRecipientsStr] = useState('executive@fleet-smart.ai, operations@fleet-smart.ai');
  const [selectedFormats, setSelectedFormats] = useState<ReportExportFormat[]>(['PDF', 'EXCEL']);
  const [selectedChannels, setSelectedChannels] = useState<ReportDeliveryChannel[]>(['EMAIL', 'IN_APP']);
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || '');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tpl = templates.find(t => t.id === selectedTemplateId) || templates[0];
    const recipients = recipientsStr.split(',').map(r => r.trim()).filter(Boolean);

    createSchedule({
      name,
      templateId: selectedTemplateId,
      reportType: tpl.type,
      subType: tpl.subType,
      frequency,
      timeOfDay,
      timezone: 'Asia/Jakarta',
      recipients,
      formats: selectedFormats,
      channels: selectedChannels,
      filters: tpl.filters,
      aiSummaryEnabled: true,
      enabled: true,
      nextRunAt: '2026-08-24T08:00:00Z',
      createdBy: 'Executive User',
    });

    setIsCreateModalOpen(false);
    setName('');
  };

  const toggleFormat = (fmt: ReportExportFormat) => {
    setSelectedFormats(prev => prev.includes(fmt) ? prev.filter(f => f !== fmt) : [...prev, fmt]);
  };

  const toggleChannel = (chn: ReportDeliveryChannel) => {
    setSelectedChannels(prev => prev.includes(chn) ? prev.filter(c => c !== chn) : [...prev, chn]);
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Jadwal Pengiriman Laporan Otomatis ({schedules.length})</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Laporan dibuat dan dikirimkan secara otomatis via Email, Notifikasi In-App, Push &amp; WhatsApp sesuai jadwal
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-md shadow-cyan-600/20"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Jadwal Baru</span>
        </button>
      </div>

      {/* Schedules List */}
      <div className="space-y-3">
        {schedules.map(sch => (
          <div
            key={sch.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {sch.frequency} @ {sch.timeOfDay} WIB
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {sch.reportType}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  sch.enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'
                }`}>
                  {sch.enabled ? 'Aktif' : 'Dijeda'}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{sch.name}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>Penerima: <strong className="text-slate-300">{sch.recipients.join(', ')}</strong></span>
                </div>
              </div>

              {/* Delivery Formats & Channels badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>Format:</span>
                  {sch.formats.map(f => (
                    <span key={f} className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {f}
                    </span>
                  ))}
                </div>
                <span className="text-slate-600">•</span>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>Kanal:</span>
                  {sch.channels.map(c => (
                    <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 flex items-center gap-1">
                      {c === 'EMAIL' ? <Mail className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
                      <span>{c}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
              <button
                onClick={() => runScheduleNow(sch.id)}
                title="Eksekusi pembuatan laporan sekarang"
                className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
              >
                <Play className="h-3.5 w-3.5 fill-current text-cyan-400" />
                <span>Jalankan Sekarang</span>
              </button>

              <button
                onClick={() => toggleSchedule(sch.id)}
                title={sch.enabled ? 'Jeda Jadwal' : 'Aktifkan Jadwal'}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                {sch.enabled ? (
                  <ToggleRight className="h-5 w-5 text-emerald-400" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-slate-500" />
                )}
              </button>

              <button
                onClick={() => deleteSchedule(sch.id)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Schedule Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Buat Jadwal Otomatis Baru</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Jadwal Laporan</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Contoh: Laporan Operasional Mingguan GM"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pilih Template Acuan</label>
                <select
                  value={selectedTemplateId}
                  onChange={e => setSelectedTemplateId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.type})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Frekuensi</label>
                  <select
                    value={frequency}
                    onChange={e => setFrequency(e.target.value as ReportScheduleFrequency)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="DAILY">Harian (Setiap Hari)</option>
                    <option value="WEEKLY">Mingguan (Setiap Senin)</option>
                    <option value="MONTHLY">Bulanan (Tanggal 1)</option>
                    <option value="QUARTERLY">Kuartalan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Waktu Kirim (WIB)</label>
                  <input
                    type="time"
                    value={timeOfDay}
                    onChange={e => setTimeOfDay(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Penerima (Dipisahkan koma)</label>
                <input
                  type="text"
                  value={recipientsStr}
                  onChange={e => setRecipientsStr(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Format Lampiran</label>
                <div className="flex items-center gap-2">
                  {(['PDF', 'EXCEL', 'CSV'] as ReportExportFormat[]).map(fmt => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => toggleFormat(fmt)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                        selectedFormats.includes(fmt)
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kanal Pengiriman</label>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'EMAIL', label: 'Email' },
                    { id: 'IN_APP', label: 'In-App' },
                    { id: 'PUSH', label: 'Push Mobile' },
                    { id: 'WHATSAPP', label: 'WhatsApp' },
                  ].map(chn => (
                    <button
                      key={chn.id}
                      type="button"
                      onClick={() => toggleChannel(chn.id as ReportDeliveryChannel)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                        selectedChannels.includes(chn.id as ReportDeliveryChannel)
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {chn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20"
                >
                  Simpan &amp; Aktifkan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
