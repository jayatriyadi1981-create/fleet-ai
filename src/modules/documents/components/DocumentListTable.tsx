/**
 * Fleet Intelligence Smart AI - Unified Document List & Filterable Table
 * PROMPT 48 - High Performance Table, Filter Matrix, Batch Actions & Responsive Mobile Cards
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  RefreshCw,
  Download,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Trash2,
  Archive,
  MoreVertical,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { DocumentItem, DocumentFilter, EntityType, DocumentType, DocumentStatus } from '../types/documentTypes';
import { documentService } from '../services/documentService';

interface DocumentListTableProps {
  documents: DocumentItem[];
  onSelectDocument: (doc: DocumentItem) => void;
  onReplaceVersion: (doc: DocumentItem) => void;
  onUploadNew: (entityType?: EntityType, docType?: DocumentType) => void;
  onUpdate: () => void;
  defaultFilter?: Partial<DocumentFilter>;
}

export const DocumentListTable: React.FC<DocumentListTableProps> = ({
  documents,
  onSelectDocument,
  onReplaceVersion,
  onUploadNew,
  onUpdate,
  defaultFilter,
}) => {
  const [search, setSearch] = useState(defaultFilter?.search || '');
  const [entityType, setEntityType] = useState<EntityType | 'ALL'>((defaultFilter?.entityType as any) || 'ALL');
  const [docType, setDocType] = useState<DocumentType | 'ALL'>((defaultFilter?.documentType as any) || 'ALL');
  const [status, setStatus] = useState<DocumentStatus | 'ALL'>((defaultFilter?.status as any) || 'ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'daysRemaining' | 'expiryDate' | 'title'>('daysRemaining');
  const [sortAsc, setSortAsc] = useState(true);

  // Apply filters
  let filtered = documents.filter((d) => {
    if (search) {
      const s = search.toLowerCase();
      const match =
        d.title.toLowerCase().includes(s) ||
        d.documentNumber.toLowerCase().includes(s) ||
        d.entityName.toLowerCase().includes(s) ||
        d.documentType.toLowerCase().includes(s);
      if (!match) return false;
    }

    if (entityType !== 'ALL' && d.entityType !== entityType) return false;
    if (docType !== 'ALL' && d.documentType !== docType) return false;
    if (status !== 'ALL' && d.status !== status) return false;

    return true;
  });

  // Sort
  filtered = filtered.sort((a, b) => {
    if (sortField === 'daysRemaining') {
      return sortAsc ? a.daysRemaining - b.daysRemaining : b.daysRemaining - a.daysRemaining;
    } else if (sortField === 'expiryDate') {
      return sortAsc ? a.expiryDate.localeCompare(b.expiryDate) : b.expiryDate.localeCompare(a.expiryDate);
    } else {
      return sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    }
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filtered.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBatchVerify = () => {
    selectedIds.forEach((id) => {
      documentService.verifyDocument(id, 'VERIFIED', 'Admin Batch Reviewer');
    });
    setSelectedIds([]);
    onUpdate();
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari plat nomor, nama pengemudi, no. dokumen STNK/KIR/SIM..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value as any)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">Semua Entitas</option>
            <option value="VEHICLE">Kendaraan (Vehicle)</option>
            <option value="DRIVER">Pengemudi (Driver)</option>
            <option value="COMPANY">Perusahaan (Company)</option>
            <option value="DEVICE">Perangkat (Device)</option>
          </select>

          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as any)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">Semua Jenis Dokumen</option>
            <option value="STNK">STNK</option>
            <option value="KIR">KIR Dishub</option>
            <option value="INSURANCE">Polis Asuransi</option>
            <option value="SIM_B2">SIM BII Umum</option>
            <option value="SIM_A">SIM A</option>
            <option value="DRIVER_CERT">DDT Certification</option>
            <option value="BUSINESS_LICENSE">NIB / SIUP-K</option>
            <option value="GPS_CALIBRATION">Kalibrasi GPS</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="VALID">Valid / Berlaku</option>
            <option value="EXPIRING_SOON">Expiring Soon (≤30d)</option>
            <option value="EXPIRED">EXPIRED (Kedaluwarsa)</option>
            <option value="PENDING_VERIFICATION">Menunggu Verifikasi</option>
            <option value="REJECTED">Ditolak (Rejected)</option>
          </select>
        </div>
      </div>

      {/* Batch Actions Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 backdrop-blur text-xs animate-in fade-in">
          <span className="font-bold text-cyan-300">
            {selectedIds.length} dokumen terpilih
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchVerify}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 font-bold text-slate-950 hover:bg-emerald-400"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Verifikasi Massal</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-300 hover:bg-slate-700"
            >
              Batal Pilih
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-semibold text-slate-400">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500"
                  />
                </th>
                <th className="py-3 px-4">Nama Dokumen & Entitas</th>
                <th className="py-3 px-4">Jenis & Versi</th>
                <th className="py-3 px-4">Nomor Registrasi</th>
                <th className="py-3 px-4">Masa Berlaku</th>
                <th className="py-3 px-4 cursor-pointer" onClick={() => {
                  setSortField('daysRemaining');
                  setSortAsc(!sortAsc);
                }}>
                  <div className="flex items-center gap-1">
                    <span>Sisa Waktu</span>
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <FileText className="mx-auto h-8 w-8 mb-2 opacity-30 text-cyan-400" />
                    <p className="text-xs font-semibold text-slate-400">Tidak ada dokumen yang sesuai dengan filter.</p>
                    <p className="text-[11px] text-slate-600 mt-1">Coba sesuaikan kata kunci pencarian atau reset filter.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(doc.id)}
                        onChange={() => handleToggleSelect(doc.id)}
                        className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500"
                      />
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => onSelectDocument(doc)}
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 hover:scale-105 transition-transform"
                        >
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              onClick={() => onSelectDocument(doc)}
                              className="font-bold text-white hover:text-cyan-400 cursor-pointer transition-colors max-w-xs truncate"
                            >
                              {doc.title}
                            </span>
                            {doc.legalHold && (
                              <span title="Legal Hold Active" className="text-rose-400">
                                <Lock className="h-3 w-3" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">{doc.entityName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-lg bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300 font-mono">
                          {doc.documentType}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">v{doc.currentVersion}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-slate-200">{doc.documentNumber}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-xs text-slate-300">{doc.expiryDate}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          doc.daysRemaining < 0
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : doc.daysRemaining === 0
                            ? 'bg-rose-500 text-slate-950 font-black'
                            : doc.daysRemaining <= 7
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : doc.daysRemaining <= 30
                            ? 'bg-amber-500/15 text-amber-300'
                            : 'bg-emerald-500/10 text-emerald-300'
                        }`}
                      >
                        {doc.daysRemaining < 0
                          ? `Overdue ${Math.abs(doc.daysRemaining)}d`
                          : doc.daysRemaining === 0
                          ? 'Hari Ini'
                          : `${doc.daysRemaining} hari`}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          doc.status === 'VALID'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : doc.status === 'EXPIRING_SOON'
                            ? 'bg-amber-500/10 text-amber-400'
                            : doc.status === 'EXPIRED'
                            ? 'bg-rose-500/10 text-rose-400'
                            : 'bg-cyan-500/10 text-cyan-400'
                        }`}
                      >
                        {doc.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectDocument(doc)}
                          title="Lihat Pratinjau & Rincian"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onReplaceVersion(doc)}
                          title="Perbarui Versi Berkas"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
