import React from 'react';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';

interface Props {
  onNavigateHome?: () => void;
}

export const Error404Page: React.FC<Props> = ({ onNavigateHome }) => {
  return (
    <div className="flex h-full min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
        <span className="text-3xl font-black">404</span>
      </div>
      <h1 className="text-2xl font-bold text-white">Halaman Tidak Ditemukan</h1>
      <p className="mt-2 max-w-md text-sm text-slate-400">
        Rute modul telematika yang Anda tuju tidak tersedia atau telah dipindahkan ke lokasi lain.
      </p>
      <button
        onClick={onNavigateHome || (() => window.location.href = '/app/dashboard')}
        className="mt-6 flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
      >
        <Home className="h-4 w-4" />
        <span>Kembali ke Dashboard Utama</span>
      </button>
    </div>
  );
};

export const Error403Page: React.FC<Props> = ({ onNavigateHome }) => {
  return (
    <div className="flex h-full min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4">
        <ShieldX className="h-10 w-10" />
      </div>
      <h1 className="text-2xl font-bold text-white">Akses Dibatasi (403 Forbidden)</h1>
      <p className="mt-2 max-w-md text-sm text-slate-400">
        Peran pengguna Anda tidak memiliki izin hak akses untuk membuka modul ini. Silakan hubungi Administrator Perusahaan.
      </p>
      <button
        onClick={onNavigateHome || (() => window.location.href = '/app/dashboard')}
        className="mt-6 flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Halaman Sebelumnya</span>
      </button>
    </div>
  );
};
