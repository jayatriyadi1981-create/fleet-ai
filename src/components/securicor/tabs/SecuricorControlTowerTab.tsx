import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Radio,
  Video,
  Navigation,
  Key,
  AlertTriangle,
  RefreshCw,
  Eye,
  Sliders,
  DollarSign
} from 'lucide-react';
import { MOCK_ARMORED_FLEETS, MOCK_CIT_MISSIONS } from '../../../modules/securicor/services/securicorMockData';
import { SecuricorArmoredVehicle } from '../../../modules/securicor/types';

export const SecuricorControlTowerTab: React.FC = () => {
  const [fleets, setFleets] = useState<SecuricorArmoredVehicle[]>(MOCK_ARMORED_FLEETS);
  const [selectedVehicle, setSelectedVehicle] = useState<SecuricorArmoredVehicle>(fleets[0]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [engineInterlockActive, setEngineInterlockActive] = useState<Record<string, boolean>>({});
  const [panicModalVehicle, setPanicModalVehicle] = useState<SecuricorArmoredVehicle | null>(null);

  const totalCashOnRoadIdr = fleets.reduce((acc, f) => acc + f.currentCashPayloadIdr, 0);
  const totalInsuredIdr = fleets.reduce((acc, f) => acc + f.insuredCoverageIdr, 0);
  const activeEnRouteCount = fleets.filter(f => f.currentStatus === 'EN_ROUTE_TRANSIT' || f.currentStatus === 'ATM_SERVICING').length;

  const toggleEngineLock = (hullId: string) => {
    setEngineInterlockActive(prev => ({
      ...prev,
      [hullId]: !prev[hullId]
    }));
  };

  const filteredFleets = fleets.filter(f => {
    if (filterType === 'ALL') return true;
    if (filterType === 'TRANSIT') return f.currentStatus === 'EN_ROUTE_TRANSIT';
    if (filterType === 'ATM') return f.currentStatus === 'ATM_SERVICING';
    if (filterType === 'LOADING') return f.currentStatus === 'CASH_LOADING';
    return true;
  });

  return (
    <div id="securicor-control-tower-tab" className="space-y-6">
      {/* Top Banner KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Total Valuables In Transit</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">Rp {totalCashOnRoadIdr.toFixed(1)} Miliar</p>
            <span className="text-xs text-emerald-400 font-medium">100% Cash-in-Transit Insured</span>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Active Tactical Convoy</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{activeEnRouteCount} / {fleets.length} Unit</p>
            <span className="text-xs text-slate-300">Armed Escort Connected</span>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
            <Navigation className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Airlock Interlock Doors</p>
            <p className="text-2xl font-bold text-sky-400 mt-1">100% SECURE</p>
            <span className="text-xs text-slate-300">Dual-Key Electronic Vault</span>
          </div>
          <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-lg text-sky-400">
            <Lock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Silent Duress & SOS</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">STANDBY 0 SOS</p>
            <span className="text-xs text-slate-300">Polda Metro Direct Link</span>
          </div>
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Tactical Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tactical Radar / GIS Map Simulator & Live Convoy List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tactical Map Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <h3 className="font-bold text-white text-sm tracking-wide">SECURE TRANSIT CORRIDOR - LIVE TACTICAL RADAR</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-mono">
                  REFRESH RATE: 1.0s (MILITARY GPS)
                </span>
                <button
                  onClick={() => setFleets([...fleets])}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-xs flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Sync
                </button>
              </div>
            </div>

            {/* Radar Simulation Area */}
            <div className="relative h-72 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 flex flex-col justify-between overflow-hidden">
              {/* Radar Grid Lines */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-emerald-500/20 rounded-full pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-emerald-500/30 rounded-full pointer-events-none"></div>

              {/* Vehicle Markers */}
              <div className="relative z-10 flex flex-wrap gap-4 items-center">
                {fleets.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicle(v)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all ${
                      selectedVehicle.id === v.id
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                        : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className={`p-1.5 rounded-md ${
                      v.currentStatus === 'EN_ROUTE_TRANSIT' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-200'
                    }`}>
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono">{v.hullNumber}</div>
                      <div className="text-[10px] text-amber-300 font-semibold">Rp {v.currentCashPayloadIdr} Miliar</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Live Info Bar on Map */}
              <div className="relative z-10 bg-slate-950/90 border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <div className="text-slate-400 font-mono">SELECTED UNIT: <span className="text-white font-bold">{selectedVehicle.hullNumber}</span></div>
                  <div className="text-slate-400 font-mono">PLATE: <span className="text-amber-300 font-bold">{selectedVehicle.plateNumber}</span></div>
                  <div className="text-slate-400 font-mono">SPEED: <span className="text-emerald-400 font-bold">{selectedVehicle.gpsLocation.speedKmh} km/h</span></div>
                </div>
                <div className="text-slate-300 font-medium flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {selectedVehicle.gpsLocation.address}
                </div>
              </div>
            </div>
          </div>

          {/* Fleets List with Filters */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600" />
                Daftar Armada Lapis Baja (Securicor CIT Fleet)
              </h3>
              <div className="flex items-center gap-1 text-xs">
                {['ALL', 'TRANSIT', 'ATM', 'LOADING'].map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1 rounded-md font-medium transition-all ${
                      filterType === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredFleets.map(v => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors flex flex-wrap items-center justify-between gap-3 ${
                    selectedVehicle.id === v.id ? 'bg-amber-50/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-mono font-bold text-xs border border-slate-800">
                      CIT
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{v.hullNumber}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-700 font-semibold border border-slate-200">
                          {v.plateNumber}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                          {v.ballisticLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <span>{v.assignedBankClient}</span> • <span>Escort: {v.armedPoliceEscort}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Valuables Payload</div>
                      <div className="text-sm font-bold text-amber-600">Rp {v.currentCashPayloadIdr} Miliar</div>
                    </div>
                    <div>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        v.currentStatus === 'EN_ROUTE_TRANSIT' ? 'bg-emerald-100 text-emerald-800' :
                        v.currentStatus === 'ATM_SERVICING' ? 'bg-blue-100 text-blue-800' :
                        v.currentStatus === 'CASH_LOADING' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {v.currentStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Selected Unit Tactical Deep Telemetry */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-amber-400 font-mono font-bold tracking-wider uppercase">TACTICAL TELEMETRY</span>
                <h4 className="text-lg font-bold text-white mt-0.5">{selectedVehicle.hullNumber}</h4>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-xs font-mono font-semibold">
                SYSTEM ARMED
              </span>
            </div>

            {/* Live Security Interlocks */}
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-sky-400" /> AIRLOCK CABIN INTERLOCK:</span>
                <span className="text-emerald-400 font-bold">{selectedVehicle.interlockingDoors}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-amber-400" /> VAULT DUAL-KEY LOCK:</span>
                <span className="text-amber-400 font-bold">{selectedVehicle.vaultDoorStatus}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-purple-400" /> RUN-FLAT MILITARY TYRE:</span>
                <span className="text-slate-200 font-bold">{selectedVehicle.runFlatTyreStatus}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-emerald-400" /> 360° CCTV RECORDER:</span>
                <span className="text-emerald-400 font-bold">{selectedVehicle.cctvLiveFeedsCount} CHANNELS LIVE</span>
              </div>
            </div>

            {/* Officers and Escort Details */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">CREW & POLRI ESCORT DETAILS</div>
              <div className="flex justify-between">
                <span className="text-slate-400">Chief Officer:</span>
                <span className="font-medium text-white">{selectedVehicle.chiefEscortOfficer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Armed Escort:</span>
                <span className="font-medium text-amber-300">{selectedVehicle.armedPoliceEscort}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tactical Driver:</span>
                <span className="font-medium text-slate-200">{selectedVehicle.driverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">KTA Senpi Expiry:</span>
                <span className="font-medium text-emerald-400">{selectedVehicle.ktaSenpiExpiry}</span>
              </div>
            </div>

            {/* Emergency Remote Commands */}
            <div className="space-y-2 pt-2">
              <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">REMOTE COMMAND CENTER ACTIONS</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => toggleEngineLock(selectedVehicle.id)}
                  className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    engineInterlockActive[selectedVehicle.id]
                      ? 'bg-rose-600 border-rose-500 text-white shadow-lg'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-rose-300'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  {engineInterlockActive[selectedVehicle.id] ? 'ENGINE KILLED' : 'INTERLOCK KILL'}
                </button>
                <button
                  onClick={() => setPanicModalVehicle(selectedVehicle)}
                  className="p-2.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-700/80 text-rose-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  POLRI SOS DISPATCH
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Dispatch Dialog */}
      {panicModalVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-rose-600 rounded-xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-8 h-8 animate-bounce" />
              <div>
                <h4 className="text-lg font-bold">POLRI TACTICAL SOS DISPATCH</h4>
                <p className="text-xs text-slate-400">Pusat Komando Siaga 1 Kejahatan Lapis Baja</p>
              </div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1.5 font-mono">
              <p><span className="text-slate-400">HULL:</span> <span className="text-amber-400 font-bold">{panicModalVehicle.hullNumber}</span></p>
              <p><span className="text-slate-400">LOKASI:</span> <span className="text-white">{panicModalVehicle.gpsLocation.address}</span></p>
              <p><span className="text-slate-400">VALUABLES:</span> <span className="text-emerald-400 font-bold">Rp {panicModalVehicle.currentCashPayloadIdr} Miliar</span></p>
              <p><span className="text-slate-400">POLICE ESCORT:</span> <span className="text-slate-300">{panicModalVehicle.armedPoliceEscort}</span></p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPanicModalVehicle(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Batalkan
              </button>
              <button
                onClick={() => {
                  alert(`SOS ALERT AKTIF: Koordinat ${panicModalVehicle.hullNumber} telah diteruskan ke Sentra Pelayanan Kepolisian Terpadu (SPKT) Polda Metro Jaya & Patroli Brimob terdekat.`);
                  setPanicModalVehicle(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-lg"
              >
                Konfirmasi Broadcast SOS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
