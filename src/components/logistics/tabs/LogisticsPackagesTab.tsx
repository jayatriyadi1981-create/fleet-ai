import React, { useState } from 'react';
import { 
  QrCode, 
  Search, 
  Barcode, 
  CheckCircle2, 
  AlertCircle, 
  Scan, 
  Package, 
  Printer,
  Scale,
  Sparkles
} from 'lucide-react';
import { LogisticsOrder } from '../../../modules/logistics/types';

interface Props {
  orders: LogisticsOrder[];
  onSelectOrder: (order: LogisticsOrder) => void;
}

export const LogisticsPackagesTab: React.FC<Props> = ({ orders, onSelectOrder }) => {
  const [scanInput, setScanInput] = useState('');
  const [scannedResult, setScannedResult] = useState<LogisticsOrder | null>(null);
  const [scanHistory, setScanHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'scan' | 'all'>('scan');

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    const found = orders.find(
      (o) =>
        o.connoteNumber.toLowerCase() === scanInput.trim().toLowerCase() ||
        o.orderNumber.toLowerCase() === scanInput.trim().toLowerCase()
    );

    if (found) {
      setScannedResult(found);
      setScanHistory((prev) => [found.connoteNumber, ...prev.slice(0, 7)]);
    } else {
      setScannedResult(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <QrCode className="w-6 h-6 text-blue-600" />
            Barcode Scanner & Koli Paket Inbound/Outbound
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Simulasi scanner barcode genggam (PDA/Laser) untuk cek timbangan otomatis, dimensi koli, & sorting conveyor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('scan')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'scan' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Scanner Aktif
          </button>
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Semua Item Koli
          </button>
        </div>
      </div>

      {activeTab === 'scan' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scanner Input Panel */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
                <Scan className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Laser Scanner PDA</h3>
                <p className="text-slate-400 text-xs">Arahkan barcode atau ketik No. Resi</p>
              </div>
            </div>

            <form onSubmit={handleScan} className="space-y-3">
              <div className="relative">
                <Barcode className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Contoh: JKT-BDG-882109"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-blue-500/40 focus:border-blue-600 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white uppercase focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20"
                >
                  Scan / Proses Resi
                </button>
              </div>
            </form>

            {/* Quick Test Sample Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold">Simulasi Klik Cepat:</span>
              <div className="flex flex-wrap gap-1.5">
                {orders.slice(0, 3).map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setScanInput(o.connoteNumber);
                      setScannedResult(o);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-mono font-bold"
                  >
                    {o.connoteNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Scan History */}
            {scanHistory.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold">Riwayat Scan Terakhir:</span>
                <div className="space-y-1">
                  {scanHistory.map((con, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{con}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Scanner Result Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            {scannedResult ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center font-bold text-xl">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Paket Terverifikasi Valid</div>
                      <h3 className="font-mono font-bold text-lg text-slate-900 dark:text-white">{scannedResult.connoteNumber}</h3>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-full text-xs font-bold">
                    {scannedResult.serviceType}
                  </span>
                </div>

                {/* Sender & Consignee Specs */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Shipper (Pengirim)</span>
                    <div className="font-bold text-slate-900 dark:text-white">{scannedResult.shipperName}</div>
                    <div className="text-slate-500">{scannedResult.shipperCity}</div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Consignee (Penerima)</span>
                    <div className="font-bold text-slate-900 dark:text-white">{scannedResult.consigneeName}</div>
                    <div className="text-slate-500">{scannedResult.consigneeCity} ({scannedResult.consigneePostalCode})</div>
                  </div>
                </div>

                {/* Items in this parcel */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    Rincian Koli ({scannedResult.items.length} Item Terdaftar)
                  </h4>
                  <div className="space-y-2">
                    {scannedResult.items.map((it, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{it.name}</div>
                          <div className="text-[11px] text-slate-400">SKU: {it.sku} • Qty: {it.qty} unit • Fragile: {it.isFragile ? 'Ya' : 'Tidak'}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-800 dark:text-slate-200">{it.weightKg} kg</div>
                          <div className="text-[11px] text-slate-400">{it.dimensions.lengthCm}x{it.dimensions.widthCm}x{it.dimensions.heightCm} cm</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Routing Hub: <strong>{scannedResult.originHubName.split('(')[0]} ➔ {scannedResult.destinationHubName.split('(')[0]}</strong>
                  </div>
                  <button 
                    onClick={() => onSelectOrder(scannedResult)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
                  >
                    Buka Detail Order Penuh
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-3 text-slate-400">
                <Scan className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">Belum Ada Barcode yang Di-scan</div>
                <p className="text-xs max-w-sm">
                  Ketik atau scan nomor resi connote pada panel sebelah kiri untuk melihat metadata koli, timbangan, dan routing staging.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* All Items Table */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">No. Resi</th>
                <th className="py-3 px-4">Nama Barang (Koli)</th>
                <th className="py-3 px-4">SKU / Kategori</th>
                <th className="py-3 px-4">Berat Aktual</th>
                <th className="py-3 px-4">Dimensi (P x L x T)</th>
                <th className="py-3 px-4">Fragile / Cold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {orders.flatMap(o => o.items.map(it => ({ ...it, connoteNumber: o.connoteNumber, service: o.serviceType }))).map((it, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{it.connoteNumber}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{it.name}</td>
                  <td className="py-3 px-4 text-slate-500">{it.sku}</td>
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{it.weightKg} kg</td>
                  <td className="py-3 px-4 text-slate-500">{it.dimensions.lengthCm} x {it.dimensions.widthCm} x {it.dimensions.heightCm} cm</td>
                  <td className="py-3 px-4">
                    {it.isFragile && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 mr-1">Fragile</span>}
                    {it.temperatureRequired && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">Cold Chain</span>}
                    {!it.isFragile && !it.temperatureRequired && <span className="text-slate-400">Standard</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
