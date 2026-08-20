/**
 * Fleet Intelligence Smart AI - Global Fleet State Context Provider
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, Driver, Trip, AlertNotification, Geofence, MaintenanceWorkOrder, AIInsight, UserProfile, TenantCompany, Branch, GPSDevice } from '../types';
import { mockVehicles, mockDrivers, mockTrips, mockAlerts, mockGeofences, mockMaintenanceOrders, mockAIInsights, mockUser, mockTenant, mockBranches, mockGpsDevices } from '../constants/mockData';
import { gpsSimulator } from '../services/gpsSimulator';

export type ActiveView = 
  | 'command_center'
  | 'executive_dashboard'
  | 'executive_report'
  | 'executive_print'
  | 'dashboard'
  | 'live_tracking'
  | 'inspection'
  | 'vehicles'
  | 'vehicle_groups'
  | 'organizations'
  | 'tenants'
  | 'branches'
  | 'departments'
  | 'fleets'
  | 'security_isolation'
  | 'drivers'
  | 'trips'
  | 'planned_trips'
  | 'routes'
  | 'geofence'
  | 'deliveries'
  | 'rent_car'
  | 'rent_car_bookings'
  | 'rent_car_contracts'
  | 'rent_car_calendar'
  | 'rent_car_customers'
  | 'rent_car_damages'
  | 'rent_car_invoices'
  | 'rent_car_security'
  | 'rent_car_tariffs'
  | 'rent_car_analytics'
  | 'rent_car_ai'
  | 'rent_car_reports'
  | 'rent_car_inspection'
  | 'rent_car_crm'
  | 'rent_car_telematics'
  | 'fuel'
  | 'maintenance'
  | 'safety'
  | 'fatigue'
  | 'cost_analytics'
  | 'alerts'
  | 'notifications'
  | 'route_intelligence'
  | 'fleet_intelligence'
  | 'driver_intelligence'
  | 'fuel_intelligence'
  | 'maintenance_intelligence'
  | 'safety_intelligence'
  | 'daily_briefing'
  | 'fleet_daily_briefing'
  | 'fleet_assistant'
  | 'ai_intelligence'
  | 'automation'
  | 'automation_workflows'
  | 'automation_builder'
  | 'automation_templates'
  | 'automation_logs'
  | 'automation_failed'
  | 'automation_settings'
  | 'analytics'
  | 'reports'
  | 'documents'
  | 'users'
  | 'roles_permissions'
  | 'integrations'
  | 'settings'
  | 'profile'
  | 'gps_devices'
  | 'gps_integration'
  | 'gps_server'
  | 'gps_server_dashboard'
  | 'gps_health'
  | 'gps_sims'
  | 'gps_protocols'
  | 'gps_firmware'
  | 'developer_portal'
  | 'external_api'
  | 'subscription'
  | 'super_admin'
  | 'driver_mobile'
  | 'audit'
  | 'enterprise_security'
  | 'security';

export interface AppNotification {
  id: string;
  userId: string;
  tenantId: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL' | 'SYSTEM' | 'SECURITY';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  category?: string;
}

interface FleetContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  alerts: AlertNotification[];
  geofences: Geofence[];
  maintenanceOrders: MaintenanceWorkOrder[];
  aiInsights: AIInsight[];
  currentUser: UserProfile;
  currentTenant: TenantCompany;
  setCurrentTenant: (tenant: TenantCompany) => void;
  branches: Branch[];
  gpsDevices: GPSDevice[];
  selectedBranchId: string;
  setSelectedBranchId: (id: string) => void;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isOrganizationModalOpen: boolean;
  setIsOrganizationModalOpen: (open: boolean) => void;
  isKeyboardShortcutsOpen: boolean;
  setIsKeyboardShortcutsOpen: (open: boolean) => void;
  unreadAlertsCount: number;
  markAlertRead: (id: string) => void;
  notificationsList: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  isGpsSimRunning: boolean;
  toggleGpsSimulator: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (open: boolean) => void;
  userRoleMode: 'fleet_manager' | 'driver';
  setUserRoleMode: (role: 'fleet_manager' | 'driver') => void;
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

export const FleetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [drivers] = useState<Driver[]>(mockDrivers);
  const [trips] = useState<Trip[]>(mockTrips);
  const [alerts, setAlerts] = useState<AlertNotification[]>(mockAlerts);
  const [geofences] = useState<Geofence[]>(mockGeofences);
  const [maintenanceOrders] = useState<MaintenanceWorkOrder[]>(mockMaintenanceOrders);
  const [aiInsights] = useState<AIInsight[]>(mockAIInsights);
  const [currentUser] = useState<UserProfile>(mockUser);
  const [currentTenant, setCurrentTenant] = useState<TenantCompany>(mockTenant);
  const [branches] = useState<Branch[]>(mockBranches);
  const [gpsDevices] = useState<GPSDevice[]>(mockGpsDevices || []);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(mockVehicles[0]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(mockVehicles[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isOrganizationModalOpen, setIsOrganizationModalOpen] = useState<boolean>(false);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState<boolean>(false);
  const [isGpsSimRunning, setIsGpsSimRunning] = useState<boolean>(true);
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('fleet_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState<boolean>(false);
  const [userRoleMode, setUserRoleMode] = useState<'fleet_manager' | 'driver'>('fleet_manager');

  const [notificationsList, setNotificationsList] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      userId: 'user-1',
      tenantId: 'tenant-1',
      type: 'CRITICAL',
      title: 'Peringatan Overspeed Tinggi',
      message: 'Kendaraan Truk Wingbox B 9876 XYZ melebihi batas 100 km/jam di Tol Cipali.',
      timestamp: '2 menit yang lalu',
      read: false,
      category: 'telematics',
      actionUrl: '/app/alerts',
    },
    {
      id: 'notif-2',
      userId: 'user-1',
      tenantId: 'tenant-1',
      type: 'WARNING',
      title: 'Jadwal Servis Berkala WO-000124',
      message: 'Unit Hino Ranger B 1234 ABC memasuki batas jarak tempuh servis 10.000 KM.',
      timestamp: '15 menit yang lalu',
      read: false,
      category: 'maintenance',
      actionUrl: '/app/maintenance',
    },
    {
      id: 'notif-3',
      userId: 'user-1',
      tenantId: 'tenant-1',
      type: 'WARNING',
      title: 'Terdeteksi Anomali BBM (Fuel Drop)',
      message: 'Penurunan mendadak 35 Liter BBM pada tangki B 4567 DEF saat durasi parkir depot.',
      timestamp: '1 jam yang lalu',
      read: false,
      category: 'fuel',
      actionUrl: '/app/fuel',
    },
    {
      id: 'notif-4',
      userId: 'user-1',
      tenantId: 'tenant-1',
      type: 'INFO',
      title: 'Laporan Perjalanan Harian Siap',
      message: 'Rekapitulasi log pengiriman cabang Surabaya tanggal 14 Agustus telah diterbitkan.',
      timestamp: '3 jam yang lalu',
      read: true,
      category: 'reports',
      actionUrl: '/app/reports',
    },
    {
      id: 'notif-5',
      userId: 'user-1',
      tenantId: 'tenant-1',
      type: 'SECURITY',
      title: 'Sesi Login Selesai Diproyeksikan',
      message: 'Otentikasi 2FA berhasil diverifikasi untuk alamat IP 182.253.120.45.',
      timestamp: 'Kemarin, 18:30',
      read: true,
      category: 'security',
      actionUrl: '/app/settings',
    },
  ]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('fleet_sidebar_collapsed', String(next));
      } catch (err) {
        console.warn('Could not save sidebar state', err);
      }
      return next;
    });
  };

  const markNotificationRead = (id: string) => {
    setNotificationsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotificationsList((prev) => prev.filter((n) => n.id !== id));
  };

  // Initialize & subscribe to GPS Simulator
  useEffect(() => {
    gpsSimulator.init(mockVehicles);
    gpsSimulator.start(3000);

    const unsubscribe = gpsSimulator.subscribe((updatedVehicles) => {
      setVehicles(updatedVehicles);
      // Keep selected vehicle telemetry fresh
      if (selectedVehicle) {
        const found = updatedVehicles.find((v) => v.id === selectedVehicle.id);
        if (found) setSelectedVehicle(found);
      }
    });

    return () => {
      unsubscribe();
      gpsSimulator.stop();
    };
  }, []);

  const toggleGpsSimulator = () => {
    if (isGpsSimRunning) {
      gpsSimulator.stop();
      setIsGpsSimRunning(false);
    } else {
      gpsSimulator.start(3000);
      setIsGpsSimRunning(true);
    }
  };

  const markAlertRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <FleetContext.Provider
      value={{
        activeView,
        setActiveView,
        vehicles,
        drivers,
        trips,
        alerts,
        geofences,
        maintenanceOrders,
        aiInsights,
        currentUser,
        currentTenant,
        setCurrentTenant,
        branches,
        gpsDevices,
        selectedBranchId,
        setSelectedBranchId,
        selectedVehicle,
        setSelectedVehicle,
        selectedVehicleId,
        setSelectedVehicleId,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isOrganizationModalOpen,
        setIsOrganizationModalOpen,
        isKeyboardShortcutsOpen,
        setIsKeyboardShortcutsOpen,
        unreadAlertsCount,
        markAlertRead,
        notificationsList,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        isGpsSimRunning,
        toggleGpsSimulator,
        isSidebarCollapsed,
        toggleSidebar,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isFilterSheetOpen,
        setIsFilterSheetOpen,
        userRoleMode,
        setUserRoleMode,
      }}
    >
      {children}
    </FleetContext.Provider>
  );
};

export const useFleet = () => {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error('useFleet must be used within a FleetProvider');
  }
  return context;
};
