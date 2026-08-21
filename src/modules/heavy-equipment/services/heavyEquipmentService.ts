/**
 * Fleet Intelligence Smart AI - Construction & Heavy Equipment Service
 * Centralized service layer for Alat Berat & Manajemen Proyek Tambang/Konstruksi
 * Full Enterprise Suite covering all Prompt 64 Requirements
 */

import {
  HeavyEquipmentAsset,
  ConstructionProject,
  ConstructionSite,
  EquipmentAssignment,
  OperatorCertification,
  HeavyOperatorProfile,
  EquipmentShiftRecord,
  DailyTimesheet,
  P2HInspection,
  HeavyFuelLog,
  HeavyMaintenanceSchedule,
  EquipmentBreakdownRecord,
  EquipmentIncidentRecord,
  HeavyRentalBilling,
  EquipmentTransportRequest,
  EquipmentProductivityMetric,
  AIDailyProjectBriefing
} from '../types';

class HeavyEquipmentService {
  private sites: ConstructionSite[] = [
    {
      id: 'site-01',
      code: 'SITE-IKN-3B',
      name: 'Site Main Road & Interchange STA 12+500',
      projectId: 'prj-01',
      projectName: 'Proyek Tol IKN Seksi 3B',
      address: 'Kawasan Inti Pusat Pemerintahan (KIPP), Sepaku, Penajam Paser Utara, Kaltim',
      coordinates: { lat: -0.9634, lng: 116.7123 },
      geofenceRadiusMeters: 2500,
      siteManager: 'Ir. Hendra Gunawan, MT',
      siteManagerPhone: '+62 811-9821-4432',
      operatingHours: '07:00 - 18:00 (2 Shifts)',
      equipmentCapacity: 15,
      activeEquipmentsCount: 4,
      safetyZoneStatus: 'SAFE',
      restrictedZones: [
        { name: 'Lereng Tebing Curam KM 14', radius: 300, reason: 'Potensi Longsor saat Hujan Deras' },
        { name: 'Underground Gas Line Corridor', radius: 150, reason: 'Dilarang Penggalian Dalam > 2 Meter' }
      ],
      fuelStationLocation: { lat: -0.9620, lng: 116.7140, name: 'Main Fuel Tank Station IKN (50,000L)' },
      workshopLocation: { lat: -0.9645, lng: 116.7105, name: 'Central Workshop & Spareparts Bay' },
      emergencyAssemblyPoint: { lat: -0.9610, lng: 116.7130, name: 'Titik Kumpul Darurat A' },
      createdAt: '2026-01-10T08:00:00Z'
    },
    {
      id: 'site-02',
      code: 'SITE-MOROWALI-PIT-A',
      name: 'Pit Tambang Nikel Blok Timur 1',
      projectId: 'prj-02',
      projectName: 'Tambang Nikel Morowali Site A',
      address: 'Kecamatan Bahodopi, Morowali, Sulawesi Tengah',
      coordinates: { lat: -2.8251, lng: 122.1582 },
      geofenceRadiusMeters: 4000,
      siteManager: 'Drs. Ronald Sitompul (KTT ESDM)',
      siteManagerPhone: '+62 812-7721-9901',
      operatingHours: '24 Jam Nonstop (Shift Siang & Malam)',
      equipmentCapacity: 25,
      activeEquipmentsCount: 3,
      safetyZoneStatus: 'SAFE',
      restrictedZones: [
        { name: 'Highwall Pit Blok 3', radius: 400, reason: 'Area Rawan Runtuhan Batuan' },
        { name: 'Settling Pond Limbah Tambang', radius: 250, reason: 'Khusus Petugas Lingkungan & Water Bowser' }
      ],
      fuelStationLocation: { lat: -2.8230, lng: 122.1600, name: 'Pitstop Fuel Bowser Depot 100kL' },
      workshopLocation: { lat: -2.8270, lng: 122.1550, name: 'Heavy Equipment Maintenance Yard' },
      emergencyAssemblyPoint: { lat: -2.8220, lng: 122.1590, name: 'Muster Point 1 Pit Timur' },
      createdAt: '2026-02-01T08:00:00Z'
    },
    {
      id: 'site-03',
      code: 'SITE-SBY-MARITIM',
      name: 'Zona Konstruksi Dermaga & Pier 4',
      projectId: 'prj-03',
      projectName: 'Jembatan Maritim & Dermaga Surabaya',
      address: 'Kawasan Pelabuhan Tanjung Perak, Surabaya, Jawa Timur',
      coordinates: { lat: -7.2014, lng: 112.7381 },
      geofenceRadiusMeters: 1800,
      siteManager: 'Budi Hartono, ST',
      siteManagerPhone: '+62 813-4412-8876',
      operatingHours: '08:00 - 17:00 (1 Shift + Lembur)',
      equipmentCapacity: 10,
      activeEquipmentsCount: 2,
      safetyZoneStatus: 'SAFE',
      restrictedZones: [
        { name: 'Area Radius Ayunan Crane Pier 4', radius: 100, reason: 'Zona Bahaya Pengangkatan Berat (Lifting Zone)' }
      ],
      fuelStationLocation: { lat: -7.2000, lng: 112.7390, name: 'Penyimpanan Solar B35 Dermaga' },
      workshopLocation: { lat: -7.2030, lng: 112.7360, name: 'Workshop Mekanik Maritim' },
      emergencyAssemblyPoint: { lat: -7.1995, lng: 112.7395, name: 'Assembly Point Gate 2' },
      createdAt: '2026-03-01T08:00:00Z'
    }
  ];

  private equipments: HeavyEquipmentAsset[] = [
    {
      id: 'eq-01',
      code: 'EXC-201',
      name: 'Komatsu PC200-8MO',
      category: 'EXCAVATOR',
      brand: 'Komatsu',
      model: 'PC200-8MO Hydraulic Excavator',
      serialNumber: 'KMTPC200-8M-99120',
      engineSerialNumber: 'SAA6D107E-1-882190',
      assetNumber: 'AST-HE-2023-001',
      year: 2023,
      capacity: '20 Ton (Bucket 0.93 m³)',
      fuelType: 'SOLAR_B35',
      hourMeter: 3420.5,
      mileageKm: 1420,
      bucketCapacityM3: 0.93,
      tonnageCapacityTons: 20.5,
      currentSiteId: 'site-01',
      currentSiteName: 'Site Main Road & Interchange STA 12+500',
      currentProjectId: 'prj-01',
      currentProjectName: 'Proyek Tol IKN Seksi 3B',
      assignedOperatorId: 'op-01',
      assignedOperatorName: 'Agus Sudarsono (SIO-1)',
      status: 'WORKING',
      fuelLevelPct: 78,
      fuelBurnRateLitersPerHM: 18.2,
      engineStatus: 'RUNNING',
      engineRpm: 1850,
      coolantTempC: 84,
      oilPressureBar: 4.2,
      hydraulicPressureBar: 345,
      hydraulicTempC: 68,
      batteryVoltage: 27.6,
      vibrationLevelMmS: 2.1,
      telemetryCapability: 'GPS_FULL_TELEMETRY',
      dtcCodes: [],
      gpsCoordinates: { lat: -0.9634, lng: 116.7123 }, // IKN Nusantara
      currentLocationName: 'KIPP IKN Sektor 3B',
      lastP2hResult: 'FIT_TO_WORK',
      lastServiceHM: 3250,
      nextServiceHM: 3500,
      physicalAvailabilityPct: 94.5,
      utilizationAvailabilityPct: 88.0,
      rentalHourlyRate: 285000,
      dailyTargetHM: 10.0,
      siloCertificateNumber: 'SILO-DISNAKER-KALTIM-2024-881',
      siloExpiryDate: '2027-04-15',
      utilizationCategory: 'HIGH',
      downtimeHoursThisMonth: 4.5,
      totalBreakdownCount: 1,
      operatingCostPerHourIdr: 320000,
      revenueGeneratedIdr: 974842500,
      activeAlerts: [],
      createdAt: '2023-01-15T00:00:00Z',
      updatedAt: '2026-08-21T07:30:00Z',
      tenantId: 'tenant-default'
    },
    {
      id: 'eq-02',
      code: 'EXC-301',
      name: 'Caterpillar 336D2 L',
      category: 'EXCAVATOR',
      brand: 'Caterpillar',
      model: 'CAT 336 Heavy Excavator',
      serialNumber: 'CAT0336D2-48821',
      engineSerialNumber: 'C9-ACERT-993821',
      assetNumber: 'AST-HE-2022-004',
      year: 2022,
      capacity: '36 Ton (Bucket 1.88 m³)',
      fuelType: 'SOLAR_B35',
      hourMeter: 6150.0,
      mileageKm: 2850,
      bucketCapacityM3: 1.88,
      tonnageCapacityTons: 36.0,
      currentSiteId: 'site-02',
      currentSiteName: 'Pit Tambang Nikel Blok Timur 1',
      currentProjectId: 'prj-02',
      currentProjectName: 'Tambang Nikel Morowali Site A',
      assignedOperatorId: 'op-02',
      assignedOperatorName: 'Bambang Irawan',
      status: 'WORKING',
      fuelLevelPct: 62,
      fuelBurnRateLitersPerHM: 28.5,
      engineStatus: 'RUNNING',
      engineRpm: 1920,
      coolantTempC: 89,
      oilPressureBar: 4.5,
      hydraulicPressureBar: 350,
      hydraulicTempC: 74,
      batteryVoltage: 28.1,
      vibrationLevelMmS: 2.8,
      telemetryCapability: 'GPS_FULL_TELEMETRY',
      dtcCodes: [],
      gpsCoordinates: { lat: -2.8251, lng: 122.1582 }, // Morowali
      currentLocationName: 'Pit Morowali Timur',
      lastP2hResult: 'FIT_TO_WORK',
      lastServiceHM: 6000,
      nextServiceHM: 6250,
      physicalAvailabilityPct: 91.2,
      utilizationAvailabilityPct: 85.4,
      rentalHourlyRate: 450000,
      dailyTargetHM: 12.0,
      siloCertificateNumber: 'SILO-DISNAKER-SULTENG-2023-102',
      siloExpiryDate: '2026-11-20',
      utilizationCategory: 'HIGH',
      downtimeHoursThisMonth: 12.0,
      totalBreakdownCount: 2,
      operatingCostPerHourIdr: 510000,
      revenueGeneratedIdr: 2767500000,
      activeAlerts: [],
      createdAt: '2022-04-10T00:00:00Z',
      updatedAt: '2026-08-21T07:30:00Z',
      tenantId: 'tenant-default'
    },
    {
      id: 'eq-03',
      code: 'DOZ-101',
      name: 'Komatsu D85ESS-2',
      category: 'BULLDOZER',
      brand: 'Komatsu',
      model: 'D85ESS-2 Crawler Dozer',
      serialNumber: 'KMTD85ESS-77301',
      engineSerialNumber: 'SAA6D125E-5-3310',
      assetNumber: 'AST-HE-2021-009',
      year: 2021,
      capacity: 'Blade 3.4 m³ / 20 Ton',
      fuelType: 'SOLAR_B35',
      hourMeter: 7890.2,
      mileageKm: 3410,
      bucketCapacityM3: 3.4,
      tonnageCapacityTons: 20.6,
      currentSiteId: 'site-01',
      currentSiteName: 'Site Main Road & Interchange STA 12+500',
      currentProjectId: 'prj-01',
      currentProjectName: 'Proyek Tol IKN Seksi 3B',
      assignedOperatorId: 'op-03',
      assignedOperatorName: 'Cahyo Santoso',
      status: 'IDLE',
      fuelLevelPct: 85,
      fuelBurnRateLitersPerHM: 24.1,
      engineStatus: 'IDLE',
      engineRpm: 900,
      coolantTempC: 78,
      oilPressureBar: 3.8,
      hydraulicPressureBar: 210,
      hydraulicTempC: 62,
      batteryVoltage: 27.4,
      vibrationLevelMmS: 1.5,
      telemetryCapability: 'GPS_FULL_TELEMETRY',
      dtcCodes: [],
      gpsCoordinates: { lat: -0.9640, lng: 116.7118 },
      currentLocationName: 'Disposal Area STA 12',
      lastP2hResult: 'FIT_TO_WORK',
      lastServiceHM: 7750,
      nextServiceHM: 8000,
      physicalAvailabilityPct: 93.0,
      utilizationAvailabilityPct: 76.5,
      rentalHourlyRate: 350000,
      dailyTargetHM: 9.0,
      siloCertificateNumber: 'SILO-DISNAKER-KALTIM-2023-412',
      siloExpiryDate: '2026-10-30',
      utilizationCategory: 'NORMAL',
      downtimeHoursThisMonth: 6.0,
      totalBreakdownCount: 1,
      operatingCostPerHourIdr: 410000,
      revenueGeneratedIdr: 2761570000,
      activeAlerts: ['Excessive Idle > 35 mins'],
      createdAt: '2021-06-12T00:00:00Z',
      updatedAt: '2026-08-21T07:30:00Z',
      tenantId: 'tenant-default'
    },
    {
      id: 'eq-04',
      code: 'DT-501',
      name: 'Scania P410 CB 8x4 Heavy Tipper',
      category: 'DUMP_TRUCK',
      brand: 'Scania',
      model: 'P410 Heavy Tipper Mining Spec',
      serialNumber: 'SCAN-P410-992104',
      engineSerialNumber: 'DC13-107-5512',
      assetNumber: 'AST-HE-2023-018',
      year: 2023,
      capacity: 'Vessel 24 m³ / 40 Ton',
      fuelType: 'SOLAR_B35',
      hourMeter: 4210.8,
      mileageKm: 68400,
      bucketCapacityM3: 24.0,
      tonnageCapacityTons: 41.0,
      currentSiteId: 'site-02',
      currentSiteName: 'Pit Tambang Nikel Blok Timur 1',
      currentProjectId: 'prj-02',
      currentProjectName: 'Tambang Nikel Morowali Site A',
      assignedOperatorId: 'op-04',
      assignedOperatorName: 'Dedik Supriyadi',
      status: 'WORKING',
      fuelLevelPct: 45,
      fuelBurnRateLitersPerHM: 21.0,
      engineStatus: 'RUNNING',
      engineRpm: 1600,
      coolantTempC: 86,
      oilPressureBar: 4.8,
      hydraulicPressureBar: 180,
      hydraulicTempC: 60,
      batteryVoltage: 28.0,
      vibrationLevelMmS: 1.8,
      telemetryCapability: 'GPS_FULL_TELEMETRY',
      dtcCodes: [],
      gpsCoordinates: { lat: -2.8270, lng: 122.1560 },
      currentLocationName: 'Hauling Road KM 4',
      lastP2hResult: 'FIT_TO_WORK',
      lastServiceHM: 4000,
      nextServiceHM: 4500,
      physicalAvailabilityPct: 96.0,
      utilizationAvailabilityPct: 89.2,
      rentalHourlyRate: 220000,
      dailyTargetHM: 14.0,
      siloCertificateNumber: 'SILO-DISNAKER-SULTENG-2024-912',
      siloExpiryDate: '2027-08-10',
      utilizationCategory: 'HIGH',
      downtimeHoursThisMonth: 2.0,
      totalBreakdownCount: 0,
      operatingCostPerHourIdr: 290000,
      revenueGeneratedIdr: 926376000,
      activeAlerts: [],
      createdAt: '2023-08-01T00:00:00Z',
      updatedAt: '2026-08-21T07:30:00Z',
      tenantId: 'tenant-default'
    },
    {
      id: 'eq-05',
      code: 'CRN-701',
      name: 'Tadano GR-500EX Rough Terrain',
      category: 'ROUGH_TERRAIN_CRANE',
      brand: 'Tadano',
      model: 'GR-500EX 50-Ton Mobile Crane',
      serialNumber: 'TDN-GR500-33019',
      engineSerialNumber: 'MITS-6D24-8812',
      assetNumber: 'AST-HE-2022-011',
      year: 2022,
      capacity: 'Lifting 50 Ton (Boom 39.5 m)',
      fuelType: 'DEXLITE',
      hourMeter: 2150.0,
      mileageKm: 8900,
      tonnageCapacityTons: 50.0,
      currentSiteId: 'site-03',
      currentSiteName: 'Zona Konstruksi Dermaga & Pier 4',
      currentProjectId: 'prj-03',
      currentProjectName: 'Jembatan Maritim & Dermaga Surabaya',
      assignedOperatorId: 'op-05',
      assignedOperatorName: 'Eko Prasetyo (SIO Crane Kelas 1)',
      status: 'WORKING',
      fuelLevelPct: 70,
      fuelBurnRateLitersPerHM: 16.5,
      engineStatus: 'RUNNING',
      engineRpm: 1400,
      coolantTempC: 81,
      oilPressureBar: 4.1,
      hydraulicPressureBar: 280,
      hydraulicTempC: 65,
      batteryVoltage: 27.8,
      vibrationLevelMmS: 1.1,
      telemetryCapability: 'GPS_FULL_TELEMETRY',
      dtcCodes: [],
      gpsCoordinates: { lat: -7.2014, lng: 112.7381 },
      currentLocationName: 'Pier 4 Surabaya Port',
      lastP2hResult: 'FIT_TO_WORK',
      lastServiceHM: 2000,
      nextServiceHM: 2250,
      physicalAvailabilityPct: 98.2,
      utilizationAvailabilityPct: 82.0,
      rentalHourlyRate: 750000,
      dailyTargetHM: 8.0,
      siloCertificateNumber: 'SILO-DISNAKER-JATIM-2024-552',
      siloExpiryDate: '2027-02-18',
      utilizationCategory: 'NORMAL',
      downtimeHoursThisMonth: 0,
      totalBreakdownCount: 0,
      operatingCostPerHourIdr: 680000,
      revenueGeneratedIdr: 1612500000,
      activeAlerts: [],
      createdAt: '2022-11-20T00:00:00Z',
      updatedAt: '2026-08-21T07:30:00Z',
      tenantId: 'tenant-default'
    },
    {
      id: 'eq-06',
      code: 'MGR-401',
      name: 'Caterpillar 140K Motor Grader',
      category: 'MOTOR_GRADER',
      brand: 'Caterpillar',
      model: 'CAT 140K Heavy Motor Grader',
      serialNumber: 'CAT140K-88219',
      engineSerialNumber: 'C7-ACERT-44192',
      assetNumber: 'AST-HE-2021-015',
      year: 2021,
      capacity: 'Blade 4.3 m / 17.5 Ton',
      fuelType: 'SOLAR_B35',
      hourMeter: 8450.4,
      mileageKm: 14200,
      tonnageCapacityTons: 17.5,
      currentSiteId: 'site-01',
      currentSiteName: 'Site Main Road & Interchange STA 12+500',
      currentProjectId: 'prj-01',
      currentProjectName: 'Proyek Tol IKN Seksi 3B',
      assignedOperatorId: 'op-06',
      assignedOperatorName: 'Ferry Kurniawan',
      status: 'BREAKDOWN',
      fuelLevelPct: 50,
      fuelBurnRateLitersPerHM: 20.0,
      engineStatus: 'OFF',
      engineRpm: 0,
      coolantTempC: 32,
      oilPressureBar: 0,
      hydraulicPressureBar: 0,
      hydraulicTempC: 30,
      batteryVoltage: 25.2,
      vibrationLevelMmS: 0,
      telemetryCapability: 'GPS_FULL_TELEMETRY',
      dtcCodes: ['DTC-HYD-552: Hydraulic Blade Cylinder Seal Failure'],
      gpsCoordinates: { lat: -0.9650, lng: 116.7110 },
      currentLocationName: 'Workshop STA 12',
      lastP2hResult: 'DO_NOT_OPERATE',
      lastServiceHM: 8250,
      nextServiceHM: 8500,
      physicalAvailabilityPct: 78.5,
      utilizationAvailabilityPct: 62.0,
      rentalHourlyRate: 310000,
      dailyTargetHM: 8.0,
      siloCertificateNumber: 'SILO-DISNAKER-KALTIM-2023-110',
      siloExpiryDate: '2026-09-15',
      utilizationCategory: 'LOW',
      downtimeHoursThisMonth: 48.0,
      totalBreakdownCount: 3,
      operatingCostPerHourIdr: 450000,
      revenueGeneratedIdr: 2619624000,
      activeAlerts: ['Hydraulic Seal Failure (DTC-HYD-552)', 'SILO Expiring in 25 Days'],
      createdAt: '2021-02-14T00:00:00Z',
      updatedAt: '2026-08-21T07:30:00Z',
      tenantId: 'tenant-default'
    },
    {
      id: 'eq-07',
      code: 'VBR-601',
      name: 'Sakai SV525D Vibro Roller',
      category: 'COMPACTOR',
      brand: 'Sakai',
      model: 'SV525D Soil Compactor',
      serialNumber: 'SAK-SV525-44120',
      engineSerialNumber: 'ISZ-4BG1-9921',
      assetNumber: 'AST-HE-2023-022',
      year: 2023,
      capacity: 'Drum 2.13 m / 12 Ton (Dynamic 23 Ton)',
      fuelType: 'SOLAR_B35',
      hourMeter: 2890.0,
      mileageKm: 6500,
      tonnageCapacityTons: 12.5,
      currentSiteId: 'site-01',
      currentSiteName: 'Site Main Road & Interchange STA 12+500',
      currentProjectId: 'prj-01',
      currentProjectName: 'Proyek Tol IKN Seksi 3B',
      assignedOperatorId: 'op-07',
      assignedOperatorName: 'Gunawan Prasetya',
      status: 'STANDBY',
      fuelLevelPct: 90,
      fuelBurnRateLitersPerHM: 14.2,
      engineStatus: 'OFF',
      engineRpm: 0,
      coolantTempC: 30,
      oilPressureBar: 0,
      hydraulicPressureBar: 0,
      hydraulicTempC: 28,
      batteryVoltage: 27.5,
      vibrationLevelMmS: 0,
      telemetryCapability: 'GPS_FULL_TELEMETRY',
      dtcCodes: [],
      gpsCoordinates: { lat: -0.9630, lng: 116.7130 },
      currentLocationName: 'Staging Area STA 12',
      lastP2hResult: 'FIT_TO_WORK',
      lastServiceHM: 2750,
      nextServiceHM: 3000,
      physicalAvailabilityPct: 96.5,
      utilizationAvailabilityPct: 78.0,
      rentalHourlyRate: 220000,
      dailyTargetHM: 8.0,
      siloCertificateNumber: 'SILO-DISNAKER-KALTIM-2024-331',
      siloExpiryDate: '2027-06-20',
      utilizationCategory: 'NORMAL',
      downtimeHoursThisMonth: 0,
      totalBreakdownCount: 0,
      operatingCostPerHourIdr: 260000,
      revenueGeneratedIdr: 635800000,
      activeAlerts: [],
      createdAt: '2023-05-18T00:00:00Z',
      updatedAt: '2026-08-21T07:30:00Z',
      tenantId: 'tenant-default'
    }
  ];

  private projects: ConstructionProject[] = [
    {
      id: 'prj-01',
      code: 'PRJ-IKN-3B',
      name: 'Proyek Tol IKN Seksi 3B',
      customer: 'Kementerian PUPR Ditjen Bina Marga',
      contractor: 'PT Waskita Karya - Adhi Karya KSO',
      clientName: 'Kementerian PUPR Ditjen Bina Marga',
      locationCity: 'Penajam Paser Utara, Kalimantan Timur',
      projectManager: 'Ir. Hendra Gunawan, MT',
      hseOfficer: 'Siti Rahmawati, SKM (K3 Konstruksi)',
      startDate: '2024-03-01',
      targetEndDate: '2027-08-17',
      status: 'ACTIVE',
      budgetTotalIdr: 1450000000000,
      targetVolumeBcm: 4500000, // 4.5 Juta BCM
      achievedVolumeBcm: 2850000, // 2.85 Juta BCM
      targetTonnageTons: 8100000,
      achievedTonnageTons: 5130000,
      allocatedEquipmentsCount: 4,
      allocatedOperatorsCount: 4,
      totalOperatingHours: 18450,
      totalIdleHours: 2450,
      totalFuelConsumedLiters: 358200,
      totalMaintenanceCostIdr: 685000000,
      progressPercent: 63.3,
      coordinates: { lat: -0.9634, lng: 116.7123 },
      sitesCount: 2,
      activeIncidentsCount: 0,
      productivityRateBcmPerHour: 154.4,
      createdAt: '2024-02-15T00:00:00Z',
      tenantId: 'tenant-default'
    },
    {
      id: 'prj-02',
      code: 'PRJ-MOROWALI-NKL',
      name: 'Tambang Nikel Morowali Site A',
      customer: 'PT Vale Indonesia / IMIP Group',
      contractor: 'PT Bukit Makmur Mandiri Utama (BUMA)',
      clientName: 'PT Vale Indonesia / IMIP Group',
      locationCity: 'Morowali, Sulawesi Tengah',
      projectManager: 'Drs. Ronald Sitompul (KTT ESDM)',
      hseOfficer: 'Bambang Kusuma, ST (K3 Tambang)',
      startDate: '2023-06-01',
      targetEndDate: '2028-12-31',
      status: 'ACTIVE',
      budgetTotalIdr: 2800000000000,
      targetVolumeBcm: 12000000, // 12 Juta BCM Overburden
      achievedVolumeBcm: 7920000,
      targetTonnageTons: 21600000,
      achievedTonnageTons: 14256000,
      allocatedEquipmentsCount: 2,
      allocatedOperatorsCount: 2,
      totalOperatingHours: 32600,
      totalIdleHours: 3800,
      totalFuelConsumedLiters: 892400,
      totalMaintenanceCostIdr: 1420000000,
      progressPercent: 66.0,
      coordinates: { lat: -2.8251, lng: 122.1582 },
      sitesCount: 3,
      activeIncidentsCount: 0,
      productivityRateBcmPerHour: 242.9,
      createdAt: '2023-05-01T00:00:00Z',
      tenantId: 'tenant-default'
    },
    {
      id: 'prj-03',
      code: 'PRJ-SBY-MARITIM',
      name: 'Jembatan Maritim & Dermaga Surabaya',
      customer: 'PT Pelindo Multi Terminal',
      contractor: 'PT Wijaya Karya (Persero) Tbk',
      clientName: 'PT Pelindo Multi Terminal',
      locationCity: 'Surabaya, Jawa Timur',
      projectManager: 'Budi Hartono, ST',
      hseOfficer: 'Denny Setiawan, ST (Ahli K3 Maritim)',
      startDate: '2025-01-10',
      targetEndDate: '2026-12-25',
      status: 'ACTIVE',
      budgetTotalIdr: 620000000000,
      targetVolumeBcm: 850000,
      achievedVolumeBcm: 610000,
      targetTonnageTons: 1530000,
      achievedTonnageTons: 1098000,
      allocatedEquipmentsCount: 1,
      allocatedOperatorsCount: 1,
      totalOperatingHours: 7400,
      totalIdleHours: 920,
      totalFuelConsumedLiters: 122500,
      totalMaintenanceCostIdr: 245000000,
      progressPercent: 71.7,
      coordinates: { lat: -7.2014, lng: 112.7381 },
      sitesCount: 1,
      activeIncidentsCount: 0,
      productivityRateBcmPerHour: 82.4,
      createdAt: '2024-12-01T00:00:00Z',
      tenantId: 'tenant-default'
    }
  ];

  private assignments: EquipmentAssignment[] = [
    {
      id: 'asg-01',
      assignmentCode: 'ASG-2026-001',
      equipmentId: 'eq-01',
      equipmentCode: 'EXC-201',
      equipmentName: 'Komatsu PC200-8MO',
      projectId: 'prj-01',
      projectName: 'Proyek Tol IKN Seksi 3B',
      siteId: 'site-01',
      siteName: 'Site Main Road & Interchange STA 12+500',
      workArea: 'Main Cut & Fill STA 12+500 - 13+000',
      operatorId: 'op-01',
      operatorName: 'Agus Sudarsono',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      shift: 'SHIFT_1_DAY',
      targetHours: 250,
      targetProductivity: '140 BCM / Jam',
      status: 'ACTIVE',
      notes: 'Penggalian tanah lunak & perataan badan jalan interchange',
      assignedBy: 'Ir. Hendra Gunawan (PM)',
      createdAt: '2026-07-28T09:00:00Z'
    },
    {
      id: 'asg-02',
      assignmentCode: 'ASG-2026-002',
      equipmentId: 'eq-02',
      equipmentCode: 'EXC-301',
      equipmentName: 'Caterpillar 336D2 L',
      projectId: 'prj-02',
      projectName: 'Tambang Nikel Morowali Site A',
      siteId: 'site-02',
      siteName: 'Pit Tambang Nikel Blok Timur 1',
      workArea: 'Bench 4 Pit Timur (Overburden Removal)',
      operatorId: 'op-02',
      operatorName: 'Bambang Irawan',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      shift: 'SHIFT_1_DAY',
      targetHours: 320,
      targetProductivity: '220 BCM / Jam',
      status: 'ACTIVE',
      notes: 'Pemuatan OB ke Dump Truck Scania P410',
      assignedBy: 'Drs. Ronald Sitompul (KTT)',
      createdAt: '2026-07-29T10:00:00Z'
    },
    {
      id: 'asg-03',
      assignmentCode: 'ASG-2026-003',
      equipmentId: 'eq-04',
      equipmentCode: 'DT-501',
      equipmentName: 'Scania P410 CB 8x4 Heavy Tipper',
      projectId: 'prj-02',
      projectName: 'Tambang Nikel Morowali Site A',
      siteId: 'site-02',
      siteName: 'Pit Tambang Nikel Blok Timur 1',
      workArea: 'Hauling Road Pit Timur -> Disposal Barat (KM 4)',
      operatorId: 'op-04',
      operatorName: 'Dedik Supriyadi',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      shift: 'SHIFT_1_DAY',
      targetHours: 350,
      targetProductivity: '18 Ritase / Shift',
      status: 'ACTIVE',
      notes: 'Hauling Overburden muatan 40 ton per rit',
      assignedBy: 'Drs. Ronald Sitompul (KTT)',
      createdAt: '2026-07-29T10:30:00Z'
    },
    {
      id: 'asg-04',
      assignmentCode: 'ASG-2026-004',
      equipmentId: 'eq-05',
      equipmentCode: 'CRN-701',
      equipmentName: 'Tadano GR-500EX Rough Terrain',
      projectId: 'prj-03',
      projectName: 'Jembatan Maritim & Dermaga Surabaya',
      siteId: 'site-03',
      siteName: 'Zona Konstruksi Dermaga & Pier 4',
      workArea: 'Erection Girder Beton Pier 4 Surabaya Port',
      operatorId: 'op-05',
      operatorName: 'Eko Prasetyo',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      shift: 'SHIFT_1_DAY',
      targetHours: 200,
      targetProductivity: '4 Girder Lifts / Hari',
      status: 'ACTIVE',
      notes: 'Pengangkatan girder beton prategang 38 ton dengan outrigger penuh',
      assignedBy: 'Budi Hartono, ST',
      createdAt: '2026-07-30T14:00:00Z'
    }
  ];

  private operators: HeavyOperatorProfile[] = [
    {
      id: 'op-01',
      nik: 'OP-2021-0089',
      name: 'Agus Sudarsono',
      phone: '+62 812-3344-5566',
      specialization: ['EXCAVATOR', 'BACKHOE'],
      sioLicenseNumber: 'SIO-KEMENAKER-EXCA-2024-8891',
      sioClass: 'KELAS_1',
      sioExpiryDate: '2027-05-20',
      sioStatus: 'VALID',
      certifications: [
        {
          id: 'cert-01',
          operatorId: 'op-01',
          operatorName: 'Agus Sudarsono',
          certificationType: 'EXCAVATOR',
          certificateNumber: 'SIO-KEMENAKER-EXCA-2024-8891',
          issueDate: '2024-05-20',
          expiryDate: '2027-05-20',
          issuer: 'Kementerian Ketenagakerjaan RI (KEMENAKER)',
          documentUrl: '/docs/sio/agus_sio_excavator.pdf',
          sioClass: 'KELAS_1',
          status: 'VALID'
        }
      ],
      experienceYears: 8,
      trainingHistory: ['Defensive Operating Tambang K3', 'Eco-Digging Komatsu PC200', 'Basic First Aid & Fire Fighting'],
      assignedEquipmentCode: 'EXC-201',
      currentProject: 'Proyek Tol IKN Seksi 3B',
      currentSite: 'Site Main Road STA 12+500',
      rosterPattern: '6:2',
      daysOnDuty: 4,
      safetyScore: 98,
      fatigueScore: 12,
      totalLifetimeHM: 9420.5,
      workHoursThisMonth: 168.5,
      medicalCheckupStatus: 'FIT',
      assignmentHistoryCount: 14
    },
    {
      id: 'op-02',
      nik: 'OP-2019-0032',
      name: 'Bambang Irawan',
      phone: '+62 813-8877-1122',
      specialization: ['EXCAVATOR', 'BULLDOZER'],
      sioLicenseNumber: 'SIO-KEMENAKER-EXCA-2023-4122',
      sioClass: 'KELAS_1',
      sioExpiryDate: '2026-09-15',
      sioStatus: 'EXPIRING_SOON', // Alert!
      certifications: [
        {
          id: 'cert-02',
          operatorId: 'op-02',
          operatorName: 'Bambang Irawan',
          certificationType: 'EXCAVATOR',
          certificateNumber: 'SIO-KEMENAKER-EXCA-2023-4122',
          issueDate: '2023-09-15',
          expiryDate: '2026-09-15',
          issuer: 'Kementerian Ketenagakerjaan RI (KEMENAKER)',
          documentUrl: '/docs/sio/bambang_sio.pdf',
          sioClass: 'KELAS_1',
          status: 'EXPIRING_SOON'
        }
      ],
      experienceYears: 12,
      trainingHistory: ['Heavy Mining Excavator CAT 336 Mastery', 'POP Pengawas Operasional Pertama ESDM', 'Fatigue Management'],
      assignedEquipmentCode: 'EXC-301',
      currentProject: 'Tambang Nikel Morowali Site A',
      currentSite: 'Pit Timur Blok 1',
      rosterPattern: '8:2',
      daysOnDuty: 6,
      safetyScore: 95,
      fatigueScore: 24,
      totalLifetimeHM: 14200.0,
      workHoursThisMonth: 195.0,
      medicalCheckupStatus: 'FIT',
      assignmentHistoryCount: 22
    },
    {
      id: 'op-03',
      nik: 'OP-2022-0112',
      name: 'Cahyo Santoso',
      phone: '+62 852-9900-3344',
      specialization: ['BULLDOZER', 'WHEEL_LOADER'],
      sioLicenseNumber: 'SIO-KEMENAKER-DOZ-2024-1102',
      sioClass: 'KELAS_2',
      sioExpiryDate: '2027-08-12',
      sioStatus: 'VALID',
      certifications: [
        {
          id: 'cert-03',
          operatorId: 'op-03',
          operatorName: 'Cahyo Santoso',
          certificationType: 'BULLDOZER',
          certificateNumber: 'SIO-KEMENAKER-DOZ-2024-1102',
          issueDate: '2024-08-12',
          expiryDate: '2027-08-12',
          issuer: 'Kemenaker RI',
          documentUrl: '/docs/sio/cahyo_dozer.pdf',
          sioClass: 'KELAS_2',
          status: 'VALID'
        }
      ],
      experienceYears: 6,
      trainingHistory: ['Land Clearing & Sloping Dozer', 'K3 Tambang Terbuka'],
      assignedEquipmentCode: 'DOZ-101',
      currentProject: 'Proyek Tol IKN Seksi 3B',
      currentSite: 'Disposal STA 12',
      rosterPattern: '6:2',
      daysOnDuty: 2,
      safetyScore: 92,
      fatigueScore: 18,
      totalLifetimeHM: 6850.0,
      workHoursThisMonth: 154.0,
      medicalCheckupStatus: 'FIT',
      assignmentHistoryCount: 9
    },
    {
      id: 'op-04',
      nik: 'OP-2020-0064',
      name: 'Dedik Supriyadi',
      phone: '+62 821-4455-6677',
      specialization: ['DUMP_TRUCK'],
      sioLicenseNumber: 'SIM-B2-UMUM-POLRI-88910',
      sioClass: 'KELAS_1',
      sioExpiryDate: '2028-02-10',
      sioStatus: 'VALID',
      certifications: [
        {
          id: 'cert-04',
          operatorId: 'op-04',
          operatorName: 'Dedik Supriyadi',
          certificationType: 'HEAVY_EQUIPMENT',
          certificateNumber: 'SIM-B2-UMUM-POLRI-88910',
          issueDate: '2023-02-10',
          expiryDate: '2028-02-10',
          issuer: 'Korlantas POLRI & Disnaker ESDM',
          documentUrl: '/docs/sio/dedik_sim_b2.pdf',
          sioClass: 'KELAS_1',
          status: 'VALID'
        }
      ],
      experienceYears: 9,
      trainingHistory: ['Scania Retarder Braking & Haul Road Safety', 'K3 Pertambangan Mineral'],
      assignedEquipmentCode: 'DT-501',
      currentProject: 'Tambang Nikel Morowali Site A',
      currentSite: 'Hauling Road KM 4',
      rosterPattern: '8:2',
      daysOnDuty: 5,
      safetyScore: 97,
      fatigueScore: 15,
      totalLifetimeHM: 11200.0,
      workHoursThisMonth: 210.0,
      medicalCheckupStatus: 'FIT',
      assignmentHistoryCount: 18
    },
    {
      id: 'op-05',
      nik: 'OP-2018-0015',
      name: 'Eko Prasetyo',
      phone: '+62 811-2233-4455',
      specialization: ['CRANE', 'MOBILE_CRANE', 'ROUGH_TERRAIN_CRANE'],
      sioLicenseNumber: 'SIO-KEMENAKER-CRANE-K1-2023-9901',
      sioClass: 'KELAS_1',
      sioExpiryDate: '2026-12-30',
      sioStatus: 'VALID',
      certifications: [
        {
          id: 'cert-05',
          operatorId: 'op-05',
          operatorName: 'Eko Prasetyo',
          certificationType: 'CRANE',
          certificateNumber: 'SIO-KEMENAKER-CRANE-K1-2023-9901',
          issueDate: '2023-12-30',
          expiryDate: '2026-12-30',
          issuer: 'Kementerian Ketenagakerjaan RI (KEMENAKER)',
          documentUrl: '/docs/sio/eko_crane_k1.pdf',
          sioClass: 'KELAS_1',
          status: 'VALID'
        }
      ],
      experienceYears: 15,
      trainingHistory: ['Rigging & Critical Lift Planning', 'Load Moment Indicator (LMI) Calibration', 'Marine Crane Operation'],
      assignedEquipmentCode: 'CRN-701',
      currentProject: 'Jembatan Maritim & Dermaga Surabaya',
      currentSite: 'Pier 4 Surabaya Port',
      rosterPattern: 'STANDARD_MON_SAT',
      daysOnDuty: 3,
      safetyScore: 100,
      fatigueScore: 8,
      totalLifetimeHM: 16800.0,
      workHoursThisMonth: 160.0,
      medicalCheckupStatus: 'FIT',
      assignmentHistoryCount: 30
    }
  ];

  private timesheets: DailyTimesheet[] = [
    {
      id: 'ts-01',
      timesheetNumber: 'TS-20260820-01',
      date: '2026-08-20',
      equipmentId: 'eq-01',
      equipmentCode: 'EXC-201',
      equipmentName: 'Komatsu PC200-8MO',
      operatorId: 'op-01',
      operatorName: 'Agus Sudarsono',
      projectId: 'prj-01',
      projectName: 'Proyek Tol IKN Seksi 3B',
      shift: 'SHIFT_1_DAY',
      startHM: 3410.5,
      endHM: 3420.5,
      totalHM: 10.0,
      operatingHours: 8.5,
      idleHours: 1.0,
      standbyRainHours: 0.5,
      standbyQueueHours: 0,
      breakdownHours: 0,
      fuelConsumedLiters: 155,
      workDescription: 'Galian cut STA 12+500 dan trimming lereng interchange IKN',
      status: 'APPROVED',
      approvedBy: 'Ir. Hendra Gunawan (PM)',
      activityType: 'EXCAVATION'
    },
    {
      id: 'ts-02',
      timesheetNumber: 'TS-20260820-02',
      date: '2026-08-20',
      equipmentId: 'eq-02',
      equipmentCode: 'EXC-301',
      equipmentName: 'Caterpillar 336D2 L',
      operatorId: 'op-02',
      operatorName: 'Bambang Irawan',
      projectId: 'prj-02',
      projectName: 'Tambang Nikel Morowali Site A',
      shift: 'SHIFT_1_DAY',
      startHM: 6138.0,
      endHM: 6150.0,
      totalHM: 12.0,
      operatingHours: 10.5,
      idleHours: 1.5,
      standbyRainHours: 0,
      standbyQueueHours: 0,
      breakdownHours: 0,
      fuelConsumedLiters: 300,
      workDescription: 'Loading Overburden (OB) Bench 4 ke Dump Truck 40T',
      status: 'APPROVED',
      approvedBy: 'Drs. Ronald Sitompul (KTT)',
      activityType: 'HAULING'
    },
    {
      id: 'ts-03',
      timesheetNumber: 'TS-20260820-03',
      date: '2026-08-20',
      equipmentId: 'eq-04',
      equipmentCode: 'DT-501',
      equipmentName: 'Scania P410 CB 8x4 Heavy Tipper',
      operatorId: 'op-04',
      operatorName: 'Dedik Supriyadi',
      projectId: 'prj-02',
      projectName: 'Tambang Nikel Morowali Site A',
      shift: 'SHIFT_1_DAY',
      startHM: 4198.0,
      endHM: 4210.8,
      totalHM: 12.8,
      operatingHours: 11.5,
      idleHours: 1.3,
      standbyRainHours: 0,
      standbyQueueHours: 0,
      breakdownHours: 0,
      fuelConsumedLiters: 240,
      workDescription: 'Hauling OB Pit Timur menuju Disposal Barat sebanyak 19 rit',
      status: 'APPROVED',
      approvedBy: 'Drs. Ronald Sitompul (KTT)',
      activityType: 'HAULING'
    }
  ];

  private p2hList: P2HInspection[] = [
    {
      id: 'p2h-01',
      inspectionNumber: 'P2H-20260821-01',
      date: '2026-08-21',
      time: '06:45',
      equipmentId: 'eq-01',
      equipmentCode: 'EXC-201',
      equipmentCategory: 'EXCAVATOR',
      operatorName: 'Agus Sudarsono',
      inspectorName: 'Siti Rahmawati (HSE Officer)',
      shift: 'SHIFT_1_DAY',
      hourMeter: 3420.5,
      gpsCoordinates: { lat: -0.9634, lng: 116.7123 },
      items: {
        engineOilLevel: true,
        hydraulicOilLevel: true,
        radiatorCoolant: true,
        fuelWaterSeparator: true,
        trackTireTension: true,
        hydraulicCylinderLeak: true,
        brakeSystem: true,
        hornAndReverseAlarm: true,
        aparFireExtinguisher: true,
        safetyBelt: true,
        rotaryLampLighting: true,
        mirrorsAndGlass: true,
        boomArmStructure: true
      },
      result: 'FIT_TO_WORK',
      photoEvidenceUrls: [
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80'
      ],
      operatorSignature: 'Agus_Sudarsono_Digital'
    },
    {
      id: 'p2h-02',
      inspectionNumber: 'P2H-20260821-02',
      date: '2026-08-21',
      time: '06:50',
      equipmentId: 'eq-06',
      equipmentCode: 'MGR-401',
      equipmentCategory: 'MOTOR_GRADER',
      operatorName: 'Ferry Kurniawan',
      inspectorName: 'Siti Rahmawati (HSE Officer)',
      shift: 'SHIFT_1_DAY',
      hourMeter: 8450.4,
      gpsCoordinates: { lat: -0.9650, lng: 116.7110 },
      items: {
        engineOilLevel: true,
        hydraulicOilLevel: false, // Defect
        radiatorCoolant: true,
        fuelWaterSeparator: true,
        trackTireTension: true,
        hydraulicCylinderLeak: false, // Defect rembes oli
        brakeSystem: true,
        hornAndReverseAlarm: true,
        aparFireExtinguisher: true,
        safetyBelt: true,
        rotaryLampLighting: true,
        mirrorsAndGlass: true
      },
      result: 'DO_NOT_OPERATE',
      photoEvidenceUrls: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
      ],
      criticalDefectNotes: 'Kebocoran parah pada cylinder lift blade hidrolik kanan. Oli menetes aktif ke tanah. Alat harus masuk workshop.',
      operatorSignature: 'Ferry_K_Digital'
    }
  ];

  private fuelLogs: HeavyFuelLog[] = [
    {
      id: 'fl-01',
      voucherNumber: 'FL-20260820-012',
      date: '2026-08-20',
      time: '12:15',
      equipmentId: 'eq-01',
      equipmentCode: 'EXC-201',
      equipmentName: 'Komatsu PC200-8MO',
      projectId: 'prj-01',
      projectName: 'Proyek Tol IKN Seksi 3B',
      currentHM: 3415.0,
      litersFilled: 180,
      fuelBowserTruck: 'BOWSER-01 (Hino 500 Pitstop 10kL)',
      dispenserOperator: 'Rahmat Hidayat (Fuelman)',
      fuelType: 'SOLAR_B35',
      unitCostPerLiter: 14500,
      totalCostIdr: 2610000,
      previousRefuelHM: 3405.0,
      calculatedBurnRate: 18.0,
      isAnomalyDetected: false
    },
    {
      id: 'fl-02',
      voucherNumber: 'FL-20260820-013',
      date: '2026-08-20',
      time: '12:45',
      equipmentId: 'eq-02',
      equipmentCode: 'EXC-301',
      equipmentName: 'Caterpillar 336D2 L',
      projectId: 'prj-02',
      projectName: 'Tambang Nikel Morowali Site A',
      currentHM: 6144.0,
      litersFilled: 320,
      fuelBowserTruck: 'BOWSER-02 (Scania Fuel Tank 15kL)',
      dispenserOperator: 'Yusuf Maulana (Fuelman)',
      fuelType: 'SOLAR_B35',
      unitCostPerLiter: 14500,
      totalCostIdr: 4640000,
      previousRefuelHM: 6133.0,
      calculatedBurnRate: 29.09,
      isAnomalyDetected: false
    },
    {
      id: 'fl-03',
      voucherNumber: 'FL-20260820-014',
      date: '2026-08-20',
      time: '13:30',
      equipmentId: 'eq-03',
      equipmentCode: 'DOZ-101',
      equipmentName: 'Komatsu D85ESS-2',
      projectId: 'prj-01',
      projectName: 'Proyek Tol IKN Seksi 3B',
      currentHM: 7885.0,
      litersFilled: 220,
      fuelBowserTruck: 'BOWSER-01 (Hino 500 Pitstop 10kL)',
      dispenserOperator: 'Rahmat Hidayat (Fuelman)',
      fuelType: 'SOLAR_B35',
      unitCostPerLiter: 14500,
      totalCostIdr: 3190000,
      previousRefuelHM: 7877.0,
      calculatedBurnRate: 27.5,
      isAnomalyDetected: true,
      anomalyReason: 'Burn rate melonjak 15% di atas rata-rata (diduga idle berkepanjangan tanpa beban)'
    }
  ];

  private maintenanceSchedules: HeavyMaintenanceSchedule[] = [
    {
      id: 'ms-01',
      workOrderNumber: 'WO-PS-2026-088',
      equipmentId: 'eq-01',
      equipmentCode: 'EXC-201',
      serviceType: 'PS_250',
      currentHM: 3420.5,
      targetServiceHM: 3500,
      remainingHM: 79.5,
      status: 'SCHEDULED',
      assignedMechanic: 'Rian Pratama (Lead Mechanic IKN)',
      partsList: ['Engine Oil 15W-40 (24 Liter)', 'Oil Filter 6736-51-5142', 'Fuel Filter 600-311-2110', 'Hydraulic Pilot Filter'],
      estimatedCostIdr: 8500000,
      downTimeHours: 4.0,
      scheduledDate: '2026-08-28'
    },
    {
      id: 'ms-02',
      workOrderNumber: 'WO-PS-2026-089',
      equipmentId: 'eq-03',
      equipmentCode: 'DOZ-101',
      serviceType: 'PS_1000',
      currentHM: 7890.2,
      targetServiceHM: 8000,
      remainingHM: 109.8,
      status: 'SCHEDULED',
      assignedMechanic: 'Suparman (Heavy Dozer Specialist)',
      partsList: ['Full Oil Change Engine & Transmisi', 'Final Drive Oil SAE 50', 'Hydraulic Suction & Return Filter', 'Track Roller Inspection Kit'],
      estimatedCostIdr: 26500000,
      downTimeHours: 12.0,
      scheduledDate: '2026-09-05'
    },
    {
      id: 'ms-03',
      workOrderNumber: 'WO-BD-2026-012',
      equipmentId: 'eq-06',
      equipmentCode: 'MGR-401',
      serviceType: 'UNSCHEDULED_BREAKDOWN',
      currentHM: 8450.4,
      targetServiceHM: 8450,
      remainingHM: 0,
      status: 'IN_PROGRESS',
      assignedMechanic: 'Joko Widodo & Tim Hidrolik Site IKN',
      partsList: ['Seal Kit Lift Cylinder CAT 140K', 'Hydraulic Hose 3/4" 4000 PSI', 'Hydraulic Oil Tellus S2 V46 (40L)'],
      estimatedCostIdr: 18500000,
      downTimeHours: 24.0,
      scheduledDate: '2026-08-21'
    }
  ];

  private breakdowns: EquipmentBreakdownRecord[] = [
    {
      id: 'bd-01',
      breakdownNumber: 'BD-2026-0821-001',
      equipmentId: 'eq-06',
      equipmentCode: 'MGR-401',
      equipmentName: 'Caterpillar 140K Motor Grader',
      projectId: 'prj-01',
      projectName: 'Proyek Tol IKN Seksi 3B',
      siteName: 'Site Main Road & Interchange STA 12+500',
      operatorId: 'op-06',
      operatorName: 'Ferry Kurniawan',
      reportedAt: '2026-08-21T06:50:00Z',
      location: 'STA 12+800 Main Road IKN',
      severity: 'CRITICAL',
      rootCause: 'Seal rod cylinder blade hidrolik jebol akibat gesekan debu tanah laterit keras',
      failureCategory: 'HYDRAULIC',
      technicianAssigned: 'Joko Widodo (Mekanik Senior Hidrolik)',
      diagnosisNotes: 'Tekanan hidrolik drop dari 280 bar ke 110 bar. Oli rembes masif. Wajib overhaul silinder hidrolik kanan.',
      partsReplaced: [
        { partName: 'CAT Seal Kit Cylinder', partNumber: 'CAT-228-4410', qty: 2, unitCostIdr: 4500000 },
        { partName: 'Hydraulic High Pressure Hose', partNumber: 'HPH-75-4000', qty: 1, unitCostIdr: 2800000 },
        { partName: 'Hydraulic Oil Tellus 46', partNumber: 'SH-V46-20L', qty: 2, unitCostIdr: 1900000 }
      ],
      repairDurationHours: 8.5,
      laborCostIdr: 2500000,
      partsCostIdr: 15600000,
      totalCostIdr: 18100000,
      status: 'REPAIRING',
      testPassed: false
    }
  ];

  private incidents: EquipmentIncidentRecord[] = [
    {
      id: 'inc-01',
      incidentNumber: 'INC-HSE-2026-044',
      project: 'Proyek Tol IKN Seksi 3B',
      site: 'Site Main Road STA 12+500',
      equipmentId: 'eq-03',
      equipmentCode: 'DOZ-101',
      operatorId: 'op-03',
      operatorName: 'Cahyo Santoso',
      date: '2026-08-15',
      time: '14:20',
      location: 'Lereng Timbunan STA 12+900',
      severity: 'NEAR_MISS',
      description: 'Dozer tergelincir 1.5 meter saat melakukan pushing timbunan di tepi lereng akibat tanah gembur pasca hujan.',
      evidencePhotoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?auto=format&fit=crop&w=400&q=80',
      witnessName: 'Siti Rahmawati (HSE Officer)',
      rootCause: 'Operator mendorong tanah terlalu mendekati bibir tebing tanpa safety berm (tanggul pengaman minimal setinggi 1/2 roda).',
      correctiveAction: 'Instruksi wajib pembuatan safety berm minimal 1 meter sebelum dozer melakukan dumping timbunan.',
      status: 'RESOLVED'
    }
  ];

  private rentalBillings: HeavyRentalBilling[] = [
    {
      id: 'rb-01',
      invoiceNumber: 'INV-HE-2026-0810',
      clientName: 'PT Waskita Karya (Persero) Tbk',
      projectName: 'Proyek Tol IKN Seksi 3B',
      equipmentCode: 'EXC-201 (Komatsu PC200-8MO)',
      rentalType: 'LEPAS_KUNCI',
      pricingScheme: 'MONTHLY',
      minimumMonthlyHM: 200,
      totalHMUsed: 228.5,
      hourlyRateIdr: 285000,
      overtimeRateIdr: 320000,
      mobilizationFeeIdr: 15000000,
      demobilizationFeeIdr: 15000000,
      subtotalIdr: 96120000,
      taxPpnIdr: 10573200,
      totalInvoiceIdr: 106693200,
      rentalCostIdr: 32000000,
      netProfitIdr: 74693200,
      paymentStatus: 'PAID',
      dueDate: '2026-08-25'
    },
    {
      id: 'rb-02',
      invoiceNumber: 'INV-HE-2026-0811',
      clientName: 'PT Bukit Makmur Mandiri Utama (BUMA)',
      projectName: 'Tambang Nikel Morowali Site A',
      equipmentCode: 'EXC-301 (CAT 336D2 L)',
      rentalType: 'ALL_IN_OPERATOR_BBM',
      pricingScheme: 'MONTHLY',
      minimumMonthlyHM: 250,
      totalHMUsed: 295.0,
      hourlyRateIdr: 580000,
      overtimeRateIdr: 650000,
      mobilizationFeeIdr: 25000000,
      demobilizationFeeIdr: 25000000,
      subtotalIdr: 224250000,
      taxPpnIdr: 24667500,
      totalInvoiceIdr: 248917500,
      rentalCostIdr: 95000000,
      netProfitIdr: 153917500,
      paymentStatus: 'UNPAID',
      dueDate: '2026-09-10'
    }
  ];

  private transportRequests: EquipmentTransportRequest[] = [
    {
      id: 'tr-01',
      requestNumber: 'TR-LB-2026-004',
      equipmentId: 'eq-07',
      equipmentCode: 'VBR-601',
      equipmentName: 'Sakai SV525D Vibro Roller',
      originSite: 'Central Pool Balikpapan KM 13',
      destinationSite: 'Site Main Road IKN STA 12+500',
      lowbedTrailerVehicle: 'LOWBED-02 (Volvo FH16 6x4 Heavy Lowbed)',
      driverName: 'Surya Darmawan',
      requestedDate: '2026-08-10',
      departureDate: '2026-08-11T08:00:00Z',
      arrivalDate: '2026-08-11T14:30:00Z',
      permitNumber: 'IZIN-KAPOLRES-KUKAR-2026-881',
      routePlan: 'Balikpapan -> Samboja -> Jembatan Pulau Balang -> KIPP IKN',
      status: 'CONFIRMED',
      transportCostIdr: 14500000
    }
  ];

  private productivityMetrics: EquipmentProductivityMetric[] = [
    {
      id: 'pm-01',
      equipmentId: 'eq-01',
      equipmentCode: 'EXC-201',
      category: 'EXCAVATOR',
      projectName: 'Proyek Tol IKN Seksi 3B',
      date: '2026-08-20',
      volumeM3: 1220,
      cycleCount: 680,
      operatingHours: 8.5,
      actualUnitPerHour: 143.5, // 143.5 m³/h
      targetUnitPerHour: 140.0,
      productivityPct: 102.5
    },
    {
      id: 'pm-02',
      equipmentId: 'eq-02',
      equipmentCode: 'EXC-301',
      category: 'EXCAVATOR',
      projectName: 'Tambang Nikel Morowali Site A',
      date: '2026-08-20',
      volumeM3: 2450,
      cycleCount: 790,
      operatingHours: 10.5,
      actualUnitPerHour: 233.3, // 233.3 m³/h
      targetUnitPerHour: 220.0,
      productivityPct: 106.0
    },
    {
      id: 'pm-03',
      equipmentId: 'eq-04',
      equipmentCode: 'DT-501',
      category: 'DUMP_TRUCK',
      projectName: 'Tambang Nikel Morowali Site A',
      date: '2026-08-20',
      tonnageTons: 760,
      cycleCount: 19, // 19 ritase
      operatingHours: 11.5,
      actualUnitPerHour: 66.1, // 66.1 ton/jam
      targetUnitPerHour: 60.0,
      productivityPct: 110.1
    },
    {
      id: 'pm-04',
      equipmentId: 'eq-05',
      equipmentCode: 'CRN-701',
      category: 'ROUGH_TERRAIN_CRANE',
      projectName: 'Jembatan Maritim & Dermaga Surabaya',
      date: '2026-08-20',
      tonnageTons: 190,
      liftCount: 5, // 5 lifting operations
      operatingHours: 7.0,
      actualUnitPerHour: 27.1,
      targetUnitPerHour: 25.0,
      productivityPct: 108.4
    }
  ];

  // Getters
  getEquipments(): HeavyEquipmentAsset[] {
    return [...this.equipments];
  }

  getEquipmentById(id: string): HeavyEquipmentAsset | undefined {
    return this.equipments.find(e => e.id === id || e.code === id);
  }

  getSites(): ConstructionSite[] {
    return [...this.sites];
  }

  getProjects(): ConstructionProject[] {
    return [...this.projects];
  }

  getProjectById(id: string): ConstructionProject | undefined {
    return this.projects.find(p => p.id === id || p.code === id);
  }

  getAssignments(): EquipmentAssignment[] {
    return [...this.assignments];
  }

  getOperators(): HeavyOperatorProfile[] {
    return [...this.operators];
  }

  getTimesheets(): DailyTimesheet[] {
    return [...this.timesheets];
  }

  getP2HInspections(): P2HInspection[] {
    return [...this.p2hList];
  }

  getP2hList(): P2HInspection[] {
    return [...this.p2hList];
  }

  getFuelLogs(): HeavyFuelLog[] {
    return [...this.fuelLogs];
  }

  getMaintenanceSchedules(): HeavyMaintenanceSchedule[] {
    return [...this.maintenanceSchedules];
  }

  getBreakdowns(): EquipmentBreakdownRecord[] {
    return [...this.breakdowns];
  }

  getIncidents(): EquipmentIncidentRecord[] {
    return [...this.incidents];
  }

  getRentalBillings(): HeavyRentalBilling[] {
    return [...this.rentalBillings];
  }

  getTransportRequests(): EquipmentTransportRequest[] {
    return [...this.transportRequests];
  }

  getProductivityMetrics(): EquipmentProductivityMetric[] {
    return [...this.productivityMetrics];
  }

  // Mutations with Business Validations (Prompt 64 Section 60)
  addEquipment(eq: Partial<HeavyEquipmentAsset>): HeavyEquipmentAsset {
    const newEq: HeavyEquipmentAsset = {
      id: `eq-${Date.now()}`,
      code: eq.code || `EQ-${Math.floor(100 + Math.random() * 900)}`,
      name: eq.name || 'Alat Berat Baru',
      category: eq.category || 'EXCAVATOR',
      brand: eq.brand || 'Komatsu',
      model: eq.model || 'Standard Model',
      serialNumber: eq.serialNumber || `SN-${Date.now()}`,
      engineSerialNumber: eq.engineSerialNumber || `ENG-${Date.now()}`,
      assetNumber: eq.assetNumber || `AST-HE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      year: eq.year || 2024,
      capacity: eq.capacity || 'Standard Spec',
      fuelType: eq.fuelType || 'SOLAR_B35',
      hourMeter: eq.hourMeter || 0,
      mileageKm: eq.mileageKm || 0,
      bucketCapacityM3: eq.bucketCapacityM3 || 1.0,
      tonnageCapacityTons: eq.tonnageCapacityTons || 20,
      currentSiteId: eq.currentSiteId || this.sites[0]?.id || '',
      currentSiteName: eq.currentSiteName || this.sites[0]?.name || 'Site Proyek',
      currentProjectId: eq.currentProjectId || this.projects[0]?.id || '',
      currentProjectName: eq.currentProjectName || this.projects[0]?.name || 'Proyek Konstruksi',
      status: eq.status || 'AVAILABLE',
      fuelLevelPct: eq.fuelLevelPct || 100,
      fuelBurnRateLitersPerHM: eq.fuelBurnRateLitersPerHM || 18.0,
      engineStatus: 'OFF',
      engineRpm: 0,
      coolantTempC: 30,
      oilPressureBar: 0,
      hydraulicPressureBar: 0,
      hydraulicTempC: 28,
      batteryVoltage: 27.5,
      vibrationLevelMmS: 0,
      telemetryCapability: eq.telemetryCapability || 'GPS_FULL_TELEMETRY',
      dtcCodes: [],
      gpsCoordinates: eq.gpsCoordinates || { lat: -0.9634, lng: 116.7123 },
      currentLocationName: eq.currentLocationName || 'Workshop Central Pool',
      lastP2hResult: 'FIT_TO_WORK',
      lastServiceHM: 0,
      nextServiceHM: 250,
      physicalAvailabilityPct: 100,
      utilizationAvailabilityPct: 0,
      rentalHourlyRate: eq.rentalHourlyRate || 285000,
      dailyTargetHM: 8.0,
      siloCertificateNumber: eq.siloCertificateNumber || `SILO-DISNAKER-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      siloExpiryDate: eq.siloExpiryDate || '2027-12-31',
      utilizationCategory: 'NORMAL',
      downtimeHoursThisMonth: 0,
      totalBreakdownCount: 0,
      operatingCostPerHourIdr: 300000,
      revenueGeneratedIdr: 0,
      activeAlerts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tenantId: 'tenant-default'
    };
    this.equipments.unshift(newEq);
    return newEq;
  }

  assignEquipment(asg: Partial<EquipmentAssignment>): { success: boolean; message: string; assignment?: EquipmentAssignment } {
    // Validation: Equipment cannot have double active assignment
    const existingActive = this.assignments.find(
      a => a.equipmentId === asg.equipmentId && a.status === 'ACTIVE' && a.id !== asg.id
    );
    if (existingActive) {
      return {
        success: false,
        message: `Alat ${asg.equipmentCode || 'ini'} sudah teralokasi di ${existingActive.projectName} (${existingActive.workArea}) hingga ${existingActive.endDate}. Double assignment tidak diizinkan!`
      };
    }

    // Validation: Operator cannot have double active assignment
    const existingOp = this.assignments.find(
      a => a.operatorId === asg.operatorId && a.status === 'ACTIVE' && a.id !== asg.id
    );
    if (existingOp) {
      return {
        success: false,
        message: `Operator ${asg.operatorName} saat ini sedang bertugas di ${existingOp.projectName}. Harap selesaikan penugasan sebelumnya terlebih dahulu.`
      };
    }

    // Validation: Equipment in breakdown/maintenance cannot be assigned
    const eq = this.equipments.find(e => e.id === asg.equipmentId);
    if (eq && (eq.status === 'BREAKDOWN' || eq.status === 'MAINTENANCE')) {
      return {
        success: false,
        message: `Alat ${eq.code} sedang berstatus ${eq.status} dan tidak dapat dialokasikan ke proyek sampai perbaikan selesai.`
      };
    }

    const newAsg: EquipmentAssignment = {
      id: `asg-${Date.now()}`,
      assignmentCode: `ASG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      equipmentId: asg.equipmentId || '',
      equipmentCode: asg.equipmentCode || '',
      equipmentName: asg.equipmentName || '',
      projectId: asg.projectId || '',
      projectName: asg.projectName || '',
      siteId: asg.siteId || '',
      siteName: asg.siteName || '',
      workArea: asg.workArea || 'General Job Site Area',
      operatorId: asg.operatorId || '',
      operatorName: asg.operatorName || '',
      startDate: asg.startDate || new Date().toISOString().slice(0, 10),
      endDate: asg.endDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      shift: asg.shift || 'SHIFT_1_DAY',
      targetHours: asg.targetHours || 200,
      targetProductivity: asg.targetProductivity || 'Standard Target',
      status: 'ACTIVE',
      notes: asg.notes || '',
      assignedBy: 'Operation Manager',
      createdAt: new Date().toISOString()
    };

    this.assignments.unshift(newAsg);

    if (eq) {
      eq.status = 'ASSIGNED';
      eq.currentProjectId = newAsg.projectId;
      eq.currentProjectName = newAsg.projectName;
      eq.currentSiteId = newAsg.siteId;
      eq.currentSiteName = newAsg.siteName;
      eq.assignedOperatorId = newAsg.operatorId;
      eq.assignedOperatorName = newAsg.operatorName;
    }

    return { success: true, message: `Alokasi alat ${newAsg.equipmentCode} ke proyek ${newAsg.projectName} berhasil diterbitkan.`, assignment: newAsg };
  }

  submitTimesheet(ts: Partial<DailyTimesheet>): DailyTimesheet {
    const totalHM = (ts.endHM || 0) - (ts.startHM || 0);
    const newTs: DailyTimesheet = {
      id: `ts-${Date.now()}`,
      timesheetNumber: `TS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`,
      date: ts.date || new Date().toISOString().slice(0, 10),
      equipmentId: ts.equipmentId || '',
      equipmentCode: ts.equipmentCode || '',
      equipmentName: ts.equipmentName || '',
      operatorId: ts.operatorId || '',
      operatorName: ts.operatorName || '',
      projectId: ts.projectId || '',
      projectName: ts.projectName || '',
      shift: ts.shift || 'SHIFT_1_DAY',
      startHM: ts.startHM || 0,
      endHM: ts.endHM || 0,
      totalHM: totalHM > 0 ? totalHM : 8,
      operatingHours: ts.operatingHours || 7.5,
      idleHours: ts.idleHours || 0.5,
      standbyRainHours: ts.standbyRainHours || 0,
      standbyQueueHours: ts.standbyQueueHours || 0,
      breakdownHours: ts.breakdownHours || 0,
      fuelConsumedLiters: ts.fuelConsumedLiters || 140,
      workDescription: ts.workDescription || 'Operasional harian alat berat',
      status: 'SUBMITTED',
      activityType: ts.activityType || 'EXCAVATION'
    };
    this.timesheets.unshift(newTs);

    // Update equipment HM & project hours
    const eq = this.equipments.find(e => e.id === ts.equipmentId);
    if (eq && ts.endHM && ts.endHM > eq.hourMeter) {
      eq.hourMeter = ts.endHM;
    }

    const prj = this.projects.find(p => p.id === ts.projectId);
    if (prj) {
      prj.totalOperatingHours += newTs.operatingHours;
      prj.totalIdleHours += newTs.idleHours;
      prj.totalFuelConsumedLiters += newTs.fuelConsumedLiters;
    }

    return newTs;
  }

  submitP2H(p2h: Partial<P2HInspection>): P2HInspection {
    return this.submitP2h(p2h);
  }

  submitP2h(p2h: Partial<P2HInspection>): P2HInspection {
    const newP2h: P2HInspection = {
      id: `p2h-${Date.now()}`,
      inspectionNumber: `P2H-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`,
      date: p2h.date || new Date().toISOString().slice(0, 10),
      time: p2h.time || '07:00',
      equipmentId: p2h.equipmentId || '',
      equipmentCode: p2h.equipmentCode || '',
      equipmentCategory: p2h.equipmentCategory || 'EXCAVATOR',
      operatorName: p2h.operatorName || 'Operator',
      inspectorName: p2h.inspectorName || 'HSE Officer',
      shift: p2h.shift || 'SHIFT_1_DAY',
      hourMeter: p2h.hourMeter || 0,
      items: p2h.items || {
        engineOilLevel: true,
        hydraulicOilLevel: true,
        radiatorCoolant: true,
        fuelWaterSeparator: true,
        trackTireTension: true,
        hydraulicCylinderLeak: true,
        brakeSystem: true,
        hornAndReverseAlarm: true,
        aparFireExtinguisher: true,
        safetyBelt: true,
        rotaryLampLighting: true,
        mirrorsAndGlass: true
      },
      result: p2h.result || 'FIT_TO_WORK',
      photoEvidenceUrls: p2h.photoEvidenceUrls || [
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80'
      ],
      criticalDefectNotes: p2h.criticalDefectNotes,
      operatorSignature: p2h.operatorSignature || 'Signed_Digital'
    };
    this.p2hList.unshift(newP2h);

    const eq = this.equipments.find(e => e.id === p2h.equipmentId);
    if (eq) {
      eq.lastP2hResult = newP2h.result;
      if (newP2h.result === 'DO_NOT_OPERATE') {
        eq.status = 'BREAKDOWN';
        eq.engineStatus = 'OFF';
        eq.activeAlerts.push(`P2H Tag-Out: ${newP2h.criticalDefectNotes || 'Alat Rusak / Kritis'}`);
      }
    }

    return newP2h;
  }

  addFuelLog(fl: Partial<HeavyFuelLog>): HeavyFuelLog {
    const isAnomaly = (fl.calculatedBurnRate || 18.5) > 26.0;
    const newFl: HeavyFuelLog = {
      id: `fl-${Date.now()}`,
      voucherNumber: `FL-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`,
      date: fl.date || new Date().toISOString().slice(0, 10),
      time: fl.time || '12:00',
      equipmentId: fl.equipmentId || '',
      equipmentCode: fl.equipmentCode || '',
      equipmentName: fl.equipmentName || '',
      projectId: fl.projectId || '',
      projectName: fl.projectName || '',
      currentHM: fl.currentHM || 0,
      litersFilled: fl.litersFilled || 200,
      fuelBowserTruck: fl.fuelBowserTruck || 'BOWSER-01 (Hino 500 Pitstop 10kL)',
      dispenserOperator: fl.dispenserOperator || 'Fuelman',
      fuelType: fl.fuelType || 'SOLAR_B35',
      unitCostPerLiter: fl.unitCostPerLiter || 14500,
      totalCostIdr: (fl.litersFilled || 200) * (fl.unitCostPerLiter || 14500),
      previousRefuelHM: fl.previousRefuelHM || 0,
      calculatedBurnRate: fl.calculatedBurnRate || 18.5,
      isAnomalyDetected: isAnomaly,
      anomalyReason: isAnomaly ? 'Konsumsi solar melebihi batas batas ambang efisiensi (Burn Rate > 26 L/HM)' : undefined
    };
    this.fuelLogs.unshift(newFl);

    // Update equipment fuel level
    const eq = this.equipments.find(e => e.id === fl.equipmentId);
    if (eq) {
      eq.fuelLevelPct = 100;
    }

    return newFl;
  }

  reportBreakdown(bd: Partial<EquipmentBreakdownRecord>): EquipmentBreakdownRecord {
    const newBd: EquipmentBreakdownRecord = {
      id: `bd-${Date.now()}`,
      breakdownNumber: `BD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`,
      equipmentId: bd.equipmentId || '',
      equipmentCode: bd.equipmentCode || '',
      equipmentName: bd.equipmentName || '',
      projectId: bd.projectId || '',
      projectName: bd.projectName || '',
      siteName: bd.siteName || '',
      operatorId: bd.operatorId || '',
      operatorName: bd.operatorName || '',
      reportedAt: new Date().toISOString(),
      location: bd.location || 'Job Site',
      severity: bd.severity || 'HIGH',
      rootCause: bd.rootCause || 'Kerusakan komponen mesin/hidrolik',
      failureCategory: bd.failureCategory || 'HYDRAULIC',
      technicianAssigned: bd.technicianAssigned || 'Tim Mekanik On-Call',
      diagnosisNotes: bd.diagnosisNotes || 'Menunggu pemeriksaan lanjutan',
      partsReplaced: bd.partsReplaced || [],
      repairDurationHours: bd.repairDurationHours || 0,
      laborCostIdr: bd.laborCostIdr || 1500000,
      partsCostIdr: bd.partsCostIdr || 5000000,
      totalCostIdr: (bd.laborCostIdr || 1500000) + (bd.partsCostIdr || 5000000),
      status: 'REPORTED',
      testPassed: false
    };

    this.breakdowns.unshift(newBd);

    // Set equipment to BREAKDOWN
    const eq = this.equipments.find(e => e.id === bd.equipmentId);
    if (eq) {
      eq.status = 'BREAKDOWN';
      eq.engineStatus = 'OFF';
      eq.totalBreakdownCount += 1;
      eq.activeAlerts.push(`BREAKDOWN: ${newBd.rootCause}`);
    }

    return newBd;
  }

  updateBreakdownStatus(id: string, status: EquipmentBreakdownRecord['status'], testPassed = false): EquipmentBreakdownRecord | undefined {
    const bd = this.breakdowns.find(b => b.id === id);
    if (!bd) return undefined;

    bd.status = status;
    bd.testPassed = testPassed;

    if (status === 'RETURNED_TO_SERVICE' && testPassed) {
      bd.completedAt = new Date().toISOString();
      const eq = this.equipments.find(e => e.id === bd.equipmentId);
      if (eq) {
        eq.status = 'AVAILABLE';
        eq.activeAlerts = eq.activeAlerts.filter(a => !a.includes('BREAKDOWN'));
      }
    }

    return bd;
  }

  reportIncident(inc: Partial<EquipmentIncidentRecord>): EquipmentIncidentRecord {
    const newInc: EquipmentIncidentRecord = {
      id: `inc-${Date.now()}`,
      incidentNumber: `INC-HSE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      project: inc.project || 'Proyek Konstruksi',
      site: inc.site || 'Site Utama',
      equipmentId: inc.equipmentId || '',
      equipmentCode: inc.equipmentCode || '',
      operatorId: inc.operatorId || '',
      operatorName: inc.operatorName || '',
      date: inc.date || new Date().toISOString().slice(0, 10),
      time: inc.time || '10:00',
      location: inc.location || 'Area Kerja',
      severity: inc.severity || 'NEAR_MISS',
      description: inc.description || 'Laporan insiden keselamatan kerja',
      evidencePhotoUrl: inc.evidencePhotoUrl,
      witnessName: inc.witnessName,
      rootCause: inc.rootCause || 'Penyelidikan berlangsung',
      correctiveAction: inc.correctiveAction || 'Penyelidikan dan perbaikan SOP K3',
      status: 'INVESTIGATING'
    };

    this.incidents.unshift(newInc);
    return newInc;
  }

  requestTransport(tr: Partial<EquipmentTransportRequest>): EquipmentTransportRequest {
    const newTr: EquipmentTransportRequest = {
      id: `tr-${Date.now()}`,
      requestNumber: `TR-LB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      equipmentId: tr.equipmentId || '',
      equipmentCode: tr.equipmentCode || '',
      equipmentName: tr.equipmentName || '',
      originSite: tr.originSite || 'Workshop Pool',
      destinationSite: tr.destinationSite || 'Job Site Proyek',
      lowbedTrailerVehicle: tr.lowbedTrailerVehicle || 'LOWBED-01 (Volvo FH16 6x4)',
      driverName: tr.driverName || 'Driver Lowbed',
      requestedDate: tr.requestedDate || new Date().toISOString().slice(0, 10),
      permitNumber: tr.permitNumber || `IZIN-DISHUB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      routePlan: tr.routePlan || 'Rute standar pengawalan kepolisian',
      status: 'REQUESTED',
      transportCostIdr: tr.transportCostIdr || 15000000
    };

    this.transportRequests.unshift(newTr);
    return newTr;
  }

  // Daily Project Briefing Generator (Prompt 64 Section 49)
  getDailyProjectBriefing(projectId?: string): AIDailyProjectBriefing {
    const prj = this.projects.find(p => p.id === projectId) || this.projects[0];
    const siteEqs = this.equipments.filter(e => e.currentProjectId === prj.id);
    const working = siteEqs.filter(e => e.status === 'WORKING' || e.status === 'OPERATING').length;
    const idle = siteEqs.filter(e => e.status === 'IDLE' || e.status === 'STANDBY').length;
    const breakdown = siteEqs.filter(e => e.status === 'BREAKDOWN').length;
    const maintenance = siteEqs.filter(e => e.status === 'MAINTENANCE').length;

    return {
      date: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      projectName: prj.name,
      totalEquipments: siteEqs.length,
      workingCount: working,
      idleCount: idle,
      breakdownCount: breakdown,
      maintenanceCount: maintenance,
      totalFuelConsumedLiters: prj.totalFuelConsumedLiters,
      totalVolumeAchievedBcm: prj.achievedVolumeBcm,
      safetyIncidentsCount: this.incidents.filter(i => i.project === prj.name && i.status !== 'CLOSED').length,
      risksIdentified: [
        `Tingkat utilisasi armada mencapai ${((working / (siteEqs.length || 1)) * 100).toFixed(1)}%.`,
        breakdown > 0 ? `Terdapat ${breakdown} unit breakdown yang menahan laju target harian.` : 'Seluruh armada utama berada dalam status siap kerja.',
        'Prakiraan cuaca hujan lebat di area disposal memerlukan pengalihan rute hauling.'
      ],
      recommendations: [
        'Maksimalkan ritase dump truck pada shift siang sebelum potensi hujan sore.',
        'Prioritaskan penyelesaian perbaikan hidrolik di workshop agar PA fleet kembali di atas 90%.',
        'Pastikan pengisian bahan bakar fuel bowser dilakukan tepat saat pergantian shift (jam 12:00 & 18:00).'
      ],
      executiveSummary: `Operasional proyek ${prj.name} berjalan lancar dengan progres kumulatif ${prj.progressPercent.toFixed(1)}%. Target galian harian tercapai 104% dari rencana kerja BCM.`
    };
  }

  // AI Heavy Equipment Diagnostics Assistant (Prompt 64 Section 43)
  askHeavyEquipmentAi(query: string): string {
    const q = query.toLowerCase();

    // 1. "Berapa alat yang sedang bekerja?"
    if (q.includes('berapa alat') && (q.includes('bekerja') || q.includes('operasi'))) {
      const working = this.equipments.filter(e => e.status === 'WORKING' || e.status === 'OPERATING');
      return `🏗️ **Alat yang Sedang Bekerja**:
Saat ini terdapat **${working.length} unit alat berat** yang sedang beroperasi aktif di lapangan:
${working.map(e => `• **${e.code} (${e.name})** di *${e.currentProjectName || e.currentSiteName}* — Status: Engine Running (${e.engineRpm} RPM)`).join('\n')}

Total populasi armada: ${this.equipments.length} unit (Tingkat Utilisasi Aktif: ${((working.length / this.equipments.length) * 100).toFixed(1)}%).`;
    }

    // 2. "Alat mana paling banyak idle?"
    if (q.includes('idle') || q.includes('menganggur') || q.includes('paling banyak idle')) {
      const idleEqs = this.equipments.filter(e => e.status === 'IDLE' || e.status === 'STANDBY');
      return `⏳ **Alat dengan Jam Idle Tertinggi**:
1. **DOZ-101 (Komatsu D85ESS-2 Bulldozer)** di Proyek Tol IKN:
   - Terdeteksi *Idle Duration*: **35 menit berturut-turut** di Disposal Area STA 12.
   - Dampak BBM terbuang: **~3.6 Liter solar**.
   - **Rekomendasi AI**: Aktifkan fitur *Auto Engine Shutdown* (3 menit) atau arahkan dozer meratakan subgrade di STA 13+200.
2. **VBR-601 (Sakai SV525D Vibro)**: Standby 4.2 jam menunggu selesainya pemadatan layer 2.`;
    }

    // 3. "Excavator mana paling boros?"
    if (q.includes('boros') || q.includes('paling boros') || q.includes('fuel rate') || q.includes('burn rate')) {
      return `⛽ **Analisis Efisiensi Konsumsi BBM (Burn Rate)**:
- **Unit Paling Tinggi Konsumsi**: **EXC-301 (Caterpillar 336D2 L)** dengan burn rate **28.5 Liter / HM**.
  - *Konteks*: 28.5 L/HM adalah angka wajar untuk kelas 36-Ton di galian batuan keras Morowali.
- **Anomali Boros**: **DOZ-101** mencatatkan lonjakan 15% pada jam idle (burn rate naik ke 27.5 L/HM dari baseline 24.0 L/HM).
- **Unit Paling Irit**: **CRN-701 Tadano 50T** (16.5 L/HM) & **EXC-201 Komatsu PC200** (18.2 L/HM).`;
    }

    // 4. "Alat mana yang harus service?"
    if (q.includes('service') || q.includes('servis') || q.includes('maintenance') || q.includes('ganti oli')) {
      const nearService = this.equipments.filter(e => (e.nextServiceHM - e.hourMeter) <= 120);
      return `🔧 **Jadwal Servis Berkala (Periodic Service) Terdekat**:
${nearService.map(e => `• **${e.code} (${e.name})**: Saat ini **${e.hourMeter.toFixed(1)} HM**, Servis berikutnya pada **${e.nextServiceHM} HM** (Tersisa **${(e.nextServiceHM - e.hourMeter).toFixed(1)} Jam Kerja**).`).join('\n')}

*Status Work Order*: Filter & oli SAE 15W-40 untuk EXC-201 sudah disiapkan di Workshop IKN.`;
    }

    // 5. "Project mana paling banyak menggunakan BBM?"
    if (q.includes('project') && (q.includes('bbm') || q.includes('solar') || q.includes('banyak'))) {
      return `📊 **Proyek dengan Konsumsi Solar Tertinggi**:
1. **Tambang Nikel Morowali Site A**: **892,400 Liter** (Operasi 24 Jam 2 Shift, Alat Berat Kelas Berat CAT 336 & Scania 8x4).
2. **Proyek Tol IKN Seksi 3B**: **358,200 Liter** (Fokus Earthmoving 4.5 Juta BCM).
3. **Jembatan Maritim Surabaya**: **122,500 Liter** (Operasi Erection Girder & Crane).`;
    }

    // 6. "Equipment mana paling mahal?"
    if (q.includes('paling mahal') || q.includes('biaya') || q.includes('cost')) {
      return `💰 **Equipment dengan Biaya Operasional / Nilai Tertinggi**:
1. **CRN-701 (Tadano GR-500EX 50-Ton Crane)**: Tarif Sewa **Rp 750.000 / Jam** | Operating Cost: **Rp 680.000 / Jam**.
2. **EXC-301 (Caterpillar 336D2 L 36-Ton)**: Tarif Sewa **Rp 450.000 / Jam** | Operating Cost: **Rp 510.000 / Jam**.
3. **DOZ-101 (Komatsu D85ESS-2)**: Tarif Sewa **Rp 350.000 / Jam**.`;
    }

    // 7. "Kenapa downtime meningkat?"
    if (q.includes('downtime') || q.includes('rusak') || q.includes('breakdown')) {
      return `⚠️ **Penyebab Utama Kenaikan Downtime Bulan Ini**:
- Terjadi **48.0 Jam Downtime** pada unit **MGR-401 (CAT 140K Grader)** akibat kerusakan seal lift cylinder hidrolik di Proyek IKN.
- *Root Cause*: Partikel debu tanah laterit tajam mengikis rod silinder karena keterlambatan penggantian dust wiper seal pada PS 8000.
- *Status Perbaikan*: Work Order WO-BD-2026-012 sedang dikerjakan tim mekanik site dengan estimasi selesai 8 jam lagi.`;
    }

    // 8. "Operator mana paling berisiko?"
    if (q.includes('operator') && (q.includes('risiko') || q.includes('berisiko') || q.includes('sio') || q.includes('fatigue'))) {
      return `🛡️ **Evaluasi Risiko Operator K3**:
1. **Bambang Irawan (EXC-301 Morowali)**:
   - **Risiko Lisensi**: Surat Izin Operator (SIO Kelas 1 Kemenaker) akan habis dalam **25 hari** (15 Sept 2026).
   - Fatigue score: **24/100** (Hari kerja ke-6 pada roster 8:2).
2. **Cahyo Santoso (DOZ-101 IKN)**:
   - Terlibat insiden *Near Miss* di lereng timbunan tanggal 15 Agustus. Disarankan refresh training safety berm.`;
    }

    // 9. "Berapa utilization fleet alat berat?"
    if (q.includes('utilization') || q.includes('utilisasi') || q.includes('pa') || q.includes('ua')) {
      return `📈 **KPI Utilisasi & Ketersediaan Alat Berat Fleet**:
- **Physical Availability (PA)**: **92.4%** (Target: ≥ 90.0% - *Status: SEHAT*).
- **Utilization of Availability (UA)**: **84.8%** (Target: ≥ 80.0% - *Status: SANGAT BAIK*).
- **Fleet Overall Equipment Effectiveness (OEE)**: **78.3%**.`;
    }

    // Default Fallback
    return `🤖 **AI Heavy Equipment Fleet Copilot**:
Fleet alat berat Anda memantau **${this.equipments.length} unit alat berat** di **${this.projects.length} proyek aktif** (IKN Nusantara, Tambang Morowali, Pelabuhan Surabaya).
Status: **${this.equipments.filter(e => e.status === 'WORKING' || e.status === 'OPERATING').length} Beroperasi**, **${this.equipments.filter(e => e.status === 'IDLE' || e.status === 'STANDBY').length} Idle/Standby**, **${this.equipments.filter(e => e.status === 'BREAKDOWN').length} Breakdown**.
Anda dapat menanyakan: utilisasi, konsumsi solar, jadwal servis PS, audit P2H, atau evaluasi K3 operator.`;
  }
}

export const heavyEquipmentService = new HeavyEquipmentService();
