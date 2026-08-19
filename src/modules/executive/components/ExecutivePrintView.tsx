/**
 * Fleet Intelligence Smart AI - Executive Print & PDF Report View
 * PROMPT 38 - Clean, high-resolution printable report formatted for Board Meetings & Executive Review
 */

import React from 'react';
import { ExecutiveProvider, useExecutive } from '../context/ExecutiveContext';
import { useFleet } from '../../../context/FleetContext';
import { useAuth } from '../../../context/AuthContext';
import {
  Printer,
  ArrowLeft,
  Building2,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const ExecutivePrintContent: React.FC = () => {
  const {
    scoreResult,
    kpiCards,
    aiSummary,
    efficiency,
    cost,
    safety,
    fuel,
    maintenance,
    branchesPerformance,
    highRiskVehicles,
    topCostVehicles,
    savingOpportunities,
  } = useExecutive();

  const { currentTenant, setActiveView } = useFleet();
  const { user } = useAuth();

  const handlePrint = () => {
    window.print();
  };

  const formatIdr = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID');

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-6 md:p-10 font-sans print:p-0 print:bg-white">
      {/* Top action toolbar (Hidden when printing) */}
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Simpan PDF (Print)</span>
        </button>
      </div>

      {/* Main Printable Paper Sheet */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-200 print:border-none print:shadow-none print:p-0">
        {/* Letterhead */}
        <div className="flex items-start justify-between pb-6 border-b-2 border-slate-900">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 block mb-1">
              EXECUTIVE BOARD REPORT • LAPORAN DIREKSI
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {currentTenant?.name || 'PT TRANS NUSANTARA LOGISTICS'}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Fleet Performance, Total Operating Cost & AI Operational Intelligence Briefing
            </p>
          </div>

          <div className="text-right text-xs text-slate-600 space-y-1">
            <div>
              <strong>Tanggal Cetak: </strong>
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div>
              <strong>Dibuat Oleh: </strong>
              {user?.name || 'Executive AI Engine'}
            </div>
            <div>
              <strong>Status Kesehatan: </strong>
              <span className="font-bold text-emerald-700">{scoreResult.status} ({scoreResult.overallScore}/100)</span>
            </div>
          </div>
        </div>

        {/* 1. Score & Core KPI Summary */}
        <div className="my-6 p-6 rounded-xl bg-slate-50 border border-slate-200">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>1. Ringkasan Eksekutif & Health Index</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block">Fleet Composite Score</span>
              <span className="text-2xl font-black text-blue-600">{scoreResult.overallScore}/100</span>
              <span className="text-[10px] text-slate-500 block">Status: {scoreResult.status}</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block">Total Operating Cost</span>
              <span className="text-lg font-black text-slate-900">{formatIdr(cost.totalOperatingCost)}</span>
              <span className="text-[10px] text-emerald-600 block">Cost/KM: {formatIdr(cost.costPerKm)}</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block">Utilisasi Armada</span>
              <span className="text-2xl font-black text-slate-900">{efficiency.fleetUtilizationRate}%</span>
              <span className="text-[10px] text-slate-500 block">Ketersediaan: {efficiency.vehicleAvailabilityRate}%</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block">Safety & Zero Accident</span>
              <span className="text-2xl font-black text-emerald-600">{safety.safetyScore}/100</span>
              <span className="text-[10px] text-slate-500 block">0 Fatal Accident</span>
            </div>
          </div>
        </div>

        {/* 2. AI Intelligence Headline & Key Findings */}
        <div className="my-6 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>2. Sintesis Temuan Kunci (AI Executive Summary)</span>
          </h2>
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-800 leading-relaxed font-medium">
            {aiSummary.executiveHeadline}
          </div>
          <div className="space-y-1.5">
            {aiSummary.keyFindings.map((finding, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{finding}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Branch Performance Table */}
        <div className="my-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-700" />
            <span>3. Matriks Kinerja Antar Cabang Depo</span>
          </h2>
          <table className="w-full text-left text-xs border border-slate-200 border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                <th className="p-2.5 text-center w-12">Rank</th>
                <th className="p-2.5">Cabang Depo</th>
                <th className="p-2.5 text-center">Unit</th>
                <th className="p-2.5">Utilisasi</th>
                <th className="p-2.5">Cost / KM</th>
                <th className="p-2.5 text-center">Safety</th>
                <th className="p-2.5">BBM</th>
                <th className="p-2.5 text-center">Skor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {branchesPerformance.map((b) => (
                <tr key={b.branchId}>
                  <td className="p-2.5 text-center font-bold">{b.rank}</td>
                  <td className="p-2.5 font-bold text-slate-900">{b.branchName}</td>
                  <td className="p-2.5 text-center">{b.fleetCount}</td>
                  <td className="p-2.5 font-semibold">{b.utilizationPct}%</td>
                  <td className="p-2.5 font-semibold">{formatIdr(b.costPerKmIdr)}</td>
                  <td className="p-2.5 text-center">{b.safetyScore}</td>
                  <td className="p-2.5">{b.fuelEfficiencyKmL} KM/L</td>
                  <td className="p-2.5 text-center font-bold text-blue-700">{b.overallScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Top Cost Vehicles & Potential Savings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Unit Kendaraan Biaya Tertinggi
            </h3>
            <div className="space-y-2 text-xs">
              {topCostVehicles.slice(0, 4).map((v) => (
                <div key={v.vehicleId} className="flex justify-between items-center bg-white p-2 rounded border border-slate-200">
                  <div>
                    <strong className="text-slate-900">{v.plateNumber}</strong>
                    <span className="text-slate-500 block text-[10px]">{v.model} • {v.branchName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-red-600">{formatIdr(v.totalCostIdr)}</span>
                    <span className="text-[10px] text-slate-500 block">{formatIdr(v.costPerKmIdr)}/KM</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3">
              Inisiatif Potensi Penghematan
            </h3>
            <div className="space-y-2 text-xs">
              {savingOpportunities.slice(0, 4).map((s) => (
                <div key={s.id} className="flex justify-between items-center bg-white p-2 rounded border border-emerald-100">
                  <div>
                    <strong className="text-slate-900">{s.title}</strong>
                    <span className="text-slate-500 block text-[10px]">Kategori: {s.category}</span>
                  </div>
                  <span className="font-bold text-emerald-700">{formatIdr(s.estimatedMonthlySavingIdr)}/bln</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-12 pt-8 border-t border-slate-300 grid grid-cols-3 gap-8 text-center text-xs">
          <div>
            <div className="h-16"></div>
            <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
              Surya Pratama
            </div>
            <span className="text-[10px] text-slate-500">Fleet Operations Director</span>
          </div>
          <div>
            <div className="h-16"></div>
            <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
              Hadi Gunawan
            </div>
            <span className="text-[10px] text-slate-500">Finance & Cost Director</span>
          </div>
          <div>
            <div className="h-16"></div>
            <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
              Ir. Budi Santoso
            </div>
            <span className="text-[10px] text-slate-500">President Director / CEO</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExecutivePrintView: React.FC = () => {
  return (
    <ExecutiveProvider>
      <ExecutivePrintContent />
    </ExecutiveProvider>
  );
};
