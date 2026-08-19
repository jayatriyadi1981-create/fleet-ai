/**
 * Fleet Intelligence Smart AI - Notification Preferences Tab Component
 */

import React, { useState } from 'react';
import { notificationPreferenceService } from '../services/notificationPreferenceService';
import { DeliveryChannel, NotificationPriority, NotificationCategory } from '../types';
import {
  Sliders,
  Bell,
  Smartphone,
  Mail,
  MessageSquare,
  MessageCircle,
  Moon,
  ShieldCheck,
  Check,
  Monitor,
  Laptop,
} from 'lucide-react';

export const NotificationPreferencesTab: React.FC = () => {
  const [pref, setPref] = useState(() => notificationPreferenceService.getPreference('usr-001'));
  const [devices, setDevices] = useState(() => notificationPreferenceService.getUserDevices('usr-001'));
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleMatrix = (priority: NotificationPriority, channel: DeliveryChannel) => {
    const updatedMatrix = {
      ...pref.matrix,
      [priority]: {
        ...pref.matrix[priority],
        [channel]: !pref.matrix[priority][channel],
      },
    };
    const updated = notificationPreferenceService.updatePreference('usr-001', { matrix: updatedMatrix });
    setPref({ ...updated });
  };

  const handleToggleCategory = (cat: NotificationCategory) => {
    const updatedCat = {
      ...pref.categoryPreferences,
      [cat]: !pref.categoryPreferences[cat],
    };
    const updated = notificationPreferenceService.updatePreference('usr-001', { categoryPreferences: updatedCat });
    setPref({ ...updated });
  };

  const handleQuietHoursChange = (field: string, value: any) => {
    const updatedQuiet = {
      ...pref.quietHours,
      [field]: value,
    };
    const updated = notificationPreferenceService.updatePreference('usr-001', { quietHours: updatedQuiet });
    setPref({ ...updated });
  };

  const handleDigestChange = (freq: any) => {
    const updated = notificationPreferenceService.updatePreference('usr-001', { digestFrequency: freq });
    setPref({ ...updated });
  };

  const handleToggleDevice = (deviceId: string, enabled: boolean) => {
    notificationPreferenceService.toggleDevice(deviceId, enabled);
    setDevices([...notificationPreferenceService.getUserDevices('usr-001')]);
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const channels: { id: DeliveryChannel; label: string; icon: any }[] = [
    { id: 'IN_APP', label: 'In-App', icon: Bell },
    { id: 'PUSH', label: 'Push', icon: Smartphone },
    { id: 'EMAIL', label: 'Email', icon: Mail },
    { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageSquare },
    { id: 'SMS', label: 'SMS', icon: MessageCircle },
  ];

  const priorities: NotificationPriority[] = ['CRITICAL', 'HIGH', 'NORMAL', 'LOW'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            Pengaturan & Matriks Kanal Notifikasi (Notification Preferences)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Konfigurasi penerimaan pesan per kanal, kategori isu, mode Quiet Hours, serta pendaftaran perangkat seluler.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-950 transition-all flex items-center gap-2"
        >
          {savedSuccess ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Pengaturan'}</span>
        </button>
      </div>

      {/* 1. Multi-Channel Preference Matrix */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-md">
        <h3 className="font-bold text-white text-sm">1. Matriks Distribusi Kanal per Prioritas Insiden</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 font-semibold">
              <tr>
                <th className="p-3">Prioritas Insiden</th>
                {channels.map((ch) => {
                  const Icon = ch.icon;
                  return (
                    <th key={ch.id} className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{ch.label}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {priorities.map((pri) => (
                <tr key={pri} className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold font-mono">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] ${
                        pri === 'CRITICAL'
                          ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                          : pri === 'HIGH'
                          ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                          : pri === 'NORMAL'
                          ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                          : 'text-slate-400 bg-slate-800'
                      }`}
                    >
                      {pri}
                    </span>
                  </td>
                  {channels.map((ch) => {
                    const isChecked = pref.matrix[pri]?.[ch.id] ?? false;
                    return (
                      <td key={ch.id} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleMatrix(pri, ch.id)}
                          className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 h-4 w-4 cursor-pointer"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. Quiet Hours Settings */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-400" />
              2. Jam Tenang (Quiet Hours)
            </h3>
            <input
              type="checkbox"
              checked={pref.quietHours.enabled}
              onChange={(e) => handleQuietHoursChange('enabled', e.target.checked)}
              className="rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-0 h-4 w-4 cursor-pointer"
            />
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Membatasi notifikasi suara/push seluler pada jam istirahat malam hari.
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Mulai Jam</label>
              <input
                type="time"
                value={pref.quietHours.startTime}
                onChange={(e) => handleQuietHoursChange('startTime', e.target.value)}
                disabled={!pref.quietHours.enabled}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Selesai Jam</label>
              <input
                type="time"
                value={pref.quietHours.endTime}
                onChange={(e) => handleQuietHoursChange('endTime', e.target.value)}
                disabled={!pref.quietHours.enabled}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              checked={pref.quietHours.bypassForCritical}
              onChange={(e) => handleQuietHoursChange('bypassCritical', e.target.checked)}
              disabled={!pref.quietHours.enabled}
              className="rounded border-slate-700 bg-slate-900 text-rose-500 focus:ring-0 h-4 w-4 cursor-pointer"
            />
            <span className="text-slate-200 font-semibold">Bypass untuk Insiden CRITICAL (Tetap Dikirim)</span>
          </div>
        </div>

        {/* 3. Notification Digest Preferences */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-md">
          <h3 className="font-bold text-white text-sm">3. Frekuensi Rangkuman (Digest Mode)</h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Mencegah luapan pesan dengan mengonsolidasikan notifikasi tingkat rendah ke dalam satu laporan berkala.
          </p>

          <div className="space-y-2 text-xs">
            {[
              { id: 'IMMEDIATE', label: 'Realtime Langsung (Immediate Dispatch)' },
              { id: 'HOURLY', label: 'Digest Setiap Jam (Hourly Summary)' },
              { id: 'DAILY', label: 'Digest Harian Pkl 08:00 WIB (Daily Summary)' },
              { id: 'WEEKLY', label: 'Digest Mingguan Setiap Hari Senin (Weekly Summary)' },
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-3 p-2.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="radio"
                  name="digest"
                  checked={pref.digestFrequency === opt.id}
                  onChange={() => handleDigestChange(opt.id)}
                  className="text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-slate-200 font-semibold">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Registered User Devices */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-md">
        <h3 className="font-bold text-white text-sm">4. Perangkat Terdaftar untuk Push Notification (User Devices)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((dev) => (
            <div key={dev.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-900 text-cyan-400 rounded-xl border border-slate-800">
                  {dev.platform === 'WEB' ? <Monitor className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                </div>
                <div>
                  <span className="font-bold text-white block">{dev.deviceName}</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {dev.platform} • {dev.osVersion} • {dev.appVersion}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={dev.enabled}
                  onChange={(e) => handleToggleDevice(dev.id, e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 h-4 w-4 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
