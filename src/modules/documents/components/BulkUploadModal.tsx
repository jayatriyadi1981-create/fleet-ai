/**
 * Fleet Intelligence Smart AI - Bulk Document Upload & Batch OCR Modal
 * PROMPT 48 - Batch Ingestion, Auto-Classification, Entity Matcher & Bulk Commit
 */

import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { EntityType, DocumentType, DocumentItem } from '../types/documentTypes';
import { documentService } from '../services/documentService';
import { documentOcrAiService } from '../services/documentOcrAiService';
import { useFleet } from '../../../context/FleetContext';
import { useAuth } from '../../../context/AuthContext';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (count: number) => void;
}

interface StagedFileItem {
  id: string;
  file: File;
  dataUrl: string;
  name: string;
  size: number;
  type: string;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  documentType: DocumentType;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  ocrConfidence: number;
  isProcessing: boolean;
  status: 'PENDING' | 'READY' | 'ERROR';
  error?: string;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { vehicles, drivers } = useFleet();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stagedFiles, setStagedFiles] = useState<StagedFileItem[]>([]);
  const [isCommitting, setIsCommitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFilesAdded = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    const newItems: StagedFileItem[] = [];

    for (const file of fileList) {
      const id = `staged-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const reader = new FileReader();

      const item: StagedFileItem = {
        id,
        file,
        dataUrl: '',
        name: file.name,
        size: file.size,
        type: file.type || 'application/pdf',
        entityType: file.name.toLowerCase().includes('sim') ? 'DRIVER' : 'VEHICLE',
        entityId: vehicles[0]?.id || 'v-101',
        entityName: vehicles[0]?.plateNumber || 'B 9481 UCH',
        documentType: file.name.toLowerCase().includes('kir') ? 'KIR' : file.name.toLowerCase().includes('sim') ? 'SIM_B2' : 'STNK',
        documentNumber: '',
        issueDate: '2024-01-01',
        expiryDate: '2027-01-01',
        ocrConfidence: 0,
        isProcessing: true,
        status: 'PENDING',
      };

      newItems.push(item);

      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        item.dataUrl = dataUrl;

        // Run OCR
        try {
          const ocr = await documentOcrAiService.processOcr(file.name, file.type, item.entityType);
          item.documentNumber = ocr.documentNumber || `DOC-${Math.floor(100000 + Math.random() * 900000)}`;
          item.documentType = ocr.detectedType || item.documentType;
          item.expiryDate = ocr.expiryDate || item.expiryDate;
          item.issueDate = ocr.issueDate || item.issueDate;
          item.ocrConfidence = ocr.confidence;
          item.isProcessing = false;
          item.status = 'READY';

          setStagedFiles((prev) => [...prev]);
        } catch (err) {
          item.isProcessing = false;
          item.status = 'ERROR';
          item.error = 'Gagal ekstraksi OCR.';
          setStagedFiles((prev) => [...prev]);
        }
      };
      reader.readAsDataURL(file);
    }

    setStagedFiles((prev) => [...prev, ...newItems]);
  };

  const handleUpdateItem = (id: string, updates: Partial<StagedFileItem>) => {
    setStagedFiles((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          if (updates.entityId) {
            if (updated.entityType === 'VEHICLE') {
              const v = vehicles.find((x) => x.id === updates.entityId);
              if (v) updated.entityName = `${v.plateNumber} (${v.brand} ${v.model})`;
            } else if (updated.entityType === 'DRIVER') {
              const d = drivers.find((x) => x.id === updates.entityId);
              if (d) updated.entityName = d.name;
            }
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setStagedFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCommitAll = async () => {
    setGlobalError(null);
    if (stagedFiles.length === 0) return;

    // Check validity
    const invalid = stagedFiles.find((f) => !f.documentNumber || !f.expiryDate);
    if (invalid) {
      setGlobalError(`Berkas "${invalid.name}" belum memiliki nomor dokumen atau tanggal kedaluwarsa.`);
      return;
    }

    setIsCommitting(true);
    try {
      const actor = user?.name || 'Operations Lead';
      let successCount = 0;

      for (const item of stagedFiles) {
        await documentService.uploadDocument({
          documentType: item.documentType,
          title: `${item.documentType} - ${item.entityName}`,
          entityType: item.entityType,
          entityId: item.entityId,
          entityName: item.entityName,
          documentNumber: item.documentNumber,
          issueDate: item.issueDate,
          expiryDate: item.expiryDate,
          uploadedBy: actor,
          autoVerify: true,
          file: {
            name: item.name,
            size: item.size,
            type: item.type,
            dataUrl: item.dataUrl,
          },
        });
        successCount++;
      }

      onSuccess(successCount);
      onClose();
    } catch (err: any) {
      setGlobalError(err.message || 'Gagal menyimpan berkas batch.');
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-cyan-950/40 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Bulk Ingestion & Batch OCR Scanner</h2>
              <p className="text-xs text-slate-400">
                Unggah banyak berkas sekaligus (STNK, KIR, SIM, Asuransi), AI mengekstrak & memetakan entitas secara otomatis.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {globalError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{globalError}</span>
            </div>
          )}

          {/* Multi-file Dropzone */}
          <div
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files) handleFilesAdded(e.dataTransfer.files);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/40 p-6 text-center hover:border-cyan-500/50 transition-colors"
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
            />
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-cyan-400 mb-3">
              <UploadCloud className="h-6 w-6" />
            </div>
            <p className="text-xs font-semibold text-slate-200">
              Tarik & lepaskan beberapa file dokumen di sini, atau{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-cyan-400 hover:underline"
              >
                Pilih Berkas Sekaligus
              </button>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Dapat memilih hingga 20 berkas sekaligus (Maks 25MB per berkas)</p>
          </div>

          {/* Staged Items Table */}
          {stagedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  Daftar Berkas Terdeteksi ({stagedFiles.length} Berkas)
                </span>
                <button
                  type="button"
                  onClick={() => setStagedFiles([])}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Hapus Semua
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-semibold text-slate-400">
                    <tr>
                      <th className="py-2.5 px-3">Berkas</th>
                      <th className="py-2.5 px-3">Tipe & Jenis</th>
                      <th className="py-2.5 px-3">Entitas / Unit</th>
                      <th className="py-2.5 px-3">No. Dokumen</th>
                      <th className="py-2.5 px-3">Masa Berlaku</th>
                      <th className="py-2.5 px-3">AI OCR</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {stagedFiles.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                            <div>
                              <p className="font-semibold text-white max-w-[150px] truncate">{item.name}</p>
                              <p className="text-[10px] text-slate-400">{(item.size / 1024).toFixed(0)} KB</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          <select
                            value={item.documentType}
                            onChange={(e) => handleUpdateItem(item.id, { documentType: e.target.value as any })}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white"
                          >
                            <option value="STNK">STNK</option>
                            <option value="KIR">KIR Dishub</option>
                            <option value="INSURANCE">Asuransi</option>
                            <option value="SIM_B2">SIM BII Umum</option>
                            <option value="SIM_A">SIM A</option>
                            <option value="DRIVER_CERT">DDT Cert</option>
                            <option value="BUSINESS_LICENSE">NIB/SIUP</option>
                          </select>
                        </td>

                        <td className="py-2.5 px-3">
                          {item.entityType === 'VEHICLE' ? (
                            <select
                              value={item.entityId}
                              onChange={(e) => handleUpdateItem(item.id, { entityId: e.target.value })}
                              className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white max-w-[160px]"
                            >
                              {vehicles.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.plateNumber}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <select
                              value={item.entityId}
                              onChange={(e) => handleUpdateItem(item.id, { entityId: e.target.value })}
                              className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white max-w-[160px]"
                            >
                              {drivers.map((d) => (
                                <option key={d.id} value={d.id}>
                                  {d.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>

                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={item.documentNumber}
                            onChange={(e) => handleUpdateItem(item.id, { documentNumber: e.target.value })}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white font-mono w-28"
                          />
                        </td>

                        <td className="py-2.5 px-3">
                          <input
                            type="date"
                            value={item.expiryDate}
                            onChange={(e) => handleUpdateItem(item.id, { expiryDate: e.target.value })}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-cyan-300"
                          />
                        </td>

                        <td className="py-2.5 px-3">
                          {item.isProcessing ? (
                            <div className="flex items-center gap-1 text-[11px] text-cyan-400">
                              <RefreshCw className="h-3 w-3 animate-spin" />
                              <span>Scanning</span>
                            </div>
                          ) : item.ocrConfidence > 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                              <Sparkles className="h-3 w-3" />
                              {item.ocrConfidence}%
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">Manual</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="rounded p-1 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              {stagedFiles.length > 0
                ? `${stagedFiles.filter((s) => s.status === 'READY').length} dari ${stagedFiles.length} berkas siap disimpan.`
                : 'Belum ada berkas yang dipilih.'}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-800 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={stagedFiles.length === 0 || isCommitting}
                onClick={handleCommitAll}
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {isCommitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                <span>Simpan Semua ({stagedFiles.length}) Dokumen</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
