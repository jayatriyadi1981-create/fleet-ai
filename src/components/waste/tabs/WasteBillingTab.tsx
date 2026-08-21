import React, { useState } from 'react';
import {
  DollarSign,
  FileText,
  Building,
  CheckCircle,
  Clock,
  Search,
  Plus,
  Scale,
  Calendar
} from 'lucide-react';

export const WasteBillingTab: React.FC = () => {
  return (
    <div id="waste-billing-tab" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Tarif Retribusi, Kontrak B2B & Faktur Billing Limbah (Waste Billing & Invoicing)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Perhitungan biaya pengangkutan sampah berdasarkan tonase jembatan timbang (Tipping Fee), volume bak kontainer m³, dan kontrak bulanan B2B komersial & industri.
          </p>
        </div>

        <button
          onClick={() => alert('Faktur Retribusi Pengangkutan Limbah Baru Berhasil Diterbitkan!')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Terbitkan Invoice Baru</span>
        </button>
      </div>

      {/* Pricing Schemes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Scale className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-100">Tarif Tipping Fee Tonase TPA</h3>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            Rp 70.000 <span className="text-xs text-slate-400 font-normal">/ Ton Netto</span>
          </div>
          <p className="text-xs text-slate-400">
            Dihitung otomatis dari selisih timbangan Gross - Tare saat pembuangan sampah ke TPST Bantargebang / TPA regional.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-sky-400">
            <Building className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-100">Kontrak Swap Kontainer Arm Roll</h3>
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono">
            Rp 450.000 <span className="text-xs text-slate-400 font-normal">/ Tarikan (8 m³)</span>
          </div>
          <p className="text-xs text-slate-400">
            Biaya pergantian kontainer kosong dan penarikan kontainer penuh untuk pasar modern, mall, hotel, dan kawasan komersial.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-amber-400">
            <FileText className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-100">Limbah B3 Medis & Festronik</h3>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            Rp 9.000.000 <span className="text-xs text-slate-400 font-normal">/ Ton Insinerasi</span>
          </div>
          <p className="text-xs text-slate-400">
            Termasuk penjemputan cold box bersuhu &lt;4°C, penerbitan Festronik KLHK resmi, dan sertifikat pemusnahan (Certificate of Destruction).
          </p>
        </div>
      </div>
    </div>
  );
};
