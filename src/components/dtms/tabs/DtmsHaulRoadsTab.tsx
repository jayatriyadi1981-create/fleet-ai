import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  AlertTriangle,
  Droplets,
  Truck,
  Gauge,
  CheckCircle2,
  Wind,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { dtmsService } from '../../../modules/dtms/services/dtmsService';
import { HaulRoadSegment } from '../../../modules/dtms/types';

export const DtmsHaulRoadsTab: React.FC = () => {
  const [segments, setSegments] = useState<HaulRoadSegment[]>(dtmsService.getHaulRoads());

  const getConditionBadge = (cond: HaulRoadSegment['roadCondition']) => {
    switch (cond) {
      case 'GOOD':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Kondisi Baik (Firm)</span>;
      case 'DUSTY':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Berdebu (Penyiraman Diperlukan)</span>;
      case 'SLIPPERY_MUDDY':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Licin & Berlumpur</span>;
      case 'POTHOLES':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">Lubang Jalan (Grader Req)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">Sedang Digrader</span>;
    }
  };

  const toggleWaterTruck = (id: string) => {
    setSegments(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, waterTruckScheduled: !s.waterTruckScheduled };
      }
      return s;
    }));
  };

  return (
    <div id="dtms-haul-roads-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span>Peta Jalan Hauling & Monitoring Kecepatan Segmen (Haul Road)</span>
          </h2>
          <p className="text-xs text-slate-400">Monitoring kemiringan grade (%), debu jalan, batas kecepatan, dan jadwal water truck</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Total Panjang Jalur Hauling:</span>
          <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">13.2 KM Terpantau</span>
        </div>
      </div>

      {/* Segments Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {segments.map((seg) => (
          <div key={seg.id} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">{seg.segmentCode}</span>
                <h3 className="text-sm font-semibold text-slate-100 mt-1">{seg.segmentName}</h3>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-200">{seg.lengthKm} KM</span>
                <div className="text-[10px] text-slate-400">Panjang</div>
              </div>
            </div>

            <div className="text-xs text-slate-400 flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5 text-slate-500" />
              <span>{seg.startPoint} &rarr; {seg.endPoint}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 text-xs">
              <div>
                <span className="text-[10px] text-slate-400">Grade Kemiringan</span>
                <div className={`font-bold ${seg.averageGradePct > 5 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {seg.averageGradePct > 0 ? `+${seg.averageGradePct}% (Tanjakan)` : `${seg.averageGradePct}% (Turunan)`}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Batas Kecepatan</span>
                <div className="font-bold text-cyan-400">{seg.maxSpeedKmh} KM/Jam</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">DT Aktif di Segmen</span>
                <div className="font-bold text-emerald-400">{seg.activeTruckCount} Unit</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Level Partikel Debu</span>
                <div className="font-bold text-slate-300">{seg.dustLevelPpm} PPM</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div>
                {getConditionBadge(seg.roadCondition)}
              </div>
              <button
                onClick={() => toggleWaterTruck(seg.id)}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors flex items-center space-x-1 ${
                  seg.waterTruckScheduled
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Droplets className="w-3 h-3" />
                <span>{seg.waterTruckScheduled ? 'Water Truck Aktif' : 'Siram Jalan'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
