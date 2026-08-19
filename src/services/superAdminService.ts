/**
 * Fleet Intelligence Smart AI - Super Admin Control Center Service (Prompt 42)
 * Central management for multi-tenant SaaS platform ecosystem: Companies, Users,
 * IoT Telematics Devices, Global Billing & MRR, AI/API Metrics, System Health,
 * Incidents, Support Access Impersonation, and Cross-Platform Security Audit.
 */

import {
  PlatformCompany,
  PlatformCompanyQuota,
  PlatformCompanyStatus,
  PlatformUser,
  PlatformDeviceItem,
  PlatformRevenueMetrics,
  PlatformAiApiMetrics,
  MicroserviceHealthItem,
  SystemResourceMetrics,
  PlatformIncident,
  PlatformAnnouncement,
  PlatformAuditLog,
  ImpersonationSession,
  SuperAdminDashboardKpis,
} from '../types/superAdmin';
import { PlanFeatureKey } from '../types/subscription';

const STORAGE_KEYS = {
  COMPANIES: 'fleet_smart_ai_saas_companies_v1',
  USERS: 'fleet_smart_ai_saas_users_v1',
  DEVICES: 'fleet_smart_ai_saas_devices_v1',
  INCIDENTS: 'fleet_smart_ai_saas_incidents_v1',
  ANNOUNCEMENTS: 'fleet_smart_ai_saas_announcements_v1',
  AUDIT_LOGS: 'fleet_smart_ai_saas_audit_logs_v1',
  IMPERSONATION: 'fleet_smart_ai_impersonation_session_v1',
};

const INITIAL_COMPANIES: PlatformCompany[] = [
  {
    id: 't-001',
    name: 'PT Trans Logistik Nusantara',
    legalName: 'PT Trans Logistik Nusantara Tbk',
    code: 'TLN',
    industry: 'Logistik & Supply Chain Ekspedisi',
    planId: 'plan-enterprise',
    planName: 'Enterprise',
    status: 'active',
    billingCycle: 'yearly',
    mrr: 18500000,
    currency: 'IDR',
    createdAt: '2024-01-15T08:00:00Z',
    subscriptionExpiresAt: '2027-12-31T23:59:59Z',
    address: 'Jl. Raya Industri No. 88, Cikarang Barat',
    city: 'Kabupaten Bekasi',
    province: 'Jawa Barat',
    taxIdNpwp: '01.345.678.9-012.000',
    primaryContact: {
      name: 'Budi Santoso',
      email: 'admin@translogistik.co.id',
      phone: '+62 812 9000 1234',
      role: 'VP Operations',
    },
    quotas: {
      maxVehicles: 250,
      currentVehicles: 128,
      maxUsers: 50,
      currentUsers: 36,
      maxDevices: 250,
      currentDevices: 128,
      maxBranches: 10,
      currentBranches: 4,
      aiCreditsMonthly: 50000,
      currentAiCredits: 38450,
      storageMb: 50000,
      currentStorageMb: 12400,
      apiMonthlyRequests: 200000,
      currentApiRequests: 84200,
    },
    features: {
      liveTracking: true,
      tripHistory: true,
      geofence: true,
      delivery: true,
      fuel: true,
      maintenance: true,
      safety: true,
      fatigue: true,
      analytics: true,
      aiAssistant: true,
      predictiveMaintenance: true,
      aiFuel: true,
      aiDriver: true,
      aiRoute: true,
      aiSafety: true,
      api: true,
      export: true,
      customBranding: true,
      automation: true,
    },
    healthScore: 98,
    telematicsDataRateMsgsSec: 85.4,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    notes: 'Key Enterprise Account. Dedicated SLA Tier 1 with 24/7 priority support.',
  },
  {
    id: 't-002',
    name: 'PT ABC Logistics Express',
    legalName: 'PT ABC Logistik Cepat Nusantara',
    code: 'ABCLOG',
    industry: 'Kurir & Express Freight',
    planId: 'plan-pro',
    planName: 'Professional',
    status: 'active',
    billingCycle: 'monthly',
    mrr: 7500000,
    currency: 'IDR',
    createdAt: '2024-06-01T09:00:00Z',
    subscriptionExpiresAt: '2026-11-30T23:59:59Z',
    address: 'Jl. Raya Rungkut Industri No. 45, Rungkut',
    city: 'Surabaya',
    province: 'Jawa Timur',
    taxIdNpwp: '02.345.678.9-023.000',
    primaryContact: {
      name: 'Dewi Lestari',
      email: 'dewi@abclogistics.co.id',
      phone: '+62 813 8899 7711',
      role: 'Fleet Director',
    },
    quotas: {
      maxVehicles: 100,
      currentVehicles: 68,
      maxUsers: 25,
      currentUsers: 18,
      maxDevices: 100,
      currentDevices: 68,
      maxBranches: 5,
      currentBranches: 3,
      aiCreditsMonthly: 15000,
      currentAiCredits: 11200,
      storageMb: 20000,
      currentStorageMb: 6800,
      apiMonthlyRequests: 50000,
      currentApiRequests: 18400,
    },
    features: {
      liveTracking: true,
      tripHistory: true,
      geofence: true,
      delivery: true,
      fuel: true,
      maintenance: true,
      safety: true,
      fatigue: true,
      analytics: true,
      aiAssistant: true,
      predictiveMaintenance: false,
      aiFuel: true,
      aiDriver: true,
      aiRoute: true,
      aiSafety: true,
      api: false,
      export: true,
      customBranding: true,
      automation: true,
    },
    healthScore: 94,
    telematicsDataRateMsgsSec: 42.1,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    id: 't-003',
    name: 'PT XYZ Transportindo Utama',
    legalName: 'PT XYZ Transportindo Utama',
    code: 'XYZTRN',
    industry: 'Transportasi Tambang & Alat Berat',
    planId: 'plan-pro',
    planName: 'Professional',
    status: 'active',
    billingCycle: 'yearly',
    mrr: 6200000,
    currency: 'IDR',
    createdAt: '2024-09-10T11:00:00Z',
    subscriptionExpiresAt: '2027-03-31T23:59:59Z',
    address: 'Jl. Soekarno Hatta No. 420, Batununggal',
    city: 'Bandung',
    province: 'Jawa Barat',
    taxIdNpwp: '03.456.789.0-034.000',
    primaryContact: {
      name: 'Hendra Gunawan',
      email: 'hendra@xyztrans.co.id',
      phone: '+62 811 2233 4455',
      role: 'Head of Maintenance',
    },
    quotas: {
      maxVehicles: 50,
      currentVehicles: 42,
      maxUsers: 15,
      currentUsers: 14,
      maxDevices: 50,
      currentDevices: 42,
      maxBranches: 3,
      currentBranches: 3,
      aiCreditsMonthly: 10000,
      currentAiCredits: 8900,
      storageMb: 15000,
      currentStorageMb: 4200,
      apiMonthlyRequests: 30000,
      currentApiRequests: 12100,
    },
    features: {
      liveTracking: true,
      tripHistory: true,
      geofence: true,
      delivery: false,
      fuel: true,
      maintenance: true,
      safety: true,
      fatigue: false,
      analytics: true,
      aiAssistant: true,
      predictiveMaintenance: true,
      aiFuel: true,
      aiDriver: true,
      aiRoute: false,
      aiSafety: true,
      api: false,
      export: true,
      customBranding: false,
      automation: true,
    },
    healthScore: 91,
    telematicsDataRateMsgsSec: 28.6,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 't-004',
    name: 'PT Samudera Kargo Sejahtera',
    legalName: 'PT Samudera Kargo Sejahtera',
    code: 'SKS',
    industry: 'Freight Forwarding & Pelabuhan',
    planId: 'plan-starter',
    planName: 'Starter',
    status: 'trial',
    trialEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString(),
    billingCycle: 'monthly',
    mrr: 0,
    currency: 'IDR',
    createdAt: '2026-08-01T10:00:00Z',
    subscriptionExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString(),
    address: 'Jl. Tanjung Perak Timur No. 120',
    city: 'Surabaya',
    province: 'Jawa Timur',
    taxIdNpwp: '04.567.890.1-045.000',
    primaryContact: {
      name: 'Rian Kurniawan',
      email: 'rian@samuderakargo.co.id',
      phone: '+62 817 6655 4433',
      role: 'Operations Lead',
    },
    quotas: {
      maxVehicles: 20,
      currentVehicles: 15,
      maxUsers: 5,
      currentUsers: 4,
      maxDevices: 20,
      currentDevices: 15,
      maxBranches: 1,
      currentBranches: 1,
      aiCreditsMonthly: 2000,
      currentAiCredits: 1450,
      storageMb: 5000,
      currentStorageMb: 1100,
      apiMonthlyRequests: 5000,
      currentApiRequests: 820,
    },
    features: {
      liveTracking: true,
      tripHistory: true,
      geofence: true,
      delivery: true,
      fuel: true,
      maintenance: true,
      safety: true,
      fatigue: false,
      analytics: false,
      aiAssistant: false,
      predictiveMaintenance: false,
      aiFuel: false,
      aiDriver: false,
      aiRoute: false,
      aiSafety: false,
      api: false,
      export: true,
      customBranding: false,
      automation: false,
    },
    healthScore: 89,
    telematicsDataRateMsgsSec: 10.2,
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 't-005',
    name: 'PT Mandiri Angkutan Mandiri',
    legalName: 'PT Mandiri Angkutan Mandiri Perkasa',
    code: 'MAM',
    industry: 'Distribusi Retail Fast Moving',
    planId: 'plan-pro',
    planName: 'Professional',
    status: 'suspended',
    suspensionReason: 'Pembayaran tagihan invoice #INV-2026-0044 tertunda lebih dari 45 hari (Overdue)',
    suspendedAt: '2026-08-10T08:30:00Z',
    suspendedBy: 'Super Admin Automation Worker',
    billingCycle: 'monthly',
    mrr: 4500000,
    currency: 'IDR',
    createdAt: '2025-02-14T08:00:00Z',
    subscriptionExpiresAt: '2026-08-01T00:00:00Z',
    address: 'Jl. Gatot Subroto No. 55',
    city: 'Medan',
    province: 'Sumatera Utara',
    taxIdNpwp: '05.678.901.2-056.000',
    primaryContact: {
      name: 'Firman Siregar',
      email: 'firman@mandiriangkutan.co.id',
      phone: '+62 812 3456 7890',
      role: 'General Manager',
    },
    quotas: {
      maxVehicles: 30,
      currentVehicles: 24,
      maxUsers: 8,
      currentUsers: 7,
      maxDevices: 30,
      currentDevices: 24,
      maxBranches: 2,
      currentBranches: 2,
      aiCreditsMonthly: 5000,
      currentAiCredits: 4200,
      storageMb: 10000,
      currentStorageMb: 3400,
      apiMonthlyRequests: 10000,
      currentApiRequests: 2100,
    },
    features: {
      liveTracking: true,
      tripHistory: true,
      geofence: true,
      delivery: true,
      fuel: true,
      maintenance: true,
      safety: true,
      fatigue: true,
      analytics: true,
      aiAssistant: true,
      predictiveMaintenance: true,
      aiFuel: true,
      aiDriver: true,
      aiRoute: true,
      aiSafety: true,
      api: false,
      export: true,
      customBranding: false,
      automation: true,
    },
    healthScore: 72,
    telematicsDataRateMsgsSec: 0,
    lastActiveAt: '2026-08-10T08:29:00Z',
  },
  {
    id: 't-006',
    name: 'PT Nusantara Cold Chain Logistics',
    legalName: 'PT Nusantara Cold Chain Logistics Indonesia',
    code: 'NCCL',
    industry: 'Cold Storage & Farmasi Pharma',
    planId: 'plan-enterprise',
    planName: 'Enterprise',
    status: 'active',
    billingCycle: 'yearly',
    mrr: 22000000,
    currency: 'IDR',
    createdAt: '2024-11-20T08:00:00Z',
    subscriptionExpiresAt: '2027-11-20T23:59:59Z',
    address: 'Kawasan Industri GIIC Blok AA No. 12',
    city: 'Cikarang Pusat',
    province: 'Jawa Barat',
    taxIdNpwp: '06.789.012.3-067.000',
    primaryContact: {
      name: 'Dr. Irwan Santoso',
      email: 'irwan@nusantaracold.co.id',
      phone: '+62 811 9988 7766',
      role: 'Chief Technology Officer',
    },
    quotas: {
      maxVehicles: 300,
      currentVehicles: 184,
      maxUsers: 60,
      currentUsers: 42,
      maxDevices: 300,
      currentDevices: 184,
      maxBranches: 12,
      currentBranches: 6,
      aiCreditsMonthly: 80000,
      currentAiCredits: 61400,
      storageMb: 80000,
      currentStorageMb: 24500,
      apiMonthlyRequests: 400000,
      currentApiRequests: 194000,
    },
    features: {
      liveTracking: true,
      tripHistory: true,
      geofence: true,
      delivery: true,
      fuel: true,
      maintenance: true,
      safety: true,
      fatigue: true,
      analytics: true,
      aiAssistant: true,
      predictiveMaintenance: true,
      aiFuel: true,
      aiDriver: true,
      aiRoute: true,
      aiSafety: true,
      api: true,
      export: true,
      customBranding: true,
      automation: true,
    },
    healthScore: 99,
    telematicsDataRateMsgsSec: 132.8,
    lastActiveAt: new Date(Date.now() - 1000 * 30).toISOString(),
    notes: 'Pharma temperature compliance monitored 24/7. IoT BLE sensors active.',
  },
];

const INITIAL_USERS: PlatformUser[] = [
  {
    id: 'u-super-01',
    tenantId: 't-platform',
    tenantName: 'Fleet Intelligence Core Platform',
    name: 'Alexandra Pratama',
    email: 'superadmin@platform.local',
    phone: '+62 811 0000 9999',
    role: 'super_admin',
    roleLabel: 'Super Administrator',
    status: 'active',
    twoFactorEnabled: true,
    activeSessionsCount: 2,
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    lastLoginIp: '182.253.112.44',
    lastLoginLocation: 'Jakarta, Indonesia',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'u-101',
    tenantId: 't-001',
    tenantName: 'PT Trans Logistik Nusantara',
    name: 'Budi Santoso',
    email: 'admin@fleet-demo.local',
    phone: '+62 812 9000 1234',
    role: 'company_admin',
    roleLabel: 'Company Admin',
    status: 'active',
    twoFactorEnabled: true,
    activeSessionsCount: 1,
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    lastLoginIp: '182.253.112.44',
    lastLoginLocation: 'Jakarta, Indonesia',
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'u-102',
    tenantId: 't-001',
    tenantName: 'PT Trans Logistik Nusantara',
    name: 'Rudi Hermawan',
    email: 'manager@fleet-demo.local',
    phone: '+62 812 8888 7777',
    role: 'fleet_manager',
    roleLabel: 'Fleet Manager',
    status: 'active',
    twoFactorEnabled: false,
    activeSessionsCount: 1,
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    lastLoginIp: '180.252.88.10',
    lastLoginLocation: 'Bandung, Indonesia',
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'u-103',
    tenantId: 't-002',
    tenantName: 'PT ABC Logistics Express',
    name: 'Dewi Lestari',
    email: 'dewi@abclogistics.co.id',
    phone: '+62 813 8899 7711',
    role: 'company_admin',
    roleLabel: 'Company Admin',
    status: 'active',
    twoFactorEnabled: true,
    activeSessionsCount: 1,
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    lastLoginIp: '114.122.45.18',
    lastLoginLocation: 'Surabaya, Indonesia',
    createdAt: '2024-06-01T11:00:00Z',
  },
  {
    id: 'u-104',
    tenantId: 't-003',
    tenantName: 'PT XYZ Transportindo Utama',
    name: 'Hendra Gunawan',
    email: 'hendra@xyztrans.co.id',
    phone: '+62 811 2233 4455',
    role: 'fleet_manager',
    roleLabel: 'Fleet Manager',
    status: 'active',
    twoFactorEnabled: false,
    activeSessionsCount: 0,
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    lastLoginIp: '180.252.88.10',
    lastLoginLocation: 'Bandung, Indonesia',
    createdAt: '2024-09-10T12:00:00Z',
  },
  {
    id: 'u-105',
    tenantId: 't-004',
    tenantName: 'PT Samudera Kargo Sejahtera',
    name: 'Rian Kurniawan',
    email: 'rian@samuderakargo.co.id',
    phone: '+62 817 6655 4433',
    role: 'company_admin',
    roleLabel: 'Company Admin',
    status: 'active',
    twoFactorEnabled: false,
    activeSessionsCount: 1,
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    lastLoginIp: '114.122.45.18',
    lastLoginLocation: 'Surabaya, Indonesia',
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'u-106',
    tenantId: 't-005',
    tenantName: 'PT Mandiri Angkutan Mandiri',
    name: 'Firman Siregar',
    email: 'firman@mandiriangkutan.co.id',
    phone: '+62 812 3456 7890',
    role: 'company_admin',
    roleLabel: 'Company Admin',
    status: 'suspended',
    twoFactorEnabled: false,
    activeSessionsCount: 0,
    lastLoginAt: '2026-08-09T14:20:00Z',
    lastLoginIp: '103.28.12.90',
    lastLoginLocation: 'Medan, Indonesia',
    createdAt: '2025-02-14T09:00:00Z',
  },
  {
    id: 'u-107',
    tenantId: 't-006',
    tenantName: 'PT Nusantara Cold Chain Logistics',
    name: 'Dr. Irwan Santoso',
    email: 'irwan@nusantaracold.co.id',
    phone: '+62 811 9988 7766',
    role: 'company_admin',
    roleLabel: 'Company Admin',
    status: 'active',
    twoFactorEnabled: true,
    activeSessionsCount: 2,
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    lastLoginIp: '182.253.112.44',
    lastLoginLocation: 'Bekasi, Indonesia',
    createdAt: '2024-11-20T09:00:00Z',
  },
];

const INITIAL_DEVICES: PlatformDeviceItem[] = [
  {
    id: 'dev-001',
    imei: '864209041234561',
    tenantId: 't-001',
    tenantName: 'PT Trans Logistik Nusantara',
    vehiclePlate: 'B 9821 UTX',
    vehicleModel: 'Hino 500 Ranger FL 235 JW',
    hardwareModel: 'Teltonika FMB920',
    protocol: 'TELTONIKA',
    simNumber: '+62 811 1234 5601',
    simProvider: 'Telkomsel IoT',
    simStatus: 'active',
    firmwareVersion: '03.28.02.Rev.00',
    connectionStatus: 'online',
    lastHeartbeat: new Date(Date.now() - 1000 * 15).toISOString(),
    packetDropRate: 0.05,
    batteryVoltage: 13.8,
    signalStrength: 94,
  },
  {
    id: 'dev-002',
    imei: '864209041234562',
    tenantId: 't-001',
    tenantName: 'PT Trans Logistik Nusantara',
    vehiclePlate: 'B 9102 KXA',
    vehicleModel: 'Isuzu Giga FVR 34 P',
    hardwareModel: 'Queclink GV300',
    protocol: 'QUECLINK',
    simNumber: '+62 811 1234 5602',
    simProvider: 'Telkomsel IoT',
    simStatus: 'active',
    firmwareVersion: 'A14V05',
    connectionStatus: 'online',
    lastHeartbeat: new Date(Date.now() - 1000 * 20).toISOString(),
    packetDropRate: 0.12,
    batteryVoltage: 24.2,
    signalStrength: 88,
  },
  {
    id: 'dev-003',
    imei: '864209041234563',
    tenantId: 't-002',
    tenantName: 'PT ABC Logistics Express',
    vehiclePlate: 'L 8820 OP',
    vehicleModel: 'Mitsubishi Fuso Canter FE 74',
    hardwareModel: 'Concox AT4',
    protocol: 'CONCOX',
    simNumber: '+62 815 9988 1122',
    simProvider: 'Indosat Ooredoo',
    simStatus: 'active',
    firmwareVersion: 'V2.1.8',
    connectionStatus: 'online',
    lastHeartbeat: new Date(Date.now() - 1000 * 35).toISOString(),
    packetDropRate: 0.18,
    batteryVoltage: 12.6,
    signalStrength: 91,
  },
  {
    id: 'dev-004',
    imei: '864209041234564',
    tenantId: 't-003',
    tenantName: 'PT XYZ Transportindo Utama',
    vehiclePlate: 'D 9432 YZ',
    vehicleModel: 'Scania P360 Heavy Tipper',
    hardwareModel: 'Teltonika FMC130 (4G LTE)',
    protocol: 'TELTONIKA',
    simNumber: '+62 878 1234 9900',
    simProvider: 'XL Axiata',
    simStatus: 'active',
    firmwareVersion: '03.28.04.Rev.02',
    connectionStatus: 'online',
    lastHeartbeat: new Date(Date.now() - 1000 * 45).toISOString(),
    packetDropRate: 0.08,
    batteryVoltage: 24.8,
    signalStrength: 85,
  },
  {
    id: 'dev-005',
    imei: '864209041234565',
    tenantId: 't-006',
    tenantName: 'PT Nusantara Cold Chain Logistics',
    vehiclePlate: 'B 9555 NCC',
    vehicleModel: 'Hino Dutro 130 HD ThermoKing',
    hardwareModel: 'Ruptela HCV5 (CAN + Dual BLE Temp)',
    protocol: 'RUPTELA',
    simNumber: '+62 811 8800 2233',
    simProvider: 'Telkomsel IoT',
    simStatus: 'active',
    firmwareVersion: '00.03.32',
    connectionStatus: 'online',
    lastHeartbeat: new Date(Date.now() - 1000 * 10).toISOString(),
    packetDropRate: 0.02,
    batteryVoltage: 13.9,
    signalStrength: 98,
  },
  {
    id: 'dev-006',
    imei: '864209041234566',
    tenantId: 't-005',
    tenantName: 'PT Mandiri Angkutan Mandiri',
    vehiclePlate: 'BK 8111 MA',
    vehicleModel: 'Isuzu Elf NMR 71',
    hardwareModel: 'Suntech ST310U',
    protocol: 'SUNTECH',
    simNumber: '+62 811 5566 7788',
    simProvider: 'Telkomsel IoT',
    simStatus: 'suspended',
    firmwareVersion: 'ST300_v1.02',
    connectionStatus: 'offline',
    lastHeartbeat: '2026-08-10T08:25:00Z',
    packetDropRate: 0.0,
    batteryVoltage: 11.2,
    signalStrength: 0,
  },
  {
    id: 'dev-007',
    imei: '864209041234567',
    tenantId: 't-platform-pool',
    tenantName: 'SaaS Unassigned Stock Pool',
    hardwareModel: 'Teltonika FMB920',
    protocol: 'TELTONIKA',
    simNumber: '+62 811 0000 0001',
    simProvider: 'Telkomsel IoT',
    simStatus: 'active',
    firmwareVersion: '03.28.02.Rev.00',
    connectionStatus: 'unassigned',
    lastHeartbeat: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    packetDropRate: 0.0,
    batteryVoltage: 3.9,
    signalStrength: 75,
  },
];

const INITIAL_INCIDENTS: PlatformIncident[] = [
  {
    id: 'inc-2026-0801',
    title: 'Peningkatan Latensi Ingestion Telematika Region Jakarta (ap-southeast-3)',
    severity: 'P2_MAJOR',
    status: 'resolved',
    affectedServices: ['Telematics Ingestion Socket Cluster', 'Live Tracking WebSockets'],
    impactDescription: 'Keterlambatan paket GPS sebesar 2.8 detik selama lonjakan traffic jam 07:30 - 08:15 WIB',
    createdAt: '2026-08-15T07:32:00Z',
    updatedAt: '2026-08-15T08:20:00Z',
    resolvedAt: '2026-08-15T08:18:00Z',
    timeline: [
      {
        timestamp: '2026-08-15T07:32:00Z',
        status: 'investigating',
        message: 'Alert otomatis: Ingestion message queue depth melebihi threshold 15,000 msgs.',
        author: 'SRE Automation Alert',
      },
      {
        timestamp: '2026-08-15T07:45:00Z',
        status: 'identified',
        message: 'Ditemukan lonjakan koneksi TCP dari gateway provider mitra. Autoscaling worker pool dipicu (4 -> 12 nodes).',
        author: 'SRE Lead (Alexandra Pratama)',
      },
      {
        timestamp: '2026-08-15T08:05:00Z',
        status: 'monitoring',
        message: 'Worker nodes baru aktif melayani traffic. Queue depth turun normal ke < 200 msgs. P95 latency kembali ke 18ms.',
        author: 'SRE Lead',
      },
      {
        timestamp: '2026-08-15T08:18:00Z',
        status: 'resolved',
        message: 'Seluruh metrik stabil 100%. Insiden dinyatakan tuntas.',
        author: 'Super Admin',
      },
    ],
  },
];

const INITIAL_ANNOUNCEMENTS: PlatformAnnouncement[] = [
  {
    id: 'ann-01',
    title: 'Pembaruan Mesin AI & Model Gemini 1.5 Pro v2.4 Rilis Malam Ini',
    message: 'Kami melakukan peningkatan performa pada modul AI Copilot & Predictive Maintenance. Seluruh endpoint telematika tetap beroperasi normal tanpa downtime.',
    severity: 'info',
    targetAudience: 'ALL',
    isActive: true,
    startsAt: '2026-08-17T00:00:00Z',
    expiresAt: '2026-08-20T23:59:59Z',
    dismissible: true,
    createdBy: 'Alexandra Pratama (Super Admin)',
    createdAt: '2026-08-17T08:00:00Z',
  },
];

const INITIAL_AUDIT_LOGS: PlatformAuditLog[] = [
  {
    id: 'aud-901',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    actorId: 'u-super-01',
    actorName: 'Alexandra Pratama',
    actorEmail: 'superadmin@platform.local',
    actorRole: 'Super Admin',
    action: 'TENANT_QUOTA_OVERRIDE',
    category: 'SUBSCRIPTION',
    details: 'Menaikkan kuota AI Monthly Tokens PT Nusantara Cold Chain Logistics dari 50,000 menjadi 80,000 tokens',
    targetTenantId: 't-006',
    targetTenantName: 'PT Nusantara Cold Chain Logistics',
    ipAddress: '182.253.112.44',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0',
    location: 'Jakarta, Indonesia',
    severity: 'medium',
  },
  {
    id: 'aud-902',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    actorId: 'u-super-01',
    actorName: 'Alexandra Pratama',
    actorEmail: 'superadmin@platform.local',
    actorRole: 'Super Admin',
    action: 'BROADCAST_ANNOUNCEMENT_POSTED',
    category: 'SYSTEM',
    details: 'Mempublikasikan pengumuman sistem baru: Rilis Pembaruan Mesin AI',
    ipAddress: '182.253.112.44',
    userAgent: 'Mozilla/5.0 Chrome/122.0',
    location: 'Jakarta, Indonesia',
    severity: 'low',
  },
  {
    id: 'aud-903',
    timestamp: '2026-08-15T08:20:00Z',
    actorId: 'u-super-01',
    actorName: 'Alexandra Pratama',
    actorEmail: 'superadmin@platform.local',
    actorRole: 'Super Admin',
    action: 'INCIDENT_RESOLVED',
    category: 'SYSTEM',
    details: 'Menandai insiden inc-2026-0801 (Latensi Ingestion) sebagai Selesai (Resolved)',
    ipAddress: '182.253.112.44',
    userAgent: 'Mozilla/5.0 Chrome/122.0',
    location: 'Jakarta, Indonesia',
    severity: 'high',
  },
  {
    id: 'aud-904',
    timestamp: '2026-08-10T08:30:00Z',
    actorId: 'sys-billing-worker',
    actorName: 'Billing Automation System',
    actorEmail: 'system@platform.local',
    actorRole: 'System Worker',
    action: 'TENANT_AUTO_SUSPENDED',
    category: 'TENANT',
    details: 'Suspensi otomatis PT Mandiri Angkutan Mandiri (Overdue invoice > 45 hari)',
    targetTenantId: 't-005',
    targetTenantName: 'PT Mandiri Angkutan Mandiri',
    ipAddress: '10.0.4.12 (Internal VPC)',
    userAgent: 'Go-http-client/1.1',
    location: 'ap-southeast-3 Cluster',
    severity: 'critical',
  },
];

export class SuperAdminService {
  private companies: PlatformCompany[] = [];
  private users: PlatformUser[] = [];
  private devices: PlatformDeviceItem[] = [];
  private incidents: PlatformIncident[] = [];
  private announcements: PlatformAnnouncement[] = [];
  private auditLogs: PlatformAuditLog[] = [];
  private impersonationSession: ImpersonationSession | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const c = localStorage.getItem(STORAGE_KEYS.COMPANIES);
      this.companies = c ? JSON.parse(c) : INITIAL_COMPANIES;

      const u = localStorage.getItem(STORAGE_KEYS.USERS);
      this.users = u ? JSON.parse(u) : INITIAL_USERS;

      const d = localStorage.getItem(STORAGE_KEYS.DEVICES);
      this.devices = d ? JSON.parse(d) : INITIAL_DEVICES;

      const inc = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
      this.incidents = inc ? JSON.parse(inc) : INITIAL_INCIDENTS;

      const ann = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      this.announcements = ann ? JSON.parse(ann) : INITIAL_ANNOUNCEMENTS;

      const aud = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      this.auditLogs = aud ? JSON.parse(aud) : INITIAL_AUDIT_LOGS;

      const imp = localStorage.getItem(STORAGE_KEYS.IMPERSONATION);
      this.impersonationSession = imp ? JSON.parse(imp) : null;
    } catch {
      this.companies = INITIAL_COMPANIES;
      this.users = INITIAL_USERS;
      this.devices = INITIAL_DEVICES;
      this.incidents = INITIAL_INCIDENTS;
      this.announcements = INITIAL_ANNOUNCEMENTS;
      this.auditLogs = INITIAL_AUDIT_LOGS;
      this.impersonationSession = null;
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(this.companies));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(this.devices));
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(this.incidents));
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(this.announcements));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(this.auditLogs));
      if (this.impersonationSession) {
        localStorage.setItem(STORAGE_KEYS.IMPERSONATION, JSON.stringify(this.impersonationSession));
      } else {
        localStorage.removeItem(STORAGE_KEYS.IMPERSONATION);
      }
    } catch (e) {
      console.warn('SuperAdminService localStorage save warning:', e);
    }
  }

  // --- DASHBOARD KPIS ---
  public getDashboardKpis(): SuperAdminDashboardKpis {
    const activeCompanies = this.companies.filter((c) => c.status === 'active').length;
    const trialCompanies = this.companies.filter((c) => c.status === 'trial').length;
    const suspendedCompanies = this.companies.filter((c) => c.status === 'suspended').length;

    const totalVehicles = this.companies.reduce((acc, c) => acc + c.quotas.currentVehicles, 0);
    const activeMovingVehicles = Math.round(totalVehicles * 0.68);

    const totalDevices = this.devices.length + 420; // Pool simulation
    const onlineDevices = this.devices.filter((d) => d.connectionStatus === 'online').length + 380;

    const totalUsers = this.users.length + 115;
    const activeSessions = this.users.reduce((acc, u) => acc + u.activeSessionsCount, 0) + 45;

    const mrrTotal = this.companies.filter((c) => c.status === 'active').reduce((acc, c) => acc + c.mrr, 0);
    const arrTotal = mrrTotal * 12;
    const arpu = activeCompanies > 0 ? Math.round(mrrTotal / activeCompanies) : 0;
    const churnRate = 1.4; // 1.4% monthly

    const totalIngestionRate = this.companies
      .filter((c) => c.status === 'active')
      .reduce((acc, c) => acc + c.telematicsDataRateMsgsSec, 0);

    const openIncidents = this.incidents.filter((i) => i.status !== 'resolved').length;

    return {
      totalCompanies: this.companies.length,
      activeCompanies,
      trialCompanies,
      suspendedCompanies,
      totalVehicles,
      activeMovingVehicles,
      totalDevices,
      onlineDevices,
      totalUsers,
      activeSessions,
      mrrTotal,
      arrTotal,
      arpu,
      churnRate,
      ingestionThroughputMsgsSec: Math.round(totalIngestionRate * 10) / 10,
      aiMonthlyTokens: 174250,
      aiMonthlySpendUsd: 348.5,
      systemOverallHealth: openIncidents > 0 ? 'DEGRADED' : 'HEALTHY',
      openIncidentsCount: openIncidents,
    };
  }

  // --- COMPANIES CRUD & OPERATIONS ---
  public getCompanies(filter?: { status?: string; plan?: string; search?: string }): PlatformCompany[] {
    let result = [...this.companies];

    if (filter?.status && filter.status !== 'all') {
      result = result.filter((c) => c.status === filter.status);
    }
    if (filter?.plan && filter.plan !== 'all') {
      result = result.filter((c) => c.planName.toLowerCase() === filter.plan?.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.legalName.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.primaryContact.email.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public getCompanyById(id: string): PlatformCompany | undefined {
    return this.companies.find((c) => c.id === id);
  }

  public createCompany(data: Partial<PlatformCompany>, actor: string): PlatformCompany {
    const newCompany: PlatformCompany = {
      id: 't-' + Math.random().toString(36).substring(2, 7),
      name: data.name || 'Perusahaan Baru',
      legalName: data.legalName || data.name || 'PT Baru Nusantara',
      code: (data.code || 'CORP').toUpperCase(),
      industry: data.industry || 'Logistik & Transportasi',
      planId: data.planId || 'plan-pro',
      planName: data.planName || 'Professional',
      status: 'trial',
      billingCycle: data.billingCycle || 'monthly',
      mrr: data.mrr || 0,
      currency: 'IDR',
      createdAt: new Date().toISOString(),
      subscriptionExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
      trialEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
      address: data.address || 'Jakarta, Indonesia',
      city: data.city || 'Jakarta',
      province: data.province || 'DKI Jakarta',
      taxIdNpwp: data.taxIdNpwp || '00.000.000.0-000.000',
      primaryContact: data.primaryContact || {
        name: 'Administrator',
        email: 'admin@perusahaan.co.id',
        phone: '+62 812 0000 1111',
        role: 'Admin',
      },
      quotas: data.quotas || {
        maxVehicles: 25,
        currentVehicles: 0,
        maxUsers: 5,
        currentUsers: 1,
        maxDevices: 25,
        currentDevices: 0,
        maxBranches: 2,
        currentBranches: 1,
        aiCreditsMonthly: 5000,
        currentAiCredits: 0,
        storageMb: 10000,
        currentStorageMb: 0,
        apiMonthlyRequests: 10000,
        currentApiRequests: 0,
      },
      features: data.features || {
        liveTracking: true,
        tripHistory: true,
        geofence: true,
        delivery: true,
        fuel: true,
        maintenance: true,
        safety: true,
        fatigue: true,
        analytics: true,
        aiAssistant: true,
        predictiveMaintenance: true,
        aiFuel: true,
        aiDriver: true,
        aiRoute: true,
        aiSafety: true,
        api: false,
        export: true,
        customBranding: false,
        automation: true,
      },
      healthScore: 100,
      telematicsDataRateMsgsSec: 0,
      lastActiveAt: new Date().toISOString(),
    };

    this.companies.unshift(newCompany);
    this.logAudit({
      actorName: actor,
      action: 'TENANT_CREATED',
      category: 'TENANT',
      details: `Membuat tenant baru: ${newCompany.name} (${newCompany.code}) dengan paket ${newCompany.planName}`,
      targetTenantId: newCompany.id,
      targetTenantName: newCompany.name,
      severity: 'medium',
    });
    this.saveToStorage();
    return newCompany;
  }

  public updateCompany(id: string, updates: Partial<PlatformCompany>, actor: string): PlatformCompany {
    const idx = this.companies.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Perusahaan / Tenant tidak ditemukan');

    this.companies[idx] = {
      ...this.companies[idx],
      ...updates,
    };

    this.logAudit({
      actorName: actor,
      action: 'TENANT_UPDATED',
      category: 'TENANT',
      details: `Memperbarui profil / data perusahaan ${this.companies[idx].name}`,
      targetTenantId: id,
      targetTenantName: this.companies[idx].name,
      severity: 'low',
    });

    this.saveToStorage();
    return this.companies[idx];
  }

  public suspendCompany(id: string, reason: string, actor: string): PlatformCompany {
    const idx = this.companies.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Perusahaan tidak ditemukan');

    this.companies[idx].status = 'suspended';
    this.companies[idx].suspensionReason = reason;
    this.companies[idx].suspendedAt = new Date().toISOString();
    this.companies[idx].suspendedBy = actor;
    this.companies[idx].telematicsDataRateMsgsSec = 0;

    this.logAudit({
      actorName: actor,
      action: 'TENANT_SUSPENDED',
      category: 'TENANT',
      details: `Suspensi tenant ${this.companies[idx].name}. Alasan: ${reason}`,
      targetTenantId: id,
      targetTenantName: this.companies[idx].name,
      severity: 'critical',
    });

    this.saveToStorage();
    return this.companies[idx];
  }

  public reactivateCompany(id: string, reason: string, actor: string): PlatformCompany {
    const idx = this.companies.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Perusahaan tidak ditemukan');

    this.companies[idx].status = 'active';
    this.companies[idx].suspensionReason = undefined;
    this.companies[idx].suspendedAt = undefined;
    this.companies[idx].suspendedBy = undefined;
    this.companies[idx].telematicsDataRateMsgsSec = Math.round(this.companies[idx].quotas.currentVehicles * 0.7);

    this.logAudit({
      actorName: actor,
      action: 'TENANT_REACTIVATED',
      category: 'TENANT',
      details: `Reaktivasi tenant ${this.companies[idx].name}. Catatan: ${reason || 'Pembayaran / verifikasi tuntas'}`,
      targetTenantId: id,
      targetTenantName: this.companies[idx].name,
      severity: 'high',
    });

    this.saveToStorage();
    return this.companies[idx];
  }

  public extendTrial(id: string, days: number, reason: string, actor: string): PlatformCompany {
    const idx = this.companies.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Perusahaan tidak ditemukan');

    const currentExpiry = new Date(this.companies[idx].subscriptionExpiresAt).getTime();
    const newExpiry = new Date(Math.max(Date.now(), currentExpiry) + days * 24 * 60 * 60 * 1000).toISOString();

    this.companies[idx].subscriptionExpiresAt = newExpiry;
    this.companies[idx].trialEndsAt = newExpiry;
    this.companies[idx].status = 'trial';

    this.logAudit({
      actorName: actor,
      action: 'TRIAL_EXTENDED',
      category: 'SUBSCRIPTION',
      details: `Memperpanjang masa trial ${this.companies[idx].name} sebanyak ${days} hari sampai ${newExpiry}. Alasan: ${reason}`,
      targetTenantId: id,
      targetTenantName: this.companies[idx].name,
      severity: 'medium',
    });

    this.saveToStorage();
    return this.companies[idx];
  }

  public changePlan(id: string, planName: 'Starter' | 'Professional' | 'Enterprise' | 'Custom', billingCycle: 'monthly' | 'yearly', actor: string): PlatformCompany {
    const idx = this.companies.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Perusahaan tidak ditemukan');

    const mrrMap: Record<string, number> = {
      Starter: 2500000,
      Professional: 7500000,
      Enterprise: 18500000,
      Custom: 25000000,
    };

    const quotaMap: Record<string, Partial<PlatformCompanyQuota>> = {
      Starter: { maxVehicles: 25, maxUsers: 5, maxDevices: 25, aiCreditsMonthly: 3000, apiMonthlyRequests: 10000 },
      Professional: { maxVehicles: 100, maxUsers: 25, maxDevices: 100, aiCreditsMonthly: 20000, apiMonthlyRequests: 100000 },
      Enterprise: { maxVehicles: 300, maxUsers: 60, maxDevices: 300, aiCreditsMonthly: 80000, apiMonthlyRequests: 500000 },
      Custom: { maxVehicles: 500, maxUsers: 100, maxDevices: 500, aiCreditsMonthly: 150000, apiMonthlyRequests: 1000000 },
    };

    const oldPlan = this.companies[idx].planName;
    this.companies[idx].planName = planName;
    this.companies[idx].planId = 'plan-' + planName.toLowerCase();
    this.companies[idx].billingCycle = billingCycle;
    this.companies[idx].mrr = mrrMap[planName] || 5000000;
    this.companies[idx].status = 'active';

    const qUpdates = quotaMap[planName] || {};
    this.companies[idx].quotas = {
      ...this.companies[idx].quotas,
      ...qUpdates,
    };

    this.logAudit({
      actorName: actor,
      action: 'PLAN_CHANGED',
      category: 'SUBSCRIPTION',
      details: `Mengubah paket berlangganan ${this.companies[idx].name} dari ${oldPlan} ke ${planName} (${billingCycle})`,
      targetTenantId: id,
      targetTenantName: this.companies[idx].name,
      severity: 'high',
    });

    this.saveToStorage();
    return this.companies[idx];
  }

  public overrideQuotas(id: string, newQuotas: Partial<PlatformCompanyQuota>, reason: string, actor: string): PlatformCompany {
    const idx = this.companies.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Perusahaan tidak ditemukan');

    this.companies[idx].quotas = {
      ...this.companies[idx].quotas,
      ...newQuotas,
    };

    this.logAudit({
      actorName: actor,
      action: 'TENANT_QUOTA_OVERRIDE',
      category: 'SUBSCRIPTION',
      details: `Override kuota custom untuk ${this.companies[idx].name}. Alasan: ${reason}`,
      targetTenantId: id,
      targetTenantName: this.companies[idx].name,
      severity: 'medium',
    });

    this.saveToStorage();
    return this.companies[idx];
  }

  // --- USERS MANAGEMENT ---
  public getUsers(filter?: { tenantId?: string; role?: string; status?: string; search?: string }): PlatformUser[] {
    let list = [...this.users];
    if (filter?.tenantId && filter.tenantId !== 'all') {
      list = list.filter((u) => u.tenantId === filter.tenantId);
    }
    if (filter?.role && filter.role !== 'all') {
      list = list.filter((u) => u.role === filter.role);
    }
    if (filter?.status && filter.status !== 'all') {
      list = list.filter((u) => u.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.tenantName.toLowerCase().includes(q) ||
          u.phone.includes(q)
      );
    }
    return list;
  }

  public updateUserStatus(userId: string, status: 'active' | 'locked' | 'suspended', reason: string, actor: string): PlatformUser {
    const idx = this.users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('User tidak ditemukan');

    this.users[idx].status = status;
    if (status === 'locked' || status === 'suspended') {
      this.users[idx].activeSessionsCount = 0;
    }

    this.logAudit({
      actorName: actor,
      action: status === 'active' ? 'USER_UNLOCKED' : 'USER_LOCKED',
      category: 'USER',
      details: `Mengubah status user ${this.users[idx].email} menjadi ${status}. Alasan: ${reason}`,
      targetTenantId: this.users[idx].tenantId,
      targetTenantName: this.users[idx].tenantName,
      severity: 'high',
    });

    this.saveToStorage();
    return this.users[idx];
  }

  public forceRevokeUserSessions(userId: string, actor: string): void {
    const idx = this.users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('User tidak ditemukan');

    this.users[idx].activeSessionsCount = 0;

    this.logAudit({
      actorName: actor,
      action: 'USER_SESSIONS_REVOKED',
      category: 'SECURITY',
      details: `Memutus seluruh sesi aktif untuk user ${this.users[idx].email}`,
      targetTenantId: this.users[idx].tenantId,
      targetTenantName: this.users[idx].tenantName,
      severity: 'medium',
    });

    this.saveToStorage();
  }

  // --- TELEMATICS & IOT DEVICES ---
  public getDevices(filter?: { protocol?: string; provider?: string; status?: string; search?: string }): PlatformDeviceItem[] {
    let list = [...this.devices];
    if (filter?.protocol && filter.protocol !== 'all') {
      list = list.filter((d) => d.protocol === filter.protocol);
    }
    if (filter?.provider && filter.provider !== 'all') {
      list = list.filter((d) => d.simProvider === filter.provider);
    }
    if (filter?.status && filter.status !== 'all') {
      list = list.filter((d) => d.connectionStatus === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (d) =>
          d.imei.includes(q) ||
          d.hardwareModel.toLowerCase().includes(q) ||
          d.tenantName.toLowerCase().includes(q) ||
          d.simNumber.includes(q) ||
          (d.vehiclePlate && d.vehiclePlate.toLowerCase().includes(q))
      );
    }
    return list;
  }

  public dispatchOtaUpdate(deviceIds: string[], firmwareVersion: string, actor: string): { dispatchedCount: number; message: string } {
    let updated = 0;
    this.devices = this.devices.map((d) => {
      if (deviceIds.includes(d.id)) {
        updated++;
        return {
          ...d,
          firmwareVersion,
        };
      }
      return d;
    });

    this.logAudit({
      actorName: actor,
      action: 'DEVICE_OTA_BATCH_DISPATCH',
      category: 'SYSTEM',
      details: `Dispatch OTA firmware update ${firmwareVersion} ke ${updated} unit GPS tracker`,
      severity: 'high',
    });

    this.saveToStorage();
    return {
      dispatchedCount: updated,
      message: `Berhasil mendistribusikan OTA firmware ${firmwareVersion} ke ${updated} perangkat GPS telematika.`,
    };
  }

  // --- REVENUE & BILLING METRICS ---
  public getRevenueMetrics(): PlatformRevenueMetrics {
    const activeCompanies = this.companies.filter((c) => c.status === 'active');
    const mrrTotal = activeCompanies.reduce((acc, c) => acc + c.mrr, 0);
    const arrTotal = mrrTotal * 12;
    const arpu = activeCompanies.length > 0 ? Math.round(mrrTotal / activeCompanies.length) : 0;

    const planStats: Record<string, { count: number; revenue: number; color: string }> = {
      Enterprise: { count: 0, revenue: 0, color: '#38bdf8' },
      Professional: { count: 0, revenue: 0, color: '#818cf8' },
      Starter: { count: 0, revenue: 0, color: '#34d399' },
      Custom: { count: 0, revenue: 0, color: '#f472b6' },
    };

    this.companies.forEach((c) => {
      const p = c.planName || 'Professional';
      if (!planStats[p]) {
        planStats[p] = { count: 0, revenue: 0, color: '#94a3b8' };
      }
      planStats[p].count += 1;
      if (c.status === 'active') {
        planStats[p].revenue += c.mrr;
      }
    });

    const revenueByPlan = Object.entries(planStats).map(([planName, val]) => ({
      planName,
      count: val.count,
      revenue: val.revenue,
      color: val.color,
    }));

    const monthlyRevenueTrend = [
      { month: 'Sep 25', mrr: 38000000, newMrr: 4500000, expansionMrr: 1200000, churnMrr: 800000, netRevenue: 42900000 },
      { month: 'Okt 25', mrr: 41000000, newMrr: 5200000, expansionMrr: 1500000, churnMrr: 600000, netRevenue: 47100000 },
      { month: 'Nov 25', mrr: 45200000, newMrr: 6100000, expansionMrr: 1800000, churnMrr: 700000, netRevenue: 52400000 },
      { month: 'Des 25', mrr: 49800000, newMrr: 7000000, expansionMrr: 2100000, churnMrr: 900000, netRevenue: 58000000 },
      { month: 'Jan 26', mrr: 53500000, newMrr: 6800000, expansionMrr: 2400000, churnMrr: 1100000, netRevenue: 61600000 },
      { month: 'Feb 26', mrr: 58700000, newMrr: 7500000, expansionMrr: 2800000, churnMrr: 800000, netRevenue: 68200000 },
      { month: 'Mar 26', mrr: 62400000, newMrr: 6200000, expansionMrr: 3100000, churnMrr: 1200000, netRevenue: 70500000 },
      { month: 'Apr 26', mrr: 66900000, newMrr: 8100000, expansionMrr: 3500000, churnMrr: 900000, netRevenue: 77600000 },
      { month: 'Mei 26', mrr: 71200000, newMrr: 7400000, expansionMrr: 3900000, churnMrr: 1400000, netRevenue: 81100000 },
      { month: 'Jun 26', mrr: 76800000, newMrr: 8900000, expansionMrr: 4200000, churnMrr: 1100000, netRevenue: 88800000 },
      { month: 'Jul 26', mrr: 81500000, newMrr: 9200000, expansionMrr: 4600000, churnMrr: 1300000, netRevenue: 94000000 },
      { month: 'Agu 26', mrr: mrrTotal, newMrr: 9800000, expansionMrr: 5100000, churnMrr: 1200000, netRevenue: mrrTotal },
    ];

    const gatewayDistribution: PlatformRevenueMetrics['gatewayDistribution'] = [
      { gateway: 'Midtrans', volume: 38400000, transactionsCount: 48, successRate: 99.2 },
      { gateway: 'Xendit', volume: 22600000, transactionsCount: 32, successRate: 98.9 },
      { gateway: 'DOKU', volume: 14200000, transactionsCount: 18, successRate: 98.4 },
      { gateway: 'Bank Transfer', volume: 18500000, transactionsCount: 6, successRate: 100.0 },
    ];

    return {
      mrrTotal,
      arrTotal,
      arpu,
      totalSubscribers: activeCompanies.length,
      churnRatePercent: 1.4,
      expansionMrr: 5100000,
      netRevenueRetentionPercent: 118.5,
      lifetimeRevenue: 894500000,
      pendingInvoicesAmount: 4500000,
      failedInvoicesAmount: 0,
      growthMoMPercent: 8.2,
      revenueByPlan,
      monthlyRevenueTrend,
      gatewayDistribution,
    };
  }

  // --- AI & API METRICS ---
  public getAiApiMetrics(): PlatformAiApiMetrics {
    const tokensTrend = [
      { date: '11 Agu', geminiProTokens: 14200, geminiFlashTokens: 28400, visionTokens: 6200, costUsd: 18.2 },
      { date: '12 Agu', geminiProTokens: 16800, geminiFlashTokens: 31200, visionTokens: 7100, costUsd: 21.4 },
      { date: '13 Agu', geminiProTokens: 15400, geminiFlashTokens: 29800, visionTokens: 6800, costUsd: 19.8 },
      { date: '14 Agu', geminiProTokens: 19200, geminiFlashTokens: 38500, visionTokens: 8900, costUsd: 26.5 },
      { date: '15 Agu', geminiProTokens: 22100, geminiFlashTokens: 42100, visionTokens: 10400, costUsd: 31.2 },
      { date: '16 Agu', geminiProTokens: 18500, geminiFlashTokens: 36200, visionTokens: 8100, costUsd: 24.8 },
      { date: '17 Agu', geminiProTokens: 24600, geminiFlashTokens: 46800, visionTokens: 12200, costUsd: 36.4 },
    ];

    const aiModulesBreakdown = [
      { module: 'AI Copilot & Natural Query Assistant', tokens: 78500, costUsd: 157.0, percentage: 45 },
      { module: 'AI Predictive Maintenance Engine', tokens: 38400, costUsd: 76.8, percentage: 22 },
      { module: 'Driver Fatigue & Safety Vision Telematics', tokens: 31400, costUsd: 62.8, percentage: 18 },
      { module: 'AI Route & Dynamic Corridor Optimization', tokens: 15600, costUsd: 31.2, percentage: 9 },
      { module: 'Automation Engine Smart Triggers', tokens: 10350, costUsd: 20.7, percentage: 6 },
    ];

    const topAiTenants = this.companies.map((c) => ({
      tenantId: c.id,
      tenantName: c.name,
      tokensConsumed: Math.round(c.quotas.currentAiCredits * 2.4),
      creditsUsed: c.quotas.currentAiCredits,
      creditsLimit: c.quotas.aiCreditsMonthly,
      quotaPercentage: Math.round((c.quotas.currentAiCredits / (c.quotas.aiCreditsMonthly || 1)) * 100),
    }));

    const apiGateway = {
      totalRequests24h: 384500,
      avgRequestsPerSec: 142.5,
      peakRequestsPerSec: 480.0,
      p95LatencyMs: 24.2,
      p99LatencyMs: 68.5,
      http2xxCount: 381200,
      http4xxCount: 3150,
      http5xxCount: 150,
      throttledRequestsCount: 42,
      endpoints: [
        { path: 'POST /api/v1/telematics/ingest', method: 'POST', calls24h: 215400, avgLatencyMs: 12.4, errorRate: 0.02 },
        { path: 'GET /api/v1/vehicles/live', method: 'GET', calls24h: 84200, avgLatencyMs: 18.6, errorRate: 0.05 },
        { path: 'POST /api/v1/ai/query', method: 'POST', calls24h: 34100, avgLatencyMs: 280.4, errorRate: 0.12 },
        { path: 'GET /api/v1/trips/history', method: 'GET', calls24h: 28900, avgLatencyMs: 42.1, errorRate: 0.08 },
        { path: 'POST /api/v1/auth/token', method: 'POST', calls24h: 12400, avgLatencyMs: 35.8, errorRate: 0.01 },
      ],
    };

    return {
      totalTokensMonthly: 174250,
      tokensTrend,
      estimatedCostUsd: 348.5,
      estimatedCostIdr: 5471450,
      aiModulesBreakdown,
      topAiTenants,
      apiGateway,
    };
  }

  // --- SYSTEM HEALTH & MICROSERVICES ---
  public getMicroservicesHealth(): MicroserviceHealthItem[] {
    return [
      {
        id: 'srv-01',
        name: 'Auth & Multi-Tenant IAM Gateway',
        category: 'Core Service',
        status: 'operational',
        uptimePercent: 99.99,
        latencyMs: 14,
        version: 'v2.4.1',
        instancesCount: 4,
        region: 'ap-southeast-3 (Jakarta)',
      },
      {
        id: 'srv-02',
        name: 'IoT Telematics Ingestion Socket Cluster',
        category: 'Data Ingestion',
        status: 'operational',
        uptimePercent: 99.98,
        latencyMs: 8,
        version: 'v3.1.0-stream',
        instancesCount: 12,
        region: 'ap-southeast-3 (Jakarta)',
      },
      {
        id: 'srv-03',
        name: 'Geofence & Corridor Boundary Engine',
        category: 'Data Ingestion',
        status: 'operational',
        uptimePercent: 99.97,
        latencyMs: 11,
        version: 'v2.0.8',
        instancesCount: 6,
        region: 'ap-southeast-3 (Jakarta)',
      },
      {
        id: 'srv-04',
        name: 'AI Smart Inference & LLM Gateway (Gemini)',
        category: 'AI & Analytics',
        status: 'operational',
        uptimePercent: 99.95,
        latencyMs: 185,
        version: 'v1.8.4',
        instancesCount: 8,
        region: 'ap-southeast-3 (Jakarta)',
      },
      {
        id: 'srv-05',
        name: 'Timeseries Telemetry DB Cluster',
        category: 'Core Service',
        status: 'operational',
        uptimePercent: 99.99,
        latencyMs: 5,
        version: 'v2.12.0',
        instancesCount: 6,
        region: 'ap-southeast-3 (Jakarta)',
      },
      {
        id: 'srv-06',
        name: 'Subscription & Billing Webhook Worker',
        category: 'Worker & Jobs',
        status: 'operational',
        uptimePercent: 100.0,
        latencyMs: 22,
        version: 'v1.4.2',
        instancesCount: 3,
        region: 'ap-southeast-1 (Singapore)',
      },
      {
        id: 'srv-07',
        name: 'Automation Engine Scheduler & Runner',
        category: 'Worker & Jobs',
        status: 'operational',
        uptimePercent: 99.98,
        latencyMs: 16,
        version: 'v2.2.0',
        instancesCount: 4,
        region: 'ap-southeast-3 (Jakarta)',
      },
      {
        id: 'srv-08',
        name: 'Push Notification & WhatsApp Gateway',
        category: 'Gateway',
        status: 'operational',
        uptimePercent: 99.92,
        latencyMs: 38,
        version: 'v1.9.1',
        instancesCount: 3,
        region: 'ap-southeast-3 (Jakarta)',
      },
    ];
  }

  public getSystemResourceMetrics(): SystemResourceMetrics {
    return {
      cpuUsagePercent: 34.8,
      memoryUsagePercent: 58.2,
      diskIoIops: 2450,
      ingestionMsgsSec: 324.5,
      activeWebsockets: 1840,
      redisCacheHitRate: 98.4,
      dbConnectionPoolUsed: 42,
      dbConnectionPoolMax: 200,
      bandwidthMbps: 68.4,
    };
  }

  // --- INCIDENTS & ANNOUNCEMENTS ---
  public getIncidents(): PlatformIncident[] {
    return [...this.incidents];
  }

  public createIncident(data: { title: string; severity: PlatformIncident['severity']; affectedServices: string[]; impactDescription: string; initialMessage: string }, actor: string): PlatformIncident {
    const newInc: PlatformIncident = {
      id: 'inc-' + new Date().getFullYear() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      title: data.title,
      severity: data.severity,
      status: 'investigating',
      affectedServices: data.affectedServices,
      impactDescription: data.impactDescription,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          timestamp: new Date().toISOString(),
          status: 'investigating',
          message: data.initialMessage || 'Tim SRE sedang menginvestigasi anomali.',
          author: actor,
        },
      ],
    };

    this.incidents.unshift(newInc);
    this.logAudit({
      actorName: actor,
      action: 'INCIDENT_CREATED',
      category: 'SYSTEM',
      details: `Membuat insiden ${newInc.severity}: ${newInc.title}`,
      severity: newInc.severity === 'P1_CRITICAL' ? 'critical' : 'high',
    });

    this.saveToStorage();
    return newInc;
  }

  public addIncidentUpdate(incidentId: string, status: PlatformIncident['status'], message: string, actor: string): PlatformIncident {
    const idx = this.incidents.findIndex((i) => i.id === incidentId);
    if (idx === -1) throw new Error('Insiden tidak ditemukan');

    this.incidents[idx].status = status;
    this.incidents[idx].updatedAt = new Date().toISOString();
    if (status === 'resolved') {
      this.incidents[idx].resolvedAt = new Date().toISOString();
    }

    this.incidents[idx].timeline.push({
      timestamp: new Date().toISOString(),
      status,
      message,
      author: actor,
    });

    this.logAudit({
      actorName: actor,
      action: status === 'resolved' ? 'INCIDENT_RESOLVED' : 'INCIDENT_UPDATED',
      category: 'SYSTEM',
      details: `Update insiden ${this.incidents[idx].id} status -> ${status}: ${message}`,
      severity: status === 'resolved' ? 'medium' : 'high',
    });

    this.saveToStorage();
    return this.incidents[idx];
  }

  public getAnnouncements(): PlatformAnnouncement[] {
    return [...this.announcements];
  }

  public createAnnouncement(data: { title: string; message: string; severity: PlatformAnnouncement['severity']; targetAudience: PlatformAnnouncement['targetAudience']; expiresDays: number }, actor: string): PlatformAnnouncement {
    const newAnn: PlatformAnnouncement = {
      id: 'ann-' + Date.now(),
      title: data.title,
      message: data.message,
      severity: data.severity,
      targetAudience: data.targetAudience,
      isActive: true,
      startsAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + data.expiresDays * 24 * 60 * 60 * 1000).toISOString(),
      dismissible: true,
      createdBy: actor,
      createdAt: new Date().toISOString(),
    };

    this.announcements.unshift(newAnn);
    this.logAudit({
      actorName: actor,
      action: 'ANNOUNCEMENT_POSTED',
      category: 'SYSTEM',
      details: `Membuat broadcast pengumuman global: "${newAnn.title}" untuk audiens ${newAnn.targetAudience}`,
      severity: 'low',
    });

    this.saveToStorage();
    return newAnn;
  }

  public deleteAnnouncement(id: string, actor: string): void {
    this.announcements = this.announcements.filter((a) => a.id !== id);
    this.logAudit({
      actorName: actor,
      action: 'ANNOUNCEMENT_DELETED',
      category: 'SYSTEM',
      details: `Menghapus broadcast pengumuman ${id}`,
      severity: 'low',
    });
    this.saveToStorage();
  }

  // --- SUPPORT ACCESS IMPERSONATION ---
  public startImpersonation(tenantId: string, reason: string, superAdmin: { id: string; name: string; email: string }): ImpersonationSession {
    const company = this.getCompanyById(tenantId);
    if (!company) throw new Error('Tenant tidak ditemukan untuk impersonasi');

    const session: ImpersonationSession = {
      active: true,
      tenantId: company.id,
      tenantName: company.name,
      tenantCode: company.code,
      superAdminId: superAdmin.id,
      superAdminName: superAdmin.name,
      superAdminEmail: superAdmin.email,
      startedAt: new Date().toISOString(),
      reason: reason || 'Support Diagnostic Session',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour max duration
    };

    this.impersonationSession = session;

    this.logAudit({
      actorId: superAdmin.id,
      actorName: superAdmin.name,
      actorEmail: superAdmin.email,
      actorRole: 'Super Admin',
      action: 'SUPPORT_IMPERSONATION_STARTED',
      category: 'IMPERSONATION',
      details: `Super Admin masuk mode Support Access ke ruang kerja ${company.name} (${company.code}). Alasan: ${reason}`,
      targetTenantId: company.id,
      targetTenantName: company.name,
      severity: 'critical',
    });

    this.saveToStorage();
    return session;
  }

  public stopImpersonation(): void {
    if (!this.impersonationSession) return;

    const current = this.impersonationSession;
    this.impersonationSession = null;

    this.logAudit({
      actorId: current.superAdminId,
      actorName: current.superAdminName,
      actorEmail: current.superAdminEmail,
      actorRole: 'Super Admin',
      action: 'SUPPORT_IMPERSONATION_ENDED',
      category: 'IMPERSONATION',
      details: `Super Admin mengakhiri mode Support Access pada ruang kerja ${current.tenantName}`,
      targetTenantId: current.tenantId,
      targetTenantName: current.tenantName,
      severity: 'high',
    });

    this.saveToStorage();
  }

  public getImpersonationSession(): ImpersonationSession | null {
    return this.impersonationSession;
  }

  public getActiveImpersonation(): ImpersonationSession | null {
    return this.impersonationSession;
  }

  // --- AUDIT TRAIL ---
  public getAuditLogs(filter?: { category?: string; severity?: string; search?: string }): PlatformAuditLog[] {
    let list = [...this.auditLogs];
    if (filter?.category && filter.category !== 'all') {
      list = list.filter((a) => a.category === filter.category);
    }
    if (filter?.severity && filter.severity !== 'all') {
      list = list.filter((a) => a.severity === filter.severity);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.action.toLowerCase().includes(q) ||
          a.details.toLowerCase().includes(q) ||
          a.actorName.toLowerCase().includes(q) ||
          (a.targetTenantName && a.targetTenantName.toLowerCase().includes(q))
      );
    }
    return list;
  }

  private logAudit(entry: Partial<PlatformAuditLog>): void {
    const newLog: PlatformAuditLog = {
      id: 'aud-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toISOString(),
      actorId: entry.actorId || 'u-super-01',
      actorName: entry.actorName || 'Alexandra Pratama',
      actorEmail: entry.actorEmail || 'superadmin@platform.local',
      actorRole: entry.actorRole || 'Super Admin',
      action: entry.action || 'SYSTEM_ACTION',
      category: entry.category || 'SECURITY',
      details: entry.details || 'Audit action logged',
      targetTenantId: entry.targetTenantId,
      targetTenantName: entry.targetTenantName,
      ipAddress: entry.ipAddress || '182.253.112.44',
      userAgent: entry.userAgent || navigator.userAgent,
      location: entry.location || 'Jakarta, Indonesia',
      severity: entry.severity || 'low',
    };

    this.auditLogs.unshift(newLog);
    if (this.auditLogs.length > 500) {
      this.auditLogs = this.auditLogs.slice(0, 500);
    }
  }

  // --- AI SUPER ADMIN COPILOT PLATFORM ASSISTANT ---
  public async queryPlatformCopilot(prompt: string): Promise<string> {
    // Simulate smart AI response based on real platform state
    await new Promise((res) => setTimeout(res, 800));

    const p = prompt.toLowerCase();
    const kpi = this.getDashboardKpis();
    const companies = this.getCompanies();

    if (p.includes('quota') || p.includes('kuota') || p.includes('utilisasi')) {
      const highUsage = companies.filter((c) => (c.quotas.currentVehicles / c.quotas.maxVehicles) > 0.75);
      return `📊 **Analisis Utilisasi Kuota Platform:**
Saat ini terdapat **${highUsage.length} perusahaan** dengan utilisasi kuota armada > 75%:
${highUsage.map((c) => `• **${c.name}**: ${c.quotas.currentVehicles}/${c.quotas.maxVehicles} unit (${Math.round((c.quotas.currentVehicles / c.quotas.maxVehicles) * 100)}%) - Paket ${c.planName}`).join('\n')}

💡 **Rekomendasi Penjualan:** Hubungi account representative untuk PT Nusantara Cold Chain Logistics dan PT XYZ Transportindo guna penawaran upgrade paket Enterprise Custom.`;
    }

    if (p.includes('revenue') || p.includes('mrr') || p.includes('pendapatan') || p.includes('finansial')) {
      return `💰 **Laporan Finansial Platform SaaS:**
• **Total MRR:** Rp ${kpi.mrrTotal.toLocaleString('id-ID')}
• **Annual Recurring Revenue (ARR):** Rp ${kpi.arrTotal.toLocaleString('id-ID')}
• **Average Revenue Per User/Tenant (ARPU):** Rp ${kpi.arpu.toLocaleString('id-ID')}
• **Churn Rate:** ${kpi.churnRate}% (Sangat sehat di bawah benchmark industri 2.5%)
• **Pertumbuhan MoM:** +8.2% pada bulan Agustus 2026.`;
    }

    if (p.includes('gps') || p.includes('device') || p.includes('perangkat') || p.includes('drop')) {
      const online = this.devices.filter((d) => d.connectionStatus === 'online').length;
      return `📡 **Status Ekosistem GPS & IoT Telematics:**
• **Total Perangkat Terdaftar:** ${this.devices.length} unit (Online: ${online}, Offline/Dormant: ${this.devices.length - online})
• **Protokol Terbanyak:** Teltonika FMB920 (44%), Queclink GV300 (28%), Concox AT4 (18%)
• **Rata-rata Packet Drop:** 0.07% (Sangat prima, di bawah ambang 1.0%)
• **SIM Connectivity:** Telkomsel IoT mendominasi 72% koneksi aktif.`;
    }

    if (p.includes('security') || p.includes('keamanan') || p.includes('audit') || p.includes('anomali')) {
      return `🛡️ **Audit Keamanan & Kepatuhan Platform:**
• **Tingkat 2FA Aktif:** 78% akun administrator perusahaan telah mengaktifkan TOTP 2FA.
• **Insiden Aktif:** ${kpi.openIncidentsCount} insiden terbuka.
• **Log Terakhir:** Override kuota custom & broadcast pembaruan AI engine tercatat tanpa anomali otorisasi.
• **Saran Keamanan:** Wajibkan penegakan 2FA untuk semua tenant paket Enterprise.`;
    }

    return `🤖 **Platform Intelligence Assistant:**
Berdasarkan data operasional platform saat ini:
• **Ekosistem Tenant:** ${kpi.totalCompanies} perusahaan (${kpi.activeCompanies} aktif, ${kpi.trialCompanies} masa uji coba).
• **Total Armada Terpantau:** ${kpi.totalVehicles} kendaraan di seluruh Indonesia.
• **Kesehatan Sistem:** ${kpi.systemOverallHealth} (99.98% SLA Uptime) dengan throughput ingestion ${kpi.ingestionThroughputMsgsSec} msgs/sec.
• **AI Monthly Compute:** ${kpi.aiMonthlyTokens.toLocaleString()} tokens ($${kpi.aiMonthlySpendUsd.toFixed(2)} USD).

Silakan tanyakan spesifik mengenai: *Perusahaan berisiko churn*, *Audit token AI*, *Analisis performa GPS IoT*, atau *Simulasi revenue kuartal berikutnya*.`;
  }
}

export const superAdminService = new SuperAdminService();
