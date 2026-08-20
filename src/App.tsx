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
