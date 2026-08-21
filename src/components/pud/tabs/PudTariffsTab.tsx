import React, { useState } from 'react';
import {
  Calculator,
  DollarSign,
  MapPin,
  Scale,
  Sparkles,
  CheckCircle2,
  Tag,
  ArrowRight
} from 'lucide-react';
import { pudService } from '../../../modules/pud/services/pudService';
import { PudTariffZone, PudServiceType } from '../../../modules/pud/types';

export const PudTariffsTab: React.FC = () => {
  const [tariffs] = useState<PudTariffZone[]>(pudService.getTariffs());
  
  // Interactive Calculator State
  const [calcService, setCalcService] = useState<PudServiceType>('INSTANT');
  const [calcDistanceKm, setCalcDistanceKm] = useState<number>(8);
  const [calcWeightKg, setCalcWeightKg] = useState<number>(2);
  const [calcResult, setCalcResult] = useState<number | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const tariff = tariffs.find(t => t.serviceType === calcService) || tariffs[0];
    const extraDist = Math.max(0, calcDistanceKm - tariff.baseDistanceKm);
    const extraWeight = Math.max(0, calcWeightKg - tariff.baseWeightKg);
    const cost = (tariff.baseFare + (extraDist * tariff.perKmRate) + (extraWeight * tariff.perKgRate)) * tariff.surgeMultiplier;
    setCalcResult(Math.round(cost));
  };

  return (
    <div className="space-y-6" id="pud-tariffs-tab">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-600" />
            Tarif Zona & Kalkulator Ongkos Kirim PUD
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Matriks harga per kilometer dan per kilogram untuk Instant Bike, Same-Day Van, dan Cargo Bulky.
          </p>
        </div>
      </div>

      {/* Grid: Tariffs Matrix vs Interactive Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Tariffs Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Matriks Tarif Layanan Terdaftar</h3>
            
            <div className="space-y-3">
              {tariffs.map((t) => (
                <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{t.zoneName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 uppercase">
                      {t.serviceType}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-slate-200/60">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Tarif Dasar ({t.baseDistanceKm} Km)</span>
                      <strong className="text-slate-900">Rp {t.baseFare.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Tarif per Km Tambahan</span>
                      <strong className="text-slate-900">Rp {t.perKmRate.toLocaleString()} / Km</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Batas Beban Dasar</span>
                      <strong className="text-slate-900">{t.baseWeightKg} Kg</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Estimasi Waktu</span>
                      <strong className="text-emerald-700">{t.estimatedHours}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Interactive Ongkir Calculator */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-600" />
            Simulator Ongkos Kirim
          </h3>

          <form onSubmit={handleCalculate} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Pilih Layanan</label>
              <select
                value={calcService}
                onChange={(e) => setCalcService(e.target.value as PudServiceType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
              >
                <option value="INSTANT">Instant (Motorcycle Rider)</option>
                <option value="SAME_DAY">Same-Day (Blind Van)</option>
                <option value="CARGO_BULKY">Cargo Bulky (Pickup Box)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Jarak Pengantaran (Km)</label>
              <input
                type="number"
                min="1"
                value={calcDistanceKm}
                onChange={(e) => setCalcDistanceKm(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Berat Total Paket (Kg)</label>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={calcWeightKg}
                onChange={(e) => setCalcWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Hitung Estimasi Biaya
            </button>
          </form>

          {calcResult !== null && (
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-center space-y-1">
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">Estimasi Ongkir</span>
              <span className="text-2xl font-black text-indigo-950 block">Rp {calcResult.toLocaleString()}</span>
              <span className="text-[10px] text-indigo-600">Sudah termasuk asuransi & PPN standar</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
