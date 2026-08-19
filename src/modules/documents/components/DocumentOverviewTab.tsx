/**
 * Fleet Intelligence Smart AI - Document Management Overview & Compliance Dashboard
 * PROMPT 48 - Compliance Gauges, Storage Quotas, Urgent Attention Matrix & Missing Documents
 */

import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  FileCheck,
  FileX,
  UploadCloud,
  Database,
  Sparkles,
  TrendingUp,
  Truck,
  UserCheck,
  Building,
  RefreshCw,
  Eye,
  Plus,
  Zap,
} from 'lucide-react';
import { DocumentComplianceSummary, DocumentItem, MissingDocumentItem } from '../types/documentTypes';

interface DocumentOverviewTabProps {
  summary: DocumentComplianceSummary;
  expiringDocs: DocumentItem[];
  expiredDocs: DocumentItem[];
  missingDocs: MissingDocumentItem[];
  onSelectDocument: (doc: DocumentItem) => void;
  onReplaceVersion: (doc: DocumentItem) => void;
  onUploadNew: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DocumentOverviewTab: React.FC<DocumentOverviewTabProps> = ({
  summary,
  expiringDocs,
  expiredDocs,
  missingDocs,
  onSelectDocument,
  onReplaceVersion,
  onUploadNew,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Hero KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Berkas</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{summary.totalDocuments}</span>
            <FileTextIcon className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-[10px] text-slate-500">Terenkripsi & Tersinkron</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Valid & Sah</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400">{summary.validCount}</span>
            <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-[10px] text-emerald-500/80">
            {Math.round((summary.validCount / Math.max(summary.totalDocuments, 1)) * 100)}% dari total armada
          </p>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-1 cursor-pointer hover:border-amber-500 transition-colors" onClick={() => onNavigateTab('expiring')}>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Expiring (≤30d)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-400">{summary.expiringSoonCount}</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-[10px] text-amber-500/80">Jatuh tempo dekat</p>
        </div>

        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-1 cursor-pointer hover:border-rose-500 transition-colors" onClick={() => onNavigateTab('expired')}>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">EXPIRED</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-400">{summary.expiredCount}</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <p className="text-[10px] text-rose-500/80">Blokir operasional</p>
        </div>

        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-4 space-y-1 cursor-pointer hover:border-cyan-500 transition-colors" onClick={() => onNavigateTab('verification')}>
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Antrean Review</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-cyan-400">{summary.pendingVerificationCount}</span>
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-[10px] text-cyan-500/80">Menunggu approval</p>
        </div>

        <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-4 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Dokumen Kurang</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-purple-400">{summary.missingRequiredCount}</span>
            <FileX className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-[10px] text-purple-500/80">Wajib diunggah</p>
        </div>
      </div>

      {/* Compliance Indices & Storage Quota */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Fleet Compliance Index */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Fleet Legal Compliance Score</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  {summary.fleetComplianceScore >= 90 ? 'Grade A (Optimal)' : 'Grade B (Perlu Tindakan)'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">Indeks kepatuhan legalitas hukum & keselamatan armada transportasi</p>
            </div>
            <span className="text-3xl font-black text-cyan-400">{summary.fleetComplianceScore}%</span>
          </div>

          {/* Progress Bars for Entity Types */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-cyan-400" />
                  Kepatuhan Dokumen Kendaraan (STNK, KIR, Asuransi)
                </span>
                <span className="font-bold text-white">{summary.vehicleComplianceScore}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${summary.vehicleComplianceScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Kepatuhan Dokumen Driver (SIM BII, DDT Cert, MCU)
                </span>
                <span className="font-bold text-white">{summary.driverComplianceScore}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${summary.driverComplianceScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-purple-400" />
                  Kepatuhan Korporat (NIB, SIUP-K, Asuransi TPL)
                </span>
                <span className="font-bold text-white">{summary.companyComplianceScore}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-purple-400 rounded-full transition-all duration-500"
                  style={{ width: `${summary.companyComplianceScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Storage Quota Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white">Secure Object Storage</h3>
            </div>
            <p className="text-[11px] text-slate-400">Penyimpanan Terenkripsi AWS S3 / Cloud Storage</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Kapasitas Terpakai</span>
              <span className="font-bold text-white">
                {summary.storageQuota.usedFormatted} / {summary.storageQuota.totalFormatted}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full"
                style={{ width: `${summary.storageQuota.percentageUsed}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500">{summary.storageQuota.percentageUsed}% kapasitas enterprise digunakan</p>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">AI OCR Scanner Bulan Ini</span>
            <span className="font-bold text-cyan-400">
              {summary.storageQuota.ocrScansUsedMonth} / {summary.storageQuota.ocrScansLimitMonth} scan
            </span>
          </div>
        </div>
      </div>

      {/* Critical & Expiring Attention Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expired / Critical Card */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-rose-300">Dokumen Telah Kedaluwarsa (Tindakan Segera)</h3>
                <p className="text-[11px] text-rose-400/80">Otomatis memicu pembatasan dispatch unit</p>
              </div>
            </div>
            <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-300">
              {expiredDocs.length} Dokumen
            </span>
          </div>

          {expiredDocs.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">Nihil. Tidak ada dokumen yang kedaluwarsa.</p>
          ) : (
            <div className="space-y-2.5">
              {expiredDocs.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-slate-950 p-3"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{doc.title}</p>
                    <p className="text-[11px] text-slate-400">
                      {doc.entityName} • Expired sejak: <span className="text-rose-400">{doc.expiryDate}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onReplaceVersion(doc)}
                      className="flex items-center gap-1 rounded-lg bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-slate-950 hover:bg-rose-400"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Perpanjang</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expiring Soon (30 Days) */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-amber-300">Mendekati Kedaluwarsa (Jendela 30 Hari)</h3>
                <p className="text-[11px] text-amber-400/80">Jadwalkan perpanjangan sebelum tanggal jatuh tempo</p>
              </div>
            </div>
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300">
              {expiringDocs.length} Dokumen
            </span>
          </div>

          {expiringDocs.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">Nihil. Tidak ada dokumen yang akan expired segera.</p>
          ) : (
            <div className="space-y-2.5">
              {expiringDocs.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-slate-950 p-3"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{doc.title}</p>
                    <p className="text-[11px] text-slate-400">
                      {doc.entityName} • Jatuh tempo: <span className="text-amber-400 font-bold">{doc.expiryDate}</span> ({doc.daysRemaining} hari)
                    </p>
                  </div>
                  <button
                    onClick={() => onReplaceVersion(doc)}
                    className="flex items-center gap-1 rounded-lg bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500/30"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Revisi Versi</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Missing Required Documents Checklist */}
      {missingDocs.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileX className="h-4 w-4 text-purple-400" />
                <span>Dokumen Standar Kepatuhan yang Belum Dilengkapi</span>
              </h3>
              <p className="text-xs text-slate-400">Daftar unit atau driver yang belum melengkapi berkas legalitas wajib</p>
            </div>
            <button
              onClick={onUploadNew}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
            >
              <Plus className="h-4 w-4" />
              <span>Unggah Berkas Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-semibold text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Entitas / Unit</th>
                  <th className="py-2.5 px-3">Tipe</th>
                  <th className="py-2.5 px-3">Dokumen Wajib yang Hilang</th>
                  <th className="py-2.5 px-3">Dampak Regulasi</th>
                  <th className="py-2.5 px-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {missingDocs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-white">{item.entityName}</td>
                    <td className="py-2.5 px-3">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                        {item.entityType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-rose-300">{item.documentTypeName}</td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{item.impactDescription}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={onUploadNew}
                        className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-bold text-cyan-300 hover:bg-cyan-500/20"
                      >
                        Lengkapi Sekarang
                      </button>
                    </td>
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

function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
