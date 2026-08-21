import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Layers,
  Fuel,
  ShieldCheck,
  CheckCircle2,
  Table,
  Filter
} from 'lucide-react';
import { miningService } from '../../../modules/mining/services/miningService';

export const MiningReportsTab: React.FC = () => {
  const [reportType, setReportType] = useState<'LHT' | 'LBT' | 'FUEL' | 'K3'>('LHT');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-21');
  const [exportSuccess, setExportSuccess] = useState(false);

  const kpis = miningService.getKpis();
  const shifts = miningService.getShifts();
  const tickets = miningService.getWeighbridgeTickets();
  const incidents = miningService.getSafetyIncidents();

  const handleExport = () => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="space-y-6" id="mining-reports-container">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900">Pusat Laporan Tambang (Mining Reports Center)</h1>
          </div>
          <p className="text-xs text-slate-500">
            Laporan Harian Tambang (LHT), Laporan Bulanan Tambang (LBT) RKAB ESDM, Rekapitulasi Ritase & Jembatan Timbang, Konsumsi Solar, & K3 Zero LTI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Ekspor Format Excel / PDF</span>
          </button>
        </div>
      </div>

      {exportSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Laporan berhasil diekspor ke format XLSX / PDF resmi standar SMKP ESDM!</span>
        </div>
      )}

      {/* Report Selection Pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setReportType('LHT')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              reportType === 'LHT'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            1. Laporan Harian Tambang (LHT)
          </button>

          <button
            onClick={() => setReportType('LBT')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              reportType === 'LBT'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            2. Rekap Ritase & Weighbridge
          </button>

          <button
            onClick={() => setReportType('FUEL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              reportType === 'FUEL'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            3. Rekap Konsumsi BBM Solar B35
          </button>

          <button
            onClick={() => setReportType('K3')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              reportType === 'K3'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            4. Laporan K3 & Manhours SMKP
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700"
          />
        </div>
      </div>

      {/* Report Document Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-5xl mx-auto font-sans">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase">
              {reportType === 'LHT' && 'LAPORAN HARIAN OPERASIONAL TAMBANG (LHT)'}
              {reportType === 'LBT' && 'REKAPITULASI RITASE & PENIMBANGAN WEIGHBRIDGE'}
              {reportType === 'FUEL' && 'REKAPITULASI KONSUMSI BAHAN BAKAR MINYAK (BBM SOLAR B35)'}
              {reportType === 'K3' && 'LAPORAN KESELAMATAN PERTAMBANGAN & K3 (SMKP ESDM)'}
            </h2>
            <div className="text-xs text-slate-600 mt-1">
              PT. NUSANTARA MINING INTELLIGENCE TBK &bull; SITE SANGATTA COAL MINE
            </div>
          </div>

          <div className="text-right text-xs font-mono">
            <div className="font-bold text-slate-900">TANGGAL: {selectedDate}</div>
            <div className="text-slate-500">STATUS: VERIFIED KTT</div>
          </div>
        </div>

        {/* LHT Content */}
        {reportType === 'LHT' && (
          <div className="space-y-6 text-xs text-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-2 border-b border-slate-200 pb-1">I. RINGKASAN PRODUKSI HARIAN</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Produksi Coal (Ton):</span>
                  <strong className="text-slate-900 text-sm">{kpis.dailyCoalProductionTon.toLocaleString()} Ton</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Volume Overburden (BCM):</span>
                  <strong className="text-slate-900 text-sm">{kpis.dailyObStrippingBcm.toLocaleString()} BCM</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Stripping Ratio (SR):</span>
                  <strong className="text-slate-900 text-sm">{kpis.strippingRatio.toFixed(2)} : 1</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Ritase Hauler:</span>
                  <strong className="text-slate-900 text-sm">{kpis.totalHaulingTrips} Trips</strong>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-2 border-b border-slate-200 pb-1">II. PERFORMA KETERSEDIAAN ARMADA (KPIs)</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Physical Availability (PA):</span>
                  <strong className="text-slate-900 text-base">{kpis.physicalAvailabilityPct}%</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Mechanical Availability (MA):</span>
                  <strong className="text-slate-900 text-base">{kpis.mechanicalAvailabilityPct}%</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Utilization of Availability (UA):</span>
                  <strong className="text-slate-900 text-base">{kpis.utilizationAvailabilityPct}%</strong>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-2 border-b border-slate-200 pb-1">III. REKAPITULASI SHIFT KERJA</h3>
              <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2.5">Shift</th>
                    <th className="p-2.5">Pengawas</th>
                    <th className="p-2.5 text-right">Coal (Ton)</th>
                    <th className="p-2.5 text-right">OB (BCM)</th>
                    <th className="p-2.5 text-right">Trips</th>
                    <th className="p-2.5 text-right">BBM (L)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {shifts.map(s => (
                    <tr key={s.id}>
                      <td className="p-2.5 font-bold font-sans">{s.shiftCode} ({s.shiftType})</td>
                      <td className="p-2.5 font-sans">{s.supervisorName}</td>
                      <td className="p-2.5 text-right">{s.actualTon.toLocaleString()}</td>
                      <td className="p-2.5 text-right">{s.actualBcm.toLocaleString()}</td>
                      <td className="p-2.5 text-right">{s.totalTrips}</td>
                      <td className="p-2.5 text-right">{s.totalFuelConsumedLiters.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Weighbridge Content */}
        {reportType === 'LBT' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-2">DAFTAR TRANSAKSI PENIMBANGAN WEIGHBRIDGE</h3>
            <table className="w-full text-left border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="p-2.5">No. Tiket</th>
                  <th className="p-2.5">Unit</th>
                  <th className="p-2.5">Supir</th>
                  <th className="p-2.5">Material</th>
                  <th className="p-2.5 text-right">Gross (Ton)</th>
                  <th className="p-2.5 text-right">Tare (Ton)</th>
                  <th className="p-2.5 text-right">Netto (Ton)</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {tickets.map(t => (
                  <tr key={t.id}>
                    <td className="p-2.5 font-bold">{t.ticketNumber}</td>
                    <td className="p-2.5 font-sans">{t.dumpTruckCode}</td>
                    <td className="p-2.5 font-sans">{t.operatorName}</td>
                    <td className="p-2.5 font-sans">{t.materialName}</td>
                    <td className="p-2.5 text-right">{t.grossWeightTon.toFixed(1)}</td>
                    <td className="p-2.5 text-right">{t.tareWeightTon.toFixed(1)}</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">{t.netPayloadTon.toFixed(1)}</td>
                    <td className="p-2.5 text-center font-sans font-bold text-emerald-600">{t.complianceStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Fuel Content */}
        {reportType === 'FUEL' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-2">REKAPITULASI PENGGUNAAN SOLAR B35</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span>Total Pemakaian BBM Hari Ini:</span>
                <strong className="font-mono text-sm">{kpis.fuelConsumedLitersDaily.toLocaleString()} Liter</strong>
              </div>
              <div className="flex justify-between">
                <span>Rata-rata Konsumsi BBM per Jam Kerja (Burn Rate):</span>
                <strong className="font-mono text-sm">{kpis.fuelBurnRateAvgLitersPerHm} L/HM</strong>
              </div>
              <div className="flex justify-between">
                <span>Rasio BBM per Tonase Batubara:</span>
                <strong className="font-mono text-sm">0.63 Liter / Ton</strong>
              </div>
              <div className="flex justify-between">
                <span>Rasio BBM per BCM Overburden:</span>
                <strong className="font-mono text-sm">0.12 Liter / BCM</strong>
              </div>
            </div>
          </div>
        )}

        {/* K3 Content */}
        {reportType === 'K3' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-2">STATISTIK KESELAMATAN KERJA & SMKP</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                <span className="font-bold block">Status Kecelakaan Kerja (LTI):</span>
                <strong className="text-lg">0 Fatality / 0 LTI</strong>
                <p className="text-[11px] mt-1">1,842,500 Safe Manhours tercapai tanpa kehilangan hari kerja.</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                <span className="font-bold block">Kepatuhan K3 & P2H:</span>
                <strong className="text-lg">100% Sesuai SOP</strong>
                <p className="text-[11px] mt-1">Seluruh P5M Toolbox Meeting telah terdokumentasi.</p>
              </div>
            </div>
          </div>
        )}

        {/* Signatures Footer */}
        <div className="grid grid-cols-3 gap-8 text-center text-xs mt-12 pt-8 border-t border-slate-300">
          <div>
            <span className="text-slate-500 block mb-12">Dibuat Oleh (Mining Dispatcher):</span>
            <strong className="text-slate-900 block border-b border-slate-400 pb-1">Surya Dharma, S.T.</strong>
            <span className="text-[10px] text-slate-500">Chief Dispatcher</span>
          </div>

          <div>
            <span className="text-slate-500 block mb-12">Diperiksa (Mining Superintendent):</span>
            <strong className="text-slate-900 block border-b border-slate-400 pb-1">Ir. Bambang Trihatmojo</strong>
            <span className="text-[10px] text-slate-500">Superintendent Mining Operations</span>
          </div>

          <div>
            <span className="text-slate-500 block mb-12">Disetujui (Kepala Teknik Tambang - KTT):</span>
            <strong className="text-slate-900 block border-b border-slate-400 pb-1">Ir. Hendra Gunawan, IPM.</strong>
            <span className="text-[10px] text-slate-500">KTT / General Manager</span>
          </div>
        </div>
      </div>
    </div>
  );
};
