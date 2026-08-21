import React, { useState } from 'react';
import {
  FileCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Building,
  DollarSign,
  Shield,
  FileText,
  Plus,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

export const CorpComplianceLeaseTab: React.FC = () => {
  const leaseContracts = [
    {
      id: 'ctr-01',
      vendor: 'PT Serasi Autoraya (TRAC Astra)',
      contractNumber: 'CTR-TRAC-CORP-2024/08',
      assetCode: 'CORP-VIP-01',
      plate: 'B 1001 RFS',
      model: 'Toyota Alphard 2.5 G Executive Lounge',
      leaseDurationMonths: 36,
      startDate: '2024-08-01',
      expiryDate: '2027-07-31',
      monthlyFeeIdr: 28500000,
      stnkExpiry: '2027-04-15',
      insuranceType: 'Comprehensive All-Risk + Third Party Liability (TPL) 100 Juta',
      replacementVehicleClause: 'Instant 4-Hour Replacement VIP Unit',
      status: 'ACTIVE_HEALTHY',
    },
    {
      id: 'ctr-02',
      vendor: 'PT Mitra Pinasthika Mustika Rent (MPM)',
      contractNumber: 'CTR-MPM-CORP-2025/02',
      assetCode: 'CORP-POOL-01',
      plate: 'B 2145 SHP',
      model: 'Toyota Innova Zenix 2.0 V',
      leaseDurationMonths: 36,
      startDate: '2025-02-15',
      expiryDate: '2028-02-14',
      monthlyFeeIdr: 11200000,
      stnkExpiry: '2026-11-20',
      insuranceType: 'Comprehensive All-Risk (TLO + Banjir + Huru-hara)',
      replacementVehicleClause: 'Replacement unit within 24 Hours',
      status: 'ACTIVE_HEALTHY',
    },
    {
      id: 'ctr-03',
      vendor: 'PT Autopedia Sukses Lestari (ASSA Rent)',
      contractNumber: 'CTR-ASSA-CORP-2023/10',
      assetCode: 'CORP-POOL-03',
      plate: 'B 2990 TZQ',
      model: 'Toyota Avanza 1.5 G',
      leaseDurationMonths: 36,
      startDate: '2023-10-01',
      expiryDate: '2026-09-30',
      monthlyFeeIdr: 6800000,
      stnkExpiry: '2026-09-18',
      insuranceType: 'Commercial All-Risk',
      replacementVehicleClause: 'Replacement unit available',
      status: 'EXPIRING_SOON_RENEWAL',
    }
  ];

  return (
    <div id="corp-compliance-lease-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
            OPERATING LEASE CONTRACTS, STNK & INSURANCE COMPLIANCE
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Manajemen Kontrak Sewa Vendor (TRAC/MPM/ASSA), STNK & Asuransi All-Risk
          </h3>
          <p className="text-xs text-slate-400">
            Pemantauan masa berlaku kontrak sewa operasional, jadwal perpanjangan pajak STNK tahunan/5-tahunan, dan klaim asuransi penggantian unit rusak.
          </p>
        </div>

        <button
          onClick={() => alert('Tambah Kontrak Sewa / Polis Asuransi Armada Baru')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Daftarkan Kontrak Sewa Baru
        </button>
      </div>

      {/* Contracts Grid */}
      <div className="space-y-4">
        {leaseContracts.map(ctr => (
          <div key={ctr.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-blue-400 flex items-center justify-center font-bold text-xs">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{ctr.vendor}</h4>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-700">
                      {ctr.contractNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{ctr.plate} • {ctr.model} ({ctr.assetCode})</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                ctr.status === 'EXPIRING_SOON_RENEWAL' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {ctr.status === 'EXPIRING_SOON_RENEWAL' ? 'SEGERA JATUH TEMPO SEWA' : 'KONTRAK AKTIF'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 font-medium">Periode Sewa & Jatuh Tempo:</span>
                <p className="text-slate-800 font-mono">Mulai: {ctr.startDate}</p>
                <p className="text-slate-800 font-mono font-bold text-amber-700">Selesai: {ctr.expiryDate} ({ctr.leaseDurationMonths} Bulan)</p>
                <p className="text-slate-500 font-mono">Pajak STNK Exp: {ctr.stnkExpiry}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-medium">Perlindungan Asuransi & SLA:</span>
                <p className="font-semibold text-slate-800">{ctr.insuranceType}</p>
                <p className="text-blue-700 font-medium">{ctr.replacementVehicleClause}</p>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100 text-right">
                <span className="text-slate-500 font-medium">Biaya Sewa Operasional:</span>
                <div className="text-base font-bold text-slate-900 font-mono">
                  Rp {ctr.monthlyFeeIdr.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">/ bulan</span>
                </div>
                <div className="text-[11px] text-emerald-600 font-medium">Termasuk Servis & Asuransi</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                <span>Klaim Asuransi Zero Deductible / Biaya Risiko Sendiri (OR) Rp 300.000</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Proses Perpanjangan Kontrak Sewa atau Peremajaan Armada untuk ${ctr.plate}`)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Perpanjang / Re-Tender Sewa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
