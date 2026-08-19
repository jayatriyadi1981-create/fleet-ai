/**
 * Fleet Intelligence Smart AI - Driver Fatigue Profiles Tab
 * PROMPT 23 - Driver Fatigue Management (/app/fatigue/drivers)
 */

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Clock, 
  BedDouble, 
  Moon, 
  Building2, 
  Truck, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Calendar,
  Grid,
  List
} from 'lucide-react';
import { DriverFatigueProfile, FatigueRiskLevel } from '../../types';

interface DriverFatigueTabProps {
  profiles: DriverFatigueProfile[];
  onSelectDriver: (profile: DriverFatigueProfile) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  riskFilter: string;
  setRiskFilter: (r: string) => void;
}

export const DriverFatigueTab: React.FC<DriverFatigueTabProps> = ({
  profiles,
  onSelectDriver,
  searchQuery,
  setSearchQuery,
  riskFilter,
  setRiskFilter,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.vehiclePlate && p.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.branchName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || p.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const getRiskBadgeColor = (level: FatigueRiskLevel) => {
    switch (level) {
      case 'LOW':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'MODERATE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pengemudi, plat nomor, atau cabang..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Risk Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 border border-slate-800 rounded-xl">
            {['all', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'].map((level) => (
              <button
                key={level}
                onClick={() => setRiskFilter(level)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  riskFilter === level
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {level === 'all' ? 'Semua Status' : level}
              </button>
            ))}
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'table' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => onSelectDriver(profile)}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all cursor-pointer space-y-4 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={profile.driverAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={profile.driverName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {profile.driverName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <Truck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{profile.vehiclePlate || 'B 9876 XYZ'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-extrabold text-white">{profile.currentScore}<span className="text-xs text-slate-500 font-normal">/100</span></div>
                  <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${getRiskBadgeColor(profile.riskLevel)}`}>
                    {profile.riskLevel}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Mengemudi</span>
                  <span className="font-bold text-white">{profile.drivingHoursToday.toFixed(1)}h</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Istirahat</span>
                  <span className="font-bold text-emerald-400">{profile.restHoursToday.toFixed(1)}h</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Night Hours</span>
                  <span className="font-bold text-indigo-400">{profile.nightDrivingHoursToday.toFixed(1)}h</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Faktor Risiko Dominan</span>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {profile.riskFactors[0]?.description || 'Indikator operasional berada dalam batas normal.'}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-500">
                <span>Data: {profile.dataSource}</span>
                <span className="text-cyan-400 font-medium group-hover:underline flex items-center gap-1">
                  Lihat Profil Detail <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table Mode */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Pengemudi (Driver)</th>
                  <th className="p-4">Cabang & Shift</th>
                  <th className="p-4">Fatigue Score</th>
                  <th className="p-4">Mengemudi Hari Ini</th>
                  <th className="p-4">Istirahat</th>
                  <th className="p-4">Mengemudi Malam</th>
                  <th className="p-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={profile.driverAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={profile.driverName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <span className="font-bold text-white block">{profile.driverName}</span>
                          <span className="text-[11px] text-slate-400">{profile.vehiclePlate || 'B 9876 XYZ'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white block">{profile.branchName}</span>
                      <span className="text-[11px] text-slate-500">{profile.currentShiftName || 'Night Shift'}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white">{profile.currentScore}/100</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getRiskBadgeColor(profile.riskLevel)}`}>
                          {profile.riskLevel}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-white">
                      {profile.drivingHoursToday.toFixed(1)} jam
                    </td>
                    <td className="p-4 font-semibold text-emerald-400">
                      {profile.restHoursToday.toFixed(1)} jam
                    </td>
                    <td className="p-4 font-semibold text-indigo-400">
                      {profile.nightDrivingHoursToday.toFixed(1)} jam
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => onSelectDriver(profile)}
                        className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white rounded-lg font-semibold transition-colors text-xs"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
