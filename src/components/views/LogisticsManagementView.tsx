import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  Package, 
  FileText, 
  ArrowUpRight, 
  PackageCheck, 
  Layers, 
  QrCode, 
  Waypoints, 
  MapPin, 
  Building2, 
  Shuffle, 
  RotateCcw, 
  AlertOctagon, 
  DollarSign, 
  Sparkles, 
  BarChart3, 
  Download,
  Target,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';
import { logisticsService } from '../../modules/logistics/services/logisticsService';
import { 
  LogisticsOrder, 
  LogisticsManifest, 
  LogisticsHub, 
  PickupTask, 
  CodSettlement, 
  LogisticsExceptionTicket,
  LogisticsTabId
} from '../../modules/logistics/types';

// Import Tabs
import { LogisticsControlTowerTab } from '../logistics/tabs/LogisticsControlTowerTab';
import { LogisticsOrdersTab } from '../logistics/tabs/LogisticsOrdersTab';
import { LogisticsShipmentsTab } from '../logistics/tabs/LogisticsShipmentsTab';
import { LogisticsPickupsTab } from '../logistics/tabs/LogisticsPickupsTab';
import { LogisticsDeliveriesTab } from '../logistics/tabs/LogisticsDeliveriesTab';
import { LogisticsManifestsTab } from '../logistics/tabs/LogisticsManifestsTab';
import { LogisticsPackagesTab } from '../logistics/tabs/LogisticsPackagesTab';
import { LogisticsRoutePlanningTab } from '../logistics/tabs/LogisticsRoutePlanningTab';
import { LogisticsLiveTrackingTab } from '../logistics/tabs/LogisticsLiveTrackingTab';
import { LogisticsHubWarehouseTab } from '../logistics/tabs/LogisticsHubWarehouseTab';
import { LogisticsSortationTab } from '../logistics/tabs/LogisticsSortationTab';
import { LogisticsReturnsTab } from '../logistics/tabs/LogisticsReturnsTab';
import { LogisticsExceptionsTab } from '../logistics/tabs/LogisticsExceptionsTab';
import { LogisticsCodTab } from '../logistics/tabs/LogisticsCodTab';
import { LogisticsCustomerCrmTab } from '../logistics/tabs/LogisticsCustomerCrmTab';
import { LogisticsSlaRadarTab } from '../logistics/tabs/LogisticsSlaRadarTab';
import { LogisticsAnalyticsTab } from '../logistics/tabs/LogisticsAnalyticsTab';
import { LogisticsAiDispatcherTab } from '../logistics/tabs/LogisticsAiDispatcherTab';
import { LogisticsReportsTab } from '../logistics/tabs/LogisticsReportsTab';

interface LogisticsManagementViewProps {
  initialTab?: LogisticsTabId;
}

export const LogisticsManagementView: React.FC<LogisticsManagementViewProps> = ({ 
  initialTab = 'control-tower' 
}) => {
  const [activeTab, setActiveTab] = useState<LogisticsTabId>(initialTab);
  
  // Data States
  const [orders, setOrders] = useState<LogisticsOrder[]>(() => logisticsService.getOrders());
  const [manifests, setManifests] = useState<LogisticsManifest[]>(() => logisticsService.getManifests());
  const [hubs, setHubs] = useState<LogisticsHub[]>(() => logisticsService.getHubs());
  const [pickups, setPickups] = useState<PickupTask[]>(() => logisticsService.getPickups());
  const [settlements, setSettlements] = useState<CodSettlement[]>(() => logisticsService.getSettlements());
  const [tickets, setTickets] = useState<LogisticsExceptionTicket[]>(() => logisticsService.getTickets());

  // Modals & Details
  const [selectedOrder, setSelectedOrder] = useState<LogisticsOrder | null>(null);

  // Sync initial tab when props change
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Load Data from Service
  useEffect(() => {
    refreshAllData();
  }, []);

  const refreshAllData = () => {
    setOrders(logisticsService.getOrders());
    setManifests(logisticsService.getManifests());
    setHubs(logisticsService.getHubs());
    setPickups(logisticsService.getPickups());
    setSettlements(logisticsService.getSettlements());
    setTickets(logisticsService.getTickets());
  };

  const handleCreateOrder = (orderData: Partial<LogisticsOrder>) => {
    logisticsService.createOrder(orderData);
    refreshAllData();
  };

  const handleUpdateOrderStatus = (id: string, status: LogisticsOrder['status'], epod?: LogisticsOrder['epod']) => {
    logisticsService.updateOrderStatus(id, status, epod);
    refreshAllData();
  };

  const handleCreateManifest = (manifestData: Partial<LogisticsManifest>) => {
    logisticsService.createManifest(manifestData);
    refreshAllData();
  };

  // Tab definitions
  const tabs = [
    { id: 'control-tower', label: 'Menara Kendali (Control Tower)', icon: Target },
    { id: 'orders', label: 'Order Pengiriman', icon: Package },
    { id: 'shipments', label: 'Surat Jalan & Resi', icon: FileText },
    { id: 'pickups', label: 'Pickup & First-Mile', icon: ArrowUpRight },
    { id: 'deliveries', label: 'Last-Mile & ePOD', icon: PackageCheck },
    { id: 'manifests', label: 'Manifest & Konsolidasi', icon: Boxes },
    { id: 'packages', label: 'Barcode Scanner & Koli', icon: QrCode },
    { id: 'routes', label: 'Perencanaan Rute', icon: Waypoints },
    { id: 'live-tracking', label: 'Live GPS Tracking', icon: MapPin },
    { id: 'hubs', label: 'Hub & Transit Depo', icon: Building2 },
    { id: 'sortation', label: 'Sortation & Staging', icon: Shuffle },
    { id: 'returns', label: 'Retur Pengirim (RTS)', icon: RotateCcw },
    { id: 'exceptions', label: 'Kendala & Tiket', icon: AlertOctagon },
    { id: 'cod', label: 'COD & Rekonsiliasi Kas', icon: DollarSign },
    { id: 'customers', label: 'Merchant B2B & CRM', icon: Building2 },
    { id: 'sla', label: 'Radar Kepatuhan SLA', icon: Target },
    { id: 'analytics', label: 'Analitik Biaya Tonase', icon: BarChart3 },
    { id: 'ai-dispatcher', label: 'AI Logistics Copilot', icon: Sparkles },
    { id: 'reports', label: 'Pusat Laporan & Ekspor', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner & Module Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold backdrop-blur-sm border border-blue-400/20">
            <Boxes className="w-3.5 h-3.5" />
            Enterprise Logistics & Freight Transportation Management System (TMS)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Logistics & Cargo Control Center
          </h1>
          <p className="text-blue-200 text-xs sm:text-sm max-w-2xl">
            Sistem terintegrasi end-to-end logistik nusantara: Sales Booking, Surat Jalan Kemenhub, Cross-Docking Hub, Linehaul Trucking, Multi-Drop Last Mile ePOD, dan Rekonsiliasi COD Merchant.
          </p>
        </div>
      </div>

      {/* Navigation Pills Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as LogisticsTabId)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View Rendering */}
      <div>
        {activeTab === 'control-tower' && (
          <LogisticsControlTowerTab 
            kpis={logisticsService.getKPIs()}
            orders={orders} 
            manifests={manifests} 
            hubs={hubs} 
            onSelectOrder={(ord) => setSelectedOrder(ord)} 
            onNavigateTab={(tab) => setActiveTab(tab as any)}
          />
        )}

        {activeTab === 'orders' && (
          <LogisticsOrdersTab 
            orders={orders} 
            onSelectOrder={(ord) => setSelectedOrder(ord)} 
            onCreateOrder={handleCreateOrder} 
          />
        )}

        {activeTab === 'shipments' && (
          <LogisticsShipmentsTab 
            orders={orders} 
            onSelectOrder={(ord) => setSelectedOrder(ord)} 
          />
        )}

        {activeTab === 'pickups' && (
          <LogisticsPickupsTab pickups={pickups} />
        )}

        {activeTab === 'deliveries' && (
          <LogisticsDeliveriesTab 
            orders={orders} 
            onUpdateStatus={handleUpdateOrderStatus} 
          />
        )}

        {activeTab === 'manifests' && (
          <LogisticsManifestsTab 
            manifests={manifests} 
            orders={orders} 
            hubs={hubs} 
            onCreateManifest={handleCreateManifest} 
          />
        )}

        {activeTab === 'packages' && (
          <LogisticsPackagesTab 
            orders={orders} 
            onSelectOrder={(ord) => setSelectedOrder(ord)} 
          />
        )}

        {activeTab === 'routes' && (
          <LogisticsRoutePlanningTab 
            orders={orders} 
            hubs={hubs} 
          />
        )}

        {activeTab === 'live-tracking' && (
          <LogisticsLiveTrackingTab 
            manifests={manifests} 
            orders={orders} 
          />
        )}

        {activeTab === 'hubs' && (
          <LogisticsHubWarehouseTab hubs={hubs} />
        )}

        {activeTab === 'sortation' && (
          <LogisticsSortationTab orders={orders} />
        )}

        {activeTab === 'returns' && (
          <LogisticsReturnsTab 
            orders={orders} 
            onSelectOrder={(ord) => setSelectedOrder(ord)} 
          />
        )}

        {activeTab === 'exceptions' && (
          <LogisticsExceptionsTab tickets={tickets} />
        )}

        {activeTab === 'cod' && (
          <LogisticsCodTab settlements={settlements} />
        )}

        {activeTab === 'customers' && (
          <LogisticsCustomerCrmTab orders={orders} />
        )}

        {activeTab === 'sla' && (
          <LogisticsSlaRadarTab orders={orders} />
        )}

        {activeTab === 'analytics' && (
          <LogisticsAnalyticsTab orders={orders} />
        )}

        {activeTab === 'ai-dispatcher' && (
          <LogisticsAiDispatcherTab orders={orders} hubs={hubs} />
        )}

        {activeTab === 'reports' && (
          <LogisticsReportsTab orders={orders} />
        )}
      </div>

      {/* Global Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">RES-CONNOTE • {selectedOrder.serviceType}</span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{selectedOrder.connoteNumber}</h3>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tracking Status Badge */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <div className="text-slate-400 text-[10px] font-semibold">STATUS SAAT INI</div>
                <div className="font-extrabold text-slate-900 dark:text-white text-sm">{selectedOrder.status.replace(/_/g, ' ')}</div>
              </div>
              <div className="text-right">
                <div className="text-slate-400 text-[10px] font-semibold">ESTIMASI TIBA (SLA)</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {selectedOrder.estimatedDeliveryAt ? new Date(selectedOrder.estimatedDeliveryAt).toLocaleString('id-ID') : '-'}
                </div>
              </div>
            </div>

            {/* Shipper & Consignee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400">1. Pengirim (Shipper)</div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">{selectedOrder.shipperName}</div>
                <div className="text-slate-500">{selectedOrder.shipperAddress}, {selectedOrder.shipperCity}</div>
                <div className="text-blue-600 dark:text-blue-400 font-medium">📞 {selectedOrder.shipperPhone}</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400">2. Penerima (Consignee)</div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">{selectedOrder.consigneeName}</div>
                <div className="text-slate-500">{selectedOrder.consigneeAddress}, {selectedOrder.consigneeCity} ({selectedOrder.consigneePostalCode})</div>
                <div className="text-blue-600 dark:text-blue-400 font-medium">📞 {selectedOrder.consigneePhone}</div>
              </div>
            </div>

            {/* Package Items */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Daftar Koli ({selectedOrder.items?.length || 0} Item • Total {selectedOrder.totalWeightKg} kg)
              </h4>
              <div className="space-y-2 text-xs">
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{it.name}</span>
                      <div className="text-[11px] text-slate-400">{it.sku} • {it.dimensions.lengthCm}x{it.dimensions.widthCm}x{it.dimensions.heightCm} cm</div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{it.weightKg} kg</span>
                      <div className="text-[11px] text-slate-400">{it.qty} Qty</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracing Info */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Histori Lacak Perjalanan</h4>
              <div className="border-l-2 border-blue-500 ml-2 pl-4 space-y-4 text-xs">
                <div className="relative">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute -left-[21px] top-1" />
                  <div className="font-bold text-slate-800 dark:text-slate-200">ORDER DIBUAT • {selectedOrder.originHubName}</div>
                  <div className="text-[11px] text-slate-400">{new Date(selectedOrder.createdAt).toLocaleString('id-ID')} • Resi connote terbit di sistem TMS</div>
                </div>
                {selectedOrder.pickedUpAt && (
                  <div className="relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute -left-[21px] top-1" />
                    <div className="font-bold text-slate-800 dark:text-slate-200">PICKUP SELESAI • {selectedOrder.shipperCity}</div>
                    <div className="text-[11px] text-slate-400">{new Date(selectedOrder.pickedUpAt).toLocaleString('id-ID')} • Diambil oleh driver {selectedOrder.assignedDriverName || 'Kurir First-Mile'}</div>
                  </div>
                )}
                {selectedOrder.deliveredAt && (
                  <div className="relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[21px] top-1" />
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">TERKIRIM (DELIVERED) • {selectedOrder.destinationHubName}</div>
                    <div className="text-[11px] text-slate-400">{new Date(selectedOrder.deliveredAt).toLocaleString('id-ID')} • Diterima oleh {selectedOrder.epod?.receivedBy || selectedOrder.consigneeName}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
