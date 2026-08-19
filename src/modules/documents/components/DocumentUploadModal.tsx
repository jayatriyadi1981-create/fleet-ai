/**
 * Fleet Intelligence Smart AI - Document Upload & AI Camera Scanner Modal
 * PROMPT 48 - Drag & Drop, Mobile Camera OCR, AI Auto-Extraction, Mismatch & Duplicate Detection
 */

import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Camera,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  FileText,
  RefreshCw,
  Eye,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { EntityType, DocumentType, DocumentItem } from '../types/documentTypes';
import { documentService } from '../services/documentService';
import { documentOcrAiService } from '../services/documentOcrAiService';
import { useFleet } from '../../../context/FleetContext';
import { useAuth } from '../../../context/AuthContext';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (doc: DocumentItem) => void;
  replaceDoc?: DocumentItem; // If provided, modal operates in Replace Version mode
  initialEntityType?: EntityType;
  initialEntityId?: string;
  initialDocumentType?: DocumentType;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  replaceDoc,
  initialEntityType = 'VEHICLE',
  initialEntityId,
  initialDocumentType = 'STNK',
}) => {
  const { vehicles, drivers } = useFleet();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [entityType, setEntityType] = useState<EntityType>(replaceDoc?.entityType || initialEntityType);
  const [entityId, setEntityId] = useState<string>(replaceDoc?.entityId || initialEntityId || '');
  const [documentType, setDocumentType] = useState<DocumentType>(replaceDoc?.documentType || initialDocumentType);
  const [customTypeName, setCustomTypeName] = useState(replaceDoc?.customTypeName || '');
  const [title, setTitle] = useState(replaceDoc?.title || '');
  const [documentNumber, setDocumentNumber] = useState(replaceDoc?.documentNumber || '');
  const [issueDate, setIssueDate] = useState(replaceDoc?.issueDate || new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(replaceDoc?.expiryDate || '');
  const [issuer, setIssuer] = useState(replaceDoc?.metadata.issuer || '');
  const [policyNumber, setPolicyNumber] = useState(replaceDoc?.metadata.policyNumber || '');
  const [coverageType, setCoverageType] = useState(replaceDoc?.metadata.coverageType || 'ALL_RISK');
  const [coverageLimit, setCoverageLimit] = useState<number | string>(replaceDoc?.metadata.coverageLimit || 500000000);
  const [notes, setNotes] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [autoVerify, setAutoVerify] = useState(true);

  // File state
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    type: string;
    dataUrl?: string;
  } | null>(null);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrConfidence, setOcrConfidence] = useState<number | null>(null);
  const [mismatchWarning, setMismatchWarning] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [cameraModeActive, setCameraModeActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Derive current entity name
  const getEntityName = (): string => {
    if (entityType === 'VEHICLE') {
      const v = vehicles.find((item) => item.id === entityId);
      return v ? `${v.plateNumber} (${v.brand} ${v.model})` : 'Kendaraan Armada';
    } else if (entityType === 'DRIVER') {
      const d = drivers.find((item) => item.id === entityId);
      return d ? d.name : 'Pengemudi';
    } else if (entityType === 'COMPANY') {
      return 'PT Nusantara Trans Logistics (Kantor Pusat)';
    } else if (entityType === 'DEVICE') {
      return 'GPS Telematics Device';
    }
    return 'Entitas Terpilih';
  };

  const handleFileSelect = async (file: File) => {
    setErrorMsg(null);
    setMismatchWarning(null);
    setDuplicateWarning(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
        dataUrl,
      };
      setSelectedFile(fileData);

      // Trigger AI OCR Extraction
      setIsProcessingOcr(true);
      try {
        const ocr = await documentOcrAiService.processOcr(file.name, file.type, entityType, getEntityName());
        setOcrConfidence(ocr.confidence);

        if (ocr.documentNumber && !documentNumber) {
          setDocumentNumber(ocr.documentNumber);
        }
        if (ocr.detectedType && !replaceDoc) {
          setDocumentType(ocr.detectedType);
        }
        if (ocr.expiryDate && !expiryDate) {
          setExpiryDate(ocr.expiryDate);
        }
        if (ocr.issueDate && !issueDate) {
          setIssueDate(ocr.issueDate);
        }
        if (ocr.issuer && !issuer) {
          setIssuer(ocr.issuer);
        }
        if (ocr.policyNumber && !policyNumber) {
          setPolicyNumber(ocr.policyNumber);
        }

        if (ocr.possibleMismatch) {
          setMismatchWarning(ocr.mismatchReason || 'Terdeteksi perbedaan antara dokumen dan entitas terpilih.');
        }

        // Duplicate check
        if (ocr.documentNumber) {
          const dupCheck = documentService.checkDuplicate(ocr.documentNumber, documentService.getDocuments(), replaceDoc?.id);
          if (dupCheck.isDuplicate) {
            setDuplicateWarning(`Nomor dokumen "${ocr.documentNumber}" sudah terdaftar pada ${dupCheck.duplicateDoc?.entityName}.`);
          }
        }
      } catch (err) {
        console.warn('OCR processing warning:', err);
      } finally {
        setIsProcessingOcr(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDocumentNumberChange = (val: string) => {
    setDocumentNumber(val);
    if (val.length > 4) {
      const dup = documentService.checkDuplicate(val, documentService.getDocuments(), replaceDoc?.id);
      if (dup.isDuplicate) {
        setDuplicateWarning(`Nomor dokumen "${val}" sudah terdaftar pada ${dup.duplicateDoc?.entityName}.`);
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedFile && !replaceDoc) {
      setErrorMsg('Harap pilih atau unggah berkas dokumen terlebih dahulu.');
      return;
    }

    if (!documentNumber.trim()) {
      setErrorMsg('Nomor dokumen / registrasi wajib diisi.');
      return;
    }

    if (!expiryDate) {
      setErrorMsg('Tanggal jatuh tempo / masa berlaku (Expiry Date) wajib diisi.');
      return;
    }

    if (!entityId && entityType !== 'COMPANY') {
      setErrorMsg('Harap pilih unit kendaraan atau pengemudi yang sesuai.');
      return;
    }

    if (replaceDoc && !changeReason.trim()) {
      setErrorMsg('Harap masukkan alasan pembaruan versi dokumen.');
      return;
    }

    setIsSubmitting(true);
    try {
      const actor = user?.name || 'Operations Lead';
      let savedDoc: DocumentItem;

      if (replaceDoc) {
        savedDoc = await documentService.replaceDocument(
          replaceDoc.id,
          selectedFile || { name: replaceDoc.fileName, size: replaceDoc.fileSize, type: replaceDoc.fileType, dataUrl: replaceDoc.fileUrl },
          {
            documentNumber,
            issueDate,
            expiryDate,
            metadata: {
              ...replaceDoc.metadata,
              issuer,
              policyNumber: documentType === 'INSURANCE' ? policyNumber : undefined,
              coverageType: documentType === 'INSURANCE' ? (coverageType as any) : undefined,
              coverageLimit: documentType === 'INSURANCE' ? Number(coverageLimit) : undefined,
              notes,
            },
          },
          actor,
          changeReason
        );
      } else {
        const entName = getEntityName();
        savedDoc = await documentService.uploadDocument({
          documentType,
          customTypeName: documentType === 'CUSTOM' ? customTypeName : undefined,
          title: title || `${documentType.replace('_', ' ')} - ${entName}`,
          entityType,
          entityId: entityId || 'c-01',
          entityName: entName,
          documentNumber,
          issueDate,
          expiryDate,
          uploadedBy: actor,
          autoVerify,
          metadata: {
            issuer,
            policyNumber: documentType === 'INSURANCE' ? policyNumber : undefined,
            coverageType: documentType === 'INSURANCE' ? (coverageType as any) : undefined,
            coverageLimit: documentType === 'INSURANCE' ? Number(coverageLimit) : undefined,
            notes,
            ocrConfidence: ocrConfidence || undefined,
          },
          file: selectedFile!,
        });
      }

      onSuccess(savedDoc);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan dokumen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-cyan-950/40 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              {replaceDoc ? <RefreshCw className="h-5 w-5" /> : <UploadCloud className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {replaceDoc ? `Perbarui Versi Dokumen (v${replaceDoc.currentVersion + 1})` : 'Unggah & Pindai Dokumen Legalitas'}
              </h2>
              <p className="text-xs text-slate-400">
                {replaceDoc
                  ? `Menggantikan berkas untuk ${replaceDoc.title}`
                  : 'Didukung ekstraksi cerdas AI OCR, klasifikasi tipe otomatis & proteksi duplikasi'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {duplicateWarning && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
              <span>{duplicateWarning}</span>
            </div>
          )}

          {mismatchWarning && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300 flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-cyan-400" />
              <span>{mismatchWarning}</span>
            </div>
          )}

          {/* Upload Area */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Berkas Dokumen (PDF, JPG, PNG, WEBP)</span>
              {ocrConfidence && (
                <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI OCR Akurasi {ocrConfidence}%
                </span>
              )}
            </label>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                selectedFile
                  ? 'border-cyan-500/50 bg-cyan-500/5'
                  : 'border-slate-700 bg-slate-950/40 hover:border-slate-600'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
              />
              <input
                type="file"
                ref={cameraInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                accept="image/*"
                capture="environment"
                className="hidden"
              />

              {isProcessingOcr ? (
                <div className="py-6 flex flex-col items-center justify-center space-y-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                  <p className="text-xs font-medium text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    AI Sedang Mengekstrak Nomor, Masa Berlaku & Data Legalitas...
                  </p>
                </div>
              ) : selectedFile ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white max-w-xs truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700"
                    >
                      Ganti Berkas
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-cyan-400">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-200">
                      Tarik & lepas file dokumen di sini, atau{' '}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-cyan-400 hover:underline font-semibold"
                      >
                        Pilih Berkas
                      </button>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">Maksimal 25MB • PDF, JPG, PNG, WEBP</p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <span>Kamera Scanner (Mobile/Webcam)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Classification & Entity Mapping */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tipe Entitas Dokumen</label>
              <select
                disabled={!!replaceDoc}
                value={entityType}
                onChange={(e) => {
                  setEntityType(e.target.value as EntityType);
                  setEntityId('');
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="VEHICLE">Kendaraan Armada (Vehicle)</option>
                <option value="DRIVER">Pengemudi (Driver)</option>
                <option value="COMPANY">Perusahaan / Korporasi (Company)</option>
                <option value="DEVICE">Perangkat GPS / IoT (Device)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Pilih {entityType === 'VEHICLE' ? 'Unit Kendaraan' : entityType === 'DRIVER' ? 'Pengemudi' : 'Entitas'}
              </label>
              {entityType === 'VEHICLE' ? (
                <select
                  disabled={!!replaceDoc}
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="">-- Pilih Kendaraan --</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plateNumber} ({v.brand} {v.model}) - {v.groupName}
                    </option>
                  ))}
                </select>
              ) : entityType === 'DRIVER' ? (
                <select
                  disabled={!!replaceDoc}
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="">-- Pilih Pengemudi --</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.simType || 'SIM B2'}) - {d.phone}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  disabled
                  value={getEntityName()}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-400"
                />
              )}
            </div>
          </div>

          {/* Document Type Selector */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Jenis Dokumen Legalitas</label>
              <select
                disabled={!!replaceDoc}
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                {entityType === 'VEHICLE' && (
                  <>
                    <option value="STNK">STNK (Surat Tanda Nomor Kendaraan)</option>
                    <option value="KIR">KIR Dishub (Uji Berkala Kendaraan Bermotor)</option>
                    <option value="INSURANCE">Polis Asuransi Kendaraan (All-Risk / TLO)</option>
                    <option value="VEHICLE_CERTIFICATE">Sertifikat Uji Emisi / Kelaikan Teknis</option>
                    <option value="CUSTOM">Dokumen Kendaraan Khusus (Custom)</option>
                  </>
                )}
                {entityType === 'DRIVER' && (
                  <>
                    <option value="SIM_B2">SIM BII Umum (Heavy Truck/Tronton)</option>
                    <option value="SIM_B1">SIM BI Umum (Bus/Medium Truck)</option>
                    <option value="SIM_A">SIM A (Mobil/Pickup/Van)</option>
                    <option value="SIM_C">SIM C (Sepeda Motor Kurir)</option>
                    <option value="DRIVER_CERT">Sertifikat Defensive Driving (DDT)</option>
                    <option value="TRAINING_CERT">Sertifikat Pelatihan K3 & Fatigue Safety</option>
                    <option value="MEDICAL_CERT">Surat Keterangan Sehat & MCU</option>
                    <option value="CUSTOM">Sertifikat Khusus Driver (Custom)</option>
                  </>
                )}
                {entityType === 'COMPANY' && (
                  <>
                    <option value="BUSINESS_LICENSE">NIB & Izin Usaha Transportasi (SIUP-K)</option>
                    <option value="OPERATING_LICENSE">Izin Trayek & Operasi Angkutan Khusus</option>
                    <option value="COMPANY_INSURANCE">Asuransi Tanggung Jawab Hukum Pihak Ketiga (TPL)</option>
                    <option value="COMPANY_CERTIFICATE">Sertifikasi ISO 9001 / SMK3 Kemenaker</option>
                  </>
                )}
                {entityType === 'DEVICE' && (
                  <>
                    <option value="GPS_CALIBRATION">Sertifikat Kalibrasi Sensor GPS/Odometer</option>
                    <option value="TELEMATICS_CERT">Sertifikat Kominfo / SDPPI Perangkat IoT</option>
                    <option value="SIM_REGISTRATION">Registrasi Kartu SIM IoT M2M</option>
                  </>
                )}
              </select>
            </div>

            {documentType === 'CUSTOM' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Nama Jenis Dokumen Custom</label>
                <input
                  type="text"
                  value={customTypeName}
                  onChange={(e) => setCustomTypeName(e.target.value)}
                  placeholder="Contoh: Izin Melintas Kawasan Industri"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Instansi Penerbit / Asuransi</label>
                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="Contoh: Samsat Polda Metro Jaya / Dishub DKI"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Document Number and Dates */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Nomor Dokumen / Registrasi *</label>
              <input
                type="text"
                required
                value={documentNumber}
                onChange={(e) => handleDocumentNumberChange(e.target.value)}
                placeholder="Contoh: KIR-JKT-8891024"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tanggal Terbit (Issue Date)</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Masa Berlaku (Expiry Date) *</label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full rounded-xl border border-cyan-500/50 bg-slate-950 px-3 py-2 text-xs text-cyan-300 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Insurance Specific Fields */}
          {documentType === 'INSURANCE' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Tipe Pertanggungan</label>
                <select
                  value={coverageType}
                  onChange={(e) => setCoverageType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="ALL_RISK">Comprehensive All-Risk</option>
                  <option value="TLO">Total Loss Only (TLO)</option>
                  <option value="LIABILITY">Third Party Liability (TPL)</option>
                  <option value="CARGO">Marine / Cargo Insurance</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Nomor Polis Asuransi</label>
                <input
                  type="text"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  placeholder="POL-ACA-2026-001"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Batas Nilai Pertanggungan (Rp)</label>
                <input
                  type="number"
                  value={coverageLimit}
                  onChange={(e) => setCoverageLimit(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Replace Version Reason */}
          {replaceDoc && (
            <div className="space-y-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
              <label className="text-xs font-semibold text-cyan-300">
                Alasan Pembaruan / Catatan Revisi Versi *
              </label>
              <textarea
                required
                rows={2}
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="Contoh: Perpanjangan masa berlaku Uji KIR 6 bulanan di Dishub Ujung Menteng."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          )}

          {/* Verification Option */}
          {!replaceDoc && (
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-200">Verifikasi Otomatis (Verified Status)</p>
                  <p className="text-[10px] text-slate-400">
                    Jika diaktifkan, dokumen langsung berstatus VALID tanpa menunggu antrean review.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoVerify}
                onChange={(e) => setAutoVerify(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isProcessingOcr}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <span>{replaceDoc ? 'Simpan Revisi Versi' : 'Unggah & Simpan Dokumen'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
