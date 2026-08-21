import React, { useState } from 'react';
import { 
  Shuffle, 
  Split, 
  Boxes, 
  CheckCircle2, 
  Barcode, 
  Layers, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { LogisticsOrder } from '../../../modules/logistics/types';

interface Props {
  orders: LogisticsOrder[];
}

export const LogisticsSortationTab: React.FC<Props> = ({ orders }) => {
  const [activeLane, setActiveLane] = useState<'line-a' | 'line-b' | 'line-c'>('line-a');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Shuffle className="w-6 h-6 text-purple-600" />
            Sortation Center & Staging Line Automation
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Manajemen jalur conveyor pemilahan paket per zonasi kota tujuan, bin sorting, dan status ready-to-load.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-semibold">
            ● 3 Jalur Conveyor Beroperasi Normal
          </span>
        </div>
      </div>

      {/* 3 Sorting Lanes Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div 
          onClick={() => setActiveLane('line-a')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
            activeLane === 'line-a'
              ? 'border-purple-600 bg-purple-50/40 dark:bg-purple-950/30 dark:border-purple-500 shadow-md'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900 dark:text-white">Conveyor Line A - Jawa Barat</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xs text-slate-500">Destinasi: Bandung, Bogor, Depok, Bekasi, Cirebon</p>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs font-semibold">
            <span>Throughput: 1,420 Pcs/Jam</span>
            <span className="text-purple-600 dark:text-purple-400">98.9% Akurasi</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveLane('line-b')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
            activeLane === 'line-b'
              ? 'border-purple-600 bg-purple-50/40 dark:bg-purple-950/30 dark:border-purple-500 shadow-md'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900 dark:text-white">Conveyor Line B - Jawa Tengah/Timur</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xs text-slate-500">Destinasi: Semarang, Solo, Yogyakarta, Surabaya, Malang</p>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs font-semibold">
            <span>Throughput: 2,100 Pcs/Jam</span>
            <span className="text-purple-600 dark:text-purple-400">99.4% Akurasi</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveLane('line-c')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
            activeLane === 'line-c'
              ? 'border-purple-600 bg-purple-50/40 dark:bg-purple-950/30 dark:border-purple-500 shadow-md'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900 dark:text-white">Conveyor Line C - Luar Pulau / Udara</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xs text-slate-500">Destinasi: Medan, Palembang, Makassar, Denpasar, Balikpapan</p>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs font-semibold">
            <span>Throughput: 980 Pcs/Jam</span>
            <span className="text-purple-600 dark:text-purple-400">99.8% Akurasi</span>
          </div>
        </div>
      </div>

      {/* Sorting Staging Bins Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Boxes className="w-5 h-5 text-purple-600" />
          Status Keranjang Staging Bin (Ready-To-Load)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
          {['BIN-BDG-01', 'BIN-BDG-02', 'BIN-SBY-01', 'BIN-SBY-02', 'BIN-SMG-01', 'BIN-YOG-01'].map((bin, idx) => (
            <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-center space-y-1">
              <div className="font-mono font-bold text-purple-600 dark:text-purple-400 text-xs">{bin}</div>
              <div className="text-slate-700 dark:text-slate-200 font-bold text-sm">{40 + idx * 8} Koli</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Siap Muat Truk</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
