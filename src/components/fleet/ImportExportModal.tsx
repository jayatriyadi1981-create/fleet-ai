/**
 * Fleet Intelligence Smart AI - Import & Export Modal Component
 * PROMPT 9 - Bulk Import CSV/Excel Preview & CSV Export
 */

import React, { useState } from 'react';
import { vehicleService } from '../../services/vehicleService';
import { VehicleExtended } from '../../types/vehicle';
import { useToast } from '../ui/Toast';
import { Upload, Download, FileSpreadsheet, X, Check, AlertTriangle, FileText } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { addToast } = useToast();
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleParse = () => {
    if (!csvText.trim()) {
      addToast({ type: 'warning', title: 'Data Kosong', message: 'Tempelkan data CSV terlebih dahulu.' });
      return;
    }

    const lines = csvText.trim().split('\n');
    const rows = lines.map((line, idx) => {
      const parts = line.split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
      const plate = parts[0] || '';
      const name = parts[1] || '';
      const type = parts[2] || 'truck_box';
      const brand = parts[3] || 'Isuzu';
      const isValid = plate.length >= 3 && name.length >= 2;

      return {
        id: idx,
        plate,
        name,
        type,
        brand,
        isValid,
        error: !isValid ? 'Plat atau Nama tidak valid' : '',
      };
    });

    setParsedRows(rows);
  };

  const handleConfirmImport = async () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      addToast({ type: 'error', title: 'Data Valid Kosong', message: 'Tidak ada baris valid untuk diimpor.' });
      return;
    }

    try {
      setIsProcessing(true);
      let importedCount = 0;
      for (const r of validRows) {
        try {
          await vehicleService.createVehicle({
            name: r.name,
            licensePlate: r.plate,
            type: r.type as any,
            brand: r.brand,
          });
          importedCount++;
        } catch (e) {
          // ignore duplicate errors during bulk
        }
      }

      addToast({
        type: 'success',
        title: 'Impor Berhasil',
        message: `${importedCount} unit kendaraan berhasil diimpor ke sistem.`,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Gagal Impor', message: err.message || 'Terjadi kesalahan' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Bulk Import Master Data Kendaraan</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Tempelkan baris data CSV dengan format: <code className="font-mono text-cyan-300">PlatNomor, NamaKendaraan, Tipe, Merek</code>
          </p>
          <textarea
            rows={5}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={`B 9999 UTX, Hino Ranger FL 235, truck_box, Hino\nB 8888 CKR, Isuzu Giga FVR, truck_container, Isuzu`}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleParse}
            className="rounded-xl border border-slate-800 bg-slate-800 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-slate-700"
          >
            Pratinjau Validation Row
          </button>
        </div>

        {parsedRows.length > 0 && (
          <div className="space-y-3 border-t border-slate-800 pt-3">
            <p className="text-xs font-bold text-slate-300">
              Pratinjau Baris Data ({parsedRows.filter((r) => r.isValid).length} Valid dari {parsedRows.length} Total)
            </p>
            <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-xl divide-y divide-slate-800">
              {parsedRows.map((r) => (
                <div key={r.id} className="p-2.5 text-xs flex items-center justify-between bg-slate-950">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-cyan-300">{r.plate}</span>
                    <span className="text-white">{r.name}</span>
                    <span className="text-slate-400">({r.type})</span>
                  </div>
                  {r.isValid ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Valid
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> {r.error}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300"
          >
            Batal
          </button>
          <button
            onClick={handleConfirmImport}
            disabled={isProcessing || parsedRows.filter((r) => r.isValid).length === 0}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {isProcessing ? 'Proses Impor...' : 'Konfirmasi Bulk Import'}
          </button>
        </div>
      </div>
    </div>
  );
};
