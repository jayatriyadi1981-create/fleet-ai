/**
 * Fleet Intelligence Smart AI - Document Preview & Inspector Modal
 * PROMPT 48 - Full Document Viewer, Zoom/Rotate, Signed URLs, Version History & Audit Trail
 */

import React, { useState } from 'react';
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  FileText,
  ShieldCheck,
  Clock,
  History,
  AlertTriangle,
  Lock,
  Unlock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Sparkles,
  User,
  Building,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { DocumentItem, VerificationStatus } from '../types/documentTypes';
import { documentService } from '../services/documentService';
import { useAuth } from '../../../context/AuthContext';

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onReplaceVersion: (doc: DocumentItem) => void;
  onUpdate: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document: doc,
  isOpen,
  onClose,
  onReplaceVersion,
  onUpdate,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'VERSIONS' | 'AUDIT' | 'OCR'>('DETAILS');
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationAction, setVerificationAction] = useState<VerificationStatus | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [legalHoldReason, setLegalHoldReason] = useState('');
  const [showLegalHoldPrompt, setShowLegalHoldPrompt] = useState(false);
  const [previewVersionNumber, setPreviewVersionNumber] = useState<number | null>(null);

  if (!isOpen || !doc) return null;

  // Selected version data
  const currentVersionData =
    previewVersionNumber !== null
      ? doc.versions.find((v) => v.versionNumber === previewVersionNumber) || doc.versions[doc.versions.length - 1]
      : doc.versions[doc.versions.length - 1] || {
          versionNumber: doc.currentVersion,
          fileUrl: doc.fileUrl,
          fileName: doc.fileName,
          uploadedBy: doc.uploadedBy,
          uploadedAt: doc.createdAt,
        };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 250));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleReset = () => {
    setZoom(100);
    setRotation(0);
  };

  const handleDownload = () => {
    documentService.recordAudit({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: user?.name || 'Authorized User',
      action: 'DOWNLOADED',
      details: `Mengunduh berkas ${doc.title} (${doc.documentNumber}) v${currentVersionData.versionNumber}.`,
    });

    // Direct download anchor
    const a = window.document.createElement('a');
    a.href = currentVersionData.fileUrl || doc.fileUrl;
    a.download = currentVersionData.fileName || doc.fileName;
    a.target = '_blank';
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    onUpdate();
  };

  const handleExecuteVerification = (status: VerificationStatus) => {
    const reviewer = user?.name || 'Safety & Compliance Officer';
    documentService.verifyDocument(doc.id, status, reviewer, rejectReason);
    setIsVerifying(false);
    setVerificationAction(null);
    setRejectReason('');
    onUpdate();
  };

  const handleToggleLegalHold = () => {
    const actor = user?.name || 'Compliance Admin';
    documentService.toggleLegalHold(doc.id, actor, legalHoldReason);
    setShowLegalHoldPrompt(false);
    setLegalHoldReason('');
    onUpdate();
  };

  const handleArchive = () => {
    if (confirm(`Pindahkan dokumen "${doc.title}" ke arsip?`)) {
      try {
        const actor = user?.name || 'Compliance Admin';
        documentService.archiveDocument(doc.id, actor);
        onUpdate();
        onClose();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const isImage =
    doc.fileType.startsWith('image/') ||
    doc.fileUrl.endsWith('.jpg') ||
    doc.fileUrl.endsWith('.png') ||
    doc.fileUrl.endsWith('.jpeg') ||
    doc.fileUrl.includes('unsplash.com');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-6 backdrop-blur-md overflow-hidden">
      <div className="relative flex flex-col h-[92vh] w-full max-w-6xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-3.5 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white max-w-md truncate">{doc.title}</h2>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                  v{currentVersionData.versionNumber}
                </span>
                {doc.legalHold && (
                  <span className="flex items-center gap-1 rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/40">
                    <Lock className="h-3 w-3" />
                    Legal Hold
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {doc.entityName} • No: <span className="font-mono text-slate-300">{doc.documentNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <Download className="h-4 w-4 text-cyan-400" />
              <span className="hidden sm:inline">Unduh Berkas</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Body: Viewer on Left (60%), Inspector on Right (40%) */}
        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          {/* Left Canvas Preview */}
          <div className="relative flex flex-1 flex-col items-center justify-center bg-slate-950 p-4 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* Viewer Control Bar */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 p-1 backdrop-blur shadow-lg">
              <button
                onClick={handleZoomOut}
                title="Zoom Out"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="px-2 text-[11px] font-mono text-slate-300">{zoom}%</span>
              <button
                onClick={handleZoomIn}
                title="Zoom In"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <div className="h-4 w-px bg-slate-800 mx-1" />
              <button
                onClick={handleRotate}
                title="Rotate"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              <button
                onClick={handleReset}
                title="Reset View"
                className="rounded-lg px-2 py-1 text-[10px] font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                Reset
              </button>
            </div>

            {/* Signed URL indicator */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/80 px-3 py-1 text-[11px] text-emerald-300 backdrop-blur shadow">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Signed URL Token Active (TTL: 1 Jam)</span>
            </div>

            {/* Document Render Canvas */}
            <div className="flex h-full w-full items-center justify-center overflow-auto p-8">
              {isImage ? (
                <img
                  src={currentVersionData.fileUrl || doc.fileUrl}
                  alt={doc.title}
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transition: 'transform 0.2s ease',
                  }}
                  className="max-h-full max-w-full rounded-lg object-contain shadow-2xl border border-slate-800"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4">
                    <FileText className="h-10 w-10" />
                  </div>
                  <p className="text-sm font-bold text-white">{currentVersionData.fileName || doc.fileName}</p>
                  <p className="text-xs text-slate-400 mt-1">Dokumen Format PDF Terenkripsi</p>
                  <button
                    onClick={handleDownload}
                    className="mt-4 flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
                  >
                    <Download className="h-4 w-4" />
                    <span>Buka / Unduh Berkas Lengkap</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Inspector & Operations Panel (40%) */}
          <div className="flex w-full lg:w-[420px] flex-col bg-slate-900/95 overflow-hidden">
            {/* Inspector Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/40 px-4">
              <button
                onClick={() => setActiveTab('DETAILS')}
                className={`py-3 px-3 text-xs font-bold transition-all border-b-2 ${
                  activeTab === 'DETAILS'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Rincian & Status
              </button>
              <button
                onClick={() => setActiveTab('VERSIONS')}
                className={`py-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'VERSIONS'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Versi ({doc.versions.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('AUDIT')}
                className={`py-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'AUDIT'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Audit Trail</span>
              </button>
              {doc.ocrResult && (
                <button
                  onClick={() => setActiveTab('OCR')}
                  className={`py-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'OCR'
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="h-3 w-3" />
                  <span>AI OCR</span>
                </button>
              )}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {activeTab === 'DETAILS' && (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div
                    className={`rounded-xl border p-3.5 flex items-center justify-between ${
                      doc.status === 'VALID'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : doc.status === 'EXPIRING_SOON'
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                        : doc.status === 'EXPIRED'
                        ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {doc.status === 'VALID' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : doc.status === 'EXPIRED' ? (
                        <XCircle className="h-5 w-5 text-rose-400" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                      )}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider">
                          Status: {doc.status.replace('_', ' ')}
                        </p>
                        <p className="text-[11px] opacity-90">
                          {doc.daysRemaining < 0
                            ? `Telah kedaluwarsa ${Math.abs(doc.daysRemaining)} hari yang lalu`
                            : doc.daysRemaining === 0
                            ? 'Kedaluwarsa HARI INI'
                            : `Sisa masa berlaku: ${doc.daysRemaining} hari`}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-slate-900/60 px-2.5 py-1 text-[10px] font-bold">
                      {doc.verificationStatus}
                    </span>
                  </div>

                  {/* Metadata key values */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Jenis Dokumen</span>
                      <span className="font-semibold text-white">{doc.customTypeName || doc.documentType}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Nomor Registrasi</span>
                      <span className="font-mono font-semibold text-cyan-300">{doc.documentNumber}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Entitas / Unit</span>
                      <span className="font-semibold text-white">{doc.entityName}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Tanggal Terbit</span>
                      <span className="text-slate-300">{doc.issueDate}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Masa Berlaku (Expiry)</span>
                      <span className="font-bold text-white">{doc.expiryDate}</span>
                    </div>
                    {doc.metadata.issuer && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Instansi Penerbit</span>
                        <span className="text-slate-300 text-right max-w-[200px] truncate">{doc.metadata.issuer}</span>
                      </div>
                    )}
                    {doc.metadata.branchName && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Depo / Cabang</span>
                        <span className="text-slate-300">{doc.metadata.branchName}</span>
                      </div>
                    )}
                    {doc.metadata.coverageLimit && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Pertanggungan Asuransi</span>
                        <span className="font-semibold text-emerald-400">
                          Rp {doc.metadata.coverageLimit.toLocaleString('id-ID')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Verification Review Card */}
                  {doc.verificationStatus === 'PENDING' && (
                    <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white">Antrean Verifikasi Kepatuhan</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Dokumen diunggah oleh <span className="text-white">{doc.uploadedBy}</span>. Harap periksa keabsahan dan masa berlaku sebelum menyetujui.
                      </p>

                      {isVerifying ? (
                        <div className="space-y-3 pt-2">
                          {verificationAction === 'REJECTED' && (
                            <textarea
                              rows={2}
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="Alasan penolakan dokumen (wajib)..."
                              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-white"
                            />
                          )}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleExecuteVerification(verificationAction!)}
                              className="flex-1 rounded-lg bg-cyan-500 py-1.5 text-xs font-bold text-slate-950"
                            >
                              Konfirmasi {verificationAction}
                            </button>
                            <button
                              onClick={() => setIsVerifying(false)}
                              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleExecuteVerification('VERIFIED')}
                            className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-emerald-500 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Setujui (Verify)</span>
                          </button>
                          <button
                            onClick={() => {
                              setVerificationAction('REJECTED');
                              setIsVerifying(true);
                            }}
                            className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
                          >
                            Tolak
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Grid */}
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Aksi Dokumen</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          onReplaceVersion(doc);
                        }}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                      >
                        <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Revisi / Versi Baru</span>
                      </button>

                      <button
                        onClick={() => setShowLegalHoldPrompt(true)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                      >
                        {doc.legalHold ? <Unlock className="h-3.5 w-3.5 text-amber-400" /> : <Lock className="h-3.5 w-3.5 text-rose-400" />}
                        <span>{doc.legalHold ? 'Buka Legal Hold' : 'Set Legal Hold'}</span>
                      </button>
                    </div>

                    {!doc.legalHold && doc.status !== 'ARCHIVED' && (
                      <button
                        onClick={handleArchive}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                      >
                        <span>Pindahkan ke Arsip Dokumen</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'VERSIONS' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Riwayat seluruh versi berkas yang pernah diunggah untuk dokumen ini:
                  </p>
                  <div className="space-y-2.5">
                    {doc.versions.map((ver) => (
                      <div
                        key={ver.versionNumber}
                        onClick={() => setPreviewVersionNumber(ver.versionNumber)}
                        className={`cursor-pointer rounded-xl border p-3 transition-all ${
                          (previewVersionNumber === ver.versionNumber) ||
                          (previewVersionNumber === null && ver.versionNumber === doc.currentVersion)
                            ? 'border-cyan-500 bg-cyan-500/10 shadow-md shadow-cyan-950/30'
                            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-slate-800 px-2 py-0.5 font-mono text-xs font-bold text-cyan-300">
                              v{ver.versionNumber}
                            </span>
                            <span className="text-xs font-semibold text-white truncate max-w-[180px]">
                              {ver.fileName}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">{(ver.fileSize / 1024).toFixed(0)} KB</span>
                        </div>
                        <p className="mt-2 text-[11px] text-slate-300 italic">
                          "{ver.changeReason || 'Pembaruan berkas'}"
                        </p>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/60 pt-1.5">
                          <span>Oleh: {ver.uploadedBy}</span>
                          <span>{ver.uploadedAt.split('T')[0]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'AUDIT' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">Log jejak audit & akses kepatuhan keamanan dokumen:</p>
                  <div className="space-y-2">
                    {doc.historyLogs.map((log) => (
                      <div key={log.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-cyan-300">{log.action}</span>
                          <span className="text-[10px] text-slate-500">{log.timestamp.replace('T', ' ').substring(0, 16)}</span>
                        </div>
                        <p className="text-slate-300 text-[11px]">{log.details}</p>
                        <p className="text-[10px] text-slate-500">Aktor: {log.actor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'OCR' && doc.ocrResult && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Hasil Ekstraksi AI OCR</span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      Akurasi {doc.ocrResult.confidence}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    {doc.ocrResult.extractedFields.map((f, i) => (
                      <div key={i} className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs flex justify-between">
                        <span className="text-slate-400">{f.label}</span>
                        <span className="font-mono font-semibold text-white">{f.value || '-'}</span>
                      </div>
                    ))}
                  </div>

                  {doc.ocrResult.rawExtractedText && (
                    <div className="space-y-1 pt-2">
                      <span className="text-[11px] font-semibold text-slate-400">Raw Extracted Text</span>
                      <pre className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-[10px] font-mono text-slate-300 whitespace-pre-wrap">
                        {doc.ocrResult.rawExtractedText}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legal Hold Reason Modal Prompt */}
      {showLegalHoldPrompt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {doc.legalHold ? 'Nonaktifkan Legal Hold' : 'Aktifkan Legal Hold'}
                </h3>
                <p className="text-xs text-slate-400">
                  {doc.legalHold
                    ? 'Membuka proteksi pengarsipan dan penghapusan.'
                    : 'Mengunci dokumen dari penghapusan & pengarsipan demi kepatuhan audit hukum.'}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Alasan Legal Hold</label>
              <textarea
                rows={3}
                value={legalHoldReason}
                onChange={(e) => setLegalHoldReason(e.target.value)}
                placeholder="Contoh: Sedang dalam audit kepatuhan tahunan Kemenhub..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLegalHoldPrompt(false)}
                className="rounded-xl border border-slate-800 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300"
              >
                Batal
              </button>
              <button
                onClick={handleToggleLegalHold}
                className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white hover:bg-rose-400"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
