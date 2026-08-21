import React, { useState } from 'react';
import {
  DollarSign,
  Calculator,
  ShieldCheck,
  Clock,
  Navigation,
  Percent,
  CheckCircle2,
  AlertCircle,
  FileCheck2
} from 'lucide-react';
import { taxiService } from '../../../modules/taxi/services/taxiService';

export const TaxiTaximeterTab: React.FC = () => {
  const [config, setConfig] = useState(taxiService.taximeterConfig);

  // Simulator State
  const [fareType, setFareType] = useState<'REGULAR' | 'EXECUTIVE'>('REGULAR');
  const [distanceKm, setDistanceKm] = useState<number>(12.5);
  const [waitingMins, setWaitingMins] = useState<number>(15);
  const [includeAirportSurcharge, setIncludeAirportSurcharge] = useState<boolean>(true);
  const [isMidnight, setIsMidnight] = useState<boolean>(false);

  // Calculate fare
  const flagFall = fareType === 'REGULAR' ? config.flagFallRegularRp : config.flagFallExecutiveRp;
  const perKmRate = fareType === 'REGULAR' ? config.perKmRegularRp : config.perKmExecutiveRp;
  const waitingRatePerHour = fareType === 'REGULAR' ? config.waitingPerHourRp : config.waitingPerHourExecutiveRp;

  // First 1 km is covered by flag fall in Indonesian taxi standard
  const additionalDistance = Math.max(0, distanceKm - 1.0);
  const distanceFare = additionalDistance * perKmRate;
  const waitingFare = (waitingMins / 60) * waitingRatePerHour;
  const airportSurcharge = includeAirportSurcharge ? config.airportSurchargeRp : 0;

  const subtotal = flagFall + distanceFare + waitingFare + airportSurcharge;
  const midnightBonus = isMidnight ? subtotal * (config.midnightSurchargePct / 100) : 0;
  const totalEstimatedFare = Math.round(subtotal + midnightBonus);

  return (
    <div id="taxi-taximeter-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Sistem Argometer Digital & Manajemen Tarif Taksi</span>
          </h2>
          <p className="text-xs text-slate-400">Konfigurasi tarif buka pintu (flag fall), tarif per KM, tarif tunggu per jam, dan sertifikasi Tera Metrologi</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            Segel Tera Metrologi: 100% Lolos Uji
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Taximeter Tariff Configuration */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Matriks Tarif Resmi Argometer (SK Gubernur Dishub)</span>
          </h3>

          <div className="space-y-4 text-xs">
            {/* Regular Taxi Card */}
            <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-400">Taksi Reguler (Sedan / MPV Transmover)</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono">Standar</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-slate-300">
                <div>
                  <span className="text-slate-400 text-[10px]">Buka Pintu (Flag Fall)</span>
                  <div className="font-bold font-mono text-slate-100">Rp {config.flagFallRegularRp.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Tarif per KM</span>
                  <div className="font-bold font-mono text-slate-100">Rp {config.perKmRegularRp.toLocaleString()}/KM</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Waktu Tunggu</span>
                  <div className="font-bold font-mono text-slate-100">Rp {config.waitingPerHourRp.toLocaleString()}/Jam</div>
                </div>
              </div>
            </div>

            {/* Executive Taxi Card */}
            <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-purple-400">Taksi Eksekutif (Silver Bird / Alphard / E-Class)</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-mono">Premium</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-slate-300">
                <div>
                  <span className="text-slate-400 text-[10px]">Buka Pintu (Flag Fall)</span>
                  <div className="font-bold font-mono text-slate-100">Rp {config.flagFallExecutiveRp.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Tarif per KM</span>
                  <div className="font-bold font-mono text-slate-100">Rp {config.perKmExecutiveRp.toLocaleString()}/KM</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Waktu Tunggu</span>
                  <div className="font-bold font-mono text-slate-100">Rp {config.waitingPerHourExecutiveRp.toLocaleString()}/Jam</div>
                </div>
              </div>
            </div>

            {/* Surcharges Box */}
            <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Surcharge Akses Bandara Soetta / Halim:</span>
                <span className="font-bold text-slate-200 font-mono">Rp {config.airportSurchargeRp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Surcharge Dini Hari (00:00 - 05:00 WIB):</span>
                <span className="font-bold text-amber-400 font-mono">+{config.midnightSurchargePct}% dari Subtotal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Fare Calculator / Argo Simulator */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-amber-500" />
            <span>Simulator & Estimator Argometer Digital</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Kelas Layanan Taksi</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFareType('REGULAR')}
                  className={`py-2 rounded-lg font-bold border transition-colors ${
                    fareType === 'REGULAR'
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Taksi Reguler (Toyota Transmover)
                </button>
                <button
                  type="button"
                  onClick={() => setFareType('EXECUTIVE')}
                  className={`py-2 rounded-lg font-bold border transition-colors ${
                    fareType === 'EXECUTIVE'
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Taksi Eksekutif (Silver Bird)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Jarak Tempuh (KM)</label>
                <input
                  type="number"
                  step="0.5"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Waktu Tunggu / Macet (Menit)</label>
                <input
                  type="number"
                  value={waitingMins}
                  onChange={(e) => setWaitingMins(Math.max(0, Number(e.target.value)))}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={includeAirportSurcharge}
                  onChange={(e) => setIncludeAirportSurcharge(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <span>Surcharge Bandara (Rp 15.000)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={isMidnight}
                  onChange={(e) => setIsMidnight(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <span>Malam Hari (+15%)</span>
              </label>
            </div>

            {/* Display Output Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2 mt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Tarif Argometer</span>
                <span className="text-xl font-extrabold text-emerald-400 font-mono">
                  Rp {totalEstimatedFare.toLocaleString()}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex flex-wrap justify-between gap-1">
                <span>Flag Fall: Rp {flagFall.toLocaleString()}</span>
                <span>Jarak ({distanceKm} km): Rp {Math.round(distanceFare).toLocaleString()}</span>
                <span>Tunggu ({waitingMins} mnt): Rp {Math.round(waitingFare).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
