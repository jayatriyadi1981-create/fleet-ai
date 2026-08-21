import React, { useState } from 'react';
import {
  Car,
  Users,
  CalendarCheck,
  Fuel,
  Key,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Clock,
  BatteryCharging,
  Zap,
  TrendingUp,
  CheckCircle2,
  Building2,
  PhoneCall,
  Search,
  Filter
} from 'lucide-react';
import { MOCK_CORP_VEHICLES, MOCK_CORP_BOOKINGS, MOCK_SMART_KEY_LOGS } from '../../../modules/corporate/mockData';

export const CorpControlTowerTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredVehicles = MOCK_CORP_VEHICLES.filter(v => {
    const matchSearch =
      v.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.brandModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.assignedDivision.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'ALL' || v.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const poolAvailableCount = MOCK_CORP_VEHICLES.filter(v => v.status === 'AVAILABLE_POOL').length;
  const onTripCount = MOCK_CORP_VEHICLES.filter(v => v.status === 'ON_TRIP_RESERVED').length;
  const dedicatedCount = MOCK_CORP_VEHICLES.filter(v => v.status === 'DEDICATED_ASSIGNED').length;

  return (
    <div id="corp-control-tower-tab" className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Armada Perusahaan</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">{MOCK_CORP_VEHICLES.length} Unit</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">100% Terhubung</span> GPS Telematics
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Siap Pakai (Pool Ready)</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2 font-mono">{poolAvailableCount} Unit</div>
          <div className="text-xs text-slate-500 mt-1">Kunci di Smart Locker B1</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Sedang Dinas (On-Trip)</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2 font-mono">{onTripCount} Unit</div>
          <div className="text-xs text-slate-500 mt-1">Sedang dipakai dinas kantor</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Mobil Jabatan (VIP BOD)</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-2 font-mono">{dedicatedCount} Unit</div>
          <div className="text-xs text-slate-500 mt-1">Dedicated C-Level & Direksi</div>
        </div>
      </div>

      {/* Main Grid: Live Radar Map & Active Trips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Fleet Radar */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
              <h3 className="font-bold text-sm text-white">Live Corporate Fleet Radar & GPS Geofence Monitor</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-emerald-400">
                HQ Radius: 50m OK
              </span>
              <span>Update: Realtime</span>
            </div>
          </div>

          {/* Interactive Vehicle Table */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari plat nomor, model, divisi, atau kode aset..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="EXECUTIVE_VIP">Executive VIP / Direksi</option>
                <option value="POOL_OPERATIONAL">Pool Sharing Karyawan</option>
                <option value="ELECTRIC_VEHICLE_EV">Green Fleet (EV)</option>
                <option value="STAFF_SHUTTLE_BUS">Shuttle Karyawan</option>
                <option value="MANAGEMENT_DEDICATED">Mobil COP / Pejabat</option>
              </select>
            </div>

            <div className="divide-y divide-slate-800 max-h-[340px] overflow-y-auto pr-1">
              {filteredVehicles.map(v => (
                <div key={v.id} className="py-3 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-800/50 px-2 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white font-mono">{v.plateNumber}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-blue-400 font-mono">
                        {v.assetCode}
                      </span>
                      {v.fuelType === 'ELECTRIC_BATTERY' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-emerald-400" /> EV Eco
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">{v.brandModel}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span>{v.gpsLocation.address}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div className="text-xs space-y-0.5">
                      <div className="text-slate-400">Kecepatan & BBM</div>
                      <div className="font-mono text-slate-200">
                        {v.gpsLocation.speedKmh} km/jam • {v.fuelLevelPercent}% {v.fuelType === 'ELECTRIC_BATTERY' ? 'Batt' : 'BBM'}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">Saldo Tol: Rp {v.eTollBalanceIdr.toLocaleString('id-ID')}</div>
                    </div>

                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      v.status === 'AVAILABLE_POOL' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' :
                      v.status === 'ON_TRIP_RESERVED' ? 'bg-amber-900/60 text-amber-300 border border-amber-700 animate-pulse' :
                      'bg-purple-900/60 text-purple-300 border border-purple-700'
                    }`}>
                      {v.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Active Booking Queue & Smart Keybox Status */}
        <div className="space-y-6">
          {/* Active Bookings */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-blue-600" /> Permohonan Booking Hari Ini
              </h4>
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {MOCK_CORP_BOOKINGS.length} Tiket
              </span>
            </div>

            <div className="space-y-3">
              {MOCK_CORP_BOOKINGS.map(b => (
                <div key={b.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{b.requestorName}</span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      b.status === 'ACTIVE_ON_GOING' ? 'bg-amber-100 text-amber-800' :
                      b.status === 'APPROVED_DISPATCHED' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-slate-200 text-slate-800'
                    }`}>
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-slate-500 font-medium">{b.requestorDivision} • {b.requestorRole}</p>
                  <div className="p-2 bg-white rounded border border-slate-200 text-slate-700">
                    <span className="font-semibold text-slate-900">Tujuan:</span> {b.destination}
                  </div>
                  <div className="flex items-center justify-between text-slate-500 pt-1">
                    <span>Unit: <strong className="text-slate-800 font-mono">{b.assignedPlate}</strong></span>
                    <span>Driver: <strong className="text-slate-800">{b.assignedDriverName || 'Self Drive'}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Keybox Status */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" /> Smart Keybox RFID Locker B1
              </h4>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
              </span>
            </div>

            <div className="space-y-2">
              {MOCK_SMART_KEY_LOGS.map(k => (
                <div key={k.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 font-mono">{k.lockerNumber} • {k.plateNumber}</div>
                    <div className="text-slate-500 text-[11px]">{k.authorizedEmployee}</div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      k.action === 'KEY_CHECKOUT' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {k.action === 'KEY_CHECKOUT' ? 'KUNCI KELUAR' : 'KUNCI KEMBALI'}
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{k.timestamp.split(' ')[1]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
