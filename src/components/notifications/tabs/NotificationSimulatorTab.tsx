import React, { useState } from 'react';
import {
  Zap,
  Play,
  CheckCircle2,
  AlertTriangle,
  Send,
  MessageSquare,
  Smartphone,
  Mail,
  Radio,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { NotificationEventType, NotificationChannel } from '../../../modules/notifications/types/notificationEngineTypes';
import { notificationEngine } from '../../../modules/notifications/core/NotificationEngine';
import { DispatchResult } from '../../../modules/notifications/core/NotificationOrchestrator';

interface ScenarioPreset {
  id: string;
  name: string;
  description: string;
  event: NotificationEventType;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  defaultChannels: NotificationChannel[];
  variables: Record<string, string | number>;
}

const PRESET_SCENARIOS: ScenarioPreset[] = [
  {
    id: 'sc-panic',
    name: '🚨 Panic SOS Tombol Darurat Driver (CRITICAL)',
    description: 'Tombol SOS ditekan driver saat insiden darurat di jalur Pantura. Menembus Quiet Hours dan disiarkan ke WhatsApp, SMS, Push, dan Email secara paralel.',
    event: 'safety.panic_sos',
    priority: 'CRITICAL',
    defaultChannels: ['WHATSAPP', 'SMS', 'PUSH', 'EMAIL'],
    variables: {
      driverName: 'Budi Santoso',
      vehiclePlate: 'B 9128 UXT',
      location: 'Pantura Subang KM 42 (Dekat Jembatan Sewo)',
      timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
      coordinates: '-6.34211, 107.82194',
    },
  },
  {
    id: 'sc-overspeed',
    name: '⚠️ Peringatan Overspeed 104 km/jam di Tol Cipali',
    description: 'Unit melaju di atas batas 80 km/jam. Evaluasi rule cooldown 10 menit dan kirim notifikasi ke WhatsApp Driver & Push Dispatcher.',
    event: 'gps.overspeed',
    priority: 'HIGH',
    defaultChannels: ['WHATSAPP', 'PUSH'],
    variables: {
      driverName: 'Agus Pratama',
      vehiclePlate: 'B 8821 PO',
      speed: 104,
      speedLimit: 80,
      location: 'Tol Cipali KM 102 (Arah Cirebon)',
      timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
    },
  },
  {
    id: 'sc-fuel',
    name: '⛽ Fuel Drop Siphon Anomaly (-28 Liter)',
    description: 'Anomali penurunan tangki BBM drastis saat mesin mati di Rest Area KM 57.',
    event: 'fuel.drop_anomaly',
    priority: 'HIGH',
    defaultChannels: ['WHATSAPP', 'PUSH', 'EMAIL'],
    variables: {
      vehiclePlate: 'B 7731 XYZ',
      dropLiters: 28,
      ignitionStatus: 'MATI (Off)',
      location: 'Rest Area KM 57 Tol Jakarta-Cikampek',
      timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
    },
  },
  {
    id: 'sc-maintenance',
    name: '🔧 Jadwal Servis Berkala Mendekati Batas',
    event: 'maintenance.due_soon',
    priority: 'NORMAL',
    defaultChannels: ['EMAIL', 'WHATSAPP'],
    description: 'Odometer mencapai 49.850 km mendekati jadwal servis berkala 50.000 KM.',
    variables: {
      driverName: 'Siti Rahma',
      vehiclePlate: 'B 3320 TAA',
      odometer: '49.850',
      serviceType: 'Servis 50.000 KM & Ganti Oli Mesin',
      dueDate: '25 Agustus 2026',
    },
  },
  {
    id: 'sc-ai-copilot',
    name: '🧠 AI Copilot: Rekomendasi Rute & Efisiensi BBM',
    event: 'ai.risk_recommendation',
    priority: 'NORMAL',
    defaultChannels: ['PUSH', 'EMAIL'],
    description: 'Insight cerdas AI Gemini merekomendasikan penyesuaian rute lingkar luar.',
    variables: {
      companyName: 'PT Nusantara Logistik Express',
      recommendationTitle: 'Optimasi Rute Cikampek - Penghematan 14.2% BBM',
      summary: 'Hindari jalur arteri pada jam sibuk 16:00-19:00 untuk menghemat rata-rata 3.2 jam perjalanan armada.',
      riskLevel: 'SEDANG',
      potentialImpact: 'Rp 4.250.000/bulan',
    },
  },
  {
    id: 'sc-otp',
    name: '🔐 Kode OTP / 2FA SMS Verification',
    event: 'system.otp_verification',
    priority: 'HIGH',
    defaultChannels: ['SMS', 'WHATSAPP'],
    description: 'Pengiriman token verifikasi login 2FA via SMS Telkomsel / WhatsApp.',
    variables: {
      otpCode: '849201',
      expiryMinutes: 5,
    },
  },
];

interface NotificationSimulatorTabProps {
  onEventDispatched: () => void;
}

export const NotificationSimulatorTab: React.FC<NotificationSimulatorTabProps> = ({
  onEventDispatched,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioPreset>(PRESET_SCENARIOS[0]);
  const [selectedChannels, setSelectedChannels] = useState<NotificationChannel[]>(PRESET_SCENARIOS[0].defaultChannels);
  const [isSimulating, setIsSimulating] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<DispatchResult | null>(null);

  const handleSelectScenario = (sc: ScenarioPreset) => {
    setSelectedScenario(sc);
    setSelectedChannels(sc.defaultChannels);
    setDispatchResult(null);
  };

  const handleToggleChannel = (ch: NotificationChannel) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter(c => c !== ch));
      }
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setDispatchResult(null);

    try {
      const res = await notificationEngine.trigger(
        selectedScenario.event,
        'tenant-indonesia-logistics',
        selectedScenario.variables,
        {
          priority: selectedScenario.priority,
          forceChannels: selectedChannels,
          deepLink: '/app/alerts',
        }
      );
      setDispatchResult(res);
      onEventDispatched();
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span>Interactive Telematics Notification Simulator</span>
          </h2>
          <p className="text-xs text-slate-400">
            Uji alur lengkap orkestrasi notifikasi: Ingest Event &rarr; Evaluasi Aturan &rarr; Interpolasi Template &rarr; Provider Abstraction &rarr; Failover &rarr; Log & Audit.
          </p>
        </div>
      </div>

      {/* Main Grid: Scenario Selector & Live Pipeline Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Scenarios Catalog (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Pilih Skenario Telematika
          </h3>

          <div className="space-y-2">
            {PRESET_SCENARIOS.map(sc => (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`w-full text-left p-4 rounded-2xl border transition space-y-1.5 ${
                  selectedScenario.id === sc.id
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-white ring-1 ring-cyan-500/20'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      sc.priority === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {sc.priority}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{sc.event}</span>
                </div>
                <div className="font-bold text-white text-xs">{sc.name}</div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {sc.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Simulation Controls & Pipeline Execution Result (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedScenario.name}</h3>
                <p className="text-[11px] text-slate-400 font-mono">Event: {selectedScenario.event}</p>
              </div>

              <button
                disabled={isSimulating}
                onClick={handleRunSimulation}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isSimulating ? 'Memproses Dispatch...' : 'Jalankan Simulasi'}</span>
              </button>
            </div>

            {/* Target Channels Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Pilih Multi-Channel Pengiriman:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['WHATSAPP', 'PUSH', 'EMAIL', 'SMS'] as const).map(ch => {
                  const isChecked = selectedChannels.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => handleToggleChannel(ch)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        isChecked
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {ch === 'WHATSAPP' && <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
                      {ch === 'PUSH' && <Smartphone className="w-3.5 h-3.5 text-cyan-400" />}
                      {ch === 'EMAIL' && <Mail className="w-3.5 h-3.5 text-purple-400" />}
                      {ch === 'SMS' && <Radio className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{ch}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Variable Payload Preview */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Payload Variabel Simulasi (JSON):
              </label>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 font-mono overflow-x-auto">
                {JSON.stringify(selectedScenario.variables, null, 2)}
              </pre>
            </div>
          </div>

          {/* Dispatch Results Pipeline Trace */}
          {dispatchResult && (
            <div className="p-6 rounded-2xl bg-slate-900/95 border border-cyan-500/30 shadow-2xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Simulasi Berhasil Dieksekusi</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Event ID: {dispatchResult.eventId}</span>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-300">Hasil Pengiriman per Channel:</h4>
                <div className="space-y-2">
                  {dispatchResult.dispatchedChannels.map((chRes, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded uppercase font-bold text-[10px] bg-slate-900 text-cyan-300 border border-slate-800 font-mono">
                          {chRes.channel}
                        </span>
                        <div>
                          <div className="font-bold text-white">{chRes.provider}</div>
                          <div className="text-[11px] text-slate-400 font-mono">Penerima: {chRes.recipient}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            chRes.success
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {chRes.status}
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {chRes.costEstimated ? `Rp ${chRes.costEstimated}` : 'Gratis'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
