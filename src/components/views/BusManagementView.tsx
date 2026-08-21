/**
 * Fleet Intelligence Smart AI - Bus Management System Main View
 * Enterprise-grade PO Bus & Passenger Transport Suite
 */

import React, { useState } from 'react';
import { 
  BusTabId, 
  BusTrip, 
  BusTicket, 
  BusCargoPackage 
} from '../../modules/bus/types';
import { busService } from '../../modules/bus/services/busService';

// Existing Tab Components
import { BusControlTowerTab } from '../bus/tabs/BusControlTowerTab';
import { BusTripsScheduleTab } from '../bus/tabs/BusTripsScheduleTab';
import { BusTicketingSeatTab } from '../bus/tabs/BusTicketingSeatTab';
import { BusPassengerManifestTab } from '../bus/tabs/BusPassengerManifestTab';
import { BusRoutesTerminalsTab } from '../bus/tabs/BusRoutesTerminalsTab';
import { BusCargoExpressTab } from '../bus/tabs/BusCargoExpressTab';
import { BusAgentsCounterTab } from '../bus/tabs/BusAgentsCounterTab';
import { BusCrewRosterTab } from '../bus/tabs/BusCrewRosterTab';
import { BusRampCheckTab } from '../bus/tabs/BusRampCheckTab';
import { BusUjsTollFuelTab } from '../bus/tabs/BusUjsTollFuelTab';
import { BusLiveTrackingTab } from '../bus/tabs/BusLiveTrackingTab';
import { BusCharterTourTab } from '../bus/tabs/BusCharterTourTab';
import { BusOccupancyAnalyticsTab } from '../bus/tabs/BusOccupancyAnalyticsTab';
import { BusAiDispatcherTab } from '../bus/tabs/BusAiDispatcherTab';
import { BusReportsTab } from '../bus/tabs/BusReportsTab';

// Newly Built Advanced Tab Components
import { BusFleetVehiclesTab } from '../bus/tabs/BusFleetVehiclesTab';
import { BusSeatLayoutDesignerTab } from '../bus/tabs/BusSeatLayoutDesignerTab';
import { BusDispatchSchedulerTab } from '../bus/tabs/BusDispatchSchedulerTab';
import { BusBoardingScannerTab } from '../bus/tabs/BusBoardingScannerTab';
import { BusPassengersCrmTab } from '../bus/tabs/BusPassengersCrmTab';
import { BusComplaintsTab } from '../bus/tabs/BusComplaintsTab';
import { BusSafetyEmergencyTab } from '../bus/tabs/BusSafetyEmergencyTab';
import { BusTerminalsDepotsTab } from '../bus/tabs/BusTerminalsDepotsTab';
import { BusProfitabilityCostTab } from '../bus/tabs/BusProfitabilityCostTab';
import { BusPublicTrackingTab } from '../bus/tabs/BusPublicTrackingTab';
import { BusMobileDriverModeTab } from '../bus/tabs/BusMobileDriverModeTab';

import { 
  Bus, 
  Target, 
  CalendarClock, 
  Ticket, 
  Users, 
  Waypoints, 
  Package, 
  Store, 
  UserCheck, 
  ShieldCheck, 
  DollarSign, 
  Radio, 
  Compass, 
  TrendingUp, 
  Sparkles, 
  FileSpreadsheet,
  Armchair,
  QrCode,
  MessageSquareWarning,
  ShieldAlert,
  Building2,
  Coins,
  Smartphone,
  CheckCircle2,
  X
} from 'lucide-react';

interface Props {
  initialTab?: BusTabId;
}

export const BusManagementView: React.FC<Props> = ({ initialTab = 'control-tower' }) => {
  const [activeTab, setActiveTab] = useState<BusTabId>(initialTab);
  const [trips, setTrips] = useState<BusTrip[]>(busService.getTrips());
  const [tickets, setTickets] = useState<BusTicket[]>(busService.getTickets());
  const [cargoPackages, setCargoPackages] = useState<BusCargoPackage[]>(busService.getCargoPackages());
  const [buses] = useState(busService.getBuses());
  const [agents] = useState(busService.getAgents());
  const [crews] = useState(busService.getCrews());
  const [rampChecks] = useState(busService.getRampChecks());
  const [charterBookings] = useState(busService.getCharterBookings());
  const [kpis] = useState(busService.getKPIs());

  const [selectedTripModal, setSelectedTripModal] = useState<BusTrip | null>(null);

  const handleCreateTrip = (tripData: Partial<BusTrip>) => {
    busService.createTrip(tripData);
    setTrips(busService.getTrips());
  };

  const handleBookTicket = (ticketData: Partial<BusTicket>) => {
    busService.bookTicket(ticketData);
    setTickets(busService.getTickets());
  };

  const handleCreateCargo = (cargoData: Partial<BusCargoPackage>) => {
    busService.createCargoPackage(cargoData);
    setCargoPackages(busService.getCargoPackages());
  };

  const tabsConfig = [
    { id: 'control-tower', label: 'Menara Kendali (Tower)', icon: Target, category: 'OPERASIONAL' },
    { id: 'bus-fleet', label: 'Master Armada Bus', icon: Bus, category: 'OPERASIONAL' },
    { id: 'seat-layout', label: 'Denah Kursi Studio', icon: Armchair, category: 'OPERASIONAL' },
    { id: 'trips-schedule', label: 'Jadwal & Ritase', icon: CalendarClock, category: 'OPERASIONAL' },
    { id: 'dispatch', label: 'Dispatch & Penugasan', icon: CalendarClock, category: 'OPERASIONAL' },
    { id: 'ticketing-seat', label: 'Reservasi & Tiket', icon: Ticket, category: 'TIKET' },
    { id: 'boarding', label: 'QR Scan E-Boarding', icon: QrCode, category: 'TIKET' },
    { id: 'passenger-manifest', label: 'Manifest Kemenhub', icon: Users, category: 'TIKET' },
    { id: 'passengers', label: 'Pelanggan & CRM', icon: Users, category: 'TIKET' },
    { id: 'complaints', label: 'Keluhan Penumpang', icon: MessageSquareWarning, category: 'TIKET' },
    { id: 'routes-terminals', label: 'Trayek & Rest Area', icon: Waypoints, category: 'INFRASTRUKTUR' },
    { id: 'terminals-depots', label: 'Terminal & Pool Depo', icon: Building2, category: 'INFRASTRUKTUR' },
    { id: 'cargo-express', label: 'Kargo Bus Express', icon: Package, category: 'BISNIS' },
    { id: 'charter-tour', label: 'Sewa Pariwisata', icon: Compass, category: 'BISNIS' },
    { id: 'agents-counter', label: 'Loket Agen & Komisi', icon: Store, category: 'BISNIS' },
    { id: 'crew-roster', label: 'Kru & Roster Supir', icon: UserCheck, category: 'KRU_SAFETY' },
    { id: 'ramp-check', label: 'Ramp Check Uji KIR', icon: ShieldCheck, category: 'KRU_SAFETY' },
    { id: 'safety-emergency', label: 'Panic Button & Safety', icon: ShieldAlert, category: 'KRU_SAFETY' },
    { id: 'ujs-toll-fuel', label: 'UJS, BBM & E-Toll', icon: DollarSign, category: 'KEUANGAN' },
    { id: 'revenue-profitability', label: 'Profit & Analisis RASK', icon: Coins, category: 'KEUANGAN' },
    { id: 'occupancy-analytics', label: 'Analitik Okupansi', icon: TrendingUp, category: 'KEUANGAN' },
    { id: 'live-tracking', label: 'Live GPS Telematika', icon: Radio, category: 'PORTAL' },
    { id: 'public-tracking', label: 'Lacak Publik (Keluarga)', icon: Compass, category: 'PORTAL' },
    { id: 'mobile-driver', label: 'Mode Mobile Supir', icon: Smartphone, category: 'PORTAL' },
    { id: 'ai-dispatcher', label: 'AI PO Bus Copilot', icon: Sparkles, category: 'INTELLIGENCE' },
    { id: 'reports', label: 'Laporan Komprehensif', icon: FileSpreadsheet, category: 'INTELLIGENCE' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md">
            <Bus className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">
                Bus Management System (PO Bus Enterprise)
              </h2>
              <span className="px-2.5 py-0.5 bg-blue-950/60 text-blue-300 text-[10px] font-bold rounded-full border border-blue-800">
                SMART FLEET AI V3.5
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Platform operasional PO Bus AKAP/Pariwisata, reservasi kursi, QR e-boarding, UJS solar, ramp check, telemetry GPS, dan manajemen keluhan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right text-xs hidden sm:block">
            <div className="font-bold text-white">PO Sinar Jaya & Rosalia Indah Network</div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              24 Ritase Aktif Terpantau
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Pills Bar */}
      <div className="overflow-x-auto scrollbar-thin pb-1">
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 w-max shadow-sm">
          {tabsConfig.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as BusTabId)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Tab Contents */}
      <div>
        {activeTab === 'control-tower' && (
          <BusControlTowerTab 
            kpis={kpis} 
            trips={trips} 
            onSelectTrip={(trip) => setSelectedTripModal(trip)}
            onNavigateTab={(tabId) => setActiveTab(tabId as BusTabId)}
          />
        )}

        {activeTab === 'bus-fleet' && (
          <BusFleetVehiclesTab 
            buses={buses}
          />
        )}

        {activeTab === 'seat-layout' && (
          <BusSeatLayoutDesignerTab />
        )}

        {activeTab === 'trips-schedule' && (
          <BusTripsScheduleTab 
            trips={trips} 
            onSelectTrip={(trip) => setSelectedTripModal(trip)}
            onCreateTrip={handleCreateTrip}
          />
        )}

        {activeTab === 'dispatch' && (
          <BusDispatchSchedulerTab 
            trips={trips}
          />
        )}

        {activeTab === 'ticketing-seat' && (
          <BusTicketingSeatTab 
            trips={trips} 
            tickets={tickets} 
            onBookTicket={handleBookTicket}
          />
        )}

        {activeTab === 'boarding' && (
          <BusBoardingScannerTab 
            trips={trips} 
            tickets={tickets} 
          />
        )}

        {activeTab === 'passenger-manifest' && (
          <BusPassengerManifestTab 
            trips={trips} 
            tickets={tickets} 
          />
        )}

        {activeTab === 'passengers' && (
          <BusPassengersCrmTab />
        )}

        {activeTab === 'complaints' && (
          <BusComplaintsTab />
        )}

        {activeTab === 'routes-terminals' && (
          <BusRoutesTerminalsTab 
            trips={trips} 
          />
        )}

        {activeTab === 'terminals-depots' && (
          <BusTerminalsDepotsTab />
        )}

        {activeTab === 'cargo-express' && (
          <BusCargoExpressTab 
            cargoPackages={cargoPackages} 
            trips={trips} 
            onCreateCargo={handleCreateCargo}
          />
        )}

        {activeTab === 'charter-tour' && (
          <BusCharterTourTab 
            charterBookings={charterBookings} 
          />
        )}

        {activeTab === 'agents-counter' && (
          <BusAgentsCounterTab 
            agents={agents} 
          />
        )}

        {activeTab === 'crew-roster' && (
          <BusCrewRosterTab 
            crews={crews} 
          />
        )}

        {activeTab === 'ramp-check' && (
          <BusRampCheckTab 
            rampChecks={rampChecks} 
          />
        )}

        {activeTab === 'safety-emergency' && (
          <BusSafetyEmergencyTab 
            trips={trips} 
          />
        )}

        {activeTab === 'ujs-toll-fuel' && (
          <BusUjsTollFuelTab 
            trips={trips} 
          />
        )}

        {activeTab === 'revenue-profitability' && (
          <BusProfitabilityCostTab 
            trips={trips} 
          />
        )}

        {activeTab === 'occupancy-analytics' && (
          <BusOccupancyAnalyticsTab 
            kpis={kpis} 
            trips={trips} 
          />
        )}

        {activeTab === 'live-tracking' && (
          <BusLiveTrackingTab 
            trips={trips} 
          />
        )}

        {activeTab === 'public-tracking' && (
          <BusPublicTrackingTab 
            trips={trips} 
          />
        )}

        {activeTab === 'mobile-driver' && (
          <BusMobileDriverModeTab 
            trips={trips} 
          />
        )}

        {activeTab === 'ai-dispatcher' && (
          <BusAiDispatcherTab />
        )}

        {activeTab === 'reports' && (
          <BusReportsTab />
        )}
      </div>

      {/* Selected Trip Quick Modal */}
      {selectedTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bus className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-base text-white">
                  Informasi Ritase Bus: {selectedTripModal.tripCode}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedTripModal(null)} 
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="font-bold text-sm text-white">{selectedTripModal.routeName}</div>
                <div className="text-slate-400">
                  Plat: <span className="font-mono text-cyan-300">{selectedTripModal.busPlateNumber}</span> • {selectedTripModal.busName} • <strong className="text-white">{selectedTripModal.busClass.replace(/_/g, ' ')}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-slate-300">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 block">Jam Berangkat:</span>
                  <strong className="text-emerald-400 font-mono">{selectedTripModal.departureTime} WIB</strong>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 block">Estimasi Tiba:</span>
                  <strong className="text-cyan-400 font-mono">{selectedTripModal.estimatedArrivalTime} WIB</strong>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 block">Supir Utama:</span>
                  <strong className="text-white">{selectedTripModal.primaryDriverName}</strong>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 block">Kondektur / Kernet:</span>
                  <strong className="text-white">{selectedTripModal.conductorName}</strong>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 block">Okupansi Kursi:</span>
                  <strong className="text-emerald-400">{selectedTripModal.bookedSeats} / {selectedTripModal.totalSeats} Kursi</strong>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 block">Uang Jalan (UJS):</span>
                  <strong className="text-amber-400 font-mono">Rp {selectedTripModal.ujsAmount.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
              <button 
                onClick={() => {
                  setSelectedTripModal(null);
                  setActiveTab('ticketing-seat');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-900/30"
              >
                Buka Denah Kursi & Reservasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
