/**
 * Fleet Intelligence Smart AI - Centralized Dynamic Navigation Configuration
 * Enforces RBAC permissions across all navigation items
 */

import { ActiveView } from '../context/FleetContext';
import { 
  LayoutDashboard, 
  MapPin, 
  Truck, 
  FolderTree,
  Building2,
  Briefcase,
  Users, 
  Navigation, 
  Map, 
  Fuel, 
  Wrench, 
  ShieldAlert, 
  Bell, 
  Sparkles, 
  BarChart3, 
  FileText, 
  Settings,
  FolderCheck,
  UserCheck,
  Radio,
  Server,
  ShieldCheck,
  Cpu,
  Activity,
  CreditCard,
  Network,
  DownloadCloud,
  LucideIcon,
  Route,
  Waypoints,
  PackageCheck,
  ClipboardCheck,
  Brain,
  Zap,
  Workflow,
  Layers,
  ListChecks,
  AlertTriangle,
  Sliders,
  DollarSign,
  Crown,
  Code2,
  Smartphone,
  Radar,
  Shield,
  FileSpreadsheet,
  Lock,
  Car,
  KeyRound,
  Calendar,
  Receipt,
  TrendingUp
} from 'lucide-react';

export interface NavItemConfig {
  id: ActiveView;
  label: string;
  icon: LucideIcon;
  permission: string; // Permission key required to view item e.g. "vehicle.view"
  badgeType?: 'moving' | 'overdue_maintenance' | 'unread_alerts';
}

export interface NavGroupConfig {
  title?: string;
  items: NavItemConfig[];
}

export const NAVIGATION_CONFIG: NavGroupConfig[] = [
  {
    items: [
      { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard, permission: 'dashboard.view' },
      { id: 'executive_dashboard', label: 'Executive Dashboard (Direksi)', icon: Crown, permission: 'executive.dashboard.view' },
      { id: 'executive_report', label: 'Laporan Eksekutif C-Level (AI)', icon: FileSpreadsheet, permission: 'executive.dashboard.view' },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { id: 'command_center', label: 'Command Center (Control Room)', icon: Radar, permission: 'command_center.view', badgeType: 'unread_alerts' },
      { id: 'driver_mobile', label: 'Driver Mobile App', icon: Smartphone, permission: 'trip.view', badgeType: 'moving' },
      { id: 'live_tracking', label: 'Live GPS Tracking', icon: MapPin, permission: 'tracking.view', badgeType: 'moving' },
      { id: 'inspection', label: 'Vehicle Inspection (Pre-Trip)', icon: ClipboardCheck, permission: 'inspection.view' },
      { id: 'planned_trips', label: 'Trip Management', icon: Navigation, permission: 'trip.view' },
      { id: 'deliveries', label: 'Delivery & POD', icon: PackageCheck, permission: 'trip.view' },
      { id: 'routes', label: 'Route Management', icon: Waypoints, permission: 'route.view' },
      { id: 'geofence', label: 'Geofencing', icon: Map, permission: 'geofence.view' },
      { id: 'trips', label: 'Trip History', icon: Route, permission: 'trip.view' },
    ],
  },
  {
    title: 'RENT CAR MANAGEMENT',
    items: [
      { id: 'rent_car', label: 'Armada & GPS Live', icon: Car, permission: 'vehicle.view' },
      { id: 'rent_car_bookings', label: 'Reservasi & Sewa', icon: KeyRound, permission: 'vehicle.view' },
      { id: 'rent_car_contracts', label: 'Kontrak Digital', icon: FileText, permission: 'vehicle.view' },
      { id: 'rent_car_calendar', label: 'Kalender Sewa', icon: Calendar, permission: 'vehicle.view' },
      { id: 'rent_car_customers', label: 'Pelanggan & AI KYC', icon: ShieldCheck, permission: 'vehicle.view' },
      { id: 'rent_car_damages', label: 'Klaim & Kerusakan', icon: Wrench, permission: 'vehicle.view' },
      { id: 'rent_car_invoices', label: 'Faktur & Piutang', icon: Receipt, permission: 'vehicle.view' },
      { id: 'rent_car_security', label: 'Anti-Theft & Geofence', icon: ShieldAlert, permission: 'vehicle.view' },
      { id: 'rent_car_tariffs', label: 'Tarif & Deposit', icon: DollarSign, permission: 'vehicle.view' },
      { id: 'rent_car_analytics', label: 'Analitik Laba Rugi', icon: TrendingUp, permission: 'vehicle.view' },
      { id: 'rent_car_ai', label: 'AI Copilot & Radar', icon: Brain, permission: 'vehicle.view' },
      { id: 'rent_car_reports', label: 'Pusat Laporan Rental', icon: FileSpreadsheet, permission: 'vehicle.view' },
    ],
  },
  {
    title: 'ARMADA & MASTER DATA',
    items: [
      { id: 'vehicles', label: 'Kendaraan & Master GPS', icon: Truck, permission: 'vehicle.view' },
      { id: 'vehicle_groups', label: 'Grup Kendaraan', icon: FolderTree, permission: 'vehicle.view' },
      { id: 'branches', label: 'Cabang & Depo', icon: Building2, permission: 'vehicle.view' },
      { id: 'departments', label: 'Departemen', icon: Briefcase, permission: 'vehicle.view' },
      { id: 'drivers', label: 'Pengemudi (Drivers)', icon: Users, permission: 'driver.view' },
    ],
  },
  {
    title: 'ORGANISASI & MULTI-TENANT',
    items: [
      { id: 'organizations', label: 'Struktur Organisasi & Tree', icon: Layers, permission: 'settings.view' },
      { id: 'tenants', label: 'Perusahaan SaaS (Tenants)', icon: Building2, permission: 'settings.view' },
      { id: 'fleets', label: 'Sub-Grup Armada (Fleets)', icon: Truck, permission: 'vehicle.view' },
      { id: 'security_isolation', label: 'Security & Isolation Lab', icon: ShieldCheck, permission: 'settings.view' },
    ],
  },
  {
    title: 'GPS & DEVICE MANAGEMENT',
    items: [
      { id: 'gps_devices', label: 'GPS Devices', icon: Cpu, permission: 'gps.device.view' },
      { id: 'gps_integration', label: 'Protocol Abstraction', icon: Network, permission: 'gps.protocol.view' },
      { id: 'gps_health', label: 'Device Health', icon: Activity, permission: 'gps.device.view' },
      { id: 'gps_sims', label: 'SIM Cards', icon: CreditCard, permission: 'gps.sim.view' },
      { id: 'gps_protocols', label: 'Protocols', icon: Network, permission: 'gps.protocol.view' },
      { id: 'gps_firmware', label: 'Firmware', icon: DownloadCloud, permission: 'gps.firmware.view' },
    ],
  },
  {
    title: 'TELEMATIKA & EFISIENSI',
    items: [
      { id: 'fuel', label: 'Monitoring BBM', icon: Fuel, permission: 'fuel.view' },
      { id: 'maintenance', label: 'Pemeliharaan (WO)', icon: Wrench, permission: 'maintenance.view', badgeType: 'overdue_maintenance' },
      { id: 'cost_analytics', label: 'Analisis Biaya & TOC/TCO', icon: DollarSign, permission: 'cost.view' },
      { id: 'safety', label: 'Keselamatan (Safety)', icon: ShieldAlert, permission: 'safety.view' },
      { id: 'fatigue', label: 'Manajemen Kelelahan', icon: Activity, permission: 'safety.view' },
      { id: 'alerts', label: 'Peringatan System', icon: Bell, permission: 'alert.view', badgeType: 'unread_alerts' },
    ],
  },
  {
    title: 'INTELLIGENCE & LAPORAN',
    items: [
      { id: 'daily_briefing', label: 'AI Fleet Daily Briefing', icon: Sparkles, permission: 'ai.view' },
      { id: 'fleet_assistant', label: 'AI Fleet Assistant', icon: Sparkles, permission: 'ai.view' },
      { id: 'route_intelligence', label: 'AI Route & ETA Intelligence', icon: Navigation, permission: 'ai.view' },
      { id: 'fleet_intelligence', label: 'AI Fleet Intelligence', icon: Brain, permission: 'ai.view' },
      { id: 'driver_intelligence', label: 'AI Driver Intelligence', icon: UserCheck, permission: 'driver.intelligence.view' },
      { id: 'fuel_intelligence', label: 'AI Fuel Intelligence', icon: Fuel, permission: 'fuel.view' },
      { id: 'maintenance_intelligence', label: 'AI Predictive Maintenance', icon: Wrench, permission: 'maintenance.view' },
      { id: 'safety_intelligence', label: 'AI Safety Intelligence', icon: ShieldCheck, permission: 'safety.view' },
      { id: 'ai_intelligence', label: 'AI Copilot & Hub', icon: Sparkles, permission: 'ai.view' },
      { id: 'analytics', label: 'Analitik & KPI', icon: BarChart3, permission: 'analytics.view' },
      { id: 'reports', label: 'Laporan Otomatis', icon: FileText, permission: 'report.view' },
      { id: 'documents', label: 'Dokumen & Legalitas AI', icon: FolderCheck, permission: 'document.view' },
    ],
  },
  {
    title: 'AI AUTOMATION ENGINE',
    items: [
      { id: 'automation', label: 'Automation Dashboard', icon: Zap, permission: 'automation.view' },
      { id: 'automation_workflows', label: 'Workflows', icon: Workflow, permission: 'automation.view' },
      { id: 'automation_templates', label: 'Templates', icon: Layers, permission: 'automation.view' },
      { id: 'automation_logs', label: 'Execution Logs', icon: ListChecks, permission: 'automation.view' },
      { id: 'automation_failed', label: 'Failed Automations', icon: AlertTriangle, permission: 'automation.view' },
      { id: 'automation_settings', label: 'Settings', icon: Sliders, permission: 'automation.view' },
    ],
  },
  {
    title: 'PENGATURAN & OTORISASI',
    items: [
      { id: 'users', label: 'Pengguna & Role', icon: UserCheck, permission: 'user.view' },
      { id: 'roles_permissions', label: 'Matriks Role & RBAC', icon: ShieldCheck, permission: 'role.view' },
      { id: 'enterprise_security', label: 'Enterprise Security Center', icon: Lock, permission: 'security.view' },
      { id: 'audit', label: 'Audit Trail & Activity Log', icon: Shield, permission: 'audit.view' },
      { id: 'subscription', label: 'Langganan & Billing', icon: CreditCard, permission: 'billing.view' },
      { id: 'developer_portal', label: 'Developer API & Webhooks', icon: Code2, permission: 'settings.view' },
      { id: 'gps_server', label: 'GPS Server & Supabase', icon: Server, permission: 'integration.view' },
      { id: 'integrations', label: 'Gateway GPS IoT', icon: Radio, permission: 'integration.view' },
      { id: 'settings', label: 'Pengaturan Tenant', icon: Settings, permission: 'settings.view' },
    ],
  },
  {
    title: 'SUPER ADMIN ROOT',
    items: [
      { id: 'super_admin', label: 'Super Admin Control Center', icon: ShieldAlert, permission: 'admin.company.manage' },
    ],
  },
];
