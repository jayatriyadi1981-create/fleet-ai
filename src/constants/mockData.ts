/**
 * Fleet Intelligence Smart AI - Enterprise Mock Dataset
 * Realistic Indonesian Fleet, GPS Telemetry & Multi-tenant Mock Infrastructure
 */

import { TenantCompany, Branch, UserProfile, Vehicle, GPSDevice, Driver, Trip, Geofence, PointOfInterest, FuelRecord, MaintenanceWorkOrder, SafetyIncident, AlertNotification, AIInsight } from '../types';

export const mockTenant: TenantCompany = {
  id: 'tenant-tln-01',
  name: 'PT Trans Logistik Nusantara',
  code: 'TLN',
  taxIdNpwp: '01.345.678.9-012.000',
  address: 'Jl. Raya Industri No. 88, Cikarang Barat, Kabupaten Bekasi, Jawa Barat 17530',
  phone: '+62 21 8901 2345',
  email: 'operations@translogistik.co.id',
  branchesCount: 4,
  vehiclesCount: 128,
  subscriptionPlan: 'Enterprise',
  status: 'active',
};

export const mockBranches: Branch[] = [
  { id: 'br-jkt', tenantId: 'tenant-tln-01', name: 'HQ & Depo Jakarta (Tanjung Priok)', code: 'JKT-01', city: 'Jakarta Utara', vehiclesCount: 45, managerName: 'Bambang Soeprapto' },
  { id: 'br-ckr', tenantId: 'tenant-tln-01', name: 'Hub Logistik Cikarang Dry Port', code: 'CKR-02', city: 'Bekasi', vehiclesCount: 38, managerName: 'Rudi Hermawan' },
  { id: 'br-sby', tenantId: 'tenant-tln-01', name: 'Depo Surabaya (Tanjung Perak)', code: 'SBY-03', city: 'Surabaya', vehiclesCount: 28, managerName: 'Agus Wijaya' },
  { id: 'br-mkn', tenantId: 'tenant-tln-01', name: 'Cabang Makassar (Soekarno-Hatta Port)', code: 'MKN-04', city: 'Makassar', vehiclesCount: 17, managerName: 'Irfan Tahir' },
];

export const mockUser: UserProfile = {
  id: 'usr-admin-01',
  tenantId: 'tenant-tln-01',
  branchId: 'br-jkt',
  name: 'Hendrikus Setiawan',
  email: 'hendrikus@translogistik.co.id',
  role: 'fleet_manager',
  department: 'Fleet & Operations',
  phone: '+62 812 9876 5432',
  permissions: [
    'vehicle.view', 'vehicle.create', 'vehicle.edit',
    'driver.view', 'driver.create', 'driver.edit',
    'trip.view', 'trip.create', 'trip.edit',
    'fuel.view', 'fuel.manage',
    'maintenance.view', 'maintenance.create', 'maintenance.approve',
    'safety.view', 'alert.view',
    'report.view', 'report.export',
    'ai.view', 'ai.ask', 'ai.execute'
  ]
};

export const mockGpsDevices: GPSDevice[] = [
  { id: 'dev-01', imei: '864201049283011', model: 'Teltonika FMB920', protocol: 'TELTONIKA', simNumber: '08119000101', provider: 'Telkomsel IoT', status: 'active', installedAt: '2025-01-15', lastHeartbeat: '2026-08-13T08:30:00Z' },
  { id: 'dev-02', imei: '864201049283022', model: 'Concox AT4', protocol: 'CONCOX', simNumber: '08119000102', provider: 'Telkomsel IoT', status: 'active', installedAt: '2025-02-10', lastHeartbeat: '2026-08-13T08:29:55Z' },
  { id: 'dev-03', imei: '864201049283033', model: 'Queclink GV300', protocol: 'TELTONIKA', simNumber: '08119000103', provider: 'Indosat Ooredoo', status: 'active', installedAt: '2025-03-01', lastHeartbeat: '2026-08-13T08:28:40Z' },
  { id: 'dev-04', imei: '864201049283044', model: 'Meitrack T333', protocol: 'MEITRACK', simNumber: '08119000104', provider: 'XL Axiata', status: 'active', installedAt: '2025-04-12', lastHeartbeat: '2026-08-13T08:30:10Z' },
  { id: 'dev-05', imei: '864201049283055', model: 'JT808 Video DVR', protocol: 'JT808', simNumber: '08119000105', provider: 'Telkomsel IoT', status: 'active', installedAt: '2025-05-20', lastHeartbeat: '2026-08-13T08:27:12Z' },
];

export const mockDrivers: Driver[] = [
  {
    id: 'drv-01',
    tenantId: 'tenant-tln-01',
    branchId: 'br-jkt',
    name: 'Sutrisno Hartono',
    phone: '+62 813 1122 3344',
    simNumber: '9203182390123',
    simType: 'SIM B2 Umum',
    simExpiry: '2028-11-20',
    nik: '3175081203850001',
    status: 'on_trip',
    assignedVehicleId: 'veh-01',
    score: {
      overallScore: 94,
      safetyScore: 96,
      ecoScore: 92,
      speedingCount: 1,
      harshBrakingCount: 0,
      harshAccelerationCount: 1,
      sharpTurnCount: 0,
      idleExcessMinutes: 12,
      fatigueAlertsCount: 0,
      totalDistanceKm: 14850,
      totalDriveTimeMinutes: 24000
    },
    totalTripsCompleted: 142
  },
  {
    id: 'drv-02',
    tenantId: 'tenant-tln-01',
    branchId: 'br-ckr',
    name: 'Ahmad Dahlan',
    phone: '+62 813 2233 4455',
    simNumber: '9203182390456',
    simType: 'SIM B2 Umum',
    simExpiry: '2027-05-14',
    nik: '3216021508820003',
    status: 'on_trip',
    assignedVehicleId: 'veh-02',
    score: {
      overallScore: 82,
      safetyScore: 80,
      ecoScore: 84,
      speedingCount: 6,
      harshBrakingCount: 4,
      harshAccelerationCount: 3,
      sharpTurnCount: 2,
      idleExcessMinutes: 45,
      fatigueAlertsCount: 1,
      totalDistanceKm: 18200,
      totalDriveTimeMinutes: 29500
    },
    totalTripsCompleted: 188
  },
  {
    id: 'drv-03',
    tenantId: 'tenant-tln-01',
    branchId: 'br-jkt',
    name: 'Eko Prasetyo',
    phone: '+62 813 3344 5566',
    simNumber: '9203182390789',
    simType: 'SIM B1',
    simExpiry: '2026-10-05',
    nik: '3172012809900004',
    status: 'active',
    assignedVehicleId: 'veh-03',
    score: {
      overallScore: 88,
      safetyScore: 90,
      ecoScore: 86,
      speedingCount: 2,
      harshBrakingCount: 1,
      harshAccelerationCount: 2,
      sharpTurnCount: 1,
      idleExcessMinutes: 20,
      fatigueAlertsCount: 0,
      totalDistanceKm: 11400,
      totalDriveTimeMinutes: 18000
    },
    totalTripsCompleted: 98
  },
  {
    id: 'drv-04',
    tenantId: 'tenant-tln-01',
    branchId: 'br-sby',
    name: 'Joko Widodo Supriyadi',
    phone: '+62 813 4455 6677',
    simNumber: '9203182390999',
    simType: 'SIM B2 Umum',
    simExpiry: '2029-01-30',
    nik: '3578010406870002',
    status: 'on_trip',
    assignedVehicleId: 'veh-04',
    score: {
      overallScore: 76,
      safetyScore: 72,
      ecoScore: 80,
      speedingCount: 12,
      harshBrakingCount: 8,
      harshAccelerationCount: 5,
      sharpTurnCount: 3,
      idleExcessMinutes: 90,
      fatigueAlertsCount: 2,
      totalDistanceKm: 22100,
      totalDriveTimeMinutes: 34000
    },
    totalTripsCompleted: 215
  }
];

export const mockVehicles: Vehicle[] = [
  {
    id: 'veh-01',
    tenantId: 'tenant-tln-01',
    branchId: 'br-jkt',
    plateNumber: 'B 9482 UTX',
    vin: 'MHF1TR30928109231',
    brand: 'Hino',
    model: 'Ranger FL 235 JW',
    year: 2023,
    type: 'truck_box',
    fuelType: 'biodiesel_b35',
    fuelCapacityLiters: 200,
    status: 'moving',
    currentDriverId: 'drv-01',
    gpsDeviceId: 'dev-01',
    odometerKm: 84320,
    engineHours: 3120,
    groupName: 'Armada Trans-Jawa',
    maintenanceOverdue: false,
    insuranceExpiry: '2027-03-15',
    stnkExpiry: '2027-08-20',
    kirExpiry: '2026-12-10',
    latestTelemetry: {
      deviceId: 'dev-01',
      imei: '864201049283011',
      timestamp: new Date().toISOString(),
      location: { lat: -6.2297, lng: 106.9275, address: 'Tol Jakarta-Cikampek KM 18, Bekasi', speed: 68, heading: 92, altitude: 25 },
      ignition: true,
      engineRpm: 1850,
      fuelLevelPercent: 78,
      fuelLevelLiters: 156,
      engineTempCelsius: 86,
      batteryVoltage: 24.2,
      odometerKm: 84320,
      engineHours: 3120,
      doorOpen: false,
      acOn: true,
      gpsSignal: 95,
      gsmSignal: 88,
      driverId: 'drv-01'
    }
  },
  {
    id: 'veh-02',
    tenantId: 'tenant-tln-01',
    branchId: 'br-ckr',
    plateNumber: 'B 9102 CKR',
    vin: 'MHF1TR30928109999',
    brand: 'Isuzu',
    model: 'Giga FVR 34 P',
    year: 2024,
    type: 'truck_container',
    fuelType: 'biodiesel_b35',
    fuelCapacityLiters: 300,
    status: 'moving',
    currentDriverId: 'drv-02',
    gpsDeviceId: 'dev-02',
    odometerKm: 52140,
    engineHours: 1980,
    groupName: 'Container Port-Cikarang',
    maintenanceOverdue: false,
    insuranceExpiry: '2027-06-10',
    stnkExpiry: '2028-01-12',
    kirExpiry: '2027-02-18',
    latestTelemetry: {
      deviceId: 'dev-02',
      imei: '864201049283022',
      timestamp: new Date().toISOString(),
      location: { lat: -6.2825, lng: 107.1702, address: 'Cikarang Dry Port, Jababeka', speed: 28, heading: 180, altitude: 32 },
      ignition: true,
      engineRpm: 1200,
      fuelLevelPercent: 62,
      fuelLevelLiters: 186,
      engineTempCelsius: 88,
      batteryVoltage: 24.0,
      odometerKm: 52140,
      engineHours: 1980,
      doorOpen: false,
      acOn: false,
      gpsSignal: 92,
      gsmSignal: 90,
      driverId: 'drv-02'
    }
  },
  {
    id: 'veh-03',
    tenantId: 'tenant-tln-01',
    branchId: 'br-jkt',
    plateNumber: 'B 9211 TJP',
    vin: 'MHF1TR30928108888',
    brand: 'Mitsubishi Fuso',
    model: 'Canter FE 74 HD',
    year: 2022,
    type: 'van',
    fuelType: 'pertamax',
    fuelCapacityLiters: 100,
    status: 'idle',
    currentDriverId: 'drv-03',
    gpsDeviceId: 'dev-03',
    odometerKm: 112500,
    engineHours: 4200,
    groupName: 'Kurir Jabodetabek',
    maintenanceOverdue: true,
    insuranceExpiry: '2026-09-01',
    stnkExpiry: '2026-11-15',
    kirExpiry: '2026-08-30', // Urgent
    latestTelemetry: {
      deviceId: 'dev-03',
      imei: '864201049283033',
      timestamp: new Date().toISOString(),
      location: { lat: -6.1152, lng: 106.8821, address: 'Depo Tanjung Priok, Jakarta Utara', speed: 0, heading: 45, altitude: 8 },
      ignition: true,
      engineRpm: 750,
      fuelLevelPercent: 34,
      fuelLevelLiters: 34,
      engineTempCelsius: 91,
      batteryVoltage: 12.4,
      odometerKm: 112500,
      engineHours: 4200,
      doorOpen: true,
      acOn: true,
      gpsSignal: 88,
      gsmSignal: 82,
      driverId: 'drv-03'
    }
  },
  {
    id: 'veh-04',
    tenantId: 'tenant-tln-01',
    branchId: 'br-sby',
    plateNumber: 'L 8092 UAP',
    vin: 'MHF1TR30928107777',
    brand: 'Scania',
    model: 'P360 Heavy Hauler',
    year: 2023,
    type: 'truck_dump',
    fuelType: 'biodiesel_b35',
    fuelCapacityLiters: 400,
    status: 'moving',
    currentDriverId: 'drv-04',
    gpsDeviceId: 'dev-04',
    odometerKm: 98400,
    engineHours: 3800,
    groupName: 'Armada Logistik Jawa Timur',
    maintenanceOverdue: false,
    insuranceExpiry: '2027-04-20',
    stnkExpiry: '2027-10-05',
    kirExpiry: '2027-01-14',
    latestTelemetry: {
      deviceId: 'dev-04',
      imei: '864201049283044',
      timestamp: new Date().toISOString(),
      location: { lat: -7.2014, lng: 112.7311, address: 'Pelabuhan Tanjung Perak, Surabaya', speed: 45, heading: 270, altitude: 5 },
      ignition: true,
      engineRpm: 1600,
      fuelLevelPercent: 88,
      fuelLevelLiters: 352,
      engineTempCelsius: 85,
      batteryVoltage: 24.5,
      odometerKm: 98400,
      engineHours: 3800,
      doorOpen: false,
      acOn: true,
      gpsSignal: 98,
      gsmSignal: 95,
      driverId: 'drv-04'
    }
  },
  {
    id: 'veh-05',
    tenantId: 'tenant-tln-01',
    branchId: 'br-jkt',
    plateNumber: 'B 7012 SKT',
    vin: 'MHF1TR30928105555',
    brand: 'Isuzu',
    model: 'Elf NLR 55',
    year: 2021,
    type: 'bus',
    fuelType: 'biodiesel_b35',
    fuelCapacityLiters: 100,
    status: 'parking',
    gpsDeviceId: 'dev-05',
    odometerKm: 145000,
    engineHours: 5100,
    groupName: 'Shuttle Karyawan',
    maintenanceOverdue: false,
    insuranceExpiry: '2026-12-01',
    stnkExpiry: '2026-12-10',
    kirExpiry: '2026-10-10',
    latestTelemetry: {
      deviceId: 'dev-05',
      imei: '864201049283055',
      timestamp: new Date().toISOString(),
      location: { lat: -6.1751, lng: 106.8272, address: 'Parkir Monas / HQ Jakarta', speed: 0, heading: 0, altitude: 15 },
      ignition: false,
      engineRpm: 0,
      fuelLevelPercent: 90,
      fuelLevelLiters: 90,
      engineTempCelsius: 32,
      batteryVoltage: 12.6,
      odometerKm: 145000,
      engineHours: 5100,
      doorOpen: false,
      acOn: false,
      gpsSignal: 90,
      gsmSignal: 85
    }
  }
];

export const mockTrips: Trip[] = [
  {
    id: 'trp-001',
    tenantId: 'tenant-tln-01',
    branchId: 'br-jkt',
    tripNumber: 'TRP-20260813-001',
    vehicleId: 'veh-01',
    driverId: 'drv-01',
    origin: 'Tanjung Priok Port Gate 3, Jakarta Utara',
    destination: 'Cikarang Dry Port & Logistics Center, Bekasi',
    originCoords: { lat: -6.1152, lng: 106.8821 },
    destinationCoords: { lat: -6.2825, lng: 107.1702 },
    plannedDistanceKm: 62.5,
    actualDistanceKm: 38.2,
    plannedDurationHours: 2.5,
    status: 'in_progress',
    startTime: '2026-08-13T07:15:00Z',
    estimatedArrival: '2026-08-13T09:30:00Z',
    cargoDescription: '40ft ISO Container Electronics Components (24 Ton)',
    cargoWeightKg: 24000,
    stops: [
      { id: 'stp-1', name: 'Gerbang Tol Semper', location: { lat: -6.1301, lng: 106.9102 }, arrivalTime: '2026-08-13T07:35:00Z', departureTime: '2026-08-13T07:38:00Z', status: 'departed' },
      { id: 'stp-2', name: 'Rest Area Tol Cikampek KM 19', location: { lat: -6.2340, lng: 106.9500 }, status: 'pending' }
    ]
  },
  {
    id: 'trp-002',
    tenantId: 'tenant-tln-01',
    branchId: 'br-ckr',
    tripNumber: 'TRP-20260813-002',
    vehicleId: 'veh-02',
    driverId: 'drv-02',
    origin: 'Kawasan Industri Jababeka 2, Cikarang',
    destination: 'Depo Industri Karawang Barat',
    originCoords: { lat: -6.2825, lng: 107.1702 },
    destinationCoords: { lat: -6.3501, lng: 107.2800 },
    plannedDistanceKm: 28.0,
    actualDistanceKm: 12.0,
    plannedDurationHours: 1.0,
    status: 'in_progress',
    startTime: '2026-08-13T08:00:00Z',
    estimatedArrival: '2026-08-13T09:00:00Z',
    cargoDescription: 'Suku Cadang Otomotif OEM (12 Pallet)',
    cargoWeightKg: 11500,
    stops: []
  }
];

export const mockGeofences: Geofence[] = [
  {
    id: 'geo-01',
    tenantId: 'tenant-tln-01',
    name: 'Depo Utama Tanjung Priok',
    category: 'port',
    type: 'polygon',
    coordinates: [
      { lat: -6.1100, lng: 106.8780 },
      { lat: -6.1100, lng: 106.8890 },
      { lat: -6.1200, lng: 106.8890 },
      { lat: -6.1200, lng: 106.8780 }
    ],
    address: 'Jl. Eka Nusa No. 1, Tanjung Priok, Jakarta Utara',
    assignedVehicleGroups: ['Armada Trans-Jawa', 'Container Port-Cikarang'],
    alertOnEnter: true,
    alertOnExit: true,
    alertOnOverstay: true,
    maxStayMinutes: 180,
    color: '#3B82F6' // Blue
  },
  {
    id: 'geo-02',
    tenantId: 'tenant-tln-01',
    name: 'Cikarang Dry Port Logistics Area',
    category: 'warehouse',
    type: 'polygon',
    coordinates: [
      { lat: -6.2800, lng: 107.1650 },
      { lat: -6.2800, lng: 107.1750 },
      { lat: -6.2880, lng: 107.1750 },
      { lat: -6.2880, lng: 107.1650 }
    ],
    address: 'Kawasan CDP, Cikarang Jababeka',
    assignedVehicleGroups: ['Container Port-Cikarang'],
    alertOnEnter: true,
    alertOnExit: true,
    alertOnOverstay: false,
    color: '#10B981' // Green
  }
];

export const mockAlerts: AlertNotification[] = [
  {
    id: 'alt-01',
    tenantId: 'tenant-tln-01',
    vehicleId: 'veh-01',
    vehiclePlate: 'B 9482 UTX',
    driverName: 'Sutrisno Hartono',
    category: 'speed',
    severity: 'critical',
    title: 'Kecepatan Melebihi Batas (Overspeed)',
    message: 'Kendaraan terdeteksi melaju 92 km/jam di Tol Cikampek (Batas maksimal 80 km/jam).',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    location: { lat: -6.2297, lng: 106.9275, speed: 92 },
    read: false,
    actionRequired: true
  },
  {
    id: 'alt-02',
    tenantId: 'tenant-tln-01',
    vehicleId: 'veh-03',
    vehiclePlate: 'B 9211 TJP',
    driverName: 'Eko Prasetyo',
    category: 'maintenance',
    severity: 'warning',
    title: 'Jadwal Servis Berkala & KIR Jatuh Tempo',
    message: 'Masa berlaku Uji KIR berakhir dalam 17 hari & Odometer telah melewati batas servis 100.000 KM.',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    location: { lat: -6.1152, lng: 106.8821 },
    read: false,
    actionRequired: true
  },
  {
    id: 'alt-03',
    tenantId: 'tenant-tln-01',
    vehicleId: 'veh-02',
    vehiclePlate: 'B 9102 CKR',
    driverName: 'Ahmad Dahlan',
    category: 'fuel_drop',
    severity: 'info',
    title: 'Penurunan BBM Cepat Terdeteksi',
    message: 'AI mendeteksi penurunan level tangki 12% dalam waktu 10 menit saat idle.',
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
    location: { lat: -6.2825, lng: 107.1702 },
    read: true,
    actionRequired: false
  }
];

export const mockAIInsights: AIInsight[] = [
  {
    id: 'ins-01',
    title: 'Prediksi Pemeliharaan Rem & Servis Rutin Armada Hino B 9482 UTX',
    category: 'maintenance',
    severity: 'high',
    summary: 'Komponen rem depan diproyeksi aus dalam 1.200 KM ke depan berdasarkan telemetri pemakaian.',
    explanation: 'Telemetri mendeteksi frekuensi pengereman tinggi sebesar 34 kali per 100 km dengan suhu kampas rem rata-rata meningkat. Disarankan melakukan inspek kampas rem sebelum perjalanan Trans-Jawa berikutnya.',
    recommendation: 'Jadwalkan Work Order Pemeliharaan Rem di Workshop Depo Jakarta sebelum tanggal 18 Agustus 2026.',
    impactScore: 88,
    potentialSavingsIdr: 4500000,
    timestamp: '2026-08-13T08:15:00Z',
    dataPoints: [
      { label: 'Odometer Saat Ini', value: '84.320 KM' },
      { label: 'Suhu Mesin Rata-rata', value: '86 °C' },
      { label: 'Estimasi Biaya Cegah Brekdwn', value: 'Rp 4.500.000' }
    ],
    actionable: true,
    actionPayload: { type: 'create_work_order', targetId: 'veh-01' }
  },
  {
    id: 'ins-02',
    title: 'Anomali Konsumsi BBM & Pembetulan Rute Tol Cikampek - Cikarang',
    category: 'fuel',
    severity: 'medium',
    summary: 'Efisiensi BBM Armada Cikarang turun 8.7% akibat kebiasaan Idle berlebih (>30 menit) saat antrean loading.',
    explanation: 'Analisis telemetri dari 38 kendaraan menunjukkan total waktu mesin menyala tanpa berjalan (idle) mencapai 14.2 jam kemarin. Hal ini membuang sekitar 28.4 liter Biosolar B35.',
    recommendation: 'Aktifkan aturan Auto-Engine Shutdown Alert jika idle melebihi 15 menit dan beri brief edukasi eco-driving ke driver.',
    impactScore: 76,
    potentialSavingsIdr: 12800000,
    timestamp: '2026-08-13T07:45:00Z',
    dataPoints: [
      { label: 'BBM Terbuang/Bulan', value: '852 Liter' },
      { label: 'Potensi Hemat/Bulan', value: 'Rp 12.800.000' }
    ],
    actionable: true,
    actionPayload: { type: 'enable_idle_alert', targetId: 'br-ckr' }
  }
];

export const mockMaintenanceOrders: MaintenanceWorkOrder[] = [
  {
    id: 'wo-101',
    tenantId: 'tenant-tln-01',
    workOrderNumber: 'WO-2026-0811',
    vehicleId: 'veh-03',
    title: 'Servis Berkala 110.000 KM & Ganti Oli Engine',
    type: 'routine_service',
    priority: 'high',
    status: 'scheduled',
    scheduledDate: '2026-08-16',
    estimatedCostIdr: 2850000,
    workshopName: 'Bengkel Resmi Isuzu Cikarang',
    technicianNotes: 'Pengantian oli mesin, filter oli, filter udara, dan tune up.'
  },
  {
    id: 'wo-102',
    tenantId: 'tenant-tln-01',
    workOrderNumber: 'WO-2026-0805',
    vehicleId: 'veh-01',
    title: 'Pemeriksaan & Pergantian Kampas Rem Depan-Belakang',
    type: 'brake_service',
    priority: 'medium',
    status: 'in_progress',
    scheduledDate: '2026-08-12',
    estimatedCostIdr: 3400000,
    workshopName: 'Depo Maintenance Workshop Tanjung Priok',
    technicianNotes: 'Kampas rem aus 75%, piringan cakram dibubut halus.'
  }
];
