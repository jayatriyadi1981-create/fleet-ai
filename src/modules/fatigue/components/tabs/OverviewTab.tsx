/**
 * Fleet Intelligence Smart AI - Fatigue Overview Dashboard Tab
 * PROMPT 23 - Enterprise Overview Dashboard Architecture
 */

import React from 'react';
import { 
  Users, 
  Clock, 
  BedDouble, 
  Moon, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Activity, 
  ShieldAlert, 
  HeartPulse, 
  Sparkles,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { DriverFatigueProfile, FatigueAlert, FatigueOverviewKPIs } from '../../types';

interface OverviewTabProps {
  kpis: FatigueOverviewKPIs;
  profiles: DriverFatigueProfile[];
  alerts: FatigueAlert[];
  onOpenDriverModal: (profile: DriverFatigueProfile) => void;
  onOpenSelfReport: () => void;
  onOpenAcknowledgeAlert: (alert: FatigueAlert) => void;
}

const drivingTrendData = [
  { day: 'Sen', drivingHours: 5.2, nightHours: 1.8, riskAvg: 76 },
  { day: 'Sel', drivingHours: 5.8, nightHours: 2.1, riskAvg: 74 },
  { day: 'Rab', drivingHours: 6.1, nightHours: 2.5, riskAvg: 71 },
  { day: 'Kam', drivingHours: 5.4, nightHours: 1.9, riskAvg: 77 },
  { day: 'Jum', drivingHours: 6.5, nightHours: 3.2, riskAvg: 68 },
  { day: 'Sab', drivingHours: 5.9, nightHours: 2.8, riskAvg: 72 },
  { day: 'Ming', drivingHours: 4.8, nightHours: 1.5, riskAvg: 82 },
];

const riskDistributionData = [
  { name: 'Low Risk (80-100)', value: 128, color: '#10b981' },
  { name: 'Moderate Risk (60-79)', value: 32, color: '#f59e0b' },
  { name: 'High Risk (40-59)', value: 12, color: '#f97316' },
  { name: 'Critical Risk (0-39)', value: 3, color: '#f43f5e' },
];

export const OverviewTab: React.FC<OverviewTabProps> = ({
  kpis,
  profiles,
  alerts,
  onOpenDriverModal,
  onOpenSelfReport,
  onOpenAcknowledgeAlert,
}) => {
  return (
    <div className="space-y-6">
      {/* Risk Summary Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Low Risk Drivers</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">128</p>
            <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> 73.1% dari total armada
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Moderate Risk</span>
            <p className="text-2xl font-black text-amber-400 mt-1">32</p>
            <span className="text-[11px] text-amber-500 font-medium flex items-center gap-1 mt-1">
              <Activity className="w-3 h-3" /> Dalam pemantauan shift
            </span>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">High Risk Drivers</span>
            <p className="text-2xl font-black text-orange-400 mt-1">12</p>
            <span className="text-[11px] text-orange-400 font-medium flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3" /> Perlu intervensi rehat
            </span>
          </div>
          <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Critical Risk</span>
            <p className="text-2xl font-black text-rose-400 mt-1">3</p>
            <span className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
              <ShieldAlert className="w-3 h-3" /> Tindakan K3 segera
            </span>
          </div>
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Fleet Fatigue Gauge & Core KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Fatigue Score Gauge Card */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Fleet Fatigue Risk Score</span>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
              78 / 100 (Low Risk)
            </span>
          </div>

          <div className="py-6 flex flex-col items-center justify-center text-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400 transition-all duration-1000 ease-out"
                  strokeDasharray="78, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white">78</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Score Index</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2 px-4">
              Nilai dihitung dari rata-rata jam mengemudi, jam istirahat, paparan malam, dan pola shift seluruh driver terdaftar.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-center text-xs">
            <div className="p-2 bg-slate-950/60 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Rest Compliance</span>
              <span className="font-bold text-emerald-400">91.4%</span>
            </div>
            <div className="p-2 bg-slate-950/60 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Active Alerts</span>
              <span className="font-bold text-rose-400">17 Active</span>
            </div>
          </div>
        </div>

        {/* Driving & Night Hours Trends Chart */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Tren Jam Mengemudi & Paparan Malam (7 Hari)</h3>
              <p className="text-xs text-slate-400">Perbandingan rata-rata jam mengemudi vs perjalanan malam hari</p>
            </div>
            <button 
              onClick={onOpenSelfReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <HeartPulse className="w-4 h-4" />
              Report Fatigue Risk
            </button>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={drivingTrendData}>
                <defs>
                  <linearGradient id="colorDriving" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit="h" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="drivingHours" name="Jam Mengemudi" stroke="#06b6d4" fillOpacity={1} fill="url(#colorDriving)" />
                <Area type="monotone" dataKey="nightHours" name="Jam Malam (22:00-06:00)" stroke="#818cf8" fillOpacity={1} fill="url(#colorNight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Drivers & Active Fatigue Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical / High Risk Driver Watchlist */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm font-bold text-white">Driver Perlu Intervensi (Risk Watchlist)</h3>
            </div>
            <span className="text-xs text-slate-400">Priority Operational Action</span>
          </div>

          <div className="space-y-3">
            {profiles
              .filter((p) => p.riskLevel === 'CRITICAL' || p.riskLevel === 'HIGH')
              .map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => onOpenDriverModal(profile)}
                  className="p-3.5 bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.driverAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={profile.driverName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {profile.driverName}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          profile.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {profile.riskLevel} ({profile.currentScore}/100)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Continuous: <strong>{profile.consecutiveDrivingHours.toFixed(1)}h</strong> • Rest: <strong>{profile.restHoursToday.toFixed(1)}h</strong> • Night: <strong>{profile.nightDrivingHoursToday.toFixed(1)}h</strong>
                      </p>
                    </div>
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
              ))}
          </div>
        </div>

        {/* Active Fatigue Alerts List */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Active Fatigue Telemetry Alerts</h3>
            </div>
            <span className="text-xs text-slate-400">{alerts.filter((a) => !a.acknowledged).length} unacknowledged</span>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    alert.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    alert.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(alert.triggeredAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white">{alert.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{alert.message}</p>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-500">Driver: {alert.driverName}</span>
                  {!alert.acknowledged ? (
                    <button
                      onClick={() => onOpenAcknowledgeAlert(alert)}
                      className="px-2.5 py-1 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white rounded text-[10px] font-bold transition-colors"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Acknowledged
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
