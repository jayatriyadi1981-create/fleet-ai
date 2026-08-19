/**
 * Fleet Intelligence Smart AI - Incident War Room / Emergency Response Modal
 * Real-time incident command room for SOS Panic & Critical Fleet Accidents
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  X, 
  PhoneCall, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  MapPin, 
  Gauge, 
  Battery, 
  Fuel, 
  User, 
  Radio, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import { commandCenterService } from '../../services/commandCenterService';
import { EmergencyAlertItem, EscalationTier } from '../../types/commandCenterTypes';

interface EmergencyResponseModalProps {
  emergencyId: string;
  onClose: () => void;
  onOpenSmartDispatch: () => void;
  onCallDriver?: (phone: string, name: string) => void;
}

export const EmergencyResponseModal: React.FC<EmergencyResponseModalProps> = ({
  emergencyId,
  onClose,
  onOpenSmartDispatch,
  onCallDriver,
}) => {
  const emergencies = commandCenterService.getEmergencies();
  const emergency = emergencies.find((e) => e.id === emergencyId) || emergencies[0];

  const [notes, setNotes] = useState<string>('');
  const [operatorName, setOperatorName] = useState<string>('Operator Utama Command Center');
  const [isResolving, setIsResolving] = useState<boolean>(false);

  if (!emergency) return null;

  const handleAcknowledge = () => {
    commandCenterService.acknowledgeEmergency(emergency.id, operatorName, notes || 'Dikonfirmasi oleh operator.');
  };

  const handleResolve = () => {
    if (!notes) {
      alert('Harap masukkan catatan resolusi insiden sebelum menutup tiket.');
      return;
    }
    commandCenterService.resolveEmergency(emergency.id, operatorName, notes);
    onClose();
  };

  const handleEscalate = (tier: EscalationTier) => {
    commandCenterService.escalateEmergency(emergency.id, tier);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-rose-500 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-rose-950/80 px-6 py-4 border-b border-rose-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-lg animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-white bg-rose-700 px-2 py-0.5 rounded">
                  {emergency.plateNumber}
                </span>
                <span className="text-sm font-bold text-rose-300">
                  {emergency.type} INCIDENT ROOM
                </span>
              </div>
              <p className="text-xs text-rose-200 mt-0.5">
                Pusat Tanggap Darurat & Komando Lapangan 24/7
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-slate-700">
          {/* Main Incident Overview Banner */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Deskripsi Insiden</div>
              <p className="text-sm font-medium text-white mt-1 leading-relaxed">
                {emergency.description}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{emergency.location.address || 'Tol Jakarta-Cikampek KM 28.5'}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <span className="text-xs text-slate-400">Status Insiden:</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/50">
                {emergency.status}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Waktu: {new Date(emergency.triggeredAt).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Telemetry & Driver Snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Driver Profile */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-400" />
                Informasi Pengemudi
              </h3>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Driver:</span>
                  <span className="font-bold text-white">{emergency.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor Telepon:</span>
                  <span className="font-mono text-amber-400 font-semibold">{emergency.driverPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tier Eskalasi:</span>
                  <span className="font-bold text-emerald-400">{emergency.escalationTier}</span>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onCallDriver && onCallDriver(emergency.driverPhone, emergency.driverName)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Panggil Driver</span>
                </button>
                <button
                  onClick={onOpenSmartDispatch}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Smart Dispatch</span>
                </button>
              </div>
            </div>

            {/* Vehicle Telemetry */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-amber-400" />
                Status Telemetri Unit
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Kecepatan</div>
                  <div className="text-base font-mono font-bold text-white mt-0.5">
                    {emergency.currentSpeed} <span className="text-[10px] text-slate-400">km/h</span>
                  </div>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">BBM Tangki</div>
                  <div className="text-base font-mono font-bold text-amber-400 mt-0.5">
                    {emergency.fuelLevel}%
                  </div>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Tegangan Aki</div>
                  <div className="text-base font-mono font-bold text-emerald-400 mt-0.5">
                    {emergency.batteryLevel}%
                  </div>
                </div>
              </div>

              {/* Multi-Channel Broadcast Status */}
              <div className="mt-3 pt-3 border-t border-slate-800 text-[11px]">
                <div className="text-slate-400 mb-1 font-semibold">Broadcast Notifikasi Terkirim:</div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-semibold">
                    ✓ WhatsApp
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-semibold">
                    ✓ SMS Gateway
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-semibold">
                    ✓ Mobile Push
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-semibold">
                    ✓ Email Alert
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Escalation Control Buttons */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Eskalasi Tingkat Tanggap Darurat:
            </div>
            <div className="flex flex-wrap gap-2">
              {(['DISPATCHER', 'SAFETY_OFFICER', 'FLEET_MANAGER', 'EXECUTIVE_ADMIN'] as EscalationTier[]).map((tier) => (
                <button
                  key={tier}
                  onClick={() => handleEscalate(tier)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    emergency.escalationTier === tier
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Operator Action / Resolution Notes Form */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Log Resolusi & Tindakan Operator:
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tuliskan catatan penanganan insiden, verifikasi kondisi pengemudi, armada pengganti, atau kronologi..."
              className="w-full h-24 p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />

            <div className="flex items-center justify-between pt-2">
              {emergency.status === 'ACTIVE' ? (
                <button
                  onClick={handleAcknowledge}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow transition-colors"
                >
                  Acknowledge Penerimaan Insiden (ACK)
                </button>
              ) : (
                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Insiden telah dikonfirmasi oleh {emergency.acknowledgedBy?.userName || 'Operator'}
                </div>
              )}

              <button
                onClick={handleResolve}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-colors"
              >
                Selesaikan Insiden & Tutup Tiket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
