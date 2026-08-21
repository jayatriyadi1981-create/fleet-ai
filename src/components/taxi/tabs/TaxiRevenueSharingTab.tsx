import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Receipt,
  Users,
  CheckCircle2,
  AlertTriangle,
  Award,
  Clock
} from 'lucide-react';
import { taxiService } from '../../../modules/taxi/services/taxiService';
import { TaxiDriver } from '../../../modules/taxi/types';

export const TaxiRevenueSharingTab: React.FC = () => {
  const [drivers] = useState<TaxiDriver[]>(taxiService.getDrivers());

  // Revenue simulator state
  const [scheme, setScheme] = useState<'SETORAN_MURNI' | 'BAGI_HASIL'>('BAGI_HASIL');
  const [simulatedGross, setSimulatedGross] = useState<number>(750000);
  const [driverSharePct, setDriverSharePct] = useState<number>(40); // 40% Driver, 60% Company
  const [fixedDepositTarget, setFixedDepositTarget] = useState<number>(320000);

  // Calculation
  const driverEarning = scheme === 'BAGI_HASIL'
    ? (simulatedGross * driverSharePct) / 100
    : Math.max(0, simulatedGross - fixedDepositTarget);

  const companyEarning = scheme === 'BAGI_HASIL'
    ? simulatedGross - driverEarning
    : Math.min(simulatedGross, fixedDepositTarget);

  return (
    <div id="taxi-revenue-sharing-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Manajemen Setoran Driver & Skema Bagi Hasil (Revenue Sharing)</span>
          </h2>
          <p className="text-xs text-slate-400">Pencatatan setoran harian kasir pool, komisi ritase, bonus target bulanan, dan jaminan operasional</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Total Setoran Hari Ini:</span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            100% Lunas (Zero Arrears)
          </span>
        </div>
      </div>

      {/* Simulator and Driver Deposit Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulator Card (1 col) */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <Percent className="w-4 h-4 text-amber-500" />
            <span>Kalkulator Skema Pendapatan Driver</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Model Skema Kontrak</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setScheme('BAGI_HASIL')}
                  className={`py-2 rounded-lg font-bold border transition-colors ${
                    scheme === 'BAGI_HASIL'
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Bagi Hasil (60:40)
                </button>
                <button
                  type="button"
                  onClick={() => setScheme('SETORAN_MURNI')}
                  className={`py-2 rounded-lg font-bold border transition-colors ${
                    scheme === 'SETORAN_MURNI'
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Setoran Murni Tetap
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Pendapatan Bruto Harian (Rp)</label>
              <input
                type="number"
                step="50000"
                value={simulatedGross}
                onChange={(e) => setSimulatedGross(Math.max(0, Number(e.target.value)))}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono font-bold"
              />
            </div>

            {scheme === 'BAGI_HASIL' ? (
              <div>
                <label className="block text-slate-400 mb-1">Porsi Pengemudi (%)</label>
                <input
                  type="number"
                  value={driverSharePct}
                  onChange={(e) => setDriverSharePct(Number(e.target.value))}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono"
                />
              </div>
            ) : (
              <div>
                <label className="block text-slate-400 mb-1">Target Setoran Tetap Pool (Rp)</label>
                <input
                  type="number"
                  value={fixedDepositTarget}
                  onChange={(e) => setFixedDepositTarget(Number(e.target.value))}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono"
                />
              </div>
            )}

            {/* Split Output Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 mt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Hak Pendapatan Driver:</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  Rp {Math.round(driverEarning).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800/80">
                <span className="text-slate-400">Setoran Kas Pool (Perusahaan):</span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  Rp {Math.round(companyEarning).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Setoran Status Table (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-cyan-400" />
              <span>Status Setoran Harian Pengemudi (Shift Aktif)</span>
            </h3>
            <span className="text-xs text-slate-400">Kasir Pool Kemayoran & Rawamangun</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Nama & No. KTA</th>
                  <th className="p-3">Armada & Pool</th>
                  <th className="p-3">Skema</th>
                  <th className="p-3">Target Setoran</th>
                  <th className="p-3">Realisasi Kasir</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {drivers.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/30">
                    <td className="p-3">
                      <div className="font-semibold text-slate-200">{d.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{d.ktaNumber}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-mono font-bold text-amber-400">{d.assignedTaxiHull}</div>
                      <div className="text-[10px] text-slate-400">{d.assignedPool}</div>
                    </td>
                    <td className="p-3">
                      <span className="text-[11px] font-medium text-slate-300">
                        {d.employmentScheme === 'SETORAN_MURNI' ? 'Setoran Murni' : 'Bagi Hasil (60:40)'}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-300">
                      Rp {d.dailyTargetSetoranRp.toLocaleString()}
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      Rp {d.actualDepositTodayRp.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        LUNAS
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
