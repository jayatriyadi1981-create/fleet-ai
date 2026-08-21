import React, { useState } from 'react';
import {
  Fuel,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Truck,
  Droplets,
  Calendar,
  CheckCircle2,
  Clock,
  Gauge
} from 'lucide-react';
import { miningService } from '../../../modules/mining/services/miningService';

export const MiningFuelBowserTab: React.FC = () => {
  const equipments = miningService.getEquipments();
  const fuelTrucks = equipments.filter(e => e.category === 'FUEL_TRUCK');

  return (
    <div className="space-y-6" id="mining-fuel-bowser-container">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Fuel className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900">Manajemen BBM Solar B35 & Mobile Fuel Bowser</h1>
          </div>
          <p className="text-xs text-slate-500">
            Monitoring level tangki induk depot & pitstop, mobilisasi truk fuel bowser ke front tambang, laju konsumsi BBM per alat (L/HM), & rasio liter per Ton/BCM.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-amber-400 font-mono font-bold text-xs">
            Depot Stock: 145,000 Liter Solar B35
          </span>
        </div>
      </div>

      {/* Fuel Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Konsumsi Shift Hari Ini</div>
          <div className="text-2xl font-black text-slate-900">28,450 <span className="text-xs font-medium text-slate-500">Liter</span></div>
          <div className="text-xs text-emerald-600 font-medium mt-1">Efisiensi 98.2% vs Budget</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Rata-rata Burn Rate Armada</div>
          <div className="text-2xl font-black text-slate-900">64.2 <span className="text-xs font-medium text-slate-500">L/HM</span></div>
          <div className="text-xs text-slate-500 mt-1">Excavator + Dump Truck</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Rasio BBM per Tonase</div>
          <div className="text-2xl font-black text-slate-900">0.63 <span className="text-xs font-medium text-slate-500">L / Ton</span></div>
          <div className="text-xs text-emerald-600 font-medium mt-1">Standar KPC &lt; 0.70 L/Ton</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Rasio BBM per Volume OB</div>
          <div className="text-2xl font-black text-slate-900">0.12 <span className="text-xs font-medium text-slate-500">L / BCM</span></div>
          <div className="text-xs text-slate-500 mt-1">Cost BBM: Rp 1.740/BCM</div>
        </div>
      </div>

      {/* Fuel Bowser Fleet Status */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-amber-500" />
          Unit Mobile Fuel Bowser Bertugas di Pit
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fuelTrucks.map(bowser => (
            <div key={bowser.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-slate-900 text-amber-400 font-mono font-bold text-xs">
                      {bowser.code}
                    </span>
                    <strong className="text-sm text-slate-900">{bowser.name}</strong>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                    {bowser.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 mt-2">
                  <div>Kapasitas Tangki: <strong>{bowser.capacityM3}kL (20.000 Liter)</strong></div>
                  <div>Sisa Isi Tangki Bowser: <strong className="text-slate-900">18.400 Liter (92%)</strong></div>
                  <div>Fuelman: <strong>{bowser.currentOperatorName}</strong></div>
                  <div>Lokasi Standby: <strong>{bowser.currentPitName || 'Pitstop Depot'}</strong></div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Flowmeter Digital Nozzle: <strong className="text-emerald-600">Terverifikasi Tera Metrologi</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Fuel Burn Rate Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Laju Konsumsi BBM per Unit Alat Berat (Telematics Data)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Kode Unit (CN)</th>
                <th className="py-3.5 px-4">Jenis Alat Berat</th>
                <th className="py-3.5 px-4">Hour Meter (HM)</th>
                <th className="py-3.5 px-4">Level Tangki (%)</th>
                <th className="py-3.5 px-4 text-right">Burn Rate (L/HM)</th>
                <th className="py-3.5 px-4 text-center">Status Efisiensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {equipments.map(eq => (
                <tr key={eq.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{eq.code}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{eq.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{eq.hourMeter.toLocaleString()} HM</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${eq.fuelLevelPct < 25 ? 'bg-rose-500' : eq.fuelLevelPct < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${eq.fuelLevelPct}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-900 text-[11px]">{eq.fuelLevelPct}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                    {eq.fuelBurnRatePerHour} L/HM
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      eq.fuelBurnRatePerHour < 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {eq.fuelBurnRatePerHour < 70 ? 'HEMAT / NORMAL' : 'HEAVY LOAD'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
