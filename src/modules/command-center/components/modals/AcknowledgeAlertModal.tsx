/**
 * Fleet Intelligence Smart AI - Operator Acknowledge Alert Modal
 */

import React, { useState } from 'react';
import { UserCheck, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { commandCenterService } from '../../services/commandCenterService';
import { CommandAlertItem, EmergencyAlertItem } from '../../types/commandCenterTypes';

interface AcknowledgeAlertModalProps {
  targetAlert: CommandAlertItem | EmergencyAlertItem | null;
  onClose: () => void;
}

export const AcknowledgeAlertModal: React.FC<AcknowledgeAlertModalProps> = ({
  targetAlert,
  onClose,
}) => {
  const [operatorName, setOperatorName] = useState<string>('Operator Command Center');
  const [resolutionNotes, setResolutionNotes] = useState<string>('Peringatan telah diverifikasi dan diteruskan ke dispatcher.');

  if (!targetAlert) return null;

  const handleConfirmAck = () => {
    commandCenterService.acknowledgeAlert(targetAlert.id, operatorName, resolutionNotes);
    onClose();
  };

  const isEmergency = 'type' in targetAlert;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl text-slate-100 overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Konfirmasi Penerimaan Alert (ACK)</h2>
              <p className="text-[11px] text-slate-400">Verifikasi operator & audit trail</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-amber-400">
                {targetAlert.plateNumber}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {isEmergency ? (targetAlert as EmergencyAlertItem).type : (targetAlert as CommandAlertItem).category.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1.5 font-medium">
              {isEmergency ? (targetAlert as EmergencyAlertItem).description : (targetAlert as CommandAlertItem).message}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nama Operator:
            </label>
            <input
              type="text"
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Catatan Tindakan / Resolusi:
            </label>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmAck}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow"
            >
              Simpan & ACK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
