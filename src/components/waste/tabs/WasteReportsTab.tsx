import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  CheckCircle,
  BarChart3,
  Scale,
  Trash2,
  ShieldCheck,
  Building
} from 'lucide-react';
import { MOCK_WEIGHBRIDGE_RECORDS } from '../../../modules/waste/services/wasteMockData';

export const WasteReportsTab: React.FC = () => {
  return (
    <div id="waste-reports-tab" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Pusat Laporan, Neraca Limbah B3 & Audit Lingkungan KLHK</span>
          </h2>
          <p className="text-xs text-slate-400">
            Rekapitulasi tonase harian sampah ke TPA/TPST, neraca pengelolaan limbah B3 Festronik, audit emisi armada, dan ekspor laporan resmi AMDAL/UKL-UPL.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => alert('Laporan Neraca Limbah B3 KLHK berhasil diekspor ke format PDF!')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor PDF KLHK</span>
          </button>
          <button
            onClick={() => alert('Rekap Tonase Timbangan TPA berhasil diekspor ke Excel!')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Excel</span>
          </button>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">Rekap Tonase Bulanan TPA</h3>
            <Scale className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            428.5 <span className="text-xs text-slate-400 font-normal">Ton Terangkut</span>
          </div>
          <p className="text-xs text-slate-400">
            Berasal dari 72 ritase compactor dan 48 tarikan kontainer arm roll menuju TPST Bantargebang.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">Neraca Limbah B3 Festronik</h3>
            <ShieldCheck className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono">
            100% <span className="text-xs text-slate-400 font-normal">Tervalidasi KLHK</span>
          </div>
          <p className="text-xs text-slate-400">
            Seluruh 34 manifest limbah medis dan industri telah diterima oleh pengolah berizin (PPLI/Wastec/WGI).
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">Kepatuhan Leachate & Emisi</h3>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            Zero <span className="text-xs text-slate-400 font-normal">Pelanggaran / Tumpahan</span>
          </div>
          <p className="text-xs text-slate-400">
            Hasil uji emisi seluruh armada lolos standar Euro 4 dan bak penampung lindi dalam kondisi prima.
          </p>
        </div>
      </div>
    </div>
  );
};
