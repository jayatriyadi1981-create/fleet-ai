import React, { useState } from 'react';
import {
  Bell,
  Smartphone,
  Moon,
  ShieldAlert,
  Check,
  Plus,
  Trash2,
  Send,
  Laptop,
  Mail,
  MessageSquare,
  Radio,
} from 'lucide-react';
import { notificationPreferenceManager } from '../../../modules/notifications/services/notificationPreferenceManager';
import { NotificationEventType } from '../../../modules/notifications/types/notificationEngineTypes';

export const UserPreferencesTab: React.FC = () => {
  const [pref, setPref] = useState(() => notificationPreferenceManager.getPreferences());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testPushSent, setTestPushSent] = useState<string | null>(null);

  const handleToggleChannel = (
    event: NotificationEventType,
    channel: 'email' | 'push' | 'whatsapp' | 'sms' | 'inApp',
    value: boolean
  ) => {
    const updated = notificationPreferenceManager.toggleEventChannel('usr-current', event, channel, value);
    setPref({ ...updated });
    showSavedNotification();
  };

  const handleUpdateQuietHours = (field: 'enabled' | 'startTime' | 'endTime' | 'allowCriticalBypass', value: any) => {
    const updated = notificationPreferenceManager.updatePreferences('usr-current', {
      quietHours: {
        ...pref.quietHours,
        [field]: value,
      },
    });
    setPref({ ...updated });
    showSavedNotification();
  };

  const handleRemoveDevice = (deviceId: string) => {
    notificationPreferenceManager.removeDevice('usr-current', deviceId);
    setPref({ ...notificationPreferenceManager.getPreferences() });
  };

  const handleSendTestPush = (deviceId: string) => {
    setTestPushSent(deviceId);
    setTimeout(() => setTestPushSent(null), 2500);
  };

  const showSavedNotification = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const eventsList: Array<{ key: NotificationEventType; label: string; category: string }> = [
    { key: 'safety.panic_sos', label: '🚨 Panic SOS Tombol Darurat Driver', category: 'SAFETY' },
    { key: 'safety.accident_detected', label: '💥 Deteksi Benturan / Kecelakaan (G-Sensor)', category: 'SAFETY' },
    { key: 'gps.overspeed', label: '⚠️ Peringatan Overspeed / Kecepatan Tinggi', category: 'GPS' },
    { key: 'gps.offline', label: '📡 Perangkat GPS Hilang Sinyal / Offline', category: 'GPS' },
    { key: 'gps.tamper_detected', label: '🔌 Kabel GPS Dicabut / Tamper Anomali', category: 'GPS' },
    { key: 'fuel.drop_anomaly', label: '⛽ Penurunan BBM Drastis (Siphon Anomaly)', category: 'FUEL' },
    { key: 'maintenance.due_soon', label: '🔧 Jadwal Pemeliharaan Servis Berkala', category: 'MAINTENANCE' },
    { key: 'route.deviation', label: '🗺️ Deviasi Rute Pengiriman Logistik', category: 'ROUTE' },
    { key: 'driver.fatigue_detected', label: '😴 Kamera AI: Deteksi Kantuk & Kelelahan', category: 'DRIVER' },
    { key: 'ai.risk_recommendation', label: '🧠 AI Copilot: Rekomendasi Efisiensi Armada', category: 'AI' },
    { key: 'system.otp_verification', label: '🔐 Kode OTP / 2FA Verifikasi Login', category: 'SECURITY' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <span>User Notification Preferences & Multi-Device Token Registry</span>
          </h2>
          <p className="text-xs text-slate-400">
            Personalisasikan matriks channel penerimaan notifikasi, jam tenang (Quiet Hours), dan perangkat push aktif (FCM / APNs / VAPID).
          </p>
        </div>

        {savedSuccess && (
          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Preferensi Disimpan!</span>
          </span>
        )}
      </div>

      {/* Quiet Hours & Contact Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quiet Hours */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Jam Tenang (Quiet Hours Policy)</span>
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pref.quietHours.enabled}
                onChange={e => handleUpdateQuietHours('enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>

          <p className="text-xs text-slate-400">
            Hanya notifikasi prioritas rendah & normal yang akan disenyapkan selama jam istirahat.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1 text-xs">
              <label className="text-slate-400">Mulai Jam:</label>
              <input
                type="time"
                value={pref.quietHours.startTime}
                onChange={e => handleUpdateQuietHours('startTime', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
            <div className="space-y-1 text-xs">
              <label className="text-slate-400">Selesai Jam:</label>
              <input
                type="time"
                value={pref.quietHours.endTime}
                onChange={e => handleUpdateQuietHours('endTime', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs">
            <input
              type="checkbox"
              id="criticalBypass"
              checked={pref.quietHours.allowCriticalBypass}
              onChange={e => handleUpdateQuietHours('allowCriticalBypass', e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
            />
            <label htmlFor="criticalBypass" className="text-slate-300 font-semibold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Selalu izinkan Panic SOS & insiden CRITICAL menembus jam tenang</span>
            </label>
          </div>
        </div>

        {/* Registered Push Devices */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>Perangkat Terdaftar ({pref.registeredDevices.length})</span>
            </h3>
          </div>

          <p className="text-xs text-slate-400">
            Token push notification aktif untuk Android (FCM), iOS (APNs), dan Desktop Browser.
          </p>

          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {pref.registeredDevices.map(dev => (
              <div
                key={dev.deviceId}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {dev.platform === 'web' ? (
                    <Laptop className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="font-bold text-white truncate">{dev.deviceName}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">{dev.pushToken}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleSendTestPush(dev.deviceId)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs transition"
                    title="Kirim Test Push"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemoveDevice(dev.deviceId)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 text-xs transition"
                    title="Hapus Perangkat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {testPushSent && (
            <div className="text-[11px] text-emerald-400 font-bold animate-fade-in flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Test push notification berhasil dikirim ke perangkat!</span>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Channel Event Matrix */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          <span>Matriks Preferensi Channel per Kategori Event</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Kategori & Tipe Event</th>
                <th className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </div>
                </th>
                <th className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Push</span>
                  </div>
                </th>
                <th className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                    <span>Email</span>
                  </div>
                </th>
                <th className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                    <span>SMS</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {eventsList.map(item => {
                const setting = pref.eventPreferences[item.key] || {
                  email: false,
                  push: true,
                  whatsapp: false,
                  sms: false,
                  inApp: true,
                };

                return (
                  <tr key={item.key} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div>{item.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.key}</div>
                    </td>

                    {/* WhatsApp */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={setting.whatsapp}
                        onChange={e => handleToggleChannel(item.key, 'whatsapp', e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Push */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={setting.push}
                        onChange={e => handleToggleChannel(item.key, 'push', e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Email */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={setting.email}
                        onChange={e => handleToggleChannel(item.key, 'email', e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-purple-500 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* SMS */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={setting.sms}
                        onChange={e => handleToggleChannel(item.key, 'sms', e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
