/**
 * Fleet Intelligence Smart AI - Command Center Right Tactical Panel
 * Emergency SOS Alert Queue, Critical Operations Stream & Operator ACK Interface
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Radio, 
  ChevronRight, 
  ChevronLeft, 
  PhoneCall, 
  Send, 
  Flame, 
  Activity, 
  FileText,
  UserCheck
} from 'lucide-react';
import { commandCenterService } from '../../services/commandCenterService';
import { EmergencyAlertItem, CommandAlertItem } from '../../types/commandCenterTypes';

interface CommandCenterRightPanelProps {
  onOpenEmergencyModal: (emergencyId: string) => void;
  onOpenAckModal: (target: CommandAlertItem | EmergencyAlertItem) => void;
  onOpenDispatch: () => void;
  onCallDriver?: (phone: string, name: string) => void;
}

export const CommandCenterRightPanel: React.FC<CommandCenterRightPanelProps> = ({
  onOpenEmergencyModal,
  onOpenAckModal,
  onOpenDispatch,
  onCallDriver,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [emergencies, setEmergencies] = useState<EmergencyAlertItem[]>(commandCenterService.getEmergencies());
  const [alerts, setAlerts] = useState<CommandAlertItem[]>(commandCenterService.getCommandAlerts());

  useEffect(() => {
    const update = () => {
      setEmergencies(commandCenterService.getEmergencies());
      setAlerts(commandCenterService.getCommandAlerts());
    };
    update();
    const unsubscribe = commandCenterService.subscribe(update);
    return unsubscribe;
  }, []);

  const activeEmergencies = emergencies.filter((e) => e.status !== 'RESOLVED');
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical' || !a.acknowledged);

  return (
    <aside
      className={`relative bg-slate-900/95 backdrop-blur-md border-l border-slate-800 text-slate-100 flex flex-col transition-all duration-300 z-20 ${
        isCollapsed ? 'w-12' : 'w-80 lg:w-96'
      }`}
    >
      {/* Collapse / Expand Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-3.5 top-12 w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center shadow-lg z-30 transition-colors"
      >
        {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {isCollapsed ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative">
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-2 rounded-lg bg-rose-600/30 text-rose-300 border border-rose-500/50"
              title="Emergency SOS"
            >
              <ShieldAlert className="w-5 h-5 animate-pulse text-rose-400" />
            </button>
            {activeEmergencies.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 bg-rose-500 text-[9px] font-bold text-white rounded-full items-center justify-center">
                {activeEmergencies.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-lg bg-slate-800 text-amber-400"
            title="Alerts Operasional"
          >
            <AlertTriangle className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <>
          {/* Header Bar */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Pusat Tanggap Insiden & Alert
              </h2>
            </div>
            <span className="text-[11px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              {activeEmergencies.length} Darurat
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
            {/* SECTION 1: EMERGENCY SOS (HIGHEST PRIORITY) */}
            <div>
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-rose-950/60">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  Panggilan Darurat SOS Aktif
                </span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-1.5 py-0.5 rounded">
                  PRIORITAS UTAMA
                </span>
              </div>

              {activeEmergencies.length === 0 ? (
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  Tidak ada panggilan darurat (SOS) aktif.
                </div>
              ) : (
                <div className="space-y-2">
                  {activeEmergencies.map((emg) => (
                    <div
                      key={emg.id}
                      className="p-3 rounded-xl bg-rose-950/40 border-2 border-rose-500/80 shadow-lg shadow-rose-950/50 text-slate-100 animate-in fade-in"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-white bg-rose-600 px-1.5 py-0.5 rounded">
                              {emg.plateNumber}
                            </span>
                            <span className="text-xs font-bold text-rose-300">
                              {emg.type}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-white mt-1">
                            {emg.driverName} • {emg.driverPhone}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200 border border-rose-500/50">
                          {emg.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800 leading-relaxed">
                        {emg.description}
                      </p>

                      <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Eskalasi: <strong className="text-amber-300">{emg.escalationTier}</strong></span>
                        <span className="font-mono text-[10px]">
                          {new Date(emg.triggeredAt).toLocaleTimeString('id-ID')}
                        </span>
                      </div>

                      {/* Multi-Action Control Buttons */}
                      <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-rose-900/50">
                        <button
                          onClick={() => onOpenEmergencyModal(emg.id)}
                          className="py-1.5 px-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center gap-1.5 shadow transition-colors"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Incident Room</span>
                        </button>
                        <button
                          onClick={onOpenDispatch}
                          className="py-1.5 px-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Kirim Unit</span>
                        </button>
                      </div>

                      {onCallDriver && (
                        <button
                          onClick={() => onCallDriver(emg.driverPhone, emg.driverName)}
                          className="w-full mt-1.5 py-1 px-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5"
                        >
                          <PhoneCall className="w-3 h-3 text-emerald-400" />
                          <span>Hubungi Pengemudi Langsung</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 2: CRITICAL & OPERATIONAL ALERTS */}
            <div className="pt-2">
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Alert & Pelanggaran Operasional
                </span>
                <span className="text-[10px] text-slate-400">
                  {criticalAlerts.length} Belum ACK
                </span>
              </div>

              <div className="space-y-2">
                {criticalAlerts.slice(0, 8).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-2.5 rounded-lg bg-slate-850/70 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400">
                            {alert.plateNumber}
                          </span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            {alert.category.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 mt-1 font-medium leading-snug">
                          {alert.message}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          alert.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="text-[10px] font-mono">
                        {new Date(alert.timestamp).toLocaleTimeString('id-ID')}
                      </span>
                      <button
                        onClick={() => onOpenAckModal(alert)}
                        className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-950/40 border border-blue-800/60 px-2 py-0.5 rounded"
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>ACK Alert</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};
