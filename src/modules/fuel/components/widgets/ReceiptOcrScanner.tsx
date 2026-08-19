/**
 * Fleet Intelligence Smart AI - Receipt OCR Scanner Widget
 * PROMPT 24 - SPBU Receipt Photo Upload & Automated OCR Data Extraction Simulation
 */

import React, { useState } from 'react';
import { Camera, CheckCircle2, RefreshCw, Sparkles, FileText, Upload } from 'lucide-react';

interface ReceiptOcrScannerProps {
  onScanComplete?: (data: {
    stationName: string;
    volume: number;
    pricePerLiter: number;
    totalCost: number;
    receiptNumber: string;
    fuelType: string;
  }) => void;
}

export const ReceiptOcrScanner: React.FC<ReceiptOcrScannerProps> = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<{
    stationName: string;
    volume: number;
    pricePerLiter: number;
    totalCost: number;
    receiptNumber: string;
    fuelType: string;
    confidence: number;
  } | null>(null);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScannedData(null);

    setTimeout(() => {
      const mockResult = {
        stationName: 'SPBU Pertamina 31.10201 Cikarang Utama',
        volume: 180.0,
        pricePerLiter: 6800,
        totalCost: 1224000,
        receiptNumber: 'INV/SPBU/' + Math.floor(Math.random() * 899999 + 100000),
        fuelType: 'BIODIESEL',
        confidence: 96.8,
      };
      setScannedData(mockResult);
      setIsScanning(false);
      if (onScanComplete) {
        onScanComplete(mockResult);
      }
    }, 1800);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Simulasi OCR Struk SPBU AI</h3>
        </div>
        <span className="text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full font-medium">
          Auto OCR Engine
        </span>
      </div>

      <p className="text-xs text-slate-400">
        Unggah foto struk SPBU untuk melakukan pencocokan transaksi otomatis dengan sensor tangki BBM.
      </p>

      {!scannedData && !isScanning && (
        <div
          onClick={handleSimulateScan}
          className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-cyan-500 hover:bg-cyan-950/20 transition-all rounded-xl p-6 text-center space-y-2"
        >
          <div className="p-3 bg-slate-800 text-cyan-400 rounded-full w-fit mx-auto">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-xs font-semibold text-slate-200">Klik untuk Unggah Struk / Ambil Foto</p>
          <p className="text-[11px] text-slate-400">Format: JPG, PNG, WEBP (Max 5MB)</p>
        </div>
      )}

      {isScanning && (
        <div className="border border-cyan-500/30 bg-cyan-950/30 rounded-xl p-6 text-center space-y-3 animate-pulse">
          <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin mx-auto" />
          <p className="text-xs font-bold text-cyan-300">AI OCR sedang mengekstrak data dari foto struk SPBU...</p>
          <p className="text-[11px] text-slate-400">Mendeteksi Nama SPBU, Liter, Harga/L, Total Biaya, & Nomor Struk...</p>
        </div>
      )}

      {scannedData && (
        <div className="border border-emerald-500/30 bg-emerald-950/20 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="h-4 w-4" />
              OCR Ekstraksi Berhasil ({scannedData.confidence}% Confidence)
            </div>
            <button
              onClick={handleSimulateScan}
              className="text-[11px] text-slate-400 hover:text-white underline flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Scan Ulang
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Nama SPBU</span>
              <span className="font-semibold text-white">{scannedData.stationName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">No. Struk</span>
              <span className="font-semibold text-white">{scannedData.receiptNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Volume BBM</span>
              <span className="font-bold text-emerald-400">{scannedData.volume} Liter</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Harga per Liter</span>
              <span className="font-semibold text-white">Rp {scannedData.pricePerLiter.toLocaleString('id-ID')}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Total Pembayaran</span>
              <span className="font-bold text-cyan-300">Rp {scannedData.totalCost.toLocaleString('id-ID')}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Jenis BBM</span>
              <span className="font-semibold text-white">{scannedData.fuelType}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
