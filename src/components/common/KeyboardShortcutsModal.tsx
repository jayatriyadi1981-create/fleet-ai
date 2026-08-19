/**
 * Fleet Intelligence Smart AI - Keyboard Shortcuts Help Modal
 */

import React from 'react';
import { useFleet } from '../../context/FleetContext';
import { Keyboard, X, Command, Search, Compass, Shield } from 'lucide-react';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen } = useFleet();

  if (!isKeyboardShortcutsOpen) return null;

  const shortcutGroups = [
    {
      title: 'Global Overlay Shortcuts',
      icon: Command,
      shortcuts: [
        { keys: ['⌘', 'K'], label: 'Buka Command Palette & Global Search' },
        { keys: ['Ctrl', 'K'], label: 'Buka Command Palette & Search (Windows/Linux)' },
        { keys: ['?'], label: 'Buka Dialog Keyboard Shortcuts Ini' },
        { keys: ['Esc'], label: 'Tutup Overlay / Drawer / Modal Active' },
      ],
    },
    {
      title: 'Navigasi Cepat (Sequential Keys)',
      icon: Compass,
      shortcuts: [
        { keys: ['G', 'kemudian', 'D'], label: 'Ke Executive Dashboard' },
        { keys: ['G', 'kemudian', 'V'], label: 'Ke Daftar Kendaraan & GPS' },
        { keys: ['G', 'kemudian', 'T'], label: 'Ke Live GPS Tracking' },
        { keys: ['G', 'kemudian', 'R'], label: 'Ke Laporan Otomatis' },
        { keys: ['G', 'kemudian', 'A'], label: 'Ke Alerts System' },
      ],
    },
    {
      title: 'Kontrol Modul & Akses',
      icon: Shield,
      shortcuts: [
        { keys: ['Tab'], label: 'Pindah Elemen Input Beri Fokus' },
        { keys: ['Enter'], label: 'Jalankan Aksi Pilihan' },
        { keys: ['↑', '↓'], label: 'Navigasi Item Pilihan Command' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Keyboard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Keyboard Shortcuts System</h3>
              <p className="text-xs text-slate-400">Pintasan papan ketik efisiensi navigasi enterprise.</p>
            </div>
          </div>
          <button
            onClick={() => setIsKeyboardShortcutsOpen(false)}
            className="p-1.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {shortcutGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.title} className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider">
                  <GroupIcon className="h-3.5 w-3.5" />
                  {group.title}
                </h4>

                <div className="space-y-2">
                  {group.shortcuts.map((sc, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-900/80 last:border-0">
                      <span className="text-slate-300 font-medium">{sc.label}</span>
                      <div className="flex items-center gap-1 font-mono">
                        {sc.keys.map((k, kIdx) => (
                          <React.Fragment key={kIdx}>
                            <kbd className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] font-bold text-cyan-300 shadow-sm">
                              {k}
                            </kbd>
                            {kIdx < sc.keys.length - 1 && k !== 'kemudian' && (
                              <span className="text-[10px] text-slate-500">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tekan <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">Esc</kbd> kapan saja untuk menutup</span>
          <button
            onClick={() => setIsKeyboardShortcutsOpen(false)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
