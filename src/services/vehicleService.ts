/**
 * Fleet Intelligence Smart AI - Vehicle Service & Repository
 * Comprehensive Vehicle Master Data, Assignments, Lifecycle & 9 Detail Tabs
 */

import { 
  VehicleExtended, 
  VehicleGroup, 
  BranchExtended, 
  Department, 
  VehicleDocument, 
  VehicleAssignmentHistory, 
  VehicleActivityLog, 
  VehicleFilterParams, 
  VehicleListResponse,
  VehicleAIInsightDetail,
  VehicleTripRecord,
  VehicleFuelRecord,
  VehicleMaintenanceRecord,
  VehicleAlertRecord,
  VehicleLifecycleStatus
} from '../types/vehicle';
import { mockVehicles, mockBranches, mockDrivers, mockGpsDevices } from '../constants/mockData';

// Initial Repository Seed Data with Complete Master Data & Assignments
let vehiclesRepository: VehicleExtended[] = mockVehicles.map((v, i) => {
  const regions = ['Jabodetabek & Banten', 'Jawa Barat', 'Jawa Timur', 'Jawa Tengah & DIY', 'Sumatera Utara'];
  const lifecycles: VehicleLifecycleStatus[] = ['active', 'active', 'active', 'rental', 'maintenance', 'inactive'];
  const colors = ['Putih - Diamond White', 'Kuning - Industrial Yellow', 'Merah - Flame Red', 'Hitam - Metallic Black', 'Silver Metallic'];
  
  const payloadKgs = [12000, 8000, 24000, 18000, 5000];
  const cargoCbm = [38, 24, 60, 48, 16];

  return {
    id: v.id,
    tenantId: v.tenantId || 'tenant-tln-01',
    vehicleCode: `VH-00${120 + i}`,
    name: `${v.brand} ${v.model}`,
    licensePlate: v.plateNumber,
    type: v.type,
    brand: v.brand,
    model: v.model,
    variant: i % 2 === 0 ? 'Long Chassis High Box' : 'Standard Heavy Duty',
    year: v.year || (2022 + (i % 3)),
    color: colors[i % colors.length],
    fuelType: v.fuelType,
    transmission: i % 3 === 0 ? 'automatic' : 'manual',
    ownership: i === 3 ? 'rental' : i === 4 ? 'leased' : 'company_owned',

    // Vehicle Lifecycle Status
    lifecycleStatus: lifecycles[i % lifecycles.length],

    // Technical Master Specs
    vin: v.vin || `MHF1TR30928${1000 + i}`,
    chassisNumber: `CHS-${v.brand.substring(0, 3).toUpperCase()}-202${i}-${100 + i}`,
    engineNumber: `ENG-J08E-UT${200 + i}`,
    engineCapacityCc: v.brand === 'Scania' ? 12700 : v.brand === 'Hino' ? 7684 : 5193,
    fuelCapacityLiters: v.fuelCapacityLiters || (v.type === 'truck_container' ? 400 : 200),
    capacity: {
      payloadKg: payloadKgs[i % payloadKgs.length],
      passengerCount: v.type.includes('van') ? 14 : 3,
      cargoVolumeCbm: cargoCbm[i % cargoCbm.length],
      maxWeightKg: payloadKgs[i % payloadKgs.length] + 6000,
      formatted: `${(payloadKgs[i % payloadKgs.length] / 1000).toFixed(1)} Ton (${cargoCbm[i % cargoCbm.length]} CBM)`,
    },
    payloadKg: payloadKgs[i % payloadKgs.length],
    grossVehicleWeightKg: payloadKgs[i % payloadKgs.length] + 6000,
    numberOfWheels: v.type === 'truck_container' ? 10 : v.type === 'truck_box' ? 6 : 4,
    tireSize: v.type === 'truck_container' ? '315/80 R22.5' : '10.00-20 16PR',
    odometerKm: v.odometerKm,
    engineHours: v.engineHours,

    // Legal & Registration
    stnkNumber: `STNK-0912384-${i + 1}`,
    stnkExpiry: v.stnkExpiry || '2027-08-20',
    bpkbNumber: `BPKB-J821903-${i + 1}`,
    kirNumber: `KIR-JABAR-92019-${i + 1}`,
    kirExpiry: v.kirExpiry || '2026-12-10',
    pajakExpiry: '2027-08-20',
    insuranceCompany: 'PT Asuransi Sinar Mas',
    insurancePolicyNumber: `POL-SM-2026-${500 + i}`,
    insuranceExpiry: v.insuranceExpiry || '2027-03-15',
    registrationStatus: 'valid',

    // Assignments
    groupId: `grp-${(i % 4) + 1}`,
    groupName: v.groupName || 'Armada Trans-Jawa Long Haul',
    branchId: v.branchId || 'br-jkt',
    branchName: mockBranches.find((b) => b.id === v.branchId)?.name || 'HQ & Depo Jakarta',
    region: regions[i % regions.length],
    departmentId: i % 2 === 0 ? 'dept-ops' : 'dept-dist',
    departmentName: i % 2 === 0 ? 'Operations & Logistics Dispatch' : 'Distribution & Retail Delivery',
    primaryDriverId: v.currentDriverId,
    primaryDriverName: mockDrivers.find((d) => d.id === v.currentDriverId)?.name || 'Sutrisno Hartono',
    backupDriverId: i === 0 ? 'drv-03' : undefined,
    backupDriverName: i === 0 ? 'Eko Prasetyo' : undefined,

    // GPS & Telemetry
    gpsDeviceId: v.gpsDeviceId || `dev-0${(i % 5) + 1}`,
    gpsImei: mockGpsDevices.find((g) => g.id === v.gpsDeviceId)?.imei || '864201049283011',
    gpsStatus: v.status === 'offline' ? 'offline' : 'online',
    latestTelemetry: v.latestTelemetry,

    // Operational Status
    status: v.status === 'moving' || v.status === 'idle' || v.status === 'parking' ? 'moving' : v.status,
    operationalStatus: v.status === 'moving' ? 'moving' : v.status === 'idle' ? 'idle' : 'stopped',

    // Metadata
    maintenanceOverdue: v.maintenanceOverdue,
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2026-08-14T10:30:00Z',
    healthScore: 88 - i * 3,
  };
});

// Additional Seed Vehicles for Enterprise Depth
vehiclesRepository.push(
  {
    id: 'veh-06',
    tenantId: 'tenant-tln-01',
    vehicleCode: 'VH-00125',
    name: 'Scania R450 Streamline Tanker',
    licensePlate: 'B 9876 SCB',
    type: 'truck_tanker',
    brand: 'Scania',
    model: 'R450 Tractor Head',
    variant: '6x2 Heavy Hauler Tanker',
    year: 2024,
    color: 'Merah - Flame Red',
    fuelType: 'biodiesel_b35',
    transmission: 'automatic',
    ownership: 'company_owned',
    lifecycleStatus: 'active',
    vin: 'SCN91823019283019',
    chassisNumber: 'CHS-SCN-2024-901',
    engineNumber: 'ENG-DC13-148',
    engineCapacityCc: 12700,
    fuelCapacityLiters: 400,
    capacity: {
      payloadKg: 35000,
      passengerCount: 2,
      cargoVolumeCbm: 32,
      maxWeightKg: 45000,
      formatted: '35.0 Ton (32.000 Liter Tanker)',
    },
    payloadKg: 35000,
    grossVehicleWeightKg: 45000,
    numberOfWheels: 10,
    tireSize: '315/80 R22.5',
    odometerKm: 112450,
    engineHours: 4200,
    stnkNumber: 'STNK-0912384-6',
    stnkExpiry: '2026-08-28', // Expiring Soon!
    bpkbNumber: 'BPKB-J821903-6',
    kirNumber: 'KIR-JABAR-92019-6',
    kirExpiry: '2026-08-25', // Expiring Soon!
    pajakExpiry: '2026-08-28',
    insuranceCompany: 'PT Asuransi Astra Buana',
    insurancePolicyNumber: 'POL-ASTRA-2026-901',
    insuranceExpiry: '2027-01-10',
    registrationStatus: 'expiring_soon',
    groupId: 'grp-3',
    groupName: 'Armada Tanker BBM & Cairan',
    branchId: 'br-ckr',
    branchName: 'Hub Logistik Cikarang Dry Port',
    region: 'Jawa Barat',
    departmentId: 'dept-ops',
    departmentName: 'Operations & Logistics Dispatch',
    primaryDriverId: 'drv-02',
    primaryDriverName: 'Ahmad Dahlan',
    gpsDeviceId: 'dev-04',
    gpsImei: '864201049283044',
    gpsStatus: 'online',
    status: 'idle',
    operationalStatus: 'idle',
    maintenanceOverdue: true,
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2026-08-14T11:00:00Z',
    healthScore: 74,
  },
  {
    id: 'veh-07',
    tenantId: 'tenant-tln-01',
    vehicleCode: 'VH-00126',
    name: 'Mitsubishi Fuso Canter FE 74 HD',
    licensePlate: 'D 8812 BNG',
    type: 'truck_box',
    brand: 'Mitsubishi Fuso',
    model: 'Canter FE 74 HD',
    variant: 'Light Truck Box 6-Roda',
    year: 2023,
    color: 'Kuning - Industrial Yellow',
    fuelType: 'biodiesel_b35',
    transmission: 'manual',
    ownership: 'rental',
    lifecycleStatus: 'rental',
    vin: 'MFT1TR30928108812',
    chassisNumber: 'CHS-FSO-2023-812',
    engineNumber: 'ENG-4D34-2AT2',
    engineCapacityCc: 3908,
    fuelCapacityLiters: 100,
    capacity: {
      payloadKg: 5000,
      passengerCount: 3,
      cargoVolumeCbm: 18,
      maxWeightKg: 7500,
      formatted: '5.0 Ton (18 CBM)',
    },
    payloadKg: 5000,
    grossVehicleWeightKg: 7500,
    numberOfWheels: 6,
    tireSize: '7.50-16 14PR',
    odometerKm: 64200,
    engineHours: 2100,
    stnkNumber: 'STNK-0912384-7',
    stnkExpiry: '2026-07-15', // Expired!
    bpkbNumber: 'BPKB-J821903-7',
    kirNumber: 'KIR-JABAR-92019-7',
    kirExpiry: '2026-07-20', // Expired!
    pajakExpiry: '2026-07-15',
    insuranceCompany: 'PT Asuransi MSIG Indonesia',
    insurancePolicyNumber: 'POL-MSIG-2026-812',
    insuranceExpiry: '2027-02-15',
    registrationStatus: 'expired',
    groupId: 'grp-1',
    groupName: 'Armada Jabodetabek & Express',
    branchId: 'br-jkt',
    branchName: 'HQ & Depo Jakarta (Tanjung Priok)',
    region: 'Jabodetabek & Banten',
    departmentId: 'dept-dist',
    departmentName: 'Distribution & Retail Delivery',
    primaryDriverId: 'drv-01',
    primaryDriverName: 'Sutrisno Hartono',
    gpsDeviceId: 'dev-05',
    gpsImei: '864201049283055',
    gpsStatus: 'offline',
    status: 'under_maintenance',
    operationalStatus: 'stopped',
    maintenanceOverdue: true,
    createdAt: '2025-03-12T08:00:00Z',
    updatedAt: '2026-08-14T11:15:00Z',
    healthScore: 62,
  }
);

// Initial Vehicle Groups Repository
let vehicleGroupsRepository: VehicleGroup[] = [
  { id: 'grp-1', tenantId: 'tenant-tln-01', name: 'Armada Jabodetabek & Express', code: 'GRP-JBD', description: 'Armada distribusi khusus wilayah Jakarta, Bogor, Depok, Tangerang, Bekasi', branchId: 'br-jkt', branchName: 'HQ & Depo Jakarta', managerName: 'Bambang Soeprapto', vehiclesCount: 18, status: 'active', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'grp-2', tenantId: 'tenant-tln-01', name: 'Armada Trans-Jawa Long Haul', code: 'GRP-TJW', description: 'Truk Tronton & Trailer khusus rute antar kota Jalur Pantura Trans-Jawa', branchId: 'br-ckr', branchName: 'Hub Logistik Cikarang', managerName: 'Rudi Hermawan', vehiclesCount: 24, status: 'active', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'grp-3', tenantId: 'tenant-tln-01', name: 'Armada Tanker BBM & Cairan', code: 'GRP-TNK', description: 'Kendaraan kargo tangki BBM Biodiesel B35 dan bahan kimia cair Industri', branchId: 'br-sby', branchName: 'Depo Surabaya', managerName: 'Agus Wijaya', vehiclesCount: 12, status: 'active', createdAt: '2025-02-15T00:00:00Z' },
  { id: 'grp-4', tenantId: 'tenant-tln-01', name: 'Armada Cold Chain Refrigerator', code: 'GRP-CCL', description: 'Truk box refrigasi suhu terkatub untuk produk bahan pangan & farmasi', branchId: 'br-jkt', branchName: 'HQ & Depo Jakarta', managerName: 'Bambang Soeprapto', vehiclesCount: 8, status: 'active', createdAt: '2025-03-20T00:00:00Z' },
];

// Initial Branches Repository
let branchesRepository: BranchExtended[] = mockBranches.map((b) => ({
  id: b.id,
  tenantId: b.tenantId || 'tenant-tln-01',
  name: b.name,
  code: b.code,
  address: 'Jl. Raya Tanjung Priok No. 102, Jakarta Utara',
  province: 'DKI Jakarta',
  city: b.city,
  district: 'Tanjung Priok',
  village: 'Kebon Bawang',
  postalCode: '14320',
  phone: '+62 21 4390 1234',
  email: `branch.${b.code.toLowerCase()}@translogistik.co.id`,
  managerName: b.managerName,
  region: b.city.includes('Jakarta') || b.city.includes('Bekasi') ? 'Jabodetabek & Banten' : b.city.includes('Surabaya') ? 'Jawa Timur' : 'Sulawesi & Indonesia Timur',
  status: 'active',
  vehiclesCount: b.vehiclesCount,
}));

// Initial Departments Repository
let departmentsRepository: Department[] = [
  { id: 'dept-ops', tenantId: 'tenant-tln-01', name: 'Operations & Logistics Dispatch', code: 'D-OPS', branchId: 'br-jkt', branchName: 'HQ & Depo Jakarta', managerName: 'Hendrikus Setiawan', vehiclesCount: 32, status: 'active', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'dept-dist', tenantId: 'tenant-tln-01', name: 'Distribution & Retail Delivery', code: 'D-DST', branchId: 'br-ckr', branchName: 'Hub Cikarang Dry Port', managerName: 'Rudi Hermawan', vehiclesCount: 20, status: 'active', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'dept-maint', tenantId: 'tenant-tln-01', name: 'Fleet Maintenance & Workshop', code: 'D-MNT', branchId: 'br-jkt', branchName: 'HQ & Depo Jakarta', managerName: 'Toni Suhendar', vehiclesCount: 0, status: 'active', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'dept-sales', tenantId: 'tenant-tln-01', name: 'Commercial & Sales Fleet', code: 'D-SLS', branchId: 'br-sby', branchName: 'Depo Surabaya', managerName: 'Agus Wijaya', vehiclesCount: 10, status: 'active', createdAt: '2025-02-10T00:00:00Z' },
];

// Initial Documents Mock Repository
let vehicleDocumentsRepository: Record<string, VehicleDocument[]> = {
  'veh-01': [
    { id: 'doc-1', vehicleId: 'veh-01', tenantId: 'tenant-tln-01', type: 'stnk', documentNumber: 'STNK-0912384-1', title: 'Surat Tanda Nomor Kendaraan (STNK)', issueDate: '2022-08-20', expiryDate: '2027-08-20', fileName: 'STNK_B9482UTX.pdf', fileSizeMb: 1.8, status: 'valid', issuingAuthority: 'Polda Metro Jaya (Samsat Jakarta Utara)', createdAt: '2022-08-20T00:00:00Z' },
    { id: 'doc-2', vehicleId: 'veh-01', tenantId: 'tenant-tln-01', type: 'kir', documentNumber: 'KIR-JABAR-92019-1', title: 'Buku Uji Berkala KIR Dishub', issueDate: '2026-06-10', expiryDate: '2026-12-10', fileName: 'KIR_B9482UTX.pdf', fileSizeMb: 2.1, status: 'valid', issuingAuthority: 'Dishub DKI Jakarta - Unit Uji PKB Cakung', createdAt: '2026-06-10T00:00:00Z' },
    { id: 'doc-3', vehicleId: 'veh-01', tenantId: 'tenant-tln-01', type: 'insurance', documentNumber: 'POL-SM-2026-501', title: 'Polis Asuransi All Risk Commercial Heavy Vehicle', issueDate: '2026-03-15', expiryDate: '2027-03-15', fileName: 'Asuransi_SinarMas_B9482UTX.pdf', fileSizeMb: 3.4, status: 'valid', issuingAuthority: 'PT Asuransi Sinar Mas', createdAt: '2026-03-15T00:00:00Z' },
    { id: 'doc-4', vehicleId: 'veh-01', tenantId: 'tenant-tln-01', type: 'bpkb', documentNumber: 'BPKB-J821903-1', title: 'Buku Pemilik Kendaraan Bermotor (BPKB)', issueDate: '2022-08-15', expiryDate: '2032-08-15', fileName: 'BPKB_B9482UTX.pdf', fileSizeMb: 4.2, status: 'valid', issuingAuthority: 'Korlantas Polri', createdAt: '2022-08-15T00:00:00Z' },
  ],
};

// Initial Trips Repository per Vehicle
let vehicleTripsRepository: Record<string, VehicleTripRecord[]> = {
  'veh-01': [
    {
      id: 'trp-101',
      tripNumber: 'TRP-20260814-001',
      vehicleId: 'veh-01',
      driverId: 'drv-01',
      driverName: 'Sutrisno Hartono',
      originName: 'Depo Tanjung Priok, Jakarta Utara',
      destinationName: 'Distribution Center Cikarang Dry Port, Bekasi',
      originLat: -6.1132,
      originLng: 106.8834,
      destLat: -6.2861,
      destLng: 107.1512,
      departureTime: '2026-08-14T06:30:00Z',
      distanceKm: 58.4,
      durationMinutes: 75,
      avgSpeedKm: 46.7,
      maxSpeedKm: 78.5,
      fuelConsumedLiters: 15.2,
      fuelEfficiencyKmPerLiter: 3.84,
      cargoDescription: 'Komponen Otomotif & Spare Parts Box',
      cargoWeightKg: 9500,
      status: 'in_progress',
      waypoints: [
        { lat: -6.1132, lng: 106.8834, name: 'Depo Tanjung Priok (Start)' },
        { lat: -6.1550, lng: 106.8920, name: 'Gerbang Tol Kebon Bawang' },
        { lat: -6.2250, lng: 106.9800, name: 'Tol Jakarta-Cikampek KM 19' },
        { lat: -6.2861, lng: 107.1512, name: 'DC Cikarang Dry Port (Tujuan)' },
      ],
    },
    {
      id: 'trp-100',
      tripNumber: 'TRP-20260813-092',
      vehicleId: 'veh-01',
      driverId: 'drv-01',
      driverName: 'Sutrisno Hartono',
      originName: 'Plant Unilever Rungkut, Surabaya',
      destinationName: 'Hub Trans Logistik Jakarta',
      originLat: -7.3190,
      originLng: 112.7680,
      destLat: -6.1132,
      destLng: 106.8834,
      departureTime: '2026-08-12T19:00:00Z',
      arrivalTime: '2026-08-13T09:30:00Z',
      distanceKm: 782.0,
      durationMinutes: 870,
      avgSpeedKm: 53.9,
      maxSpeedKm: 85.0,
      fuelConsumedLiters: 205.8,
      fuelEfficiencyKmPerLiter: 3.80,
      cargoDescription: 'Fast Moving Consumer Goods (FMCG Palletized)',
      cargoWeightKg: 11800,
      status: 'completed',
    },
    {
      id: 'trp-099',
      tripNumber: 'TRP-20260811-045',
      vehicleId: 'veh-01',
      driverId: 'drv-01',
      driverName: 'Sutrisno Hartono',
      originName: 'Hub Trans Logistik Jakarta',
      destinationName: 'Kawasan Industri Wijayakusuma, Semarang',
      originLat: -6.1132,
      originLng: 106.8834,
      destLat: -6.9720,
      destLng: 110.3540,
      departureTime: '2026-08-11T05:00:00Z',
      arrivalTime: '2026-08-11T13:45:00Z',
      distanceKm: 442.0,
      durationMinutes: 525,
      avgSpeedKm: 50.5,
      maxSpeedKm: 82.0,
      fuelConsumedLiters: 115.0,
      fuelEfficiencyKmPerLiter: 3.84,
      cargoDescription: 'Material Konstruksi Ringan',
      cargoWeightKg: 10200,
      status: 'completed',
    },
  ],
};

// Initial Fuel Logs Repository per Vehicle
let vehicleFuelLogsRepository: Record<string, VehicleFuelRecord[]> = {
  'veh-01': [
    {
      id: 'fuel-101',
      vehicleId: 'veh-01',
      tenantId: 'tenant-tln-01',
      driverId: 'drv-01',
      driverName: 'Sutrisno Hartono',
      date: '2026-08-13',
      odometerKm: 84250,
      litersAdded: 160,
      fuelType: 'biodiesel_b35',
      costPerLiterIdr: 15200,
      totalCostIdr: 2432000,
      gasStationName: 'SPBU Pertamina Pasti Pas 34-17502 Tol Japek KM 19A',
      locationAddress: 'Rest Area KM 19A Tol Jakarta - Cikampek',
      fullTank: true,
      efficiencyKmPerLiter: 3.84,
      receiptNumber: 'SPBU-JKT-992019',
      notes: 'Pengisian full tank sebelum dinas Jakarta - Surabaya.',
      isAnomaly: false,
    },
    {
      id: 'fuel-100',
      vehicleId: 'veh-01',
      tenantId: 'tenant-tln-01',
      driverId: 'drv-01',
      driverName: 'Sutrisno Hartono',
      date: '2026-08-10',
      odometerKm: 83635,
      litersAdded: 145,
      fuelType: 'biodiesel_b35',
      costPerLiterIdr: 15200,
      totalCostIdr: 2204000,
      gasStationName: 'SPBU Pertamina 44-50116 Trans Jawa KM 379A Batang',
      locationAddress: 'Rest Area Tol Batang - Semarang KM 379A',
      fullTank: true,
      efficiencyKmPerLiter: 3.82,
      receiptNumber: 'SPBU-BTG-881923',
      notes: 'Pengisian rutin rute Jawa Tengah.',
      isAnomaly: false,
    },
    {
      id: 'fuel-099',
      vehicleId: 'veh-01',
      tenantId: 'tenant-tln-01',
      driverId: 'drv-01',
      driverName: 'Sutrisno Hartono',
      date: '2026-08-05',
      odometerKm: 83080,
      litersAdded: 150,
      fuelType: 'biodiesel_b35',
      costPerLiterIdr: 15200,
      totalCostIdr: 2280000,
      gasStationName: 'SPBU Shell Commercial Tanjung Priok',
      locationAddress: 'Jl. Yos Sudarso No. 45, Jakarta Utara',
      fullTank: true,
      efficiencyKmPerLiter: 3.79,
      receiptNumber: 'SHL-PRIOK-10293',
      notes: 'Pengisian awal bulan armada Jakarta.',
      isAnomaly: false,
    },
  ],
};

// Initial Maintenance Records Repository per Vehicle
let vehicleMaintenanceRepository: Record<string, VehicleMaintenanceRecord[]> = {
  'veh-01': [
    {
      id: 'maint-101',
      workOrderNumber: 'WO-202608-019',
      vehicleId: 'veh-01',
      serviceType: 'routine_service',
      title: 'Servis Berkala 85.000 KM (Ganti Oli Mesin & Filter Bahan Bakar)',
      status: 'scheduled',
      priority: 'medium',
      serviceDate: '2026-08-25',
      serviceOdometerKm: 85000,
      nextServiceOdometerKm: 95000,
      nextServiceDate: '2026-11-25',
      workshopName: 'Hino Authorized Dealer Workshop Cikarang',
      technicianName: 'Budi Santoso & Tim Bengkel',
      totalCostIdr: 3250000,
      partsReplaced: [
        { partName: 'Oli Mesin Hino Genuine Oil 15W-40 (24 Liter)', partNumber: 'HGO-15W40-24L', quantity: 1, costIdr: 1850000 },
        { partName: 'Filter Oli Mesin', partNumber: '15607-2190', quantity: 1, costIdr: 450000 },
        { partName: 'Fuel Filter Element Primary & Secondary', partNumber: '23304-EV010', quantity: 1, costIdr: 550000 },
      ],
      notes: 'Jadwal servis preventif rutin. Cek ketebalan kampas rem depan-belakang dan tegangan aki.',
    },
    {
      id: 'maint-100',
      workOrderNumber: 'WO-202605-112',
      vehicleId: 'veh-01',
      serviceType: 'brake_overhaul',
      title: 'Penggantian Kampas Rem Tromol Roda Belakang & Kuras Minyak Rem',
      status: 'completed',
      priority: 'high',
      serviceDate: '2026-05-18',
      completedDate: '2026-05-19',
      serviceOdometerKm: 75200,
      nextServiceOdometerKm: 85000,
      workshopName: 'Hino Authorized Dealer Workshop Sunter Jakarta',
      technicianName: 'Agus Riyadi',
      totalCostIdr: 4680000,
      partsReplaced: [
        { partName: 'Brake Shoe Lining Kit Roda Belakang', partNumber: '04495-37020', quantity: 2, costIdr: 3200000 },
        { partName: 'Minyak Rem DOT 4 HD (4 Liter)', partNumber: 'BRK-DOT4-4L', quantity: 1, costIdr: 680000 },
      ],
      notes: 'Pekerjaan rem belakang selesai diuji pada roller brake tester dishub dengan efisiensi pengereman 72% (Standar Lulus).',
    },
    {
      id: 'maint-099',
      workOrderNumber: 'WO-202602-088',
      vehicleId: 'veh-01',
      serviceType: 'tire_replacement',
      title: 'Rotasi Ban & Penggantian 2 Unit Ban Luar Depan (Bridgestone R150)',
      status: 'completed',
      priority: 'medium',
      serviceDate: '2026-02-10',
      completedDate: '2026-02-10',
      serviceOdometerKm: 65400,
      nextServiceOdometerKm: 75000,
      workshopName: 'Bengkel Ban & Spooring PT Cipta Roda Prima',
      technicianName: 'Slamet M.',
      totalCostIdr: 7800000,
      partsReplaced: [
        { partName: 'Ban Truk Bridgestone R150 10.00-20 16PR', partNumber: 'BS-R150-100020', quantity: 2, costIdr: 7200000 },
        { partName: 'Jasa Spooring Computer & Balancing 6 Roda', partNumber: 'SRV-SP-BAL', quantity: 1, costIdr: 600000 },
      ],
      notes: 'Kedua ban depan baru dipasang. Spooring alignment kembali ke toleransi standar pabrik.',
    },
  ],
};

// Initial Vehicle Alerts Repository
let vehicleAlertsRepository: Record<string, VehicleAlertRecord[]> = {
  'veh-01': [
    {
      id: 'alt-101',
      vehicleId: 'veh-01',
      vehiclePlate: 'B 9482 UTX',
      driverName: 'Sutrisno Hartono',
      timestamp: '2026-08-14T07:15:22Z',
      alertType: 'overspeed',
      severity: 'warning',
      title: 'Kecepatan Melebihi Batas (Overspeeding 84 KM/H)',
      description: 'Kendaraan melaju 84 km/jam di zona batas maksimal 70 km/jam pada ruas Tol Dalam Kota.',
      speedAtEvent: 84,
      locationAddress: 'Tol Dalam Kota KM 14+200, Jakarta Timur',
      lat: -6.2297,
      lng: 106.8725,
      isResolved: false,
    },
    {
      id: 'alt-100',
      vehicleId: 'veh-01',
      vehiclePlate: 'B 9482 UTX',
      driverName: 'Sutrisno Hartono',
      timestamp: '2026-08-12T23:45:10Z',
      alertType: 'idle_excess',
      severity: 'info',
      title: 'Engine Idle Lebih dari 25 Menit',
      description: 'Mesin kendaraan menyala diam tanpa pergerakan selama 28 menit di Rest Area Tol Batang.',
      speedAtEvent: 0,
      locationAddress: 'Rest Area Tol Trans-Jawa KM 379A, Batang',
      lat: -6.9580,
      lng: 109.8420,
      isResolved: true,
      resolvedAt: '2026-08-13T01:00:00Z',
      resolvedBy: 'Auto System',
      resolutionNote: 'Driver beristirahat di rest area dengan AC menyala.',
    },
    {
      id: 'alt-099',
      vehicleId: 'veh-01',
      vehiclePlate: 'B 9482 UTX',
      driverName: 'Sutrisno Hartono',
      timestamp: '2026-08-08T14:12:00Z',
      alertType: 'harsh_braking',
      severity: 'warning',
      title: 'Pengereman Mendadak (Harsh Braking -0.48g)',
      description: 'Deselerasi kuat terdeteksi oleh akselerometer sensor IoT.',
      speedAtEvent: 62,
      locationAddress: 'Jalan Raya Pantura Cirebon, Jawa Barat',
      lat: -6.7320,
      lng: 108.5520,
      isResolved: true,
      resolvedAt: '2026-08-08T15:30:00Z',
      resolvedBy: 'Fleet Safety Officer',
      resolutionNote: 'Kendaraan menghindari pengendara motor memotong jalur mendadak.',
    },
  ],
};

// Activity Log Repository
let vehicleActivityLogsRepository: Record<string, VehicleActivityLog[]> = {
  'veh-01': [
    { id: 'act-1', vehicleId: 'veh-01', tenantId: 'tenant-tln-01', timestamp: '2026-08-14T07:00:00Z', eventType: 'fuel_logged', title: 'Pencatatan Refill BBM', description: 'Pengisian Biodiesel B35 sebesar 160 Liter dicatat oleh driver.', performedBy: 'Sutrisno Hartono' },
    { id: 'act-2', vehicleId: 'veh-01', tenantId: 'tenant-tln-01', timestamp: '2026-08-10T14:30:00Z', eventType: 'driver_assigned', title: 'Penugasan Pengemudi Utama', description: 'Pengemudi Sutrisno Hartono ditugaskan ke unit Hino Ranger B 9482 UTX.', performedBy: 'Hendrikus Setiawan (Fleet Mgr)' },
    { id: 'act-3', vehicleId: 'veh-01', tenantId: 'tenant-tln-01', timestamp: '2026-08-01T09:15:00Z', eventType: 'branch_assigned', title: 'Mutasi Cabang Operasional', description: 'Lokasi cabang diperbarui ke HQ & Depo Jakarta (Tanjung Priok).', performedBy: 'System Admin' },
    { id: 'act-4', vehicleId: 'veh-01', tenantId: 'tenant-tln-01', timestamp: '2026-07-20T11:00:00Z', eventType: 'gps_assigned', title: 'Pemasangan Sensor GPS Teltonika', description: 'GPS Device dev-01 (IMEI: 864201049283011) di-binding ke kendaraan.', performedBy: 'Teknisi Workshop' },
  ],
};

export const vehicleService = {
  /**
   * List vehicles with searching, filtering, pagination, region, lifecycle & tenant isolation
   */
  async listVehicles(params: VehicleFilterParams = {}): Promise<VehicleListResponse> {
    await new Promise((res) => setTimeout(res, 80));

    const {
      tenantId = 'tenant-tln-01',
      branchId = 'all',
      departmentId = 'all',
      groupId = 'all',
      region = 'all',
      lifecycleStatus = 'all',
      status = 'all',
      operationalStatus = 'all',
      gpsStatus = 'all',
      type = 'all',
      fuelType = 'all',
      ownership = 'all',
      search = '',
      page = 1,
      pageSize = 25,
      sortBy = 'name',
      sortOrder = 'asc',
      isArchived = false,
    } = params;

    let filtered = vehiclesRepository.filter((v) => {
      // Tenant Isolation Check
      if (tenantId && v.tenantId !== tenantId) return false;

      // Archive Status Filter
      if (isArchived ? !v.archivedAt : v.archivedAt) return false;

      // Branch Scope Filter
      if (branchId !== 'all' && v.branchId !== branchId) return false;

      // Department Filter
      if (departmentId !== 'all' && v.departmentId !== departmentId) return false;

      // Group Filter
      if (groupId !== 'all' && v.groupId !== groupId) return false;

      // Region Filter
      if (region !== 'all' && v.region !== region) return false;

      // Lifecycle Filter
      if (lifecycleStatus !== 'all' && v.lifecycleStatus !== lifecycleStatus) return false;

      // Status Filter
      if (status !== 'all' && v.status.toLowerCase() !== status.toLowerCase()) return false;

      // Operational Status Filter
      if (operationalStatus !== 'all' && v.operationalStatus !== operationalStatus) return false;

      // GPS Status Filter
      if (gpsStatus !== 'all' && v.gpsStatus !== gpsStatus) return false;

      // Vehicle Type Filter
      if (type !== 'all' && v.type !== type) return false;

      // Fuel Type Filter
      if (fuelType !== 'all' && v.fuelType !== fuelType) return false;

      // Ownership Filter
      if (ownership !== 'all' && v.ownership !== ownership) return false;

      // Multi-Field Search Query Match
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesPlate = v.licensePlate.toLowerCase().includes(q);
        const matchesName = v.name.toLowerCase().includes(q);
        const matchesCode = v.vehicleCode.toLowerCase().includes(q);
        const matchesVin = v.vin.toLowerCase().includes(q);
        const matchesChassis = v.chassisNumber.toLowerCase().includes(q);
        const matchesEngine = v.engineNumber.toLowerCase().includes(q);
        const matchesGps = v.gpsDeviceId.toLowerCase().includes(q) || (v.gpsImei && v.gpsImei.includes(q));
        const matchesDriver = v.primaryDriverName ? v.primaryDriverName.toLowerCase().includes(q) : false;
        const matchesGroup = v.groupName ? v.groupName.toLowerCase().includes(q) : false;
        const matchesBranch = v.branchName ? v.branchName.toLowerCase().includes(q) : false;
        const matchesRegion = v.region ? v.region.toLowerCase().includes(q) : false;

        return (
          matchesPlate ||
          matchesName ||
          matchesCode ||
          matchesVin ||
          matchesChassis ||
          matchesEngine ||
          matchesGps ||
          matchesDriver ||
          matchesGroup ||
          matchesBranch ||
          matchesRegion
        );
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let valA: any = a[sortBy as keyof VehicleExtended] || '';
      let valB: any = b[sortBy as keyof VehicleExtended] || '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination Calculation
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedVehicles = filtered.slice(startIndex, startIndex + pageSize);

    return {
      vehicles: paginatedVehicles,
      total,
      page,
      pageSize,
      totalPages,
    };
  },

  /**
   * Get single vehicle profile by ID
   */
  async getVehicleById(id: string): Promise<VehicleExtended | null> {
    await new Promise((res) => setTimeout(res, 40));
    const vehicle = vehiclesRepository.find((v) => v.id === id);
    return vehicle || null;
  },

  /**
   * Create vehicle with duplicate license plate check per tenant scope
   */
  async createVehicle(data: Partial<VehicleExtended> & { name: string; licensePlate: string; type: any }): Promise<VehicleExtended> {
    await new Promise((res) => setTimeout(res, 120));

    const tenantId = data.tenantId || 'tenant-tln-01';
    const normalizedPlate = data.licensePlate.trim().toUpperCase();

    // License Plate Duplicate Check per Tenant Scope
    const existing = vehiclesRepository.find(
      (v) => v.tenantId === tenantId && v.licensePlate.toUpperCase() === normalizedPlate && !v.archivedAt
    );

    if (existing) {
      throw new Error(`Plat nomor "${normalizedPlate}" sudah terdaftar pada tenant ini. Silakan periksa kembali.`);
    }

    const newId = `veh-${Date.now().toString().slice(-4)}`;
    const newCode = `VH-00${vehiclesRepository.length + 120}`;

    const newVehicle: VehicleExtended = {
      id: newId,
      tenantId,
      vehicleCode: data.vehicleCode || newCode,
      name: data.name,
      licensePlate: normalizedPlate,
      type: data.type,
      brand: data.brand || 'Isuzu',
      model: data.model || 'Giga Series',
      variant: data.variant || 'Standard Truck Box',
      year: data.year || 2024,
      color: data.color || 'Putih - Diamond White',
      fuelType: data.fuelType || 'biodiesel_b35',
      transmission: data.transmission || 'manual',
      ownership: data.ownership || 'company_owned',
      lifecycleStatus: data.lifecycleStatus || 'active',

      vin: data.vin || `MHF1TR${Date.now()}`,
      chassisNumber: data.chassisNumber || `CHS-ISZ-${Date.now().toString().slice(-5)}`,
      engineNumber: data.engineNumber || `ENG-4HK1-${Date.now().toString().slice(-5)}`,
      engineCapacityCc: data.engineCapacityCc || 5193,
      fuelCapacityLiters: data.fuelCapacityLiters || 200,
      capacity: data.capacity || {
        payloadKg: data.payloadKg || 8000,
        passengerCount: 3,
        cargoVolumeCbm: 24,
        maxWeightKg: 14000,
        formatted: `${((data.payloadKg || 8000) / 1000).toFixed(1)} Ton (24 CBM)`,
      },
      payloadKg: data.payloadKg || 8000,
      grossVehicleWeightKg: data.grossVehicleWeightKg || 14000,
      numberOfWheels: data.numberOfWheels || 6,
      tireSize: data.tireSize || '8.25-16 14PR',
      odometerKm: data.odometerKm || 0,
      engineHours: data.engineHours || 0,

      stnkNumber: data.stnkNumber || '',
      stnkExpiry: data.stnkExpiry || '2027-12-31',
      bpkbNumber: data.bpkbNumber || '',
      kirNumber: data.kirNumber || '',
      kirExpiry: data.kirExpiry || '2027-06-30',
      pajakExpiry: data.pajakExpiry || '2027-12-31',
      insuranceCompany: data.insuranceCompany || 'PT Asuransi Sinar Mas',
      insurancePolicyNumber: data.insurancePolicyNumber || '',
      insuranceExpiry: data.insuranceExpiry || '2027-12-31',
      registrationStatus: 'valid',

      groupId: data.groupId || 'grp-1',
      groupName: vehicleGroupsRepository.find((g) => g.id === data.groupId)?.name || 'Armada Jabodetabek & Express',
      branchId: data.branchId || 'br-jkt',
      branchName: branchesRepository.find((b) => b.id === data.branchId)?.name || 'HQ & Depo Jakarta',
      region: data.region || 'Jabodetabek & Banten',
      departmentId: data.departmentId || 'dept-ops',
      departmentName: departmentsRepository.find((d) => d.id === data.departmentId)?.name || 'Operations & Logistics Dispatch',

      primaryDriverId: data.primaryDriverId,
      primaryDriverName: mockDrivers.find((d) => d.id === data.primaryDriverId)?.name,
      backupDriverId: data.backupDriverId,
      backupDriverName: mockDrivers.find((d) => d.id === data.backupDriverId)?.name,

      gpsDeviceId: data.gpsDeviceId || 'dev-01',
      gpsImei: mockGpsDevices.find((g) => g.id === data.gpsDeviceId)?.imei || '864201049283011',
      gpsStatus: 'online',

      status: data.status || 'moving',
      operationalStatus: 'stopped',

      maintenanceOverdue: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      healthScore: 95,
    };

    vehiclesRepository.unshift(newVehicle);

    // Add activity log
    this.addActivityLog(newId, {
      eventType: 'created',
      title: 'Kendaraan Baru Didaftarkan',
      description: `Unit ${newVehicle.name} (${newVehicle.licensePlate}) berhasil ditambahkan ke master data armada.`,
      performedBy: 'User Administrator',
    });

    return newVehicle;
  },

  /**
   * Update existing vehicle
   */
  async updateVehicle(id: string, updates: Partial<VehicleExtended>): Promise<VehicleExtended> {
    await new Promise((res) => setTimeout(res, 100));

    const index = vehiclesRepository.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new Error(`Kendaraan ID ${id} tidak ditemukan.`);
    }

    const current = vehiclesRepository[index];

    // Duplicate plate check if plate is updated
    if (updates.licensePlate && updates.licensePlate.toUpperCase() !== current.licensePlate.toUpperCase()) {
      const normalizedPlate = updates.licensePlate.trim().toUpperCase();
      const existing = vehiclesRepository.find(
        (v) => v.tenantId === current.tenantId && v.licensePlate.toUpperCase() === normalizedPlate && v.id !== id && !v.archivedAt
      );

      if (existing) {
        throw new Error(`Plat nomor "${normalizedPlate}" sudah digunakan oleh kendaraan lain.`);
      }
      updates.licensePlate = normalizedPlate;
    }

    const updatedVehicle: VehicleExtended = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    vehiclesRepository[index] = updatedVehicle;

    this.addActivityLog(id, {
      eventType: 'updated',
      title: 'Profil Kendaraan Diperbarui',
      description: 'Data spesifikasi teknis / pendaftaran / assignment telah diperbarui.',
      performedBy: 'User Administrator',
    });

    return updatedVehicle;
  },

  /**
   * Update Vehicle Lifecycle Status
   */
  async updateVehicleLifecycle(id: string, newLifecycle: VehicleLifecycleStatus, reason?: string): Promise<VehicleExtended> {
    const vehicle = await this.updateVehicle(id, { lifecycleStatus: newLifecycle });

    this.addActivityLog(id, {
      eventType: 'lifecycle_changed',
      title: `Status Lifecycle Berubah: ${newLifecycle.toUpperCase()}`,
      description: `Status operasional unit diubah menjadi ${newLifecycle}. ${reason ? `Alasan: ${reason}` : ''}`,
      performedBy: 'Fleet Operations Manager',
    });

    return vehicle;
  },

  /**
   * Archive vehicle (Soft Delete)
   */
  async archiveVehicle(id: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 80));
    const index = vehiclesRepository.findIndex((v) => v.id === id);
    if (index !== -1) {
      vehiclesRepository[index].archivedAt = new Date().toISOString();
      vehiclesRepository[index].status = 'archived';

      this.addActivityLog(id, {
        eventType: 'archived',
        title: 'Kendaraan Diarsipkan (Soft Delete)',
        description: 'Unit kendaraan diarsipkan. Riwayat GPS dan historical trip tetap tersimpan aman.',
        performedBy: 'User Administrator',
      });
      return true;
    }
    return false;
  },

  /**
   * Restore archived vehicle
   */
  async restoreVehicle(id: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 80));
    const index = vehiclesRepository.findIndex((v) => v.id === id);
    if (index !== -1) {
      vehiclesRepository[index].archivedAt = undefined;
      vehiclesRepository[index].status = 'moving';
      return true;
    }
    return false;
  },

  /**
   * Driver Assignment
   */
  async assignDriver(vehicleId: string, driverId: string, driverName?: string): Promise<VehicleExtended> {
    const drv = mockDrivers.find((d) => d.id === driverId);
    const name = driverName || drv?.name || 'Driver Assigned';

    const vehicle = await this.updateVehicle(vehicleId, {
      primaryDriverId: driverId,
      primaryDriverName: name,
    });

    this.addActivityLog(vehicleId, {
      eventType: 'driver_assigned',
      title: 'Penugasan Pengemudi Utama',
      description: `Pengemudi ${name} resmi ditugaskan membawa unit ${vehicle.licensePlate}.`,
      performedBy: 'Fleet Operations Manager',
    });

    return vehicle;
  },

  /**
   * Backup Driver Assignment
   */
  async assignBackupDriver(vehicleId: string, driverId: string, driverName?: string): Promise<VehicleExtended> {
    const drv = mockDrivers.find((d) => d.id === driverId);
    const name = driverName || drv?.name || 'Backup Driver';

    const vehicle = await this.updateVehicle(vehicleId, {
      backupDriverId: driverId,
      backupDriverName: name,
    });

    this.addActivityLog(vehicleId, {
      eventType: 'backup_driver_assigned',
      title: 'Penugasan Driver Cadangan (Backup)',
      description: `Pengemudi cadangan ${name} ditugaskan untuk unit ${vehicle.licensePlate}.`,
      performedBy: 'Fleet Operations Manager',
    });

    return vehicle;
  },

  /**
   * GPS Device Assignment
   */
  async assignGpsDevice(vehicleId: string, gpsDeviceId: string): Promise<VehicleExtended> {
    const dev = mockGpsDevices.find((g) => g.id === gpsDeviceId);

    const vehicle = await this.updateVehicle(vehicleId, {
      gpsDeviceId,
      gpsImei: dev?.imei || '864201049283099',
      gpsStatus: 'online',
    });

    this.addActivityLog(vehicleId, {
      eventType: 'gps_assigned',
      title: 'Binding Perangkat GPS Telematika',
      description: `GPS ID ${gpsDeviceId} (${dev?.model || 'Device'}) berhasil terhubung ke kendaraan.`,
      performedBy: 'IoT Support Engineer',
    });

    return vehicle;
  },

  /**
   * Trips Data Provider
   */
  async getVehicleTrips(vehicleId: string): Promise<VehicleTripRecord[]> {
    await new Promise((res) => setTimeout(res, 50));
    return vehicleTripsRepository[vehicleId] || [
      {
        id: `trp-gen-${vehicleId}`,
        tripNumber: `TRP-20260814-01`,
        vehicleId,
        driverId: 'drv-01',
        driverName: 'Sutrisno Hartono',
        originName: 'Depo Utama Tanjung Priok',
        destinationName: 'Distribution Hub Jawa Barat',
        originLat: -6.1132,
        originLng: 106.8834,
        destLat: -6.2861,
        destLng: 107.1512,
        departureTime: '2026-08-14T07:30:00Z',
        distanceKm: 64.2,
        durationMinutes: 80,
        avgSpeedKm: 48.0,
        maxSpeedKm: 76.0,
        fuelConsumedLiters: 16.5,
        fuelEfficiencyKmPerLiter: 3.89,
        cargoDescription: 'Kargo Distribusi Reguler',
        cargoWeightKg: 8500,
        status: 'in_progress',
      }
    ];
  },

  /**
   * Fuel Records Data Provider
   */
  async getVehicleFuelRecords(vehicleId: string): Promise<VehicleFuelRecord[]> {
    await new Promise((res) => setTimeout(res, 50));
    return vehicleFuelLogsRepository[vehicleId] || [
      {
        id: `fuel-gen-${vehicleId}`,
        vehicleId,
        tenantId: 'tenant-tln-01',
        driverName: 'Sutrisno Hartono',
        date: '2026-08-12',
        odometerKm: 78500,
        litersAdded: 150,
        fuelType: 'biodiesel_b35',
        costPerLiterIdr: 15200,
        totalCostIdr: 2280000,
        gasStationName: 'SPBU Pertamina Pasti Pas KM 19 Tol Jakarta-Cikampek',
        locationAddress: 'Rest Area KM 19 Tol Japek',
        fullTank: true,
        efficiencyKmPerLiter: 3.85,
        receiptNumber: 'SPBU-9021-X',
        isAnomaly: false,
      }
    ];
  },

  async addVehicleFuelRecord(vehicleId: string, record: Omit<VehicleFuelRecord, 'id' | 'tenantId'>): Promise<VehicleFuelRecord> {
    await new Promise((res) => setTimeout(res, 80));
    const newRecord: VehicleFuelRecord = {
      ...record,
      id: `fuel-${Date.now()}`,
      tenantId: 'tenant-tln-01',
    };

    if (!vehicleFuelLogsRepository[vehicleId]) {
      vehicleFuelLogsRepository[vehicleId] = [];
    }
    vehicleFuelLogsRepository[vehicleId].unshift(newRecord);

    this.addActivityLog(vehicleId, {
      eventType: 'fuel_logged',
      title: 'Pencatatan Refill BBM',
      description: `Pengisian BBM ${record.litersAdded} Liter di ${record.gasStationName} berhasil dicatat.`,
      performedBy: record.driverName || 'Driver / Operator',
    });

    return newRecord;
  },

  /**
   * Maintenance Records Data Provider
   */
  async getVehicleMaintenanceRecords(vehicleId: string): Promise<VehicleMaintenanceRecord[]> {
    await new Promise((res) => setTimeout(res, 50));
    return vehicleMaintenanceRepository[vehicleId] || [
      {
        id: `maint-gen-${vehicleId}`,
        workOrderNumber: 'WO-202608-055',
        vehicleId,
        serviceType: 'routine_service',
        title: 'Servis Berkala Preventif Mesin & Oli',
        status: 'scheduled',
        priority: 'medium',
        serviceDate: '2026-08-28',
        serviceOdometerKm: 80000,
        nextServiceOdometerKm: 90000,
        workshopName: 'Hino Authorized Dealer Workshop',
        technicianName: 'Tim Teknisi Workshop',
        totalCostIdr: 2850000,
        notes: 'Servis rutin berkala preventif.',
      }
    ];
  },

  async addVehicleMaintenanceRecord(vehicleId: string, record: Omit<VehicleMaintenanceRecord, 'id' | 'workOrderNumber'>): Promise<VehicleMaintenanceRecord> {
    await new Promise((res) => setTimeout(res, 80));
    const newRecord: VehicleMaintenanceRecord = {
      ...record,
      id: `maint-${Date.now()}`,
      workOrderNumber: `WO-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`,
    };

    if (!vehicleMaintenanceRepository[vehicleId]) {
      vehicleMaintenanceRepository[vehicleId] = [];
    }
    vehicleMaintenanceRepository[vehicleId].unshift(newRecord);

    this.addActivityLog(vehicleId, {
      eventType: 'maintenance_created',
      title: 'Work Order Servis Dibuat',
      description: `Work order ${newRecord.workOrderNumber} (${newRecord.title}) dijadwalkan pada ${newRecord.serviceDate}.`,
      performedBy: 'Fleet Maintenance Engineer',
    });

    return newRecord;
  },

  /**
   * Alerts Data Provider
   */
  async getVehicleAlerts(vehicleId: string): Promise<VehicleAlertRecord[]> {
    await new Promise((res) => setTimeout(res, 50));
    return vehicleAlertsRepository[vehicleId] || [
      {
        id: `alt-gen-${vehicleId}`,
        vehicleId,
        vehiclePlate: vehiclesRepository.find((v) => v.id === vehicleId)?.licensePlate || 'B 1234 ABC',
        driverName: 'Sutrisno Hartono',
        timestamp: new Date().toISOString(),
        alertType: 'overspeed',
        severity: 'warning',
        title: 'Peringatan Kecepatan Melampaui Batas (78 KM/H)',
        description: 'Kecepatan melebihi ambang batas toleransi 70 km/h.',
        speedAtEvent: 78,
        locationAddress: 'Tol Jakarta - Cikampek KM 18',
        lat: -6.2297,
        lng: 106.9275,
        isResolved: false,
      }
    ];
  },

  async resolveVehicleAlert(alertId: string, vehicleId: string, note?: string): Promise<boolean> {
    const list = vehicleAlertsRepository[vehicleId];
    if (list) {
      const alert = list.find((a) => a.id === alertId);
      if (alert) {
        alert.isResolved = true;
        alert.resolvedAt = new Date().toISOString();
        alert.resolvedBy = 'Fleet Safety Officer';
        alert.resolutionNote = note || 'Insiden telah diverifikasi dan diselesaikan.';
        return true;
      }
    }
    return false;
  },

  /**
   * Vehicle Documents Management
   */
  async getVehicleDocuments(vehicleId: string): Promise<VehicleDocument[]> {
    await new Promise((res) => setTimeout(res, 40));
    return vehicleDocumentsRepository[vehicleId] || [
      {
        id: `doc-def-1`,
        vehicleId,
        tenantId: 'tenant-tln-01',
        type: 'stnk',
        documentNumber: 'STNK-0912384-AUTO',
        title: 'Surat Tanda Nomor Kendaraan (STNK)',
        issueDate: '2023-01-10',
        expiryDate: '2028-01-10',
        status: 'valid',
        issuingAuthority: 'Polda Metro Jaya',
        createdAt: '2023-01-10T00:00:00Z',
      },
      {
        id: `doc-def-2`,
        vehicleId,
        tenantId: 'tenant-tln-01',
        type: 'kir',
        documentNumber: 'KIR-DISHUB-2026',
        title: 'Buku Uji Berkala KIR Dishub',
        issueDate: '2026-06-01',
        expiryDate: '2026-12-01',
        status: 'valid',
        issuingAuthority: 'Dishub DKI Jakarta',
        createdAt: '2026-06-01T00:00:00Z',
      },
      {
        id: `doc-def-3`,
        vehicleId,
        tenantId: 'tenant-tln-01',
        type: 'insurance',
        documentNumber: 'POL-SINARMAS-2026',
        title: 'Polis Asuransi All Risk Commercial',
        issueDate: '2026-01-15',
        expiryDate: '2027-01-15',
        status: 'valid',
        issuingAuthority: 'PT Asuransi Sinar Mas',
        createdAt: '2026-01-15T00:00:00Z',
      }
    ];
  },

  async addVehicleDocument(vehicleId: string, doc: Omit<VehicleDocument, 'id' | 'createdAt'>): Promise<VehicleDocument> {
    await new Promise((res) => setTimeout(res, 80));

    const newDoc: VehicleDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (!vehicleDocumentsRepository[vehicleId]) {
      vehicleDocumentsRepository[vehicleId] = [];
    }

    vehicleDocumentsRepository[vehicleId].unshift(newDoc);

    this.addActivityLog(vehicleId, {
      eventType: 'document_added',
      title: `Dokumen ${newDoc.type.toUpperCase()} Ditambahkan`,
      description: `Dokumen ${newDoc.title} (${newDoc.documentNumber}) berlaku hingga ${newDoc.expiryDate}.`,
      performedBy: 'Legal & Compliance Officer',
    });

    return newDoc;
  },

  /**
   * Activity Timeline & Audit Logs
   */
  async getVehicleActivityLogs(vehicleId: string): Promise<VehicleActivityLog[]> {
    await new Promise((res) => setTimeout(res, 40));
    return vehicleActivityLogsRepository[vehicleId] || [
      {
        id: `act-init-${vehicleId}`,
        vehicleId,
        tenantId: 'tenant-tln-01',
        timestamp: '2026-08-14T08:00:00Z',
        eventType: 'created',
        title: 'Registrasi Master Kendaraan',
        description: 'Unit kendaraan aktif dalam sistem telematika GPS fleet.',
        performedBy: 'System Admin',
      }
    ];
  },

  addActivityLog(vehicleId: string, log: Omit<VehicleActivityLog, 'id' | 'vehicleId' | 'tenantId' | 'timestamp'>) {
    const newLog: VehicleActivityLog = {
      ...log,
      id: `act-${Date.now()}`,
      vehicleId,
      tenantId: 'tenant-tln-01',
      timestamp: new Date().toISOString(),
    };

    if (!vehicleActivityLogsRepository[vehicleId]) {
      vehicleActivityLogsRepository[vehicleId] = [];
    }
    vehicleActivityLogsRepository[vehicleId].unshift(newLog);
  },

  /**
   * AI Diagnostics & Health Insight for Vehicle
   */
  async getVehicleAIInsight(vehicleId: string): Promise<VehicleAIInsightDetail> {
    await new Promise((res) => setTimeout(res, 80));
    const vehicle = vehiclesRepository.find((v) => v.id === vehicleId);

    const healthScore = vehicle?.healthScore || 88;

    return {
      id: `ai-veh-${vehicleId}`,
      vehicleId,
      healthScore,
      healthBreakdown: {
        engine: 91,
        transmission: 88,
        brakingSystem: 86,
        battery: 94,
        gpsSensor: 99,
        tires: 79,
        fuelSystem: 85,
        coolingSystem: 92,
      },
      predictedMaintenance: [
        {
          component: 'Kampas Rem Belakang (Brake Lining)',
          estimatedDaysRemaining: 18,
          estimatedKmRemaining: 2400,
          urgency: 'medium',
          action: 'Inspeksi ketebalan kampas pada servis 85.000 KM mendatang.',
        },
        {
          component: 'Filter Udara & Filter Bahan Bakar',
          estimatedDaysRemaining: 11,
          estimatedKmRemaining: 750,
          urgency: 'high',
          action: 'Penggantian filter solar primary untuk mencegah penurunan tarikan RPM.',
        },
        {
          component: 'Cairan Radiator Coolant',
          estimatedDaysRemaining: 45,
          estimatedKmRemaining: 6800,
          urgency: 'low',
          action: 'Top up coolant level dan cek kerapatan klem selang radiator.',
        },
      ],
      anomalies: [
        {
          id: 'anom-1',
          type: 'fuel_efficiency',
          title: 'Deteksi Fluktuasi RPM saat Idle (Anomali Ringan)',
          description: 'Sensor RPM mendeteksi deviasi 60 RPM pada kondisi mesin idle di suhu kerja optimal. Potensi endapan pada throttle body.',
          confidencePercent: 88,
          recommendation: 'Lakukan pembersihan throttle body injector saat servis berkala berikutnya.',
          severity: 'medium',
        },
        {
          id: 'anom-2',
          type: 'tire_wear_balance',
          title: 'Pola Getaran Sensor Akselerometer Roda Depan Kanan',
          description: 'Harmonisa getaran mikro pada kecepatan 70-80 km/jam mengindikasikan perlunya kalibrasi balancing ban.',
          confidencePercent: 83,
          recommendation: 'Lakukan spooring & balancing roda depan untuk mencegah keausan ban tidak merata.',
          severity: 'low',
        },
      ],
      ecoDrivingScore: 92,
      carbonEmissionsKgPerMonth: 1840,
      fuelOptimizationTips: [
        'Pertahankan kecepatan ekonomis 60 - 75 km/jam di jalur tol Trans-Jawa untuk efisiensi BBM terbaik.',
        'Kurangi waktu idle berlebih saat antrean bongkar muat gudang logistik.',
        'Pertahankan tekanan ban pada 110 PSI sesuai standar muatan penuh.',
      ],
      riskLevel: vehicle?.maintenanceOverdue ? 'HIGH' : healthScore < 75 ? 'MEDIUM' : 'LOW',
    };
  },

  /**
   * Vehicle Groups CRUD
   */
  async listGroups(tenantId = 'tenant-tln-01'): Promise<VehicleGroup[]> {
    await new Promise((res) => setTimeout(res, 40));
    return vehicleGroupsRepository.filter((g) => g.tenantId === tenantId);
  },

  async createGroup(name: string, description: string, branchId?: string): Promise<VehicleGroup> {
    const newGrp: VehicleGroup = {
      id: `grp-${Date.now()}`,
      tenantId: 'tenant-tln-01',
      name,
      code: `GRP-${name.substring(0, 3).toUpperCase()}`,
      description,
      branchId,
      vehiclesCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    vehicleGroupsRepository.push(newGrp);
    return newGrp;
  },

  /**
   * Branches CRUD
   */
  async listBranches(tenantId = 'tenant-tln-01'): Promise<BranchExtended[]> {
    await new Promise((res) => setTimeout(res, 40));
    return branchesRepository.filter((b) => b.tenantId === tenantId);
  },

  async createBranch(data: Partial<BranchExtended> & { name: string; city: string }): Promise<BranchExtended> {
    const newBranch: BranchExtended = {
      id: `br-${Date.now()}`,
      tenantId: 'tenant-tln-01',
      name: data.name,
      code: data.code || `BR-${data.city.substring(0, 3).toUpperCase()}`,
      address: data.address || 'Jl. Raya Industri Utama No. 45',
      province: data.province || 'Jawa Barat',
      city: data.city,
      phone: data.phone || '+62 21 8900 1122',
      email: data.email || `branch.${data.city.toLowerCase()}@translogistik.co.id`,
      managerName: data.managerName || 'Manager Cabang',
      region: data.region || 'Jabodetabek & Banten',
      status: 'active',
      vehiclesCount: 0,
    };
    branchesRepository.push(newBranch);
    return newBranch;
  },

  /**
   * Departments CRUD
   */
  async listDepartments(tenantId = 'tenant-tln-01'): Promise<Department[]> {
    await new Promise((res) => setTimeout(res, 40));
    return departmentsRepository.filter((d) => d.tenantId === tenantId);
  },

  async createDepartment(name: string, branchId: string, managerName: string): Promise<Department> {
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      tenantId: 'tenant-tln-01',
      name,
      code: `D-${name.substring(0, 3).toUpperCase()}`,
      branchId,
      branchName: branchesRepository.find((b) => b.id === branchId)?.name || 'HQ Branch',
      managerName,
      vehiclesCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    departmentsRepository.push(newDept);
    return newDept;
  },

  /**
   * Bulk Actions
   */
  async bulkAssignGroup(vehicleIds: string[], groupId: string): Promise<number> {
    const group = vehicleGroupsRepository.find((g) => g.id === groupId);
    let count = 0;
    vehiclesRepository.forEach((v) => {
      if (vehicleIds.includes(v.id)) {
        v.groupId = groupId;
        v.groupName = group?.name || 'Group';
        count++;
      }
    });
    return count;
  },

  async bulkAssignBranch(vehicleIds: string[], branchId: string): Promise<number> {
    const branch = branchesRepository.find((b) => b.id === branchId);
    let count = 0;
    vehiclesRepository.forEach((v) => {
      if (vehicleIds.includes(v.id)) {
        v.branchId = branchId;
        v.branchName = branch?.name || 'Branch';
        count++;
      }
    });
    return count;
  },

  async bulkChangeStatus(vehicleIds: string[], status: any): Promise<number> {
    let count = 0;
    vehiclesRepository.forEach((v) => {
      if (vehicleIds.includes(v.id)) {
        v.status = status;
        count++;
      }
    });
    return count;
  },

  async bulkArchive(vehicleIds: string[]): Promise<number> {
    let count = 0;
    vehiclesRepository.forEach((v) => {
      if (vehicleIds.includes(v.id)) {
        v.archivedAt = new Date().toISOString();
        v.status = 'archived';
        count++;
      }
    });
    return count;
  },

  /**
   * Export Vehicles to CSV string
   */
  exportVehiclesToCsv(vehicles: VehicleExtended[]): string {
    const headers = [
      'Vehicle Code',
      'License Plate',
      'Vehicle Name',
      'Type',
      'Brand',
      'Model',
      'Year',
      'Color',
      'VIN',
      'Chassis Number',
      'Engine Number',
      'Fuel Type',
      'Fuel Capacity (L)',
      'Payload Capacity (Kg)',
      'Odometer (KM)',
      'Engine Hours',
      'Lifecycle Status',
      'Status',
      'Branch',
      'Region',
      'Group',
      'Department',
      'Primary Driver',
      'GPS Device ID',
      'STNK Expiry',
      'KIR Expiry',
    ];

    const rows = vehicles.map((v) => [
      v.vehicleCode,
      v.licensePlate,
      `"${v.name}"`,
      v.type,
      v.brand,
      v.model,
      v.year,
      `"${v.color}"`,
      v.vin,
      v.chassisNumber,
      v.engineNumber,
      v.fuelType,
      v.fuelCapacityLiters,
      v.payloadKg || v.capacity?.payloadKg || 0,
      v.odometerKm,
      v.engineHours,
      v.lifecycleStatus,
      v.status,
      `"${v.branchName}"`,
      `"${v.region}"`,
      `"${v.groupName}"`,
      `"${v.departmentName}"`,
      `"${v.primaryDriverName || 'Unassigned'}"`,
      v.gpsDeviceId,
      v.stnkExpiry || '-',
      v.kirExpiry || '-',
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },
};
