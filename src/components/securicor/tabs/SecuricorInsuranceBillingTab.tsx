import React, { useState } from 'react';
import {
  DollarSign,
  ShieldCheck,
  FileSpreadsheet,
  FileText,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';

export const SecuricorInsuranceBillingTab: React.FC = () => {
  const billingContracts = [
    {
      id: 'bill-01',
      client: 'PT Bank Central Asia Tbk (BCA)',
      contractNumber: 'CTR-BCA-CIT-2026/01',
      insuranceUnderwriter: 'PT Asuransi Wahana Tata / Lloyd’s Syndicate',
      policyNumber: 'POL-CIT-LOMBARD-99021',
      maxCoveragePerTripIdr: 50000000000, // 50 Miliar
      monthlyTripCount: 142,
      billingRateFormula: 'Rp 2.500.000 / Trip + 0.015% Nilai Kas Angkut',
      currentInvoiceIdr: 485000000,
      paymentStatus: 'PAID',
    },
    {
      id: 'bill-02',
      client: 'PT Bank Mandiri (Persero) Tbk',
      contractNumber: 'CTR-MDR-CIT-2026/04',
      insuranceUnderwriter: 'PT Asuransi Jasa Indonesia (Jasindo)',
      policyNumber: 'POL-CIT-JASINDO-88301',
      maxCoveragePerTripIdr: 75000000000, // 75 Miliar
      monthlyTripCount: 180,
      billingRateFormula: 'Rp 2.750.000 / Trip + 0.012% Nilai Kas Angkut',
      currentInvoiceIdr: 620000000,
      paymentStatus: 'PENDING_APPROVAL',
    },
    {
      id: 'bill-03',
      client: 'Bank Indonesia - Khazanah Nasional',
      contractNumber: 'CTR-BI-KHAZANAH-2026/001',
      insuranceUnderwriter: 'Konsorsium Asuransi BUMN & Bank Indonesia',
      policyNumber: 'POL-CIT-BI-VVIP-001',
      maxCoveragePerTripIdr: 250000000000, // 250 Miliar
      monthlyTripCount: 24,
      billingRateFormula: 'Paket Pengawalan Khazanah VVIP',
      currentInvoiceIdr: 350000000,
      paymentStatus: 'PAID',
    }
  ];

  return (
    <div id="securicor-insurance-billing-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">CASH-IN-TRANSIT (CIT) INSURANCE & TARIFF BILLING</span>
          <h3 className="text-lg font-bold text-white mt-1">Polis Asuransi Pengangkutan Uang & Penagihan Faktur (Billing)</h3>
          <p className="text-xs text-slate-400">Pengelolaan polis asuransi Lloyd's / Konsorsium BUMN untuk perlindungan kerugian tunai 100% dan penagihan biaya ritase CIT.</p>
        </div>

        <button
          onClick={() => alert('Terbitkan Faktur Penagihan Billing CIT Baru')}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Terbitkan Faktur Tagihan
        </button>
      </div>

      {/* Contracts Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" /> Kontrak Penagihan Bank Klien & Polis Asuransi Aktif
          </h4>
        </div>

        <div className="divide-y divide-slate-100">
          {billingContracts.map(c => (
            <div key={c.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-base">{c.client}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-700">
                    {c.contractNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <span>Asuransi: <strong className="text-slate-800">{c.insuranceUnderwriter}</strong></span> •
                  <span className="font-mono">{c.policyNumber}</span>
                </p>
                <div className="text-xs text-slate-600 pt-1">
                  Skema Tarif: <span className="font-mono font-medium text-slate-800">{c.billingRateFormula}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <div className="text-xs text-slate-500">Maksimal Coverage Per Trip</div>
                  <div className="text-sm font-bold text-slate-900 font-mono">Rp {(c.maxCoveragePerTripIdr / 1000000000).toFixed(0)} Miliar</div>
                </div>

                <div>
                  <div className="text-xs text-slate-500">Nilai Tagihan Bulan Ini</div>
                  <div className="text-base font-bold text-amber-600 font-mono">Rp {(c.currentInvoiceIdr).toLocaleString('id-ID')}</div>
                  <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full font-bold mt-0.5 ${
                    c.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {c.paymentStatus}
                  </span>
                </div>

                <div>
                  <button
                    onClick={() => alert(`Cetak Faktur Penagihan & Sertifikat Polis Asuransi untuk ${c.client}`)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-semibold flex items-center gap-1 shadow"
                  >
                    <FileText className="w-3.5 h-3.5" /> Faktur
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
