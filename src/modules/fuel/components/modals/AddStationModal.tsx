/**
 * Fleet Intelligence Smart AI - Add Station Modal
 * PROMPT 24 - Register SPBU Station / Authorized Depot
 */

import React, { useState } from 'react';
import { X, MapPin, Fuel } from 'lucide-react';
import { FuelStation } from '../../types';

interface AddStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (station: Partial<FuelStation>) => void;
}

export const AddStationModal: React.FC<AddStationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [brand, setBrand] = useState<'PERTAMINA' | 'SHELL' | 'BP' | 'PRIVATE_DEPOT'>('PERTAMINA');
  const [status, setStatus] = useState<'AUTHORIZED' | 'UNAUTHORIZED'>('AUTHORIZED');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      address,
      brand,
      status,
      latitude: -6.2,
      longitude: 106.8,
      fuelTypes: ['SOLAR', 'BIODIESEL'],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Tambah SPBU / Depo Terdaftar</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Nama SPBU / Depo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. SPBU Pertamina 31.10201 Cikarang"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Alamat Lengkap</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jl. Raya Lemahabang KM 38..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Brand SPBU</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value as any)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="PERTAMINA">PERTAMINA</option>
                <option value="SHELL">SHELL</option>
                <option value="BP">BP</option>
                <option value="PRIVATE_DEPOT">DEPO SWATA / MANDIRI</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Otorisasi SPBU</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="AUTHORIZED">AUTHORIZED (Disetujui)</option>
                <option value="UNAUTHORIZED">UNAUTHORIZED (Dilarang)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
            >
              Simpan SPBU
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
