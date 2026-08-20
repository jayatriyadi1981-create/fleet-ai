/**
 * Fleet Intelligence Smart AI - Root Cause Drilldown Modal
 * PROMPT 52 — Interactive "WHY?" Causal Investigation Modal (WHAT -> WHY -> WHO/WHERE -> IMPACT)
 */

import React from 'react';
import { X, HelpCircle, AlertCircle, ArrowRight, Truck, Route, User, DollarSign, ShieldAlert, Sparkles, FileText } from 'lucide-react';
import { RootCauseDriver } from '../../types/executiveReport';
import { ExecutiveKPIService } from '../../services/executiveReport/executiveKPIService';

interface RootCauseDrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  driver?: RootCauseDriver | null;
  onViewEvidence: (evidenceIds: string[], title: string) => void;
}

export const RootCauseDrilldownModal: React.FC<RootCauseDrilldownModalProps> = ({
  isOpen,
  onClose,
  title,
  category,
  driver,
  onViewEvidence,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/50 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-700 text-cyan-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/80 border border-cyan-800/40 px-2 py-0.5 rounded">
                  DIAGNOSTIK AKAR MASALAH (ROOT CAUSE)
                </span>
                {driver && (
                  <span className="text-xs font-semibold text-amber-400 bg-amber-950/80 border border-amber-800/40 px-2 py-0.5 rounded">
                    {driver.sharePercent}% Beban Biaya
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-100 mt-1">{title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content: Causal Cascade Pipeline */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Step 1: WHAT HAPPENED (Fenomena Gejala) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-mono">1</span>
              <span>Fenomena & Fakta Data (What Happened)</span>
            </div>
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 text-sm text-slate-300 leading-relaxed">
              {driver?.explanation || 'Terjadi penyimpangan realisasi biaya operasional melebihi target anggaran perusahaan akibat beban konsumsi energi dan pemeliharaan mendadak.'}
            </div>
          </div>

          {/* Step 2: WHY IT HAPPENED (Analisis Kausalitas AI) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono">2</span>
              <span>Penyebab Utama (Why It Happened)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Excessive Engine Idling</span>
                </div>
                <p className="text-xs text-slate-400">
                  Akumulasi 312 jam idle engine saat antrean bongkar muat logistik dan pendingin kabin menyala di rest area.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Unscheduled Component Wear</span>
                </div>
                <p className="text-xs text-slate-400">
                  Perbaikan injector common-rail dan kanvas kopling pada 5 unit truk dengan akumulasi jarak di atas 280.000 km.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: WHO & WHERE (Unit, Rute, dan Pengemudi Terkait) */}
          {driver && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-mono">3</span>
                <span>Entitas Terdampak (Who, Where, & Assets Involved)</span>
              </div>

              {/* Affected Vehicles */}
              {driver.affectedVehicles && driver.affectedVehicles.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Top Unit Kendaraan Penyumbang Biaya Terbesar:</span>
                  </div>
                  <div className="space-y-1.5">
                    {driver.affectedVehicles.slice(0, 3).map((v, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                        <div className="font-semibold text-slate-200">{v.plateNumber} <span className="font-normal text-slate-400">({v.model})</span></div>
                        <div className="text-right">
                          <span className="text-rose-400 font-semibold">{ExecutiveKPIService.formatRupiah(v.cost)}</span>
                          <span className="text-slate-400 ml-2">({ExecutiveKPIService.formatCostPerKm(v.costPerKm)})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Affected Drivers */}
              {driver.affectedDrivers && driver.affectedDrivers.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Perilaku Pengemudi Terkait (Driver Behavior Factors):</span>
                  </div>
                  <div className="space-y-1.5">
                    {driver.affectedDrivers.map((d, i) => (
                      <div key={i} className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{d.name}</span>
                          <span className="text-amber-400 font-medium">Overspeed: {d.overspeedCount}x | Excess Idle: {d.idleExcessMinutes} mnt</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{d.impactDescription}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: BUSINESS IMPACT & ACTION (Rekomendasi Solusi) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-mono">4</span>
              <span>Langkah Mitigasi & Rekomendasi Solusi</span>
            </div>
            <div className="p-4 bg-emerald-950/20 rounded-xl border border-emerald-900/40 text-xs text-emerald-200/90 leading-relaxed space-y-2">
              <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Intervensi Direksi:</span>
              </div>
              <p>
                1. Terapkan batas kuota bahan bakar berdasarkan ritase aktual kilometer (Electronic Fuel Coupon).
                <br />
                2. Lakukan eco-driving re-training untuk driver dengan riwayat overspeed malam.
                <br />
                3. Jadwalkan slot booking dermaga Pelabuhan Tanjung Priok pada window jam off-peak (20:00 - 05:00 WIB).
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {driver?.evidenceIds && driver.evidenceIds.length > 0 ? (
            <button
              onClick={() => {
                onClose();
                onViewEvidence(driver.evidenceIds, `Bukti Data: ${title}`);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Lihat Audit Bukti ({driver.evidenceIds.length} Evidence)</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow"
          >
            Tutup Diagnostik
          </button>
        </div>
      </div>
    </div>
  );
};
