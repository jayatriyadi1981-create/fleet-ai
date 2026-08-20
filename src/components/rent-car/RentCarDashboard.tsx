/**
 * Fleet Intelligence Smart AI - Rent Car Management System Main View
 */

import React, { useState, useEffect } from 'react';
import { 
  RentalVehicle, 
  RentalCustomer, 
  RentalBooking, 
  RentalTelemetryAlert, 
  RentalFleetKPIs,
  RentalContract,
  RentalDamageRecord,
  RentalInvoice,
  VehicleProfitabilityData,
  RentalAiInsight,
  RentalCalendarEvent
} from '../../modules/rent-car/types';
import { rentCarService } from '../../modules/rent-car/services/rentCarService';
import { RentCarKpiBar } from './RentCarKpiBar';
import { RentalFleetGrid } from './RentalFleetGrid';
import { RentCarMap } from './RentCarMap';
import { BookingManagementTab } from './BookingManagementTab';
import { CustomerKycTab } from './CustomerKycTab';
import { SecurityTelematicsTab } from './SecurityTelematicsTab';
import { FinancialTariffTab } from './FinancialTariffTab';
import { RentalContractTab } from './RentalContractTab';
import { RentalDamageInspectionTab } from './RentalDamageInspectionTab';
import { RentalCalendarTab } from './RentalCalendarTab';
import { RentalInvoicePaymentTab } from './RentalInvoicePaymentTab';
import { RentalAnalyticsProfitabilityTab } from './RentalAnalyticsProfitabilityTab';
import { RentalAiIntelligenceTab } from './RentalAiIntelligenceTab';
import { RentalReportsTab } from './RentalReportsTab';

import { CreateBookingModal } from './CreateBookingModal';
import { DigitalHandoverModal } from './DigitalHandoverModal';
import { RemoteImmobilizerModal } from './RemoteImmobilizerModal';
import { CustomerKycModal } from './CustomerKycModal';

import { 
  Car, 
  KeyRound, 
  ShieldCheck, 
  ShieldAlert, 
  DollarSign, 
  Calendar, 
  Map, 
  Plus, 
  Sparkles, 
  RefreshCw,
  Layers,
  Lock,
  FileText,
  Wrench,
  Receipt,
  TrendingUp,
  Brain,
  FileSpreadsheet
} from 'lucide-react';

export type RentCarTabType = 
  | 'inventory' 
  | 'bookings' 
  | 'contracts' 
  | 'calendar' 
  | 'customers' 
  | 'damages' 
  | 'invoices' 
  | 'security' 
  | 'tariff' 
  | 'analytics' 
  | 'ai' 
  | 'reports';

interface RentCarDashboardProps {
  initialSubTab?: RentCarTabType;
}

export const RentCarDashboard: React.FC<RentCarDashboardProps> = ({ initialSubTab = 'inventory' }) => {
  const [activeTab, setActiveTab] = useState<RentCarTabType>(initialSubTab);

  useEffect(() => {
    setActiveTab(initialSubTab);
  }, [initialSubTab]);

  // Module Data States
  const [vehicles, setVehicles] = useState<RentalVehicle[]>(rentCarService.getVehicles());
  const [customers, setCustomers] = useState<RentalCustomer[]>(rentCarService.getCustomers());
  const [bookings, setBookings] = useState<RentalBooking[]>(rentCarService.getBookings());
  const [alerts, setAlerts] = useState<RentalTelemetryAlert[]>(rentCarService.getAlerts());
  const [kpis, setKpis] = useState<RentalFleetKPIs>(rentCarService.getKPIs());
  const [contracts, setContracts] = useState<RentalContract[]>(rentCarService.getContracts());
  const [damages, setDamages] = useState<RentalDamageRecord[]>(rentCarService.getDamages());
  const [invoices, setInvoices] = useState<RentalInvoice[]>(rentCarService.getInvoices());
  const [profitability, setProfitability] = useState<VehicleProfitabilityData[]>(rentCarService.getVehicleProfitability());
  const [aiInsights, setAiInsights] = useState<RentalAiInsight[]>(rentCarService.getAiInsights());
  const [calendarEvents, setCalendarEvents] = useState<RentalCalendarEvent[]>(rentCarService.getCalendarEvents());

  // Modal States
  const [isCreateBookingOpen, setIsCreateBookingOpen] = useState<boolean>(false);
  const [isCustomerKycOpen, setIsCustomerKycOpen] = useState<boolean>(false);
  const [handoverModalConfig, setHandoverModalConfig] = useState<{
    isOpen: boolean;
    booking?: RentalBooking;
    type: 'check_out' | 'check_in';
  }>({ isOpen: false, type: 'check_out' });
  const [immobilizerVehicle, setImmobilizerVehicle] = useState<RentalVehicle | null>(null);
  const [selectedVehicleForMap, setSelectedVehicleForMap] = useState<RentalVehicle | undefined>(vehicles[0]);

  // Subscribe to service state changes
  useEffect(() => {
    const unsubscribe = rentCarService.subscribe(() => {
      setVehicles(rentCarService.getVehicles());
      setCustomers(rentCarService.getCustomers());
      setBookings(rentCarService.getBookings());
      setAlerts(rentCarService.getAlerts());
      setKpis(rentCarService.getKPIs());
      setContracts(rentCarService.getContracts());
      setDamages(rentCarService.getDamages());
      setInvoices(rentCarService.getInvoices());
      setProfitability(rentCarService.getVehicleProfitability());
      setAiInsights(rentCarService.getAiInsights());
      setCalendarEvents(rentCarService.getCalendarEvents());
    });
    return unsubscribe;
  }, []);

  const refreshData = () => {
    setVehicles(rentCarService.getVehicles());
    setCustomers(rentCarService.getCustomers());
    setBookings(rentCarService.getBookings());
    setAlerts(rentCarService.getAlerts());
    setKpis(rentCarService.getKPIs());
    setContracts(rentCarService.getContracts());
    setDamages(rentCarService.getDamages());
    setInvoices(rentCarService.getInvoices());
    setProfitability(rentCarService.getVehicleProfitability());
    setAiInsights(rentCarService.getAiInsights());
    setCalendarEvents(rentCarService.getCalendarEvents());
  };

  const handleOpenHandover = (booking: RentalBooking, type: 'check_out' | 'check_in') => {
    setHandoverModalConfig({
      isOpen: true,
      booking,
      type
    });
  };

  const handleBookVehicleDirect = (vehicle: RentalVehicle) => {
    setSelectedVehicleForMap(vehicle);
    setIsCreateBookingOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Fast Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400">
            <Car className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Rent Car Management System
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                PRO ENTERPRISE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Sistem manajemen rental mobil all-in-one: Booking, Digital Handover 360°, Telematika Geofence, & Starter Kill.
            </p>
          </div>
        </div>

        {/* Global Action CTAs */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={refreshData}
            title="Sinkronisasi Data"
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsCustomerKycOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>KYC Pelanggan</span>
          </button>

          <button
            onClick={() => setIsCreateBookingOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-950"
          >
            <Plus className="w-4 h-4" />
            <span>Reservasi Baru</span>
          </button>
        </div>
      </div>

      {/* Metric KPI Bar */}
      <RentCarKpiBar kpis={kpis} />

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl overflow-x-auto no-scrollbar">
        {[
          { id: 'inventory', label: 'Armada & GPS Live', icon: Car, badge: `${vehicles.length}` },
          { id: 'bookings', label: 'Reservasi & Sewa', icon: KeyRound, badge: `${bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length}` },
          { id: 'contracts', label: 'Kontrak Digital', icon: FileText, badge: `${contracts.length}` },
          { id: 'calendar', label: 'Kalender Sewa', icon: Calendar },
          { id: 'customers', label: 'Pelanggan & AI KYC', icon: ShieldCheck, badge: `${customers.length}` },
          { id: 'damages', label: 'Klaim & Kerusakan', icon: Wrench, badge: `${damages.length}` },
          { id: 'invoices', label: 'Faktur & Piutang', icon: Receipt, badge: `${invoices.length}` },
          { id: 'security', label: 'Anti-Theft & Geofence', icon: ShieldAlert, badge: `${alerts.filter(a => !a.resolved).length > 0 ? alerts.filter(a => !a.resolved).length : undefined}`, badgeDanger: true },
          { id: 'tariff', label: 'Tarif & Deposit', icon: DollarSign },
          { id: 'analytics', label: 'Analitik Laba Rugi', icon: TrendingUp },
          { id: 'ai', label: 'AI Copilot & Radar', icon: Brain },
          { id: 'reports', label: 'Pusat Laporan', icon: FileSpreadsheet }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as RentCarTabType)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  isActive
                    ? 'bg-slate-950 text-cyan-400'
                    : tab.badgeDanger
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-800 text-slate-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Views */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <RentCarMap
            vehicles={vehicles}
            selectedVehicle={selectedVehicleForMap}
            onSelectVehicle={(v) => setSelectedVehicleForMap(v)}
            onOpenImmobilizerModal={(v) => setImmobilizerVehicle(v)}
          />

          <RentalFleetGrid
            vehicles={vehicles}
            onSelectVehicle={(v) => setSelectedVehicleForMap(v)}
            onBookVehicle={handleBookVehicleDirect}
            onOpenImmobilizerModal={(v) => setImmobilizerVehicle(v)}
          />
        </div>
      )}

      {activeTab === 'bookings' && (
        <BookingManagementTab
          bookings={bookings}
          onOpenCreateModal={() => setIsCreateBookingOpen(true)}
          onOpenHandoverModal={handleOpenHandover}
          onSelectBooking={(b) => {
            const v = vehicles.find(veh => veh.id === b.vehicleId);
            if (v) setSelectedVehicleForMap(v);
          }}
        />
      )}

      {activeTab === 'contracts' && (
        <RentalContractTab
          contracts={contracts}
          onRefresh={refreshData}
        />
      )}

      {activeTab === 'calendar' && (
        <RentalCalendarTab
          events={calendarEvents}
          vehicles={vehicles}
        />
      )}

      {activeTab === 'customers' && (
        <CustomerKycTab
          customers={customers}
          onOpenNewCustomerModal={() => setIsCustomerKycOpen(true)}
          onRefresh={refreshData}
        />
      )}

      {activeTab === 'damages' && (
        <RentalDamageInspectionTab
          damages={damages}
          onRefresh={refreshData}
        />
      )}

      {activeTab === 'invoices' && (
        <RentalInvoicePaymentTab
          invoices={invoices}
          onRefresh={refreshData}
        />
      )}

      {activeTab === 'security' && (
        <SecurityTelematicsTab
          vehicles={vehicles}
          alerts={alerts}
          onOpenImmobilizerModal={(v) => setImmobilizerVehicle(v)}
          onRefresh={refreshData}
        />
      )}

      {activeTab === 'tariff' && (
        <FinancialTariffTab
          vehicles={vehicles}
          kpis={kpis}
        />
      )}

      {activeTab === 'analytics' && (
        <RentalAnalyticsProfitabilityTab
          profitabilityData={profitability}
        />
      )}

      {activeTab === 'ai' && (
        <RentalAiIntelligenceTab
          insights={aiInsights}
        />
      )}

      {activeTab === 'reports' && (
        <RentalReportsTab />
      )}

      {/* Modal: Create Booking */}
      {isCreateBookingOpen && (
        <CreateBookingModal
          vehicles={vehicles}
          customers={customers}
          initialVehicle={selectedVehicleForMap}
          onClose={() => setIsCreateBookingOpen(false)}
          onSuccess={() => {
            setIsCreateBookingOpen(false);
            refreshData();
          }}
        />
      )}

      {/* Modal: Customer KYC */}
      {isCustomerKycOpen && (
        <CustomerKycModal
          onClose={() => setIsCustomerKycOpen(false)}
          onSuccess={() => {
            setIsCustomerKycOpen(false);
            refreshData();
          }}
        />
      )}

      {/* Modal: Digital Handover & Damage Inspection */}
      {handoverModalConfig.isOpen && handoverModalConfig.booking && (
        <DigitalHandoverModal
          booking={handoverModalConfig.booking}
          type={handoverModalConfig.type}
          onClose={() => setHandoverModalConfig({ isOpen: false, type: 'check_out' })}
          onSuccess={() => {
            setHandoverModalConfig({ isOpen: false, type: 'check_out' });
            refreshData();
          }}
        />
      )}

      {/* Modal: Remote Immobilizer Starter Kill */}
      {immobilizerVehicle && (
        <RemoteImmobilizerModal
          vehicle={immobilizerVehicle}
          onClose={() => setImmobilizerVehicle(null)}
          onSuccess={() => {
            setImmobilizerVehicle(null);
            refreshData();
          }}
        />
      )}
    </div>
  );
};

