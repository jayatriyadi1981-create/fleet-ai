/**
 * Fleet Intelligence Smart AI - Root Application & Authentication Routing Architecture
 * PROMPT 6 - Role-Based Access Control (RBAC) & Authorization Architecture
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FleetProvider, useFleet } from './context/FleetContext';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { LandingPage } from './components/pages/LandingPage';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { ForgotPasswordPage } from './components/pages/ForgotPasswordPage';
import { ResetPasswordPage } from './components/pages/ResetPasswordPage';
import { VerifyEmailPage } from './components/pages/VerifyEmailPage';
import { VerifyOtpPage } from './components/pages/VerifyOtpPage';
import { Setup2faPage } from './components/pages/Setup2faPage';
import { Verify2faPage } from './components/pages/Verify2faPage';
import { AuthCallbackPage } from './components/pages/AuthCallbackPage';
import { ForbiddenPage } from './components/pages/ForbiddenPage';

import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { AIDrawer } from './components/layout/AIDrawer';
import { CommandPalette } from './components/layout/CommandPalette';

import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { ExecutiveDashboardView, ExecutivePrintView } from './modules/executive';
import { ExecutiveReportDashboard } from './components/executive-report/ExecutiveReportDashboard';
import { LiveTrackingView } from './components/live-tracking/LiveTrackingView';
import { TelematicsMap } from './components/maps/TelematicsMap';
import { VehiclesView } from './components/views/VehiclesView';
import { DriversMainView } from './components/drivers/DriversMainView';
import { TripHistoryView } from './components/trip-history/TripHistoryView';
import { TripManagementMainView } from './components/trip-management/TripManagementMainView';
import { TripsView } from './components/views/TripsView';
import { FuelView } from './components/views/FuelView';
import { MaintenanceView } from './components/views/MaintenanceView';
import { SafetyView } from './components/views/SafetyView';
import { FatigueView } from './modules/fatigue/components/FatigueView';
import { AlertsView } from './components/views/AlertsView';
import { AIIntelligenceView } from './components/views/AIIntelligenceView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { DocumentsView } from './components/views/DocumentsView';
import { UsersView } from './components/views/UsersView';
import { RoleManagementView } from './components/views/RoleManagementView';
import { IntegrationsView } from './components/views/IntegrationsView';
import { NotificationView } from './components/notifications/NotificationView';
import { UserProfileView } from './components/pages/UserProfileView';
import { GpsDevicesView } from './components/gps/GpsDevicesView';
import { GPSIntegrationMainView } from './components/gps/integration/GPSIntegrationMainView';
import { GpsServerDashboardView } from './components/gps-server/GpsServerDashboardView';
import { RouteManagementView } from './components/views/RouteManagementView';
import { GeofenceManagementView } from './components/views/GeofenceManagementView';
import { DeliveryManagementView } from './components/views/DeliveryManagementView';
import { InspectionMainView } from './modules/inspection/components/InspectionMainView';
import { DriverMobileMainView } from './modules/driver-mobile/DriverMobileMainView';
import { CommandCenterMainView } from './modules/command-center/CommandCenterMainView';
import { FleetIntelligenceView } from './modules/fleet-intelligence/components/FleetIntelligenceView';
import { RouteIntelligenceView } from './modules/route-intelligence/RouteIntelligenceView';
import { DriverIntelligenceView } from './modules/driver-intelligence/DriverIntelligenceView';
import { FuelIntelligenceView } from './modules/fuel-intelligence/FuelIntelligenceView';
import { MaintenanceIntelligenceView } from './modules/maintenance-intelligence/MaintenanceIntelligenceView';
import { SafetyIntelligenceView } from './modules/safety-intelligence/components/SafetyIntelligenceView';
import { FleetAssistantMainView } from './modules/fleet-assistant/components/FleetAssistantMainView';
import { AutomationMainView } from './modules/automation/components/AutomationMainView';
import { CostModule } from './modules/cost/CostModule';
import { OrganizationSwitcherModal } from './components/common/OrganizationSwitcherModal';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { OrganizationProvider } from './context/OrganizationContext';
import { OrganizationMainView } from './components/organization/OrganizationMainView';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { SubscriptionMainView } from './components/subscription/SubscriptionMainView';
import { SuperAdminMainView } from './components/super-admin/SuperAdminMainView';
import { ImpersonationBanner } from './components/super-admin/ImpersonationBanner';
import { NetworkStatusBanner } from './components/common/NetworkStatusBanner';
import { DeveloperPortalMainView } from './components/developer/DeveloperPortalMainView';
import { DailyBriefingView } from './components/daily-briefing/DailyBriefingView';
import { AuditMainView } from './modules/audit/components/AuditMainView';
import { SecurityCenterMainView } from './modules/security/components/SecurityCenterMainView';
import { RentCarDashboard } from './components/rent-car/RentCarDashboard';
import { LogisticsManagementView } from './components/views/LogisticsManagementView';
import { BusManagementView } from './components/views/BusManagementView';
import { HeavyEquipmentManagementView } from './components/views/HeavyEquipmentManagementView';
import { MiningManagementView } from './components/mining/MiningManagementView';
import { PudManagementView } from './components/views/PudManagementView';
import { DtmsManagementView } from './components/views/DtmsManagementView';
import { TaxiManagementView } from './components/views/TaxiManagementView';
import { TankerManagementView } from './components/views/TankerManagementView';
import { WasteManagementView } from './components/views/WasteManagementView';
import { SecuricorManagementView } from './components/views/SecuricorManagementView';
import { superAdminService } from './services/superAdminService';
import { ROUTE_METADATA_MAP } from './config/routeMetadata';
import { useAuthorization } from './hooks/useAuthorization';

type AppRouteMode =
  | 'landing'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'reset-password'
  | 'verify-email'
  | 'verify-otp'
  | 'setup-2fa'
  | 'verify-2fa'
  | 'auth-callback'
  | 'app';

interface MainContentProps {
  onNavigateSetup2FA?: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ onNavigateSetup2FA }) => {
  const { activeView, setActiveView, currentTenant } = useFleet();
  const { can } = useAuthorization();

  // Map activeView to required permission
  const requiredPermissionsMap: Record<string, string> = {
    daily_briefing: 'ai.view',
    fleet_daily_briefing: 'ai.view',
    executive_dashboard: 'executive.dashboard.view',
    executive_report: 'executive.dashboard.view',
    executive_print: 'executive.dashboard.export',
    dashboard: 'dashboard.view',
    live_tracking: 'tracking.view',
    inspection: 'inspection.view',
    driver_mobile: 'trip.view',
    geofence: 'geofence.view',
    organizations: 'settings.view',
    tenants: 'settings.view',
    fleets: 'vehicle.view',
    security_isolation: 'settings.view',
    vehicles: 'vehicle.view',
    vehicle_groups: 'vehicle.view',
    branches: 'vehicle.view',
    departments: 'vehicle.view',
    drivers: 'driver.view',
    trips: 'trip.view',
    planned_trips: 'trip.view',
    deliveries: 'trip.view',
    routes: 'trip.view',
    rent_car: 'vehicle.view',
    rent_car_bookings: 'vehicle.view',
    rent_car_customers: 'vehicle.view',
    rent_car_security: 'vehicle.view',
    rent_car_tariffs: 'vehicle.view',
    logistics: 'trip.view',
    logistics_control_tower: 'trip.view',
    logistics_orders: 'trip.view',
    logistics_shipments: 'trip.view',
    logistics_pickups: 'trip.view',
    logistics_deliveries: 'trip.view',
    logistics_manifests: 'trip.view',
    logistics_packages: 'trip.view',
    logistics_routes: 'route.view',
    logistics_live_tracking: 'tracking.view',
    logistics_hubs: 'vehicle.view',
    logistics_sortation: 'trip.view',
    logistics_returns: 'trip.view',
    logistics_exceptions: 'alert.view',
    logistics_cod: 'cost.view',
    logistics_customers: 'driver.view',
    logistics_sla: 'analytics.view',
    logistics_analytics: 'cost.view',
    logistics_ai: 'ai.view',
    logistics_reports: 'report.view',
    bus_management: 'trip.view',
    bus_control_tower: 'trip.view',
    bus_trips_schedule: 'trip.view',
    bus_ticketing_seat: 'trip.view',
    bus_passenger_manifest: 'trip.view',
    bus_routes_terminals: 'route.view',
    bus_cargo_express: 'trip.view',
    bus_agents_counter: 'trip.view',
    bus_crew_roster: 'driver.view',
    bus_ramp_check: 'inspection.view',
    bus_ujs_toll_fuel: 'cost.view',
    bus_live_tracking: 'tracking.view',
    bus_charter_tour: 'trip.view',
    bus_occupancy_analytics: 'analytics.view',
    bus_ai_dispatcher: 'ai.view',
    bus_reports: 'report.view',
    heavy_equipment: 'trip.view',
    heavy_equipment_control_tower: 'trip.view',
    heavy_equipment_assets: 'vehicle.view',
    heavy_equipment_projects: 'trip.view',
    heavy_equipment_timesheets: 'trip.view',
    heavy_equipment_p2h: 'inspection.view',
    heavy_equipment_fuel: 'fuel.view',
    heavy_equipment_maintenance: 'maintenance.view',
    heavy_equipment_safety: 'safety.view',
    heavy_equipment_billing: 'cost.view',
    heavy_equipment_ai: 'ai.view',
    heavy_equipment_reports: 'report.view',
    mining: 'trip.view',
    mining_control_tower: 'trip.view',
    mining_sites: 'vehicle.view',
    mining_pits: 'trip.view',
    mining_benches: 'trip.view',
    mining_materials: 'vehicle.view',
    mining_equipment: 'vehicle.view',
    mining_operators: 'driver.view',
    mining_shifts: 'trip.view',
    mining_dispatch: 'trip.view',
    mining_weighbridge: 'trip.view',
    mining_fuel: 'fuel.view',
    mining_safety: 'safety.view',
    mining_maintenance: 'maintenance.view',
    mining_productivity: 'cost.view',
    mining_ai: 'ai.view',
    mining_reports: 'report.view',
    pud: 'trip.view',
    pud_control_tower: 'trip.view',
    pud_pickups: 'trip.view',
    pud_deliveries: 'trip.view',
    pud_dispatch: 'trip.view',
    pud_epod: 'trip.view',
    pud_live_couriers: 'tracking.view',
    pud_route_optimizer: 'route.view',
    pud_failed_undelivered: 'alert.view',
    pud_cod: 'cost.view',
    pud_tracking_link: 'trip.view',
    pud_couriers: 'driver.view',
    pud_tariffs: 'cost.view',
    pud_ai_copilot: 'ai.view',
    pud_reports: 'report.view',
    dtms: 'trip.view',
    dtms_control_tower: 'trip.view',
    dtms_fleets: 'vehicle.view',
    dtms_cycles: 'trip.view',
    dtms_payload: 'trip.view',
    dtms_haul_roads: 'route.view',
    dtms_dispatch: 'trip.view',
    dtms_fuel: 'fuel.view',
    dtms_tires: 'maintenance.view',
    dtms_telematics: 'tracking.view',
    dtms_drivers: 'driver.view',
    dtms_safety: 'safety.view',
    dtms_maintenance: 'maintenance.view',
    dtms_billing: 'cost.view',
    dtms_ai: 'ai.view',
    dtms_reports: 'report.view',
    taxi: 'trip.view',
    taxi_control_tower: 'trip.view',
    taxi_fleets: 'vehicle.view',
    taxi_taximeter: 'cost.view',
    taxi_orders: 'trip.view',
    taxi_revenue: 'cost.view',
    taxi_pools: 'trip.view',
    taxi_energy: 'fuel.view',
    taxi_drivers: 'driver.view',
    taxi_safety: 'safety.view',
    taxi_maintenance: 'maintenance.view',
    taxi_lost_found: 'trip.view',
    taxi_cashless: 'cost.view',
    taxi_ai_copilot: 'ai.view',
    taxi_reports: 'report.view',
    tanker: 'trip.view',
    tanker_control_tower: 'trip.view',
    tanker_fleets: 'vehicle.view',
    tanker_compartments: 'vehicle.view',
    tanker_elocks: 'safety.view',
    tanker_loading_orders: 'trip.view',
    tanker_unloading: 'trip.view',
    tanker_geofences: 'safety.view',
    tanker_safety_hazmat: 'safety.view',
    tanker_cleaning: 'maintenance.view',
    tanker_drivers: 'driver.view',
    tanker_maintenance: 'maintenance.view',
    tanker_billing: 'cost.view',
    tanker_ai_copilot: 'ai.view',
    tanker_reports: 'report.view',
    waste: 'trip.view',
    waste_control_tower: 'trip.view',
    waste_fleets: 'vehicle.view',
    waste_routes: 'route.view',
    waste_manifest_festronik: 'trip.view',
    waste_weighbridge: 'trip.view',
    waste_containers: 'vehicle.view',
    waste_medical_biohazard: 'safety.view',
    waste_sludge_vacuum: 'trip.view',
    waste_safety_compliance: 'safety.view',
    waste_crews: 'driver.view',
    waste_maintenance: 'maintenance.view',
    waste_billing: 'cost.view',
    waste_ai_copilot: 'ai.view',
    waste_reports: 'report.view',
    securicor: 'trip.view',
    securicor_control_tower: 'trip.view',
    securicor_armored_fleets: 'vehicle.view',
    securicor_cit_missions: 'trip.view',
    securicor_smart_vault: 'trip.view',
    securicor_atm_replenishment: 'trip.view',
    securicor_patrol_guards: 'safety.view',
    securicor_duress_emergency: 'safety.view',
    securicor_armed_officers: 'driver.view',
    securicor_geofence_corridors: 'route.view',
    securicor_armor_maintenance: 'maintenance.view',
    securicor_insurance_billing: 'cost.view',
    securicor_ai_copilot: 'ai.view',
    securicor_reports: 'report.view',
    fuel: 'fuel.view',
    maintenance: 'maintenance.view',
    cost_analytics: 'cost.view',
    safety: 'safety.view',
    fatigue: 'safety.view',
    alerts: 'alert.view',
    fleet_assistant: 'ai.view',
    automation: 'automation.view',
    automation_workflows: 'automation.view',
    automation_builder: 'automation.create',
    automation_templates: 'automation.view',
    automation_logs: 'automation.audit',
    automation_failed: 'automation.view',
    automation_settings: 'automation.edit',
    fleet_intelligence: 'ai.view',
    driver_intelligence: 'ai.view',
    fuel_intelligence: 'fuel.view',
    maintenance_intelligence: 'maintenance.view',
    safety_intelligence: 'safety.view',
    ai_intelligence: 'ai.view',
    analytics: 'analytics.view',
    reports: 'report.view',
    documents: 'vehicle.view',
    users: 'user.view',
    roles_permissions: 'role.view',
    integrations: 'integration.view',
    developer_portal: 'settings.view',
    external_api: 'settings.view',
    settings: 'settings.view',
    subscription: 'billing.view',
    gps_integration: 'gps.protocol.view',
    gps_devices: 'gps.device.view',
    gps_health: 'gps.device.view',
    gps_sims: 'gps.sim.view',
    gps_protocols: 'gps.protocol.view',
    gps_firmware: 'gps.firmware.view',
    super_admin: 'admin.company.manage',
  };

  const reqPerm = requiredPermissionsMap[activeView] || 'dashboard.view';
  const isAllowed = can(reqPerm);

  // Dynamic Document Title
  useEffect(() => {
    const meta = ROUTE_METADATA_MAP[activeView];
    if (meta) {
      document.title = `${meta.title} | Fleet Intelligence Smart AI`;
    }
  }, [activeView]);

  if (!isAllowed) {
    return <ForbiddenPage requiredPermission={reqPerm} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'command_center':
        return <CommandCenterMainView />;
      case 'executive_dashboard':
        return <ExecutiveDashboardView />;
      case 'executive_report':
        return <ExecutiveReportDashboard />;
      case 'executive_print':
        return <ExecutivePrintView />;
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'live_tracking':
        return <LiveTrackingView />;
      case 'inspection':
        return <InspectionMainView />;
      case 'driver_mobile':
        return <DriverMobileMainView />;
      case 'geofence':
        return <GeofenceManagementView />;
      case 'deliveries':
        return <DeliveryManagementView />;
      case 'organizations':
        return <OrganizationMainView initialTab="tree" />;
      case 'tenants':
        return <OrganizationMainView initialTab="tenants" />;
      case 'branches':
        return <OrganizationMainView initialTab="branches" />;
      case 'departments':
        return <OrganizationMainView initialTab="departments" />;
      case 'fleets':
        return <OrganizationMainView initialTab="fleets" />;
      case 'security_isolation':
        return <OrganizationMainView initialTab="security" />;
      case 'vehicles':
      case 'vehicle_groups':
        return <VehiclesView />;
      case 'drivers':
        return <DriversMainView />;
      case 'planned_trips':
        return <TripManagementMainView />;
      case 'trips':
        return <TripHistoryView />;
      case 'routes':
        return <RouteManagementView />;
      case 'rent_car':
        return <RentCarDashboard initialSubTab="inventory" />;
      case 'rent_car_bookings':
        return <RentCarDashboard initialSubTab="bookings" />;
      case 'rent_car_contracts':
        return <RentCarDashboard initialSubTab="contracts" />;
      case 'rent_car_calendar':
        return <RentCarDashboard initialSubTab="calendar" />;
      case 'rent_car_customers':
        return <RentCarDashboard initialSubTab="customers" />;
      case 'rent_car_damages':
        return <RentCarDashboard initialSubTab="damages" />;
      case 'rent_car_invoices':
        return <RentCarDashboard initialSubTab="invoices" />;
      case 'rent_car_security':
        return <RentCarDashboard initialSubTab="security" />;
      case 'rent_car_tariffs':
        return <RentCarDashboard initialSubTab="tariff" />;
      case 'rent_car_analytics':
        return <RentCarDashboard initialSubTab="analytics" />;
      case 'rent_car_ai':
        return <RentCarDashboard initialSubTab="ai" />;
      case 'rent_car_reports':
        return <RentCarDashboard initialSubTab="reports" />;
      case 'logistics':
      case 'logistics_control_tower':
        return <LogisticsManagementView initialTab="control-tower" />;
      case 'logistics_orders':
        return <LogisticsManagementView initialTab="orders" />;
      case 'logistics_shipments':
        return <LogisticsManagementView initialTab="shipments" />;
      case 'logistics_pickups':
        return <LogisticsManagementView initialTab="pickups" />;
      case 'logistics_deliveries':
        return <LogisticsManagementView initialTab="deliveries" />;
      case 'logistics_manifests':
        return <LogisticsManagementView initialTab="manifests" />;
      case 'logistics_packages':
        return <LogisticsManagementView initialTab="packages" />;
      case 'logistics_routes':
        return <LogisticsManagementView initialTab="routes" />;
      case 'logistics_live_tracking':
        return <LogisticsManagementView initialTab="live-tracking" />;
      case 'logistics_hubs':
        return <LogisticsManagementView initialTab="hubs" />;
      case 'logistics_sortation':
        return <LogisticsManagementView initialTab="sortation" />;
      case 'logistics_returns':
        return <LogisticsManagementView initialTab="returns" />;
      case 'logistics_exceptions':
        return <LogisticsManagementView initialTab="exceptions" />;
      case 'logistics_cod':
        return <LogisticsManagementView initialTab="cod" />;
      case 'logistics_customers':
        return <LogisticsManagementView initialTab="customers" />;
      case 'logistics_sla':
        return <LogisticsManagementView initialTab="sla" />;
      case 'logistics_analytics':
        return <LogisticsManagementView initialTab="analytics" />;
      case 'logistics_ai':
        return <LogisticsManagementView initialTab="ai-dispatcher" />;
      case 'logistics_reports':
        return <LogisticsManagementView initialTab="reports" />;
      case 'bus_management':
        return <BusManagementView initialTab="control-tower" />;
      case 'bus_control_tower':
        return <BusManagementView initialTab="control-tower" />;
      case 'bus_trips_schedule':
        return <BusManagementView initialTab="trips-schedule" />;
      case 'bus_ticketing_seat':
        return <BusManagementView initialTab="ticketing-seat" />;
      case 'bus_passenger_manifest':
        return <BusManagementView initialTab="passenger-manifest" />;
      case 'bus_routes_terminals':
        return <BusManagementView initialTab="routes-terminals" />;
      case 'bus_cargo_express':
        return <BusManagementView initialTab="cargo-express" />;
      case 'bus_agents_counter':
        return <BusManagementView initialTab="agents-counter" />;
      case 'bus_crew_roster':
        return <BusManagementView initialTab="crew-roster" />;
      case 'bus_ramp_check':
        return <BusManagementView initialTab="ramp-check" />;
      case 'bus_ujs_toll_fuel':
        return <BusManagementView initialTab="ujs-toll-fuel" />;
      case 'bus_live_tracking':
        return <BusManagementView initialTab="live-tracking" />;
      case 'bus_charter_tour':
        return <BusManagementView initialTab="charter-tour" />;
      case 'bus_occupancy_analytics':
        return <BusManagementView initialTab="occupancy-analytics" />;
      case 'bus_ai_dispatcher':
        return <BusManagementView initialTab="ai-dispatcher" />;
      case 'bus_reports':
        return <BusManagementView initialTab="reports" />;
      case 'heavy_equipment':
      case 'heavy_equipment_control_tower':
        return <HeavyEquipmentManagementView initialTab="control-tower" />;
      case 'heavy_equipment_assets':
        return <HeavyEquipmentManagementView initialTab="equipment-assets" />;
      case 'heavy_equipment_projects':
        return <HeavyEquipmentManagementView initialTab="projects-sites" />;
      case 'heavy_equipment_timesheets':
        return <HeavyEquipmentManagementView initialTab="timesheets-hm" />;
      case 'heavy_equipment_p2h':
        return <HeavyEquipmentManagementView initialTab="p2h-inspection" />;
      case 'heavy_equipment_fuel':
        return <HeavyEquipmentManagementView initialTab="fuel-bowser" />;
      case 'heavy_equipment_maintenance':
        return <HeavyEquipmentManagementView initialTab="maintenance-ps" />;
      case 'heavy_equipment_safety':
        return <HeavyEquipmentManagementView initialTab="safety-sio" />;
      case 'heavy_equipment_billing':
        return <HeavyEquipmentManagementView initialTab="rental-billing" />;
      case 'heavy_equipment_ai':
        return <HeavyEquipmentManagementView initialTab="ai-copilot" />;
      case 'heavy_equipment_reports':
        return <HeavyEquipmentManagementView initialTab="reports" />;
      case 'mining':
      case 'mining_control_tower':
        return <MiningManagementView initialTab="dashboard" />;
      case 'mining_sites':
        return <MiningManagementView initialTab="sites" />;
      case 'mining_pits':
        return <MiningManagementView initialTab="pits" />;
      case 'mining_benches':
        return <MiningManagementView initialTab="benches" />;
      case 'mining_materials':
        return <MiningManagementView initialTab="materials" />;
      case 'mining_equipment':
        return <MiningManagementView initialTab="equipment" />;
      case 'mining_operators':
        return <MiningManagementView initialTab="operators" />;
      case 'mining_shifts':
        return <MiningManagementView initialTab="shifts" />;
      case 'mining_dispatch':
        return <MiningManagementView initialTab="dispatch" />;
      case 'mining_weighbridge':
        return <MiningManagementView initialTab="weighbridge" />;
      case 'mining_fuel':
        return <MiningManagementView initialTab="fuel" />;
      case 'mining_safety':
        return <MiningManagementView initialTab="safety" />;
      case 'mining_maintenance':
        return <MiningManagementView initialTab="maintenance" />;
      case 'mining_productivity':
        return <MiningManagementView initialTab="productivity" />;
      case 'mining_ai':
        return <MiningManagementView initialTab="ai_copilot" />;
      case 'mining_reports':
        return <MiningManagementView initialTab="reports" />;
      case 'pud':
      case 'pud_control_tower':
        return <PudManagementView initialTab="control_tower" />;
      case 'pud_pickups':
        return <PudManagementView initialTab="pickups" />;
      case 'pud_deliveries':
        return <PudManagementView initialTab="deliveries" />;
      case 'pud_dispatch':
        return <PudManagementView initialTab="dispatch" />;
      case 'pud_epod':
        return <PudManagementView initialTab="epod" />;
      case 'pud_live_couriers':
        return <PudManagementView initialTab="live_couriers" />;
      case 'pud_route_optimizer':
        return <PudManagementView initialTab="route_optimizer" />;
      case 'pud_failed_undelivered':
        return <PudManagementView initialTab="failed_undelivered" />;
      case 'pud_cod':
        return <PudManagementView initialTab="cod" />;
      case 'pud_tracking_link':
        return <PudManagementView initialTab="tracking_link" />;
      case 'pud_couriers':
        return <PudManagementView initialTab="couriers" />;
      case 'pud_tariffs':
        return <PudManagementView initialTab="tariffs" />;
      case 'pud_ai_copilot':
        return <PudManagementView initialTab="ai_copilot" />;
      case 'pud_reports':
        return <PudManagementView initialTab="reports" />;
      case 'dtms':
      case 'dtms_control_tower':
        return <DtmsManagementView initialTab="control_tower" />;
      case 'dtms_fleets':
        return <DtmsManagementView initialTab="fleets" />;
      case 'dtms_cycles':
        return <DtmsManagementView initialTab="cycles" />;
      case 'dtms_payload':
        return <DtmsManagementView initialTab="payload" />;
      case 'dtms_haul_roads':
        return <DtmsManagementView initialTab="haul_roads" />;
      case 'dtms_dispatch':
        return <DtmsManagementView initialTab="dispatch" />;
      case 'dtms_fuel':
        return <DtmsManagementView initialTab="fuel" />;
      case 'dtms_tires':
        return <DtmsManagementView initialTab="tires" />;
      case 'dtms_telematics':
        return <DtmsManagementView initialTab="telematics" />;
      case 'dtms_drivers':
        return <DtmsManagementView initialTab="drivers" />;
      case 'dtms_safety':
        return <DtmsManagementView initialTab="safety" />;
      case 'dtms_maintenance':
        return <DtmsManagementView initialTab="maintenance" />;
      case 'dtms_billing':
        return <DtmsManagementView initialTab="billing" />;
      case 'dtms_ai':
        return <DtmsManagementView initialTab="ai_copilot" />;
      case 'dtms_reports':
        return <DtmsManagementView initialTab="reports" />;
      case 'taxi':
      case 'taxi_control_tower':
        return <TaxiManagementView initialTab="control_tower" />;
      case 'taxi_fleets':
        return <TaxiManagementView initialTab="fleets" />;
      case 'taxi_taximeter':
        return <TaxiManagementView initialTab="taximeter" />;
      case 'taxi_orders':
        return <TaxiManagementView initialTab="orders" />;
      case 'taxi_revenue':
        return <TaxiManagementView initialTab="revenue" />;
      case 'taxi_pools':
        return <TaxiManagementView initialTab="pools" />;
      case 'taxi_energy':
        return <TaxiManagementView initialTab="energy" />;
      case 'taxi_drivers':
        return <TaxiManagementView initialTab="drivers" />;
      case 'taxi_safety':
        return <TaxiManagementView initialTab="safety" />;
      case 'taxi_maintenance':
        return <TaxiManagementView initialTab="maintenance" />;
      case 'taxi_lost_found':
        return <TaxiManagementView initialTab="lost_found" />;
      case 'taxi_cashless':
        return <TaxiManagementView initialTab="cashless" />;
      case 'taxi_ai_copilot':
        return <TaxiManagementView initialTab="ai_copilot" />;
      case 'taxi_reports':
        return <TaxiManagementView initialTab="reports" />;
      case 'tanker':
      case 'tanker_control_tower':
        return <TankerManagementView initialTab="control_tower" />;
      case 'tanker_fleets':
        return <TankerManagementView initialTab="fleets" />;
      case 'tanker_compartments':
        return <TankerManagementView initialTab="compartments" />;
      case 'tanker_elocks':
        return <TankerManagementView initialTab="elocks" />;
      case 'tanker_loading_orders':
        return <TankerManagementView initialTab="loading_orders" />;
      case 'tanker_unloading':
        return <TankerManagementView initialTab="unloading" />;
      case 'tanker_geofences':
        return <TankerManagementView initialTab="geofences" />;
      case 'tanker_safety_hazmat':
        return <TankerManagementView initialTab="safety_hazmat" />;
      case 'tanker_cleaning':
        return <TankerManagementView initialTab="cleaning" />;
      case 'tanker_drivers':
        return <TankerManagementView initialTab="drivers" />;
      case 'tanker_maintenance':
        return <TankerManagementView initialTab="maintenance" />;
      case 'tanker_billing':
        return <TankerManagementView initialTab="billing" />;
      case 'tanker_ai_copilot':
        return <TankerManagementView initialTab="ai_copilot" />;
      case 'tanker_reports':
        return <TankerManagementView initialTab="reports" />;
      case 'waste':
      case 'waste_control_tower':
        return <WasteManagementView initialTab="control_tower" />;
      case 'waste_fleets':
        return <WasteManagementView initialTab="fleets" />;
      case 'waste_routes':
        return <WasteManagementView initialTab="routes" />;
      case 'waste_manifest_festronik':
        return <WasteManagementView initialTab="manifest_festronik" />;
      case 'waste_weighbridge':
        return <WasteManagementView initialTab="weighbridge" />;
      case 'waste_containers':
        return <WasteManagementView initialTab="containers" />;
      case 'waste_medical_biohazard':
        return <WasteManagementView initialTab="medical_biohazard" />;
      case 'waste_sludge_vacuum':
        return <WasteManagementView initialTab="sludge_vacuum" />;
      case 'waste_safety_compliance':
        return <WasteManagementView initialTab="safety_compliance" />;
      case 'waste_crews':
        return <WasteManagementView initialTab="crews" />;
      case 'waste_maintenance':
        return <WasteManagementView initialTab="maintenance" />;
      case 'waste_billing':
        return <WasteManagementView initialTab="billing" />;
      case 'waste_ai_copilot':
        return <WasteManagementView initialTab="ai_copilot" />;
      case 'waste_reports':
        return <WasteManagementView initialTab="reports" />;
      case 'securicor':
      case 'securicor_control_tower':
        return <SecuricorManagementView initialTab="control_tower" />;
      case 'securicor_armored_fleets':
        return <SecuricorManagementView initialTab="armored_fleets" />;
      case 'securicor_cit_missions':
        return <SecuricorManagementView initialTab="cit_missions" />;
      case 'securicor_smart_vault':
        return <SecuricorManagementView initialTab="smart_vault" />;
      case 'securicor_atm_replenishment':
        return <SecuricorManagementView initialTab="atm_replenishment" />;
      case 'securicor_patrol_guards':
        return <SecuricorManagementView initialTab="patrol_guards" />;
      case 'securicor_duress_emergency':
        return <SecuricorManagementView initialTab="duress_emergency" />;
      case 'securicor_armed_officers':
        return <SecuricorManagementView initialTab="armed_officers" />;
      case 'securicor_geofence_corridors':
        return <SecuricorManagementView initialTab="geofence_corridors" />;
      case 'securicor_armor_maintenance':
        return <SecuricorManagementView initialTab="armor_maintenance" />;
      case 'securicor_insurance_billing':
        return <SecuricorManagementView initialTab="insurance_billing" />;
      case 'securicor_ai_copilot':
        return <SecuricorManagementView initialTab="ai_copilot" />;
      case 'securicor_reports':
        return <SecuricorManagementView initialTab="reports" />;
      case 'fuel':
        return <FuelView />;
      case 'maintenance':
        return <MaintenanceView />;
      case 'safety':
        return <SafetyView />;
      case 'fatigue':
        return <FatigueView />;
      case 'cost_analytics':
        return <CostModule />;
      case 'alerts':
        return <AlertsView />;
      case 'notifications':
        return <NotificationView />;
      case 'fleet_assistant':
        return <FleetAssistantMainView />;
      case 'automation':
        return <AutomationMainView initialTab="dashboard" />;
      case 'automation_workflows':
        return <AutomationMainView initialTab="workflows" />;
      case 'automation_builder':
        return <AutomationMainView initialTab="builder" />;
      case 'automation_templates':
        return <AutomationMainView initialTab="templates" />;
      case 'automation_logs':
        return <AutomationMainView initialTab="logs" />;
      case 'automation_failed':
        return <AutomationMainView initialTab="failed" />;
      case 'automation_settings':
        return <AutomationMainView initialTab="settings" />;
      case 'daily_briefing':
      case 'fleet_daily_briefing':
        return (
          <DailyBriefingView
            tenantId={currentTenant?.id || 'tenant-1'}
            onNavigateToModule={(mod) => {
              if (mod) setActiveView(mod as any);
            }}
          />
        );
      case 'route_intelligence':
        return <RouteIntelligenceView />;
      case 'fleet_intelligence':
        return <FleetIntelligenceView />;
      case 'driver_intelligence':
        return <DriverIntelligenceView />;
      case 'fuel_intelligence':
        return <FuelIntelligenceView />;
      case 'maintenance_intelligence':
        return <MaintenanceIntelligenceView />;
      case 'safety_intelligence':
        return <SafetyIntelligenceView />;
      case 'ai_intelligence':
        return <AIIntelligenceView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'reports':
        return <ReportsView />;
      case 'documents':
        return <DocumentsView />;
      case 'users':
        return <UsersView />;
      case 'roles_permissions':
        return <RoleManagementView />;
      case 'audit':
        return <AuditMainView />;
      case 'enterprise_security':
      case 'security':
        return <SecurityCenterMainView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'developer_portal':
      case 'external_api':
        return <DeveloperPortalMainView />;
      case 'settings':
        return <SettingsView onNavigateSetup2FA={onNavigateSetup2FA} />;
      case 'subscription':
        return <SubscriptionMainView />;
      case 'profile':
        return <UserProfileView />;
      case 'gps_integration':
        return <GPSIntegrationMainView />;
      case 'gps_server':
      case 'gps_server_dashboard':
        return <GpsServerDashboardView />;
      case 'gps_devices':
      case 'gps_health':
      case 'gps_sims':
      case 'gps_protocols':
      case 'gps_firmware':
        return <GpsDevicesView />;
      case 'super_admin':
        return <SuperAdminMainView />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  const isFullScreenView =
    activeView === 'executive_dashboard' ||
    activeView === 'executive_print' ||
    activeView === 'live_tracking' ||
    activeView === 'fleet_assistant' ||
    activeView === 'automation' ||
    activeView === 'automation_builder' ||
    activeView === 'cost_analytics' ||
    activeView === 'gps_integration' ||
    activeView === 'super_admin' ||
    activeView === 'driver_mobile';

  return (
    <main className={`flex-1 bg-slate-950 ${isFullScreenView ? 'p-0 overflow-hidden' : 'overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8'}`}>
      {renderView()}
    </main>
  );
};

function AppShell({
  onNavigateLanding,
  onNavigateSetup2FA,
}: {
  onNavigateLanding: () => void;
  onNavigateSetup2FA?: () => void;
}) {
  const [impersonationSession, setImpersonationSession] = useState(superAdminService.getActiveImpersonation());

  useEffect(() => {
    const checkSession = () => {
      setImpersonationSession(superAdminService.getActiveImpersonation());
    };
    window.addEventListener('storage', checkSession);
    const interval = setInterval(checkSession, 2000);
    return () => {
      window.removeEventListener('storage', checkSession);
      clearInterval(interval);
    };
  }, []);

  const handleExitImpersonation = () => {
    superAdminService.stopImpersonation();
    setImpersonationSession(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950 flex-col">
      <NetworkStatusBanner />
      {impersonationSession && (
        <ImpersonationBanner
          session={impersonationSession}
          onExitImpersonation={handleExitImpersonation}
        />
      )}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar onNavigateLanding={onNavigateLanding} />
          <MainContent onNavigateSetup2FA={onNavigateSetup2FA} />
          <MobileNav />
        </div>
        <AIDrawer />
        <CommandPalette />
        <OrganizationSwitcherModal />
        <KeyboardShortcutsModal />
      </div>
    </div>
  );
}

function AppRouter() {
  const { isAuthenticated } = useAuth();
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resetToken, setResetToken] = useState('demo-reset-token-123');

  const [routeMode, setRouteMode] = useState<AppRouteMode>(() => {
    const path = window.location.pathname;
    if (path === '/login') return 'login';
    if (path === '/register') return 'register';
    if (path === '/forgot-password') return 'forgot-password';
    if (path === '/reset-password') return 'reset-password';
    if (path === '/verify-email') return 'verify-email';
    if (path === '/verify-otp') return 'verify-otp';
    if (path === '/setup-2fa') return 'setup-2fa';
    if (path === '/verify-2fa') return 'verify-2fa';
    if (path === '/auth/callback') return 'auth-callback';
    if (path.startsWith('/app')) return 'app';
    return 'landing';
  });

  const navigateTo = (mode: AppRouteMode, pathName?: string) => {
    setRouteMode(mode);
    const targetPath = pathName || (
      mode === 'login' ? '/login' :
      mode === 'register' ? '/register' :
      mode === 'forgot-password' ? '/forgot-password' :
      mode === 'reset-password' ? '/reset-password' :
      mode === 'verify-email' ? '/verify-email' :
      mode === 'verify-otp' ? '/verify-otp' :
      mode === 'setup-2fa' ? '/setup-2fa' :
      mode === 'verify-2fa' ? '/verify-2fa' :
      mode === 'app' ? '/app/dashboard' : '/'
    );
    window.history.pushState({}, '', targetPath);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/login') setRouteMode('login');
      else if (path === '/register') setRouteMode('register');
      else if (path === '/forgot-password') setRouteMode('forgot-password');
      else if (path === '/reset-password') setRouteMode('reset-password');
      else if (path === '/verify-email') setRouteMode('verify-email');
      else if (path === '/verify-otp') setRouteMode('verify-otp');
      else if (path === '/setup-2fa') setRouteMode('setup-2fa');
      else if (path === '/verify-2fa') setRouteMode('verify-2fa');
      else if (path.startsWith('/app')) setRouteMode('app');
      else setRouteMode('landing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Redirect authenticated user from login page to dashboard
  useEffect(() => {
    if (isAuthenticated && (routeMode === 'login' || routeMode === 'register')) {
      navigateTo('app');
    }
  }, [isAuthenticated, routeMode]);

  return (
    <>
      {routeMode === 'landing' && (
        <LandingPage
          onNavigateLogin={() => navigateTo('login')}
          onNavigateApp={() => navigateTo(isAuthenticated ? 'app' : 'login')}
        />
      )}

      {routeMode === 'login' && (
        <LoginPage
          onLoginSuccess={() => navigateTo('app')}
          onNavigateRegister={() => navigateTo('register')}
          onNavigateForgotPassword={() => navigateTo('forgot-password')}
          onNavigate2FA={() => navigateTo('verify-2fa')}
          onBackToLanding={() => navigateTo('landing')}
        />
      )}

      {routeMode === 'register' && (
        <RegisterPage
          onRegisterSuccess={(email) => {
            setRegisteredEmail(email);
            navigateTo('verify-email');
          }}
          onNavigateLogin={() => navigateTo('login')}
        />
      )}

      {routeMode === 'forgot-password' && (
        <ForgotPasswordPage
          onNavigateLogin={() => navigateTo('login')}
          onNavigateResetPasswordWithToken={(token) => {
            setResetToken(token);
            navigateTo('reset-password');
          }}
        />
      )}

      {routeMode === 'reset-password' && (
        <ResetPasswordPage
          token={resetToken}
          onNavigateLogin={() => navigateTo('login')}
        />
      )}

      {routeMode === 'verify-email' && (
        <VerifyEmailPage
          email={registeredEmail || 'admin@perusahaan.co.id'}
          onNavigateLogin={() => navigateTo('login')}
        />
      )}

      {routeMode === 'verify-otp' && (
        <VerifyOtpPage
          email={registeredEmail || 'admin@perusahaan.co.id'}
          onVerifySuccess={() => navigateTo('app')}
          onNavigateBack={() => navigateTo('login')}
        />
      )}

      {routeMode === 'setup-2fa' && (
        <Setup2faPage
          onComplete={() => navigateTo('app')}
          onNavigateBack={() => navigateTo('app')}
        />
      )}

      {routeMode === 'verify-2fa' && (
        <Verify2faPage
          onVerifySuccess={() => navigateTo('app')}
          onNavigateBack={() => navigateTo('login')}
        />
      )}

      {routeMode === 'auth-callback' && (
        <AuthCallbackPage
          onSuccess={() => navigateTo('app')}
          onError={() => navigateTo('login')}
        />
      )}

      {routeMode === 'app' && (
        <ProtectedRoute onRedirectLogin={(redirectPath) => navigateTo('login', redirectPath ? `/login?redirect=${encodeURIComponent(redirectPath)}` : '/login')}>
          <AppShell
            onNavigateLanding={() => navigateTo('landing')}
            onNavigateSetup2FA={() => navigateTo('setup-2fa')}
          />
        </ProtectedRoute>
      )}
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <OrganizationProvider>
            <SubscriptionProvider>
              <FleetProvider>
                <AppRouter />
              </FleetProvider>
            </SubscriptionProvider>
          </OrganizationProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
