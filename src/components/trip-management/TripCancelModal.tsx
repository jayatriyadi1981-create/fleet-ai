/**
 * Fleet Intelligence Smart AI - Trip Cancel Reason Dialog Modal
 * PROMPT 15 — Reason requirement enforcement for operational trip cancellation
 */

import React, { useState } from 'react';
import { PlannedTrip } from '../../modules/trips/plannedTripTypes';
import { AlertTriangle, X } from 'lucide-react';

interface TripCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (reason: string) => void;
  trip: PlannedTrip | null;
}

export const TripCancelModal: React.FC<TripCancelModalProps> = ({
  isOpen,
  onClose,
  onConfirmCancel,
  trip,
}) => {
  const [reason, setReason] = useState<string>('');

  if (!isOpen || !trip) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirmCancel(reason);
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Konfirmasi Pembatalan Trip</span>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-gray-600">
            Apakah Anda yakin ingin membatalkan trip operasional <span className="font-bold text-gray-900">{trip.tripNumber}</span> ({trip.origin.name} → {trip.destination.name})?
          </p>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Alasan Pembatalan <span className="text-rose-500">* (Wajib)</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Jelaskan alasan pembatalan (misal: perubahan pesanan pelanggan, gangguan armada, kendala cuaca)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 text-gray-900"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!reason.trim()}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg disabled:opacity-50"
            >
              Ya, Batalkan Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
