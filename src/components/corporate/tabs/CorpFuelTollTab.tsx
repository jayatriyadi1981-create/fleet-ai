import React, { useState } from 'react';
import {
  Fuel,
  CreditCard,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Receipt,
  Car,
  TrendingDown,
  DollarSign
} from 'lucide-react';

export const CorpFuelTollTab: React.FC = () => {
  const [fuelTollLogs, setFuelTollLogs] = useState([
    {
      id: 'ft-01',
      plate: 'B 2145 SHP',
      model: 'Toyota Innova Zenix',
      category: 'BBM_PERTAMAX',
      date: '2026-08-20',
      liters: 42.5,
      costIdr: 550000,
      paymentMethod: 'Pertamina Corporate Fleet Card',
      cardNumber: 'PERT-CORP-9901-002',
      eTollTopupIdr: 200000,
      driverName: 'Siti Aminah',
      costCenter: 'CC-FIN-201',
      status: 'APPROVED_PAID',
    },
    {
      id: 'ft-02',
      plate: 'B 1001 RFS',
      model: 'Toyota Alphard VIP',
      category: 'BBM_PERTAMAX_TURBO',
      date: '2026-08-19',
      liters: 65.0,
      costIdr: 975000,
      paymentMethod: 'Shell Fleet Corporate Card',
      cardNumber: 'SHELL-CORP-4401-001',
      eTollTopupIdr: 500000,
      driverName: 'Suryadi Kusuma (VIP Chauffeur)',
      costCenter: 'CC-BOD-001',
      status: 'APPROVED_PAID',
    },
    {
      id: 'ft-03',
      plate: 'B 2990 TZQ',
      model: 'Toyota Avanza 1.5 G',
      category: 'BBM_PERTAMAX',
      date: '2026-08-18',
      liters: 35.0,
      costIdr: 455000,
      paymentMethod: 'Reimbursement Kasbon Karyawan',
      cardNumber: 'RECEIPT-OCR-8819',
      eTollTopupIdr: 100000,
      driverName: 'Agus Sunarto',
      costCenter: 'CC-SALES-102',
      status: 'PENDING_FINANCE_AUDIT',
    }
  ]);

  return (
    <div id="corp-fuel-toll-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
            CORPORATE FUEL CARDS, E-TOLL & EXPENSE REIMBURSEMENT
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Pengelolaan Kartu BBM Korporat, Saldo E-Toll & Reimbursement Perjalanan
          </h3>
          <p className="text-xs text-slate-400">
            Integrasi Pertamina / Shell Corporate Fleet Card, auto top-up kartu e-Toll Mandiri/BCA, audit rasio konsumsi BBM (KM/Liter), dan validasi struk kasbon.
          </p>
        </div>

        <button
          onClick={() => alert('Klaim Reimbursement Struk BBM / Isi Saldo Tol')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Klaim Struk BBM / Tol
        </button>
      </div>

      {/* Fuel Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Pengeluaran BBM Bulan Ini</span>
            <Fuel className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2 font-mono">Rp 42.850.000</div>
          <div className="text-xs text-slate-500 mt-1">Rata-rata konsumsi: <strong className="text-slate-800 font-mono">11.4 KM / Liter</strong></div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Transaksi Gerbang Tol</span>
            <CreditCard className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-blue-600 mt-2 font-mono">Rp 18.240.000</div>
          <div className="text-xs text-slate-500 mt-1">Terintegrasi kartu Flazz & e-Money</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Audit Efisiensi Armada (Fuel Cost Index)</span>
            <TrendingDown className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-600 mt-2 font-mono">-8.2% Lebih Hemat</div>
          <div className="text-xs text-slate-500 mt-1">Efek pemanfaatan armada EV & Hybrid</div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Receipt className="w-4 h-4 text-blue-600" /> Log Transaksi Bahan Bakar & Top-Up E-Toll
          </h4>
        </div>

        <div className="divide-y divide-slate-100">
          {fuelTollLogs.map(log => (
            <div key={log.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm font-mono">{log.plate}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-700">
                    {log.costCenter}
                  </span>
                  <span className="text-xs text-slate-500">({log.model})</span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <span>Pengemudi: <strong className="text-slate-800">{log.driverName}</strong></span> •
                  <span>Metode: <strong className="text-slate-800">{log.paymentMethod}</strong></span>
                </p>
                <div className="text-[11px] text-slate-400 font-mono">
                  Ref: {log.cardNumber} • Tanggal: {log.date}
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <div className="text-xs text-slate-500">Volume & Biaya BBM</div>
                  <div className="text-sm font-bold text-slate-900 font-mono">
                    {log.liters} L • Rp {log.costIdr.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[11px] text-blue-600 font-mono font-medium">
                    + Tol Rp {log.eTollTopupIdr.toLocaleString('id-ID')}
                  </div>
                </div>

                <div>
                  <span className={`inline-block text-[11px] px-2.5 py-1 rounded font-bold ${
                    log.status === 'APPROVED_PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {log.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
