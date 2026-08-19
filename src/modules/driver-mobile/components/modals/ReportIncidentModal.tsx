import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Camera,
  X,
  Send,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { driverSessionService } from '../../services/driverSessionService';
import { IncidentReportPayload } from '../../types/driverMobileTypes';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted: (incident: IncidentReportPayload) => void;
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  onClose,
  onCompleted,
}) => {
  const [type, setType] = useState<IncidentReportPayload['type']>('NEAR_MISS');
  const [severity, setSeverity] = useState<IncidentReportPayload['severity']>('MEDIUM');
  const [location, setLocation] = useState('Tol Jakarta-Cikampek KM 48');
  const [description, setDescription] = useState('');
  const [peopleInvolved, setPeopleInvolved] = useState('Driver & Pengendara Lain');
  const [photosCount, setPhotosCount] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const inc = driverSessionService.reportIncident({
        vehicleId: 'veh-01',
        type,
        severity,
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        location,
        coordinates: { lat: -6.3211, lng: 107.2184 },
        description: description || 'Insiden keselamatan lalu lintas dilaporkan oleh driver armada.',
        peopleInvolved,
        photos: [
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1586191582152-70b54e3cbba3?w=500&auto=format&fit=crop',
        ],
      });

      onCompleted(inc);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-white shadow-2xl flex flex-col space-y-4 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Lapor Insiden / Kejadian (Safety)</h2>
              <p className="text-[11px] text-slate-400">Armada Isuzu Giga FVR (B 9128 UXT)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Incident Type */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">Jenis Insiden / Kejadian:</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500"
            >
              <option value="NEAR_MISS">Near Miss (Hampir Terjadi Tabrakan / Insiden)</option>
              <option value="ACCIDENT">Kecelakaan Lalu Lintas (Accident)</option>
              <option value="VEHICLE_DAMAGE">Kerusakan Fisik Kendaraan di Jalan</option>
              <option value="ROAD_HAZARD">Bahaya Kondisi Jalan / Longsor / Banjir</option>
              <option value="CUSTOMER_INCIDENT">Insiden di Lokasi Customer / Bongkar Muat</option>
              <option value="OTHER">Kejadian Lainnya</option>
            </select>
          </div>

          {/* Severity */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">Tingkat Keparahan (Severity):</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map(sev => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverity(sev)}
                  className={`py-2 rounded-xl text-[10px] font-bold transition border ${
                    severity === sev
                      ? sev === 'CRITICAL'
                        ? 'bg-rose-600 text-white border-rose-500'
                        : sev === 'HIGH'
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">Lokasi Kejadian & Landmark:</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Contoh: Tol Japek KM 48 arah Cikampek..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">Deskripsi Kronologi Kejadian:</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ceritakan kronologi singkat insiden, kondisi cuaca, dan tindakan awal yang telah diambil..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-500"
            />
          </div>

          {/* Photo Evidence */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="font-bold text-white text-xs">Foto Bukti Kerusakan & TKP</div>
                <div className="text-[10px] text-emerald-400 font-mono">{photosCount} Foto Terlampir + GPS Tag</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPhotosCount(prev => prev + 1)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-bold hover:border-cyan-500"
            >
              Tambah Foto
            </button>
          </div>

          {/* AI Analysis Preview */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-950 border border-cyan-500/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart AI Incident Assistant</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Setelah dikirim, AI akan otomatis mengklasifikasikan insiden, mengidentifikasi faktor risiko, dan memberikan rekomendasi pencegahan ke tim Safety.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 pt-3 shrink-0 flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
          >
            Batal
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Mengirim...' : 'Kirim Laporan Insiden'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
