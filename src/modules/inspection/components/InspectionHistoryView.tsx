/**
 * Fleet Intelligence Smart AI - Vehicle Inspection History Table View
 * Filterable, searchable, and exportable inspection logs across all branches.
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldAlert, 
  Calendar, 
  FileSpreadsheet, 
  RefreshCw 
} from 'lucide-react';
import { inspectionService } from '../services/inspectionService';
import { VehicleInspection } from '../types/inspection';
import { InspectionDetailModal } from './InspectionDetailModal';

interface InspectionHistoryViewProps {
  onSelectInspection?: (inspection: VehicleInspection) => void;
}

export const InspectionHistoryView: React.FC<InspectionHistoryViewProps> = () => {
  const [inspections, setInspections] = useState<VehicleInspection[]>(() => inspectionService.getInspections());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [resultFilter, setResultFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedInspection, setSelectedInspection] = useState<VehicleInspection | null>(null);

  // Subscribe to updates
  React.useEffect(() => {
    return inspectionService.subscribe(() => {
      setInspections(inspectionService.getInspections());
    });
  }, []);

  const filteredInspections = useMemo(() => {
    return inspections.filter(item => {
      const matchSearch = 
        item.inspectionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.locationName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchResult = resultFilter === 'all' || item.result === resultFilter;
      const matchType = typeFilter === 'all' || item.type === typeFilter;

      return matchSearch && matchResult && matchType;
    });
  }, [inspections, searchQuery, resultFilter, typeFilter]);

  const handleExportCSV = () => {
    const headers = ['InspectionNumber', 'VehiclePlate', 'DriverName', 'Type', 'Result', 'Score', 'Odometer', 'Location', 'CompletedAt', 'Grounded'];
    const rows = filteredInspections.map(i => [
      i.inspectionNumber,
      i.vehiclePlate,
      i.driverName,
      i.type,
      i.result,
      i.overallScore,
      i.odometer,
      `"${i.locationName}"`,
      i.completedAt || i.createdAt,
      i.grounded ? 'YES' : 'NO',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inspection_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white">Riwayat Lengkap Pemeriksaan Kendaraan</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Total {filteredInspections.length} catatan inspeksi terekam di sistem telematika.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            Ekspor CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari No. Inspeksi, Plat, Driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Result Filter */}
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
          >
            <option value="all">Semua Hasil</option>
            <option value="PASS">Lolos (PASS)</option>
            <option value="ATTENTION">Perhatian (ATTENTION)</option>
            <option value="FAIL">Gagal (FAIL)</option>
            <option value="CRITICAL">Kritis (CRITICAL)</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
          >
            <option value="all">Semua Tipe</option>
            <option value="PRE_TRIP">Pre-Trip</option>
            <option value="POST_TRIP">Post-Trip</option>
            <option value="PERIODIC">Periodik</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[11px]">
              <tr>
                <th className="p-4">No. Inspeksi</th>
                <th className="p-4">Kendaraan</th>
                <th className="p-4">Driver</th>
                <th className="p-4">Tipe</th>
                <th className="p-4">Hasil & Skor</th>
                <th className="p-4">Odometer</th>
                <th className="p-4">Waktu</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredInspections.map((ins) => (
                <tr
                  key={ins.id}
                  onClick={() => setSelectedInspection(ins)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="p-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {ins.inspectionNumber}
                    {ins.grounded && (
                      <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        GROUNDED
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white">{ins.vehiclePlate}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{ins.vehicleModel}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-200">{ins.driverName}</td>
                  <td className="p-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {ins.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-1 ${
                      ins.result === 'PASS' 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : ins.result === 'ATTENTION' 
                        ? 'bg-amber-500/20 text-amber-300' 
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {ins.result === 'PASS' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : ins.result === 'ATTENTION' ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {ins.result} ({ins.overallScore}%)
                    </span>
                  </td>
                  <td className="p-4 font-mono">{ins.odometer.toLocaleString()} km</td>
                  <td className="p-4 text-slate-400 whitespace-nowrap">
                    {new Date(ins.completedAt || ins.createdAt).toLocaleDateString()} {new Date(ins.completedAt || ins.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInspection(ins);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedInspection && (
        <InspectionDetailModal
          inspection={selectedInspection}
          onClose={() => setSelectedInspection(null)}
        />
      )}
    </div>
  );
};
