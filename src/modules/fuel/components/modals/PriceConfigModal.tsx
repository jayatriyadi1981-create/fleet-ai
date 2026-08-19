/**
 * Fleet Intelligence Smart AI - Fuel Price Config Modal
 * PROMPT 24 - Configure Fuel Price / Liter for B35, Solar, Pertalite
 */

import React, { useState } from 'react';
import { X, DollarSign, Fuel } from 'lucide-react';
import { FuelType } from '../../types';

interface PriceConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdatePrice: (type: FuelType, price: number) => void;
}

export const PriceConfigModal: React.FC<PriceConfigModalProps> = ({
  isOpen,
  onClose,
  onUpdatePrice,
}) => {
  const [fuelType, setFuelType] = useState<FuelType>('BIODIESEL');
  const [price, setPrice] = useState('6800');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePrice(fuelType, parseFloat(price));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Konfigurasi Harga BBM Acuan</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Jenis Bahan Bakar</label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as FuelType)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="BIODIESEL">BIODIESEL B35</option>
              <option value="SOLAR">SOLAR PERTAMINA</option>
              <option value="PERTALITE">PERTALITE</option>
              <option value="PERTAMAX">PERTAMAX</option>
              <option value="DIESEL">SHELL DIESEL</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Harga Resmi per Liter (IDR)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-emerald-400 font-bold focus:outline-none focus:border-cyan-500"
              required
            />
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
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Perbarui Harga
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
