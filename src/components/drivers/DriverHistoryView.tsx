/**
 * Fleet Intelligence Smart AI - Driver Activity History & Audit Trail View
 */

import React, { useState, useEffect } from 'react';
import {
  Clock,
  UserCheck,
  Truck,
  ShieldCheck,
  Award,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { DriverActivityLog } from '../../types/driver';
import { mockDriverActivityLogs } from '../../constants/mockDriverData';

interface DriverHistoryViewProps {
  onSelectDriver: (driverId: string) => void;
}

export const DriverHistoryView: React.FC<DriverHistoryViewProps> = ({ onSelectDriver }) => {
  const [logs, setLogs] = useState<DriverActivityLog[]>(mockDriverActivityLogs);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Histori Aktivitas & Log Audit Pengemudi Armada
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Rekam jejak perubahan data master driver, penugasan kendaraan, sertifikasi pelatihan, dan otorisasi kepatuhan.
        </p>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {logs.map((log) => (
          <div key={log.id} className="relative group">
            <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900" />
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {log.title}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {new Date(log.timestamp).toLocaleString('id-ID')}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {log.description}
              </p>
              <div className="text-[10px] text-slate-400 pt-1 font-medium">
                Dilakukan oleh: <span className="font-semibold text-slate-700 dark:text-slate-300">{log.performedBy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
