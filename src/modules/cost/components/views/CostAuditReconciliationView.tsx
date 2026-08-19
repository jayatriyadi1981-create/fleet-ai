/**
 * Fleet Intelligence Smart AI - Cost Audit & Telematics Reconciliation View
 * PROMPT 37 - Telematics Cross-Verification, Discrepancy Audit & Buku Kas Ledger
 */

import React, { useState, useMemo } from 'react';
import {
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Printer,
  DollarSign,
  Fuel,
  Wrench,
  Users,
  Eye,
  Sliders,
  Filter,
} from 'lucide-react';
import { useCost } from '../../context/CostContext';
import { CostCalculationEngine } from '../../engines/CostCalculationEngine';

export const CostAuditReconciliationView: React.FC = () => {
  const {
    reconciliationItems,
    auditLogs,
    runReconciliationAudit,
    exportCurrentData,
    setIsReconciliationModalOpen,
  } = useCost();

  const [activeSubTab, setActiveSubTab] = useState<'reconciliation' | 'audit_log'>('reconciliation');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filtered reconciliation items
  const filteredReconciliation = useMemo(() => {
    return reconciliationItems.filter((item) => {
      const matchSearch =
        item.referenceLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.typeLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.vehiclePlate && item.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [reconciliationItems, searchTerm, statusFilter]);

  // Filtered audit logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      return (
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [auditLogs, searchTerm]);

  // Reconciliation anomalies count
  const anomalyCount = reconciliationItems.filter(
    (i) => i.status === 'SUSPICIOUS_SPIKE' || i.status === 'FLAGGED'
  ).length;

  const totalDiscrepancyAmount = reconciliationItems.reduce(
    (sum, i) => sum + i.discrepancyAmount,
    0
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Banner: Reconciliation Audit */}
      <div className="bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-transparent border border-amber-500/30 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">
                  Telematics Cross-Verification & Automated Reconciliation Audit
                </h3>
                {anomalyCount > 0 && (
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {anomalyCount} Selisih Anomali
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
                Membandingkan data telemetri sensor IoT (sensor BBM, GPS odometer, jam kerja) dengan kwitansi SPBU, invoice bengkel, dan slip uang jalan untuk mencegah fraud.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                runReconciliationAudit();
                setIsReconciliationModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Jalankan Audit Rekonsiliasi</span>
            </button>

            <button
              onClick={() => exportCurrentData('CSV')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation: Reconciliation vs Audit Trail */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('reconciliation')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'reconciliation'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Rekonsiliasi Telematika vs Nota ({reconciliationItems.length})
        </button>
        <button
          onClick={() => setActiveSubTab('audit_log')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'audit_log'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Audit Trail & Buku Kas ({auditLogs.length})
        </button>
      </div>

      {/* Reconciliation Table */}
      {activeSubTab === 'reconciliation' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari transaksi rekonsiliasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Semua Status Hasil Audit</option>
                <option value="MATCH">Sesuai (Match)</option>
                <option value="MINOR_VARIANCE">Variansi Wajar (&lt;5%)</option>
                <option value="SUSPICIOUS_SPIKE">Mencurigakan (Spike)</option>
                <option value="FLAGGED">Flagged (Fraud Alert)</option>
              </select>
            </div>

            <div className="text-xs text-slate-400">
              Total Selisih Terdeteksi:{' '}
              <span className="text-amber-400 font-bold font-mono">
                {CostCalculationEngine.formatCurrencyIdr(totalDiscrepancyAmount)}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Tanggal & Referensi</th>
                  <th className="py-3 px-4">Tipe Rekonsiliasi</th>
                  <th className="py-3 px-4">Kendaraan / Driver</th>
                  <th className="py-3 px-4 text-right">Data Telematika Sensor</th>
                  <th className="py-3 px-4 text-right">Kwitansi / Nota Klaim</th>
                  <th className="py-3 px-4 text-right">Selisih Deviasi</th>
                  <th className="py-3 px-4 text-center">Status Audit</th>
                  <th className="py-3 px-4">Rekomendasi Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredReconciliation.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-white block">{item.referenceLabel}</span>
                      <span className="text-[10px] text-slate-500">{item.date}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-300">{item.typeLabel}</td>
                    <td className="py-3 px-4">
                      {item.vehiclePlate && (
                        <span className="font-semibold text-cyan-400 block">{item.vehiclePlate}</span>
                      )}
                      {item.driverName && <span className="text-[10px] text-slate-400">{item.driverName}</span>}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-200">
                      {item.type.includes('FUEL')
                        ? `${item.telemetryAmount.toLocaleString()} Liter`
                        : CostCalculationEngine.formatCurrencyIdr(item.telemetryAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-white">
                      {item.type.includes('FUEL')
                        ? `${item.reportedAmount.toLocaleString()} Liter`
                        : CostCalculationEngine.formatCurrencyIdr(item.reportedAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span
                        className={`font-bold ${
                          item.status === 'SUSPICIOUS_SPIKE' || item.status === 'FLAGGED'
                            ? 'text-rose-400'
                            : item.status === 'MINOR_VARIANCE'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {item.discrepancyPercent > 0 ? '+' : ''}
                        {item.discrepancyPercent}% (
                        {CostCalculationEngine.formatCurrencyIdr(item.discrepancyAmount)})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'MATCH'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : item.status === 'MINOR_VARIANCE'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : item.status === 'SUSPICIOUS_SPIKE'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] max-w-xs">{item.suggestedAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Log Table */}
      {activeSubTab === 'audit_log' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari aktivitas audit log..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <span className="text-xs text-slate-400">{filteredLogs.length} Entri Tercatat</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Waktu (Timestamp)</th>
                  <th className="py-3 px-4">Pengguna & Peran</th>
                  <th className="py-3 px-4">Aksi Finansial</th>
                  <th className="py-3 px-4">Rincian Aktivitas</th>
                  <th className="py-3 px-4 text-right">Nominal Terkait</th>
                  <th className="py-3 px-4">Alamat IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">{log.timestamp}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white block">{log.userName}</span>
                      <span className="text-[10px] text-slate-500">{log.userRole}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-cyan-400 border border-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{log.details}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      {log.amountIdr ? CostCalculationEngine.formatCurrencyIdr(log.amountIdr) : '-'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[10px]">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
