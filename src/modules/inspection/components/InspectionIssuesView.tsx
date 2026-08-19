/**
 * Fleet Intelligence Smart AI - Inspection Issues Management & Post-Repair Verification
 * Tracks defects, linked work orders, repair resolution, and vehicle ungrounding release.
 */

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Wrench, 
  Check, 
  Filter, 
  Search, 
  CarFront, 
  Calendar 
} from 'lucide-react';
import { inspectionService } from '../services/inspectionService';
import { InspectionIssue } from '../types/inspection';

export const InspectionIssuesView: React.FC = () => {
  const [issues, setIssues] = useState<InspectionIssue[]>(() => inspectionService.getIssues());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Post repair verification modal state
  const [verifyingIssue, setVerifyingIssue] = useState<InspectionIssue | null>(null);
  const [verifierName, setVerifierName] = useState<string>('Mulyadi (Kepala Mekanik Workshop)');
  const [verificationNotes, setVerificationNotes] = useState<string>('Telah dilakukan penggantian sparepart dan uji fungsi rem pneumatik di pool.');

  React.useEffect(() => {
    return inspectionService.subscribe(() => {
      setIssues(inspectionService.getIssues());
    });
  }, []);

  const filteredIssues = issues.filter(iss => {
    const matchStatus = statusFilter === 'all' || iss.status === statusFilter;
    const matchSeverity = severityFilter === 'all' || iss.severity === severityFilter;
    const matchSearch = 
      iss.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSeverity && matchSearch;
  });

  const handleResolve = (pass: boolean) => {
    if (!verifyingIssue) return;
    inspectionService.verifyAndResolveIssue(
      verifyingIssue.id,
      verifierName,
      verificationNotes,
      pass
    );
    setVerifyingIssue(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            Manajemen Temuan Kerusakan (Inspection Issues)
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
              {issues.filter(i => i.status !== 'RESOLVED').length} Terbuka
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Daftar kegagalan checklist inspeksi, tindak lanjut Work Order, dan verifikasi pelepasan status Grounded.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari Plat, Komponen Rusak..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_REVIEW">IN_REVIEW</option>
            <option value="WORK_ORDER_CREATED">WORK_ORDER_CREATED</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
          >
            <option value="all">Semua Tingkat Keparahan</option>
            <option value="CRITICAL">Kritis (CRITICAL)</option>
            <option value="HIGH">Tinggi (HIGH)</option>
            <option value="MEDIUM">Sedang (MEDIUM)</option>
            <option value="LOW">Rendah (LOW)</option>
          </select>
        </div>
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
              issue.status === 'RESOLVED'
                ? 'bg-slate-900/60 border-slate-800 opacity-75'
                : issue.severity === 'CRITICAL'
                ? 'bg-rose-950/20 border-rose-800/80 shadow-md'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="space-y-3">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  issue.severity === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : issue.severity === 'HIGH'
                    ? 'bg-orange-500/20 text-orange-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {issue.severity}
                </span>

                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                  issue.status === 'RESOLVED'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : issue.status === 'WORK_ORDER_CREATED'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {issue.status}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-bold text-white text-sm">{issue.itemName}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{issue.description}</p>
              </div>

              {/* Info Details */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Kendaraan:</span>
                  <strong className="text-white">{issue.vehiclePlate}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Pelapor:</span>
                  <span className="text-slate-300">{issue.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span>No. Inspeksi:</span>
                  <span className="text-cyan-400 font-mono">{issue.inspectionNumber}</span>
                </div>
                {issue.workOrderNumber && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Work Order:</span>
                    <span className="font-mono">{issue.workOrderNumber}</span>
                  </div>
                )}
              </div>

              {/* Photos if any */}
              {issue.photoUrls && issue.photoUrls.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {issue.photoUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Defect"
                      className="w-14 h-14 rounded-lg object-cover border border-slate-700"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Actions / Verification state */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              {issue.status === 'RESOLVED' ? (
                <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Selesai diperbaiki & diverifikasi
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setVerifyingIssue(issue)}
                  className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Verifikasi Pasca Perbaikan (QC)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Post-Repair Verification Modal */}
      {verifyingIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl text-slate-100">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-cyan-400" />
              Verifikasi Pasca Perbaikan & Pelepasan Unit
            </h2>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div><strong>Item:</strong> {verifyingIssue.itemName} ({verifyingIssue.vehiclePlate})</div>
              <div className="text-slate-400"><strong>Keluhan Awal:</strong> {verifyingIssue.description}</div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Nama Petugas QC / Kepala Bengkel</label>
              <input
                type="text"
                value={verifierName}
                onChange={(e) => setVerifierName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Catatan Hasil Pengujian Ulang (QC Notes)</label>
              <textarea
                rows={3}
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setVerifyingIssue(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={() => handleResolve(true)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
              >
                <Check className="w-4 h-4" />
                Lolos Verifikasi & Rilis Unit (PASS)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
