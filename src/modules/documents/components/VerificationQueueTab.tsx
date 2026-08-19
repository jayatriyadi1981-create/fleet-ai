/**
 * Fleet Intelligence Smart AI - Document Verification Review Queue
 * PROMPT 48 - Split-Pane Review, Fast Approvals, Rejection Workflows & Correction Requests
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Eye,
  Sparkles,
  User,
  Calendar,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { DocumentItem, VerificationStatus } from '../types/documentTypes';
import { documentService } from '../services/documentService';
import { useAuth } from '../../../context/AuthContext';

interface VerificationQueueTabProps {
  onSelectDocument: (doc: DocumentItem) => void;
  onUpdate: () => void;
}

export const VerificationQueueTab: React.FC<VerificationQueueTabProps> = ({
  onSelectDocument,
  onUpdate,
}) => {
  const { user } = useAuth();
  const pendingDocs = documentService.getDocuments({ verificationStatus: 'PENDING' });
  const [activeDoc, setActiveDoc] = useState<DocumentItem | null>(pendingDocs[0] || null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const handleVerify = (status: VerificationStatus) => {
    if (!activeDoc) return;
    const reviewer = user?.name || 'HSE Compliance Lead';
    documentService.verifyDocument(activeDoc.id, status, reviewer, rejectReason);
    setIsRejecting(false);
    setRejectReason('');
    onUpdate();

    const remaining = documentService.getDocuments({ verificationStatus: 'PENDING' });
    setActiveDoc(remaining[0] || null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Antrean Verifikasi Legalitas Dokumen</h2>
            <p className="text-xs text-slate-400">
              Pemeriksaan berkas yang diunggah oleh driver mobile app, staf depo, dan vendor mitra
            </p>
          </div>
        </div>

        <span className="rounded-full bg-cyan-500/20 border border-cyan-500/40 px-3 py-1 text-xs font-bold text-cyan-300">
          {pendingDocs.length} Dokumen Menunggu Review
        </span>
      </div>

      {pendingDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-3">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="text-sm font-bold text-white">Semua Berkas Telah Terverifikasi</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Tidak ada dokumen baru yang memerlukan persetujuan saat ini. Semua data valid & tersinkronisasi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Pending List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Daftar Antrean ({pendingDocs.length})
            </h3>

            <div className="space-y-2.5">
              {pendingDocs.map((doc) => {
                const isSelected = activeDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setActiveDoc(doc)}
                    className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-950/40'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{doc.documentType}</span>
                      <span className="text-[10px] text-slate-500">{doc.createdAt.split('T')[0]}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-200 mt-1 truncate">{doc.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">No: {doc.documentNumber}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                      <span>Pengunggah: {doc.uploadedBy}</span>
                      <span className="text-cyan-400 font-semibold">Review →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Detailed Review Split Pane */}
          {activeDoc && (
            <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{activeDoc.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                      Nomor Registrasi: <span className="text-cyan-300">{activeDoc.documentNumber}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectDocument(activeDoc)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                  >
                    <Eye className="h-4 w-4 text-cyan-400" />
                    <span>Buka Layar Penuh</span>
                  </button>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400">Entitas Pemilik</span>
                    <p className="text-xs font-bold text-white">{activeDoc.entityName}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400">Jenis Dokumen</span>
                    <p className="text-xs font-bold text-cyan-300">{activeDoc.documentType}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400">Tanggal Terbit (Issue Date)</span>
                    <p className="text-xs text-slate-200">{activeDoc.issueDate}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400">Masa Berlaku (Expiry Date)</span>
                    <p className="text-xs font-bold text-white">{activeDoc.expiryDate}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400">Instansi Penerbit</span>
                    <p className="text-xs text-slate-200">{activeDoc.metadata.issuer || 'Polda Metro Jaya / Dishub'}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400">Diupload Oleh</span>
                    <p className="text-xs text-slate-200">{activeDoc.uploadedBy}</p>
                  </div>
                </div>

                {/* Image / PDF Thumbnail Preview */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex items-center justify-center min-h-[220px]">
                  <img
                    src={activeDoc.fileUrl}
                    alt={activeDoc.title}
                    className="max-h-[200px] rounded-lg object-contain border border-slate-800 shadow"
                  />
                </div>

                {/* AI OCR Badge */}
                {activeDoc.ocrResult && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                    <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>
                      AI OCR mengekstrak kecocokan data sebesar <strong>{activeDoc.ocrResult.confidence}%</strong> tanpa indikasi rekayasa berkas.
                    </span>
                  </div>
                )}
              </div>

              {/* Approval Actions */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                {isRejecting ? (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-rose-300">Alasan Penolakan Dokumen *</label>
                    <textarea
                      rows={2}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Contoh: Foto buram atau masa berlaku tidak sesuai dengan dokumen asli..."
                      className="w-full rounded-xl border border-rose-500/40 bg-slate-950 p-2 text-xs text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsRejecting(false)}
                        className="rounded-xl border border-slate-800 bg-slate-800 px-3 py-1.5 text-xs text-slate-300"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => handleVerify('REJECTED')}
                        className="rounded-xl bg-rose-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-400"
                      >
                        Konfirmasi Tolak Dokumen
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setIsRejecting(true)}
                      className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Tolak Dokumen</span>
                    </button>

                    <button
                      onClick={() => handleVerify('VERIFIED')}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Setujui (Verify & Valid)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
